import _ from "lodash";

import { Entity, GeneticAlgorithm, randInt } from "./GeneticAlgorithm";
import { EWeekday, ICoord, IEngineInput, IEngineInputClass, IEngineInputInstructor, IEngineInputNewClass, IEngineInputPeriod, IEngineInputRoom, IEngineInputStudent, IEngineInputSubject } from "./type";


class Coord implements ICoord {
    building: any = ["B1", "B2"];
    value: number = 0;
    constructor(label: string) {
        let coord = label.split("-");
        let value = 0;
        if (coord[0][0] == "H") {
            value += 100000 + (parseInt(coord[0][1]) - 1) * 1000;
        } else {
            value += this.building.findIndex((x: any) => x == coord[0]) * 1000;
        }
        value += parseInt(coord[1]);
        this.value = value;
    }

    distanceTo(point: ICoord) {
        let dist = Math.abs(this.value - point.value);
        return dist >= 50000 ? 2 : 0;
    }
}

class EngineInput implements IEngineInput {
    instructors: IEngineInputInstructor[] = [];
    newClasses: IEngineInputNewClass[] = [];
    periods: IEngineInputPeriod[] = [];
    rooms: IEngineInputRoom[] = [];
    students: IEngineInputStudent[] = [];
    subjects: IEngineInputSubject[] = [];
    timetable: IEngineInputClass[] = [];

    constructor(input: any[]) {
        let enrollmentInput: any[] = [];
        let instructorInput: any[] = [];
        let newClassInput: any[] = [];
        let periodInput: any[] = [];
        let roomInput: any[] = [];
        let studentInput: any[] = [];
        let subjectInput: any[] = [];
        let timetableInput: any[] = [];


        input.forEach((item: any) => {
            switch (item.data.sheetName) {
                case "Subject": {
                    subjectInput = item.data.rows;
                    break;
                }
                case "Room": {
                    roomInput = item.data.rows;
                    break;
                }
                case "Instructor": {
                    instructorInput = item.data.rows;
                    break;
                }
                case "Student": {
                    studentInput = item.data.rows;
                    break;
                }
                case "Enrollment": {
                    enrollmentInput = item.data.rows;
                    break;
                }
                case "Class": {
                    timetableInput = item.data.rows;
                    break;
                }
                case "NewClass": {
                    newClassInput = item.data.rows;
                    break;
                }
                case "Period": {
                    periodInput = item.data.rows;
                    break;
                }
                default: {
                    // Undefined sheet
                    break;
                }
            }
        });
        // Phase 1 parsing (inordered)
        this.convertInstructor(instructorInput);
        this.convertPeriod(periodInput)
        this.convertRoom(roomInput);
        this.convertStudent(studentInput);
        this.convertSubject(subjectInput);
        // Phase 2 parsing (ordered)
        this.convertClasses(newClassInput);
        this.convertTimetable(timetableInput);
        this.convertEnrollment(enrollmentInput);
    }

    // Phase 1 parser (inordered)
    convertInstructor(input: any[]) {
        this.instructors = input.map((rowItem: any) => {
            return {
                id: rowItem.id,
                name: rowItem.name,
                department: rowItem.department,
                activeClasses: new Array(7).fill(new Array(this.periods.length).fill(undefined)),
            } as IEngineInputInstructor;
        });
    }

    convertPeriod(input: any[]) {
        this.periods = input.map((rowItem: any) => {
            return {
                id: rowItem.id,
                startTime: rowItem.startTime,
                endTime: rowItem.endTime,
                breakInterval: parseInt(rowItem.breakInterval),
            } as IEngineInputPeriod;
        })
    }
    
    convertRoom(input: any[]) {
        this.rooms = input.map((rowItem: any) => {
            return {
                id: rowItem.id,
                label: rowItem.label,
                type: rowItem.classType,
                capacity: parseInt(rowItem.capacity),
                coord: new Coord(rowItem.label),
                activeClasses: new Array(7).fill(new Array(this.periods.length).fill(undefined)),
            } as IEngineInputRoom;
        });
    }

    convertStudent(input: any[]) {
        this.students = input.map((rowItem: any) => {
            return {
                id: rowItem.id,
                name: rowItem.name,
                department: rowItem.department,
                activeClasses: new Array(7).fill(new Array(this.periods.length).fill(undefined)),
            } as IEngineInputStudent;
        });
    }
    
    convertSubject(input: any[]) {
        this.subjects = input.map((rowItem: any) => {
            return {
                id: rowItem.id,
                name: rowItem.name,
                department: rowItem.department,
                instructors: rowItem.instructors
                    .toString()
                    .split(",")
                    .map((instructorId: string) => {
                        return this.instructors.findIndex((instructor: IEngineInputInstructor) => {
                            return instructor.id === instructorId;
                        });
                    }),
                newStudents: [],
            } as IEngineInputSubject;
        });
    }

    // Phase 2 parser (ordered)
    convertClasses(input: any[]) {
        this.newClasses = input.map((rowItem: any) => {
            return {
                id: rowItem.id,
                subjectI: this.subjects.findIndex((subject: IEngineInputSubject) => {
                    return subject.id === rowItem.id;
                }),
                type: rowItem.type,
                period: parseInt(rowItem.period),
                capacity: parseInt(rowItem.capacity),
                instructors: this.subjects
                    .find((subject) => {
                        return subject.id === rowItem.subjectId;
                    })
                    ?.instructors,
                preferedWeekday: rowItem.preferedWeekDay
                    .toString()
                    .split(",")
                    .map((weekday: string) => {
                        return EWeekday[weekday];
                    }),
                preferedPeriod: rowItem.preferedPeriod
                    .toString()
                    .split(",")
                    .map((periodRange: string) => {
                        return periodRange
                            .split("-")
                            .map((periodId: string, index: number) => {
                                return this.periods
                                    .findIndex((period: IEngineInputPeriod) => {
                                        return period.id === periodId;
                                    }) - index*(parseInt(rowItem.period) - 1);
                            });
                    }),
            } as IEngineInputNewClass;
        })
    }

    convertTimetable(input: any[]) {
        this.timetable = input.map((rowItem: any, classI: number) => {
            const instructorI = this.instructors.findIndex((instructor : IEngineInputInstructor) => instructor.id === rowItem.instructorId);
            const subjectI = this.subjects.findIndex((subject: IEngineInputSubject) => subject.id === rowItem.subjectId);
            const roomI = this.subjects.findIndex((room: IEngineInputSubject) => room.id === rowItem.roomId);
            // Create active class for instructors
            let maxI = this.periods.findIndex((period: IEngineInputPeriod) => {
                return period.id === rowItem.endPeriod;
            });
            maxI += 1;
            let i = this.periods.findIndex((period: IEngineInputPeriod) => {
                return period.id === rowItem.startPeriod;
            });
            for (; i < maxI; ++i) {
                this.instructors[instructorI].activeClasses[EWeekday[rowItem.weekDay]][i] = classI;
                this.rooms[roomI].activeClasses[EWeekday[rowItem.weekDay]][i] = classI;
            }
            
            return {
                id: rowItem.id,
                name: rowItem.name,
                subjectI: subjectI,
                instructorI: instructorI,
                roomI: roomI,
                weekday: EWeekday[rowItem.weekDay],
                startPeriod: this.periods.findIndex((period: IEngineInputPeriod) => {
                    return period.id === rowItem.startPeriod;
                }),
                endPeriod: this.periods.findIndex((period: IEngineInputPeriod) => {
                    return period.id === rowItem.endPeriod;
                }),
            } as IEngineInputClass;
        });
    }

    convertEnrollment(input: any[]) {
        input.forEach((rowItem: any) => {
            if (rowItem.classId !== undefined) {
                const currClassI = this.timetable.findIndex((classItem: IEngineInputClass) => {
                    return classItem.id = rowItem.classId;
                })
                const currClassItem = this.timetable[currClassI]
                const studentI = this.students.findIndex((student: IEngineInputStudent) => {
                    return student.id === rowItem.studentId;
                })
                for (let i = currClassItem!.startPeriod; i <= currClassItem!.endPeriod; ++i) {
                    this.students[studentI].activeClasses[currClassItem!.weekday][i] = currClassI;
                }
            } else {
                let currSubjectI = this.subjects.findIndex((subject: IEngineInputSubject) => {
                    return subject.id === rowItem.subjectId;
                });
                const studentI = this.students.findIndex((student: IEngineInputStudent) => {
                    return student.id === rowItem.studentId;
                })
                this.subjects[currSubjectI].newStudents.push(studentI);
            }
        });
    }
}
let engineInput: EngineInput;

class EngineOutput {
    result: {
        id: string,
        subject: string,
        type: string,
        capacity: number,
        weekday: string,
        period: string,
        time: string,
    }[][];

    constructor(engineInput: EngineInput, engineResult: Entity[]) {
        this.result = [];
        engineResult.forEach((entity: Entity, suggestionI: number) => {
            let maxI = engineInput.newClasses.length;
            // Accumulate gene result
            let extendedInput = {
                rooms: [],
                instructors: [],
            }

            for (let newClassI = 0; newClassI < maxI; ++newClassI) {
                const roomI = entity.chromosome[newClassI] % engineInput.rooms.length;  // RoomI
                const gene = entity.chromosome[newClassI + maxI];                       // instructorI & weekday & startperiodI
                const instructorI = Math.floor(gene / (7 * engineInput.periods.length)) % engineInput.newClasses[newClassI].instructors.length;
                const weekday = gene % (7 * engineInput.periods.length) % 7;
                const startPeriodI = Math.floor(gene % (7 * engineInput.periods.length) / 7); // Raw iteration; modulus to max possible length of each prefered period range for usable iteration
        
                let geneEval = geneEvaluate({
                    newClassI: newClassI,
                    weekday: weekday,
                    startPeriodI: startPeriodI,
                    roomI: roomI,
                    instructorI: instructorI,
                    extendedInput: extendedInput,
                });

                // Parsed class
                let refClass = {
                    id: engineInput.newClasses[newClassI].id,
                    subject: engineInput.subjects[engineInput.newClasses[newClassI].subjectI].name,
                    type: engineInput.newClasses[newClassI].type,
                    capacity: engineInput.newClasses[newClassI].capacity,
                    weekday: "N/A",
                    period: "N/A",
                    time: "N/A",
                }
                // Acceptable class
                if (geneEval > 0) {
                    const resWeekday: string = Object.keys(EWeekday).find((key) => EWeekday[key] === weekday)!;
                    refClass.weekday = resWeekday;
                    const startPeriod: IEngineInputPeriod = engineInput.periods[startPeriodI];
                    const endPeriod: IEngineInputPeriod = engineInput.periods[startPeriodI + engineInput.newClasses[newClassI].period - 1];
                    refClass.period = `${startPeriod.id}-${endPeriod.id}`
                    refClass.time = `${startPeriod.startTime}-${endPeriod.endTime}`
                }
                this.result[suggestionI].push(refClass);
            }
        });
    }
}

const geneEvaluate = ({
        newClassI,
        weekday,
        startPeriodI,
        roomI,
        instructorI,
        extendedInput,
    }: {
        weekday: number,
        startPeriodI: number,
        newClassI: number,
        roomI: number,
        instructorI: number,
        extendedInput: {
            rooms: number[][][],
            instructors: number[][][],
        }
    }) => {
    let score = 1;

    do {
        let maxI = 0; // Maximum value for iterative variable
        let isNotFit = false; // True if any invalid hard constraints caught
        // Satisfied all hard constraints, return 0 score if fails any
        //-- Time availability
        // Check if prefered weekday
        if (!engineInput.newClasses[newClassI].preferedWeekday.includes(weekday)) {
            score *= 0;
            break;
        }
        // Check if fit a prefered period frame
        maxI = engineInput.newClasses[newClassI].preferedPeriod.length;
        isNotFit = true;
        for (let preferedFrameI = 0; preferedFrameI < maxI; ++preferedFrameI) {
            if (
                engineInput.newClasses[newClassI].preferedPeriod[preferedFrameI][0] <= startPeriodI &&
                startPeriodI <= engineInput.newClasses[newClassI].preferedPeriod[preferedFrameI][1]
            ) {
                isNotFit = false;
                break;
            }
        }
        if (isNotFit) {
            score *= 0;
            break;
        }
        // Instructor & room availability
        maxI = startPeriodI + engineInput.newClasses[newClassI].period;
        for (let periodI = startPeriodI; periodI < maxI; ++periodI) {
            if (
                engineInput.rooms[roomI].activeClasses[weekday][periodI] !== undefined ||
                extendedInput.rooms[roomI]?.[weekday]?.[periodI] !== undefined ||
                engineInput.instructors[instructorI].activeClasses[weekday][periodI] !== undefined ||
                extendedInput.rooms[roomI]?.[weekday]?.[periodI] !== undefined
            ) {
                isNotFit = true;
                break;
            }
        }
        if (isNotFit) {
            score *= 0;
        }
        // -- Room's condition satisfied
        // Type match
        if (engineInput.rooms[roomI].type != engineInput.newClasses[newClassI].type) {
            score *= 0;
            break;
        }
        // Capacity availability
        if (engineInput.rooms[roomI].capacity < engineInput.newClasses[newClassI].capacity) {
            score *= 0;
            break;
        }
        // -- Instructor availability
        // Assume that instructor only teach in 1 branch at a day
        maxI = engineInput.periods.length;
        for (let i = 0; i < maxI; ++i) {
            const proxClassI = engineInput.instructors[instructorI].activeClasses[weekday][i];
            if (proxClassI !== undefined) {
                const proxRoomCoord = engineInput.rooms[engineInput.timetable[proxClassI].roomI].coord;
                if (engineInput.rooms[roomI].coord.distanceTo(proxRoomCoord) > 0) {
                    isNotFit = true;
                    break;
                }
            }
        }
        if (isNotFit) {
            score *= 0;
            break;
        }
        
        // Satisfied all hard constraints
        maxI = startPeriodI + engineInput.newClasses[newClassI].period;
        for (let periodI = startPeriodI; periodI < maxI; ++periodI) {
            extendedInput.rooms[roomI][weekday][startPeriodI] = newClassI;
            extendedInput.instructors[instructorI][weekday][startPeriodI] = newClassI;
        }
    } while (false);

    return score;
}

const classFitness = (entity: Entity) => {
    let score = 0;
    // Accumulate gene result
    let extendedInput = {
        rooms: [],
        instructors: [],
    }

    const maxI = engineInput.newClasses.length;
    for (let newClassI = 0; newClassI < maxI; ++newClassI) {
        const roomI = entity.chromosome[newClassI] % engineInput.rooms.length;  // RoomI
        const gene = entity.chromosome[newClassI + maxI];                       // instructorI & weekday & startperiodI
        const instructorI = Math.floor(gene / (7 * engineInput.periods.length)) % engineInput.newClasses[newClassI].instructors.length;
        const weekday = gene % (7 * engineInput.periods.length) % 7;
        const startPeriodI = Math.floor(gene % (7 * engineInput.periods.length) / 7); // Raw iteration; modulus to max possible length of each prefered period range for usable iteration

        let geneEval = geneEvaluate({
            newClassI: newClassI,
            weekday: weekday,
            startPeriodI: startPeriodI,
            roomI: roomI,
            instructorI: instructorI,
            extendedInput: extendedInput,
        });
        score += geneEval;
    };


    return score;
}

export const engine = (input: any) => {
    // -- Parsing input to engine input
    engineInput = new EngineInput(input);

    // -- Engine configuration for class searching
    let engineConfig: any = {
        chromosomeLength: engineInput.newClasses.length * 2,
        geneCount: engineInput.rooms.length,
        generation: 50,
        mutationRate: 0.01,
        maxPopulationSize: 20,
        fitness: classFitness,
        eliteRate: 0.1,
        // initialPopulation: [
        //     new Entity(10, 10, [0, 9, 1, 7, 4, 5, 0, 1, 4, 2]),
        //     new Entity(10, 10, [0, 4, 2, 7, 2, 5, 0, 1, 0, 2]),
        // ]
    }
    const timeLength = 7 * engineInput.periods.length;
    for (let i = 0; i < engineInput.subjects.length; ++i) {
        engineConfig.geneCount = Math.max(
            engineConfig.geneCount, 
            engineInput.subjects[i].instructors.length * timeLength
        );
    }
    // Custom crossover function for class searching
    engineConfig.crossover = (first: Entity, second: Entity) => {
        let firstChild: any;
        let secondChild: any;
    
        const length = engineInput.newClasses.length;
        let crossPoint = randInt(1, length) * 2 // At least 1 gene should be able to crossover
    
        firstChild = first.chromosome.slice(0, crossPoint);
        secondChild = second.chromosome.slice(0, crossPoint);
    
        
        firstChild.push(...second.chromosome.slice(crossPoint));
        secondChild.push(...first.chromosome.slice(crossPoint));
    
    
        firstChild = new Entity({
            geneCount: engineConfig.geneCount,
            chromosome: firstChild,
            calcFitness: classFitness,
        });
        secondChild = new Entity({
            geneCount: engineConfig.geneCount,
            chromosome: secondChild,
            calcFitness: classFitness,
        });
    
        firstChild.mutate(engineConfig.mutationRate);
        secondChild.mutate(engineConfig.mutationRate);
    
        return [firstChild, secondChild];
    }
    
    // Run engine
    const topCount = 5;
    let bestRes: Entity[] = [];     // Store best results from each run
    let engine = new GeneticAlgorithm();
    engine.configurate(engineConfig);

    for (let i = 0; i < topCount; ++i) {
        bestRes.push(engine.run()[0]);
    }

    // Parse engine result to readable result
    let engineOutput = new EngineOutput(engineInput, bestRes);

    return {
        result: engineOutput.result,
    };
}
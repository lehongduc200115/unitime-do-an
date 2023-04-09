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
    modifiedSubjects: number[] = [];

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
        // Phase 1 parsing - basic input (ordered)
        this.convertInstructor(instructorInput);
        this.convertPeriod(periodInput)
        this.convertRoom(roomInput);
        this.convertStudent(studentInput);
        this.convertSubject(subjectInput);
        // Phase 2 parsing - refined input (ordered)
        this.convertClasses(newClassInput);
        this.convertTimetable(timetableInput);
        this.convertEnrollment(enrollmentInput);
    }

    // Phase 1 parser - basic input (ordered)
    convertInstructor(input: any[]) {
        this.instructors = input.map((rowItem: any) => {
            return {
                id: rowItem.id.toString(),
                name: rowItem.name,
                department: rowItem.department,
                activeClasses: [],
            } as IEngineInputInstructor;
        });
    }

    convertPeriod(input: any[]) {
        this.periods = input.map((rowItem: any) => {
            return {
                id: rowItem.id.toString(),
                startTime: rowItem.startTime,
                endTime: rowItem.endTime,
                breakInterval: parseInt(rowItem.breakInterval),
            } as IEngineInputPeriod;
        })
    }
    
    convertRoom(input: any[]) {
        this.rooms = input.map((rowItem: any) => {
            return {
                id: rowItem.id.toString(),
                label: rowItem.label,
                type: rowItem.classType,
                capacity: parseInt(rowItem.capacity),
                coord: new Coord(rowItem.label),
                activeClasses: [],
            } as IEngineInputRoom;
        });
    }

    convertStudent(input: any[]) {
        this.students = input.map((rowItem: any) => {
            return {
                id: rowItem.id.toString(),
                name: rowItem.name,
                department: rowItem.department,
                activeClasses: [],
            } as IEngineInputStudent;
        });
    }
    
    convertSubject(input: any[]) {
        this.subjects = input.map((rowItem: any) => {
            return {
                id: rowItem.id.toString(),
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
                classes: [],
                newStudents: [],
                newClasses: [],
            } as IEngineInputSubject;
        });
    }

    // Phase 2 parser - refined input (ordered)
    convertClasses(input: any[]) {
        this.newClasses = input.map((rowItem: any, newClassI: number) => {
            const subjectI = this.subjects.findIndex((subject: IEngineInputSubject) => {
                return subject.id === rowItem.id.toString();
            });
            this.subjects[subjectI].newClasses.push(newClassI);
            
            return {
                id: rowItem.id.toString(),
                subjectI: subjectI,
                type: rowItem.type,
                period: parseInt(rowItem.period),
                entrants: parseInt(rowItem.entrants),
                instructors: this.subjects
                    .find((subject) => {
                        return subject.id === rowItem.subjectId.toString();
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
            const instructorI = this.instructors.findIndex((instructor: IEngineInputInstructor) => instructor.id === rowItem.instructorId.toString());
            const subjectI = this.subjects.findIndex((subject: IEngineInputSubject) => subject.id === rowItem.subjectId.toString());
            const roomI = this.subjects.findIndex((room: IEngineInputSubject) => room.id === rowItem.roomId.toString());
            // Create active class for instructors
            let maxI = this.periods.findIndex((period: IEngineInputPeriod) => {
                return period.id === rowItem.endPeriod.toString();
            });
            const minI = this.periods.findIndex((period: IEngineInputPeriod) => {
                return period.id === rowItem.startPeriod.toString();
            });
            for (let i = minI; i <= maxI; ++i) {
                this.instructors[instructorI].activeClasses[EWeekday[rowItem.weekDay.toString()]] = this.instructors[instructorI].activeClasses[EWeekday[rowItem.weekDay.toString()]] || []
                this.instructors[instructorI].activeClasses[EWeekday[rowItem.weekDay.toString()]][i] = classI;
                this.rooms[roomI].activeClasses[EWeekday[rowItem.weekDay.toString()]] = this.rooms[roomI].activeClasses[EWeekday[rowItem.weekDay.toString()]] || [];
                this.rooms[roomI].activeClasses[EWeekday[rowItem.weekDay.toString()]][i] = classI;
            }
            console.log(`Class ${classI}, ${minI}-${maxI}`);
            console.log(JSON.stringify(this.rooms[0].activeClasses));
            
            return {
                id: rowItem.id.toString(),
                name: rowItem.name,
                subjectI: subjectI,
                instructorI: instructorI,
                roomI: roomI,
                weekday: EWeekday[rowItem.weekDay.toString()],
                startPeriod: this.periods.findIndex((period: IEngineInputPeriod) => {
                    return period.id === rowItem.startPeriod.toString();
                }),
                endPeriod: this.periods.findIndex((period: IEngineInputPeriod) => {
                    return period.id === rowItem.endPeriod.toString();
                }),
            } as IEngineInputClass;
        });
    }

    convertEnrollment(input: any[]) {
        input.forEach((rowItem: any) => {
            if (rowItem.classId !== undefined) {
                const currClassI = this.timetable.findIndex((classItem: IEngineInputClass) => {
                    return classItem.id = rowItem.classId.toString();
                });
                const currClassItem = this.timetable[currClassI];
                const studentI = this.students.findIndex((student: IEngineInputStudent) => {
                    return student.id === rowItem.studentId.toString();
                });
                for (let i = currClassItem!.startPeriod; i <= currClassItem!.endPeriod; ++i) {
                    this.students[studentI].activeClasses[currClassItem!.weekday] = this.students[studentI].activeClasses[currClassItem!.weekday] || [];
                    this.students[studentI].activeClasses[currClassItem!.weekday][i] = currClassI;
                }
            } else {
                let currSubjectI = this.subjects.findIndex((subject: IEngineInputSubject) => {
                    return subject.id === rowItem.subjectId.toString();
                });
                const studentI = this.students.findIndex((student: IEngineInputStudent) => {
                    return student.id === rowItem.studentId.toString();
                });
                this.subjects[currSubjectI].newStudents.push(studentI);
            }
        });
    }
}
let engineInput: EngineInput;

const classGeneEvaluate = ({
        score,
        newClassI,
        weekday,
        startPeriodI,
        roomI,
        instructorI,
        extendedInput,
    }: {
        score: number,
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
                engineInput.rooms[roomI].activeClasses[weekday]?.[periodI] !== undefined ||
                extendedInput.rooms[roomI]?.[weekday]?.[periodI] !== undefined ||
                engineInput.instructors[instructorI].activeClasses[weekday]?.[periodI] !== undefined ||
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
        if (engineInput.rooms[roomI].capacity < engineInput.newClasses[newClassI].entrants) {
            score *= 0;
            break;
        }
        // -- Instructor availability
        // Assume that instructor only teach in 1 branch at a day
        maxI = engineInput.periods.length;
        for (let i = 0; i < maxI; ++i) {
            const proxClassI = engineInput.instructors[instructorI].activeClasses[weekday]?.[i] ||
                extendedInput.instructors[instructorI]?.[weekday]?.[i];   
            if (proxClassI != null) {
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
            extendedInput.rooms[roomI] = new Array(7).fill(new Array(engineInput.periods.length).fill(undefined));
            extendedInput.rooms[roomI][weekday][startPeriodI] = newClassI;
            extendedInput.instructors[instructorI] = new Array(7).fill(new Array(engineInput.periods.length).fill(undefined));
            extendedInput.instructors[instructorI][weekday][startPeriodI] = newClassI;
        }
    } while (false);

    return score;
}

class EngineOutput {
    result: {
        id: string,
        subject: string,
        instructor: string,
        type: string,
        entrants: number,
        room: string,
        weekday: string,
        period: string,
        time: string,
    }[][];

    constructor(engineInput: EngineInput, engineResult: Entity[]) {
        this.result = [];
        engineResult.forEach((entity: Entity, suggestionI: number) => {
            this.result[suggestionI] = [];
            let maxI = engineInput.newClasses.length;
            // Accumulate gene result
            let extendedInput = {
                rooms: [],
                instructors: [],
            }
            let score = 1;

            for (let newClassI = 0; newClassI < maxI; ++newClassI) {
                const roomI = entity.chromosome[newClassI] % engineInput.rooms.length;  // RoomI
                const gene = entity.chromosome[newClassI + maxI];                       // instructorI & weekday & startperiodI
                const instructorI = Math.floor(gene / (7 * engineInput.periods.length)) % engineInput.newClasses[newClassI].instructors.length;
                const weekday = gene % (7 * engineInput.periods.length) % engineInput.newClasses[newClassI].preferedWeekday.length;
                const startPeriodI = Math.floor(gene % (7 * engineInput.periods.length) / 7); // Raw iteration; modulus to max possible length of each prefered period range for usable iteration
        
                let geneEval = classGeneEvaluate({
                    score: score,
                    newClassI: newClassI,
                    weekday: weekday,
                    startPeriodI: startPeriodI,
                    roomI: roomI,
                    instructorI: instructorI,
                    extendedInput: extendedInput,
                });
                score += geneEval;

                // Parsed class
                let refClass = {
                    id: engineInput.newClasses[newClassI].id,
                    subject: `${engineInput.subjects[engineInput.newClasses[newClassI].subjectI].id} - ${engineInput.subjects[engineInput.newClasses[newClassI].subjectI].name}`,
                    instructor: `${engineInput.instructors[engineInput.newClasses[newClassI].instructors[instructorI]].id} - ${engineInput.instructors[engineInput.newClasses[newClassI].instructors[instructorI]].name}`,
                    type: engineInput.newClasses[newClassI].type,
                    entrants: engineInput.newClasses[newClassI].entrants,
                    room: "N/A",
                    weekday: "N/A",
                    period: "N/A",
                    time: "N/A",
                }
                // Acceptable class
                if (geneEval > 0) {
                    refClass.room = engineInput.rooms[roomI].id;
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

const classFitness = (entity: Entity) => {
    // Accumulate gene result
    let extendedInput = {
        rooms: [],
        instructors: [],
    }
    let score = 1;

    const maxI = engineInput.newClasses.length;
    for (let newClassI = 0; newClassI < maxI; ++newClassI) {
        const roomI = entity.chromosome[newClassI] % engineInput.rooms.length;  // RoomI
        const gene = entity.chromosome[newClassI + maxI];                       // instructorI & weekday & startperiodI
        const instructorI = Math.floor(gene / (7 * engineInput.periods.length)) % engineInput.newClasses[newClassI].instructors.length;
        const weekday = gene % (7 * engineInput.periods.length) % engineInput.newClasses[newClassI].preferedWeekday.length;
        const startPeriodI = Math.floor(gene % (7 * engineInput.periods.length) / 7); // Raw iteration; modulus to max possible length of each prefered period range for usable iteration

        let geneEval = classGeneEvaluate({
            score: score,
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
    console.log("Adapt input to engine...");
    engineInput = new EngineInput(input);
    console.log("-- Done!");

    console.log("Initialize engine configuration...");
    // -- Engine configuration for class searching
    let engineClassConfig: any = {
        chromosomeLength: engineInput.newClasses.length * 2,
        geneCount: engineInput.rooms.length,
        generation: 5000,
        mutationRate: 0.01,
        maxPopulationSize: 50,
        fitness: classFitness,
        eliteRate: 0.1,
        // initialPopulation: [
        //     new Entity(10, 10, [0, 9, 1, 7, 4, 5, 0, 1, 4, 2]),
        //     new Entity(10, 10, [0, 4, 2, 7, 2, 5, 0, 1, 0, 2]),
        // ]
    }
    const timeLength = 7 * engineInput.periods.length;
    for (let i = 0; i < engineInput.subjects.length; ++i) {
        engineClassConfig.geneCount = Math.max(
            engineClassConfig.geneCount, 
            engineInput.subjects[i].instructors.length * timeLength
        );
    }
    // Custom crossover function for class searching
    engineClassConfig.crossover = (first: Entity, second: Entity) => {
        let firstChild: any;
        let secondChild: any;
    
        const length = engineInput.newClasses.length;
        let crossPoint = randInt(1, length) * 2 // At least 1 gene should be able to crossover
    
        firstChild = first.chromosome.slice(0, crossPoint);
        secondChild = second.chromosome.slice(0, crossPoint);
    
        
        firstChild.push(...second.chromosome.slice(crossPoint));
        secondChild.push(...first.chromosome.slice(crossPoint));
    
    
        firstChild = new Entity({
            geneCount: engineClassConfig.geneCount,
            chromosome: firstChild,
            calcFitness: classFitness,
        });
        secondChild = new Entity({
            geneCount: engineClassConfig.geneCount,
            chromosome: secondChild,
            calcFitness: classFitness,
        });
    
        firstChild.mutate(engineClassConfig.mutationRate);
        secondChild.mutate(engineClassConfig.mutationRate);
    
        return [firstChild, secondChild];
    }
    console.log("-- Done!");
    // -- Run engine
    const topResultCount = 5;
    let bestRes: Entity[] = [];     // Store best results from each run
    let engine = new GeneticAlgorithm();
    engine.configurate(engineClassConfig);
    // Find class 
    for (let i = 0; i < topResultCount; ++i) {
        const dump = (_: any, loop: any) => {
            if (loop % 1000 == 0) {
                console.log(`${(topResultCount-i-1)*engineClassConfig.generation + loop} iteration left`);
            }
        }
        bestRes.push(engine.run(dump)[0]);
    }

    // Parse engine result to readable result
    let engineOutput = new EngineOutput(engineInput, bestRes);


    // console.log(engineOutput.result.map((res, index) => {
    //     let point = 0;
    //     res.forEach((e) => {
    //         point += e.period !== "N/A" ? 1 : 0;
    //     })
    //     return {
    //         point: point,
    //         classes: res.map((val) => JSON.stringify(val)),
    //         chromosome: JSON.stringify(bestRes[index].chromosome),
    //     };
    // }));

    /*
    Room1 (4): 2[5-6, 10-12], 3[7-12], 4[2-4, 9-12] 
    Room2 (3): 2[2-3], 3[2-6, 7-12], 4[4-6, 7-8, 11-12]
    Room3 (3): 2[2-6], 3[7-12], 4[4-6, 7-8]
    */

    console.log(JSON.stringify(engineInput.instructors[1].activeClasses));

    return {
        result: engineOutput.result,
    };
}
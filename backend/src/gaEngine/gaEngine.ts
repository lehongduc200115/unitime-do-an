import _ from "lodash";

import { Entity, GeneticAlgorithm, randInt } from "./GeneticAlgorithm";
import { EWeekday, ICoord, IEngineInput, IEngineInputClass, IEngineInputInstructor, IEngineInputNewClass, IEngineInputPeriod, IEngineInputRoom, IEngineInputStudent, IEngineInputSubject, IEngineOutputResult } from "./type";


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
    instructors: IEngineInputInstructor[];
    newClasses: IEngineInputNewClass[];
    periods: IEngineInputPeriod[];
    rooms: IEngineInputRoom[];
    students: IEngineInputStudent[];
    subjects: IEngineInputSubject[];
    timetable: IEngineInputClass[];

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
        this.convertTimetable(timetableInput);
        this.convertEnrollment(enrollmentInput);
        this.convertClasses(newClassInput);
    }

    // Phase 1 parser - basic input (ordered)
    convertInstructor(input: any[]) {
        this.instructors = input.map((rowItem: any) => {
            return {
                id: rowItem.id.toString(),
                name: rowItem.name,
                department: rowItem.department,
                activeClasses: new Array(7),
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
                activeClasses: new Array(7),
            } as IEngineInputRoom;
        });
    }

    convertStudent(input: any[]) {
        this.students = input.map((rowItem: any) => {
            return {
                id: rowItem.id.toString(),
                name: rowItem.name,
                department: rowItem.department,
                activeClasses: new Array(7),
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
                newClasses: [],
                newStudents: [],
            } as IEngineInputSubject;
        });
    }

    // Phase 2 parser - refined input (ordered)
    convertTimetable(input: any[]) {
        this.timetable = input.map((rowItem: any, classI: number) => {
            const instructorI = this.instructors.findIndex((instructor: IEngineInputInstructor) => instructor.id === rowItem.instructorId.toString());
            const subjectI = this.subjects.findIndex((subject: IEngineInputSubject) => subject.id === rowItem.subjectId.toString());
            const roomI = this.subjects.findIndex((room: IEngineInputSubject) => room.id === rowItem.roomId.toString());
            // Create active class for instructors & rooms
            let maxI = this.periods.findIndex((period: IEngineInputPeriod) => {
                return period.id === rowItem.endPeriod.toString();
            });
            const minI = this.periods.findIndex((period: IEngineInputPeriod) => {
                return period.id === rowItem.startPeriod.toString();
            });
            for (let i = minI; i <= maxI; ++i) {
                this.instructors[instructorI].activeClasses[EWeekday[rowItem.weekDay.toString()]] = this.instructors[instructorI].activeClasses[EWeekday[rowItem.weekDay.toString()]] || new Array(this.periods.length)
                this.instructors[instructorI].activeClasses[EWeekday[rowItem.weekDay.toString()]][i] = classI;
                this.rooms[roomI].activeClasses[EWeekday[rowItem.weekDay.toString()]] = this.rooms[roomI].activeClasses[EWeekday[rowItem.weekDay.toString()]] || new Array(this.periods.length);
                this.rooms[roomI].activeClasses[EWeekday[rowItem.weekDay.toString()]][i] = classI;
            }
            // Class belongs to subject
            this.subjects[subjectI].classes.push(classI);
            
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
                students: [],
            } as IEngineInputClass;
        });
    }

    convertEnrollment(input: any[]) {
        input.forEach((rowItem: any) => {
            const subjectId = rowItem.subjectId.toString();
            const classId = rowItem.classId?.toString();
            const studentId = rowItem.studentId.toString();
            // Check if students have classes yet
            if (classId != null) {
                const classI = this.timetable.findIndex((classItem: IEngineInputClass) => {
                    return classItem.id === classId;
                });
                const classItem = this.timetable[classI];
                const studentI = this.students.findIndex((student: IEngineInputStudent) => {
                    return student.id === studentId;
                });
                // Add class to student's active classes
                for (let i = classItem.startPeriod; i <= classItem.endPeriod; ++i) {
                    this.students[studentI].activeClasses[classItem.weekday] = this.students[studentI].activeClasses[classItem.weekday] || new Array(this.periods.length)
                    this.students[studentI].activeClasses[classItem.weekday][i] = classI;
                }
                // Add student to arranged class (for scaleup class)
                this.timetable[classI].students.push(studentI);
            } else {
                const studentI = this.students.findIndex((student: IEngineInputStudent) => {
                    return student.id === studentId;
                });
                const subjectI = this.subjects.findIndex((subject: IEngineInputSubject) => {
                    return subject.id === subjectId;
                });
                // Add student to enrollment list
                this.subjects[subjectI].newStudents.push(studentI);
            }
        });
    }

    convertClasses(input: any[]) {
        this.newClasses = input.map((rowItem: any, newClassI: number) => {
            const subjectId = rowItem.subjectId.toString();
            const subjectI = this.subjects.findIndex((subject: IEngineInputSubject) => {
                return subject.id === subjectId;
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
}
let engineInput: EngineInput;

// Return list of students who are capable of taking class (unassigned classes do not take into account)
const checkCapableStudent = ({
        weekday,
        startPeriodI,
        periodCount,
        subjectI,
        roomI,
    }:{
        weekday: number,
        startPeriodI: number,
        periodCount: number,
        subjectI: number,
        roomI: number,
    }) => {
        let ans: any[] = [];
        const maxSubjectStudentI = engineInput.subjects[subjectI].newStudents.length;
        const endPeriodI = startPeriodI + periodCount - 1;
        const maxPeriodI = engineInput.periods.length;
        
        for (let subjectStudentI = 0; subjectStudentI < maxSubjectStudentI; ++subjectStudentI) {
            const studentI = engineInput.subjects[subjectI].newStudents[subjectStudentI];
            let isNotFit = false;

            for (let periodI = 0; periodI < maxPeriodI; ++periodI) {
                // Active periods
                const activeClassI = engineInput.students[studentI].activeClasses[weekday]?.[periodI];
                if (activeClassI != null) {
                    if (startPeriodI <= periodI && periodI <= endPeriodI) {
                        isNotFit = true;
                        break;
                    }
                    // 
                    const activeRoomI = engineInput.timetable[activeClassI].roomI;
                    if (engineInput.rooms[activeRoomI].coord.distanceTo(engineInput.rooms[roomI].coord) > 0) {
                        isNotFit = true;
                        break;
                    }
                }
            }
            if (!isNotFit) {
                ans.push(studentI);
            }
        }

        return ans;
}


const classGeneEvaluate = ({
        score,
        newClassI,
        weekday,
        startPeriodI,
        roomI,
        instructorI,
        extendedInput,
    }:{
        score: number,
        weekday: number,
        startPeriodI: number,
        newClassI: number,
        roomI: number,
        instructorI: number,
        extendedInput: { // Active classes for each object, indexing: [object's index][weekday][periodI]
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
                engineInput.rooms[roomI].activeClasses[weekday]?.[periodI] != null ||
                extendedInput.rooms[roomI]?.[weekday]?.[periodI] != null ||
                engineInput.instructors[instructorI].activeClasses[weekday]?.[periodI] != null ||
                extendedInput.instructors[instructorI]?.[weekday]?.[periodI] != null
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

        // -- Student availability
        const capableStudents = checkCapableStudent({
            weekday: weekday,
            startPeriodI: startPeriodI,
            periodCount: engineInput.newClasses[newClassI].period,
            subjectI: engineInput.newClasses[newClassI].subjectI,
            roomI: roomI,
        });
        // TODO: check if student count meets minimum requirement
        score += capableStudents.length;
        
        // Satisfied all hard constraints
        maxI = startPeriodI + engineInput.newClasses[newClassI].period;
        for (let periodI = startPeriodI; periodI < maxI; ++periodI) {
            extendedInput.rooms[roomI] = extendedInput.rooms[roomI] || new Array(7);
            extendedInput.rooms[roomI][weekday] = extendedInput.rooms[roomI][weekday] || new Array(engineInput.periods.length);
            extendedInput.rooms[roomI][weekday][startPeriodI] = newClassI;
            extendedInput.instructors[instructorI] = extendedInput.instructors[instructorI] || new Array(7);
            extendedInput.instructors[instructorI][weekday] = extendedInput.instructors[instructorI][weekday] || new Array(engineInput.periods.length);
            extendedInput.instructors[instructorI][weekday][startPeriodI] = newClassI;
        }
    } while (false);

    return score;
}

class EngineOutput {
    classResult: IEngineOutputResult[][];

    constructor(engineInput: EngineInput, classResult: Entity[]) {
        this.classResult = new Array(classResult.length);
        classResult.forEach((entity: Entity, suggestionI: number) => {
            this.classResult[suggestionI] = [];
            let maxI = engineInput.newClasses.length;
            // Accumulate gene result
            let extendedInput = {
                rooms: new Array(engineInput.rooms.length),
                instructors: new Array(engineInput.instructors.length),
                students: new Array(engineInput.students.length),
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
                let refClass: IEngineOutputResult = {
                    id: engineInput.newClasses[newClassI].id,
                    subject: `${engineInput.subjects[engineInput.newClasses[newClassI].subjectI].id} - ${engineInput.subjects[engineInput.newClasses[newClassI].subjectI].name}`,
                    instructor: `${engineInput.instructors[engineInput.newClasses[newClassI].instructors[instructorI]].id} - ${engineInput.instructors[engineInput.newClasses[newClassI].instructors[instructorI]].name}`,
                    type: engineInput.newClasses[newClassI].type,
                    entrants: engineInput.newClasses[newClassI].entrants,
                    room: "N/A",
                    weekday: "N/A",
                    period: "N/A",
                    time: "N/A",
                    capableStudents: [],
                }
                // Acceptable class
                if (geneEval > 0) {
                    refClass.room = engineInput.rooms[roomI].id;
                    const resWeekday: string = Object.keys(EWeekday).find((key) => EWeekday[key] === weekday)!;
                    refClass.weekday = resWeekday;
                    const startPeriod: IEngineInputPeriod = engineInput.periods[startPeriodI];
                    const endPeriod: IEngineInputPeriod = engineInput.periods[startPeriodI + engineInput.newClasses[newClassI].period - 1];
                    refClass.period = `${startPeriod.id}-${endPeriod.id}`;
                    refClass.time = `${startPeriod.startTime}-${endPeriod.endTime}`;
                    refClass.capableStudents = checkCapableStudent({
                        weekday: weekday,
                        startPeriodI: startPeriodI,
                        periodCount: engineInput.newClasses[newClassI].period,
                        subjectI: engineInput.newClasses[newClassI].subjectI,
                        roomI: roomI,
                    });
                    refClass.capableStudents = refClass.capableStudents.map((studentI: number) => {
                        return `${engineInput.students[studentI].id} - ${engineInput.students[studentI].name}`
                    });
                }
                this.classResult[suggestionI].push(refClass);
            }
        });
    }
}

const fitness = (entity: Entity) => {
    // Accumulate gene result
    let extendedInput = {
        rooms: new Array(engineInput.rooms.length),
        instructors: new Array(engineInput.instructors.length),
        students: new Array(engineInput.students.length),
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
        generation: 1000,
        mutationRate: 0.01,
        maxPopulationSize: 50,
        fitness: fitness,
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
            calcFitness: fitness,
        });
        secondChild = new Entity({
            geneCount: engineClassConfig.geneCount,
            chromosome: secondChild,
            calcFitness: fitness,
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
            // if (loop % 1000 == 0) {
                console.log(`${(topResultCount-i-1)*engineClassConfig.generation + loop} iteration left`);
            // }
        }
        bestRes.push(engine.run(dump)[0]);
    }
    console.log("-- Done!");

    // Parse engine result to readable result
    console.log("Reading population...");
    let engineOutput: EngineOutput = new EngineOutput(engineInput, bestRes);
    console.log("-- Done!");


    // console.log(engineInput.newClasses.map((res) => {
    //     return JSON.stringify(res.subjectI);
    // }));

    /*
    Room1 (4): 2[5-6, 10-12], 3[7-12], 4[2-4, 9-12] 
    Room2 (3): 2[2-3], 3[2-6, 7-12], 4[4-6, 7-8, 11-12]
    Room3 (3): 2[2-6], 3[7-12], 4[4-6, 7-8]
    */

    return {
        result: engineOutput.classResult,
        // result: null,
    };
}
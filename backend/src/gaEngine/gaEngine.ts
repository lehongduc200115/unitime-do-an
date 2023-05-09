import _, { max } from "lodash";

import { Entity, GeneticAlgorithm, randInt } from "./GeneticAlgorithm";
import { EWeekday, IEngineInput, IEngineInputClass, IEngineInputInstructor, IEngineInputNewClass, IEngineInputPeriod, IEngineInputRoom, IEngineInputStudent, IEngineInputSubject, IEngineOutputResult } from "./type";


const distanceTo = (a: IEngineInputRoom, b: IEngineInputRoom) => {
    let dist = 0;
    if (a.campus !== b.campus) {
        dist += 1000;
    }

    return dist;
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
                campus: rowItem.campus,
                capacity: parseInt(rowItem.capacity),
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
                    ?.toString()
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
                minEntrants: parseInt(rowItem.minEntrants),
                maxEntrants: parseInt(rowItem.maxEntrants),
                instructors: this.subjects
                    .find((subject) => {
                        return subject.id === rowItem.subjectId.toString();
                    })
                    ?.instructors,
                preferedWeekday: rowItem.preferedWeekDay
                    ?.toString()
                    .split(",")
                    .map((weekday: string) => {
                        return EWeekday[weekday];
                    }),
                preferedPeriod: rowItem.preferedPeriod
                    ?.toString()
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
                preferedCampus: rowItem.preferedCampus,
                preferedRoom: rowItem.preferedRoom
                    ?.toString()
                    .split(",")
                    .map((roomId: string) => {
                        return this.rooms
                            .findIndex((room: IEngineInputRoom) => {
                                return room.id === roomId
                            })
                    }),
                scaleupClass: rowItem.scaleupClass ? true : false,
                unrestricted: rowItem.unrestricted ? true : false,
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
                    if (distanceTo(engineInput.rooms[roomI], engineInput.rooms[activeRoomI]) > 0) {
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


const newClassEvaluate = ({
        score,
        penalty,
        newClassI,
        weekday,
        startPeriodI,
        roomI,
        newRoomI,
        instructorI,
        extendedInput,
        modifiedClasses,
    }:{
        score: number,
        penalty: number,
        weekday: number,
        startPeriodI: number,
        newClassI: number,
        roomI: number,
        newRoomI?: number,
        instructorI: number,
        extendedInput: { // Active classes for each object, indexing: [object's index][weekday][periodI]
            rooms: number[][][],
            instructors: number[][][],
        },
        modifiedClasses: IEngineInputClass[],
    }) => {

    do {
        let maxI = 0; // Maximum value for iterative variable
        let isNotFit = false; // True if any invalid hard constraints caught
        let oldClassI: number | undefined = undefined; // use for unrestricted mode
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
        if (newRoomI != null) { // If unrestricted to move old class
            for (let periodI = startPeriodI; periodI < maxI; ++periodI) {
                // Check if instructor is available
                let activeClassI = engineInput.instructors[instructorI].activeClasses[weekday]?.[periodI];
                if (
                    (
                        activeClassI != null
                        && !modifiedClasses.some((modClass) => {
                            return modClass.id === engineInput.timetable[activeClassI].id;
                        })
                    ) || (
                        extendedInput.instructors[instructorI]?.[weekday]?.[periodI] != null
                        && extendedInput.instructors[instructorI]?.[weekday]?.[periodI] !== -1
                    )
                ) {
                    isNotFit = true;
                    break;
                }
                // Check if new class only takes up 1 old class
                activeClassI = engineInput.rooms[roomI].activeClasses[weekday]?.[periodI];
                if (oldClassI != null) {
                    if (
                        (
                            activeClassI != null
                            && !modifiedClasses.some((modClass) => {
                                return modClass.id === engineInput.timetable[activeClassI].id;
                            })
                        ) || (
                            extendedInput.rooms[roomI]?.[weekday]?.[periodI] != null
                            && extendedInput.rooms[roomI]?.[weekday]?.[periodI] !== -1
                        )
                    ) {
                        isNotFit = true;
                        break;
                    }
                } else {
                    oldClassI = activeClassI || extendedInput.rooms[roomI]?.[weekday]?.[periodI];
                    oldClassI = oldClassI !== -1 ? oldClassI : undefined;
                }
            }
            // Check if there is old class and is movable
            if (oldClassI != null) {
                maxI = engineInput.timetable[oldClassI].endPeriod;
                for (let periodI = engineInput.timetable[oldClassI].startPeriod; periodI < maxI; ++periodI) {
                    // Check if new room is vacant
                    const activeClassI = engineInput.rooms[newRoomI].activeClasses[weekday]?.[periodI];
                    if (
                        (
                            activeClassI != null
                            && !modifiedClasses.some((modClass) => {
                                return modClass.id === engineInput.timetable[activeClassI].id;
                            })
                        ) || (
                            extendedInput.rooms[newRoomI]?.[weekday]?.[periodI] != null
                            && extendedInput.rooms[newRoomI]?.[weekday]?.[periodI] !== -1
                        )
                    ) {
                        isNotFit = true;
                        break;
                    }
                }
            }
        } else {    // Restricted to be moved
            for (let periodI = startPeriodI; periodI < maxI; ++periodI) {
                // Check if room is vacant
                let activeClassI = engineInput.rooms[roomI].activeClasses[weekday]?.[periodI];
                if (
                    (
                        activeClassI != null
                        && !modifiedClasses.some((modClass) => {
                            return modClass.id === engineInput.timetable[activeClassI].id;
                        })
                    ) || (
                        extendedInput.rooms[roomI]?.[weekday]?.[periodI] != null
                        && extendedInput.rooms[roomI]?.[weekday]?.[periodI] !== -1
                    )
                ) {
                    isNotFit = true;
                    break;
                }
                // Check if instructor is available
                activeClassI = engineInput.instructors[instructorI].activeClasses[weekday]?.[periodI];
                if (
                    (
                        activeClassI != null 
                        && !modifiedClasses.some((modClass) => {
                            return modClass.id === engineInput.timetable[activeClassI].id;
                        })
                    ) || (
                        extendedInput.instructors[instructorI]?.[weekday]?.[periodI] != null
                        && extendedInput.instructors[instructorI]?.[weekday]?.[periodI] !== -1
                    )
                ) {
                    isNotFit = true;
                    break;
                }
            }
        }
        if (isNotFit) {
            score *= 0;
            break;
        }
        // -- Room's condition satisfied
        // Type match
        if (engineInput.rooms[roomI].type != engineInput.newClasses[newClassI].type) {
            score *= 0;
            break;
        }
        // Capacity availability
        if (engineInput.rooms[roomI].capacity < engineInput.newClasses[newClassI].minEntrants) {
            score *= 0;
            break;
        }
        // -- Instructor availability
        // Assume that instructor only teach in 1 campus at a day
        maxI = engineInput.periods.length;
        for (let i = 0; i < maxI; ++i) {
            const proxClassI = engineInput.newClasses[newClassI].preferedCampus || 
                engineInput.instructors[instructorI].activeClasses[weekday]?.[i]
            if (proxClassI != null) {
                if (distanceTo(engineInput.rooms[roomI], engineInput.rooms[engineInput.timetable[proxClassI].roomI]) > 0) {
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
        
        // -- Satisfied all hard constraints
        // Unrestricted mode: an old class is moved
        if (newRoomI != null && oldClassI != null) {
            // Append class to modified category and update class's room
            const modClassI = modifiedClasses.findIndex((modClass) => {
                return modClass.id === engineInput.timetable[oldClassI!].id;
            })
            let oldRoomI = -1;
            if (modClassI < 0) {
                let modClass = _.cloneDeep(engineInput.timetable[oldClassI]);
                oldRoomI = modClass.roomI;
                modClass.roomI = newRoomI;
                modifiedClasses.push(modClass);
            } else {
                oldRoomI = modifiedClasses[modClassI].roomI;
                modifiedClasses[modClassI].roomI = newRoomI;
            }
            maxI = engineInput.timetable[oldClassI].endPeriod;
            for (let periodI = engineInput.timetable[oldClassI].startPeriod; periodI < maxI; ++periodI) {
                // Add new room to extended input
                extendedInput.rooms[newRoomI] = extendedInput.rooms[newRoomI] || new Array(7);
                extendedInput.rooms[newRoomI][weekday] = extendedInput.rooms[newRoomI][weekday] || new Array(engineInput.periods.length);
                extendedInput.rooms[newRoomI][weekday][periodI] = oldClassI;
                // Remove old room from extended input
                extendedInput.rooms[oldRoomI] = extendedInput.rooms[oldRoomI] || new Array(7);
                extendedInput.rooms[oldRoomI][weekday] = extendedInput.rooms[oldRoomI][weekday] || new Array(engineInput.periods.length);
                extendedInput.rooms[oldRoomI][weekday][periodI] = -1;
                // Add instructor to extended input
                extendedInput.instructors[instructorI] = extendedInput.instructors[instructorI] || new Array(7);
                extendedInput.instructors[instructorI][weekday] = extendedInput.instructors[instructorI][weekday] || new Array(engineInput.periods.length);
                extendedInput.instructors[instructorI][weekday][periodI] = oldClassI;
            }
            // Nudge score
            score = score - penalty;
            penalty += 1;
        }
        // Register new class
        maxI = startPeriodI + engineInput.newClasses[newClassI].period;
        for (let periodI = startPeriodI; periodI < maxI; ++periodI) {
            // Add new room to extended input
            extendedInput.rooms[roomI] = extendedInput.rooms[roomI] || new Array(7);
            extendedInput.rooms[roomI][weekday] = extendedInput.rooms[roomI][weekday] || new Array(engineInput.periods.length);
            extendedInput.rooms[roomI][weekday][periodI] = engineInput.timetable.length + newClassI;
            // Add instructor to extended input
            extendedInput.instructors[instructorI] = extendedInput.instructors[instructorI] || new Array(7);
            extendedInput.instructors[instructorI][weekday] = extendedInput.instructors[instructorI][weekday] || new Array(engineInput.periods.length);
            extendedInput.instructors[instructorI][weekday][periodI] = engineInput.timetable.length + newClassI;
        }
    } while (false);

    return score;
}

const scaleupClassEvaluate = ({
        score,
        penalty,
        newClassI,
        oldClassI,
        newRoomI,
        newRoomI_2,
        // newWeekday,
        // newStartPeriodI,
        extendedInput,
        modifiedClasses,
    }:{
        score: number,
        penalty: number,
        newClassI: number,
        oldClassI: number, // Picked classI
        newRoomI: number,
        newRoomI_2: number,
        newWeekday?: number,
        newStartPeriodI?: number,
        extendedInput: { // Active classes for each object and classes tend to be scaleup or moved, indexing: [object's index][weekday][periodI]
            rooms: number[][][],
            instructors: number[][][],
        }
        modifiedClasses: IEngineInputClass[],
    }) => {
        do {
            let isNotFit = false;
            let oldIsFit = false;       // Picked class is suitable of scaleup (true) or need to be moved (false)
            let oldClassI_2: number | undefined = undefined; // second class to be moved
            // -- Check room capacity
            const newClassEntrants = engineInput.newClasses[newClassI].minEntrants + engineInput.timetable[oldClassI].students.length;
            // Current room satisfied?
            let oldRoomI = modifiedClasses.find((modClass) => {
                    return modClass.id === engineInput.timetable[oldClassI].id;
                })?.roomI || engineInput.timetable[oldClassI].roomI;

            if (engineInput.rooms[oldRoomI].capacity < newClassEntrants) {
                // If old class's room is not capacity satisfied
                // -- Specified new room satisfied?
                // Type check
                if (engineInput.rooms[newRoomI].type !== engineInput.newClasses[newClassI].type) {
                    score *= 0;
                    break;
                }
                // Capacity check
                if (engineInput.rooms[newRoomI].capacity < newClassEntrants) {
                    score *= 0;
                    break;
                }
                // -- Check if old class is able to be moved to new room (only occupy 1 other class)
                const weekday = engineInput.timetable[oldClassI].weekday;
                const startPeriod = engineInput.timetable[oldClassI].startPeriod;
                const endPeriod = engineInput.timetable[oldClassI].endPeriod;
                for (let periodI = startPeriod; periodI <= endPeriod; ++periodI) {
                    const activeClassI = engineInput.rooms[newRoomI].activeClasses[weekday]?.[periodI];
                    // Check if there is only 1 class to be moved on new room
                    if (oldClassI_2 != null) {
                        if (
                            (
                                activeClassI != null
                                && !modifiedClasses.some((modClass) => {
                                    return modClass.id === engineInput.timetable[activeClassI].id;
                                })
                            ) || (
                                extendedInput.rooms[newRoomI]?.[weekday]?.[periodI] != null
                                && extendedInput.rooms[newRoomI]?.[weekday]?.[periodI] !== -1
                            )
                        ) {
                            isNotFit = true;
                            break;
                        }
                    } else {
                        oldClassI_2 = activeClassI || extendedInput.rooms[newRoomI]?.[weekday]?.[periodI];
                        oldClassI_2 = oldClassI_2 !== -1 ? oldClassI_2 : undefined;
                    }
                }
                if (isNotFit) {
                    score *= 0;
                    break;
                }
                // Check if there is second movable class
                if (oldClassI_2 != null) {
                    let maxI = engineInput.timetable[oldClassI_2].endPeriod;
                    for (let periodI = engineInput.timetable[oldClassI_2].startPeriod; periodI < maxI; ++periodI) {
                        // Check if new room is vacant
                        const activeClassI = engineInput.rooms[newRoomI].activeClasses[weekday]?.[periodI];
                        if (
                            (
                                activeClassI != null
                                && !modifiedClasses.some((modClass) => {
                                    return modClass.id === engineInput.timetable[activeClassI].id;
                                })
                            ) || (
                                extendedInput.rooms[newRoomI]?.[weekday]?.[periodI] != null
                                && extendedInput.rooms[newRoomI]?.[weekday]?.[periodI] !== -1
                            )
                        ) {
                            isNotFit = true;
                            break;
                        }
                    }
                }
            } else {
                oldIsFit = true;                
            }

            if (isNotFit) {
                score *= 0;
                break;
            }

            // -- Student availability
            const capableStudents = checkCapableStudent({
                weekday: engineInput.timetable[oldClassI].weekday,
                startPeriodI: engineInput.timetable[oldClassI].startPeriod,
                periodCount: engineInput.timetable[oldClassI].endPeriod - engineInput.timetable[oldClassI].startPeriod + 1,
                subjectI: engineInput.newClasses[newClassI].subjectI,
                roomI: oldIsFit ? engineInput.timetable[oldClassI].roomI : newRoomI,
            });
            // TODO: check if student count meets minimum requirement
            score += capableStudents.length;

            // -- Satisfied all constraints
            // Check if another class is moved while shifting picked class
            if (oldClassI_2 != null) {
                // Append class to modified category and update class's room
                const modClassI = modifiedClasses.findIndex((modClass) => {
                    return modClass.id === engineInput.timetable[oldClassI_2!].id;
                })
                if (modClassI < 0) {
                    let modClass = _.cloneDeep(engineInput.timetable[oldClassI_2]);
                    modClass.roomI = newRoomI_2;
                    modifiedClasses.push(modClass);
                } else {
                    modifiedClasses[modClassI].roomI = newRoomI_2;
                }
                // Shift second class (from newRoomI -> to newRoomI_2)
                let weekday = engineInput.timetable[oldClassI_2].weekday;
                let startPeriod = engineInput.timetable[oldClassI_2].startPeriod
                let endPeriod = engineInput.timetable[oldClassI_2].endPeriod;
                for (let periodI = startPeriod; periodI <= endPeriod; ++periodI) {
                    // Add shifted room to extended input
                    extendedInput.rooms[newRoomI_2] = extendedInput.rooms[newRoomI_2] || new Array(7);
                    extendedInput.rooms[newRoomI_2][weekday] = extendedInput.rooms[newRoomI_2][weekday] || new Array(engineInput.periods.length);
                    extendedInput.rooms[newRoomI_2][weekday][periodI] = oldClassI_2;
                    // Remove old room from extended input
                    extendedInput.rooms[newRoomI] = extendedInput.rooms[newRoomI] || new Array(7);
                    extendedInput.rooms[newRoomI][weekday] = extendedInput.rooms[newRoomI][weekday] || new Array(engineInput.periods.length);
                    extendedInput.rooms[newRoomI][weekday][periodI] = -1;
                }
                // Nudge score
                score = score - penalty;
                penalty += 1;
            }
            // Check if picked classroom has enough space
            if (oldIsFit) {
                // Do nothing
            } else {
                // Append class to modified category and update class's room
                const modClassI = modifiedClasses.findIndex((modClass) => {
                    return modClass.id === engineInput.timetable[oldClassI].id;
                });
                if (modClassI < 0) {
                    let modClass = _.cloneDeep(engineInput.timetable[oldClassI]);
                    modClass.roomI = newRoomI;
                    modifiedClasses.push(modClass);
                } else {
                    modifiedClasses[modClassI].roomI = newRoomI;
                }
                // Update room
                const weekday = engineInput.timetable[oldClassI].weekday;
                const startPeriod = engineInput.timetable[oldClassI].startPeriod;
                const endPeriod = engineInput.timetable[oldClassI].endPeriod;
                for (let periodI = startPeriod; periodI <= endPeriod; ++periodI) {
                    // Add shifted room to extended input
                    extendedInput.rooms[newRoomI] = extendedInput.rooms[newRoomI] || new Array(7);
                    extendedInput.rooms[newRoomI][weekday] = extendedInput.rooms[newRoomI][weekday] || new Array(engineInput.periods.length);
                    extendedInput.rooms[newRoomI][weekday][periodI] = oldClassI;
                    // Remove old room from extended input
                    extendedInput.rooms[oldRoomI] = extendedInput.rooms[oldRoomI] || new Array(7);
                    extendedInput.rooms[oldRoomI][weekday] = extendedInput.rooms[oldRoomI][weekday] || new Array(engineInput.periods.length);
                    extendedInput.rooms[oldRoomI][weekday][periodI] = -1;
                }
                // Nudge score
                score = Math.max(score - 1, 1); // Try the best not to move room
            }
            // Increase 
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
            let modifiedClasses: IEngineInputClass[] = [];
            let penalty = 1;

            for (let newClassI = 0; newClassI < maxI; ++newClassI) {
                if (engineInput.newClasses[newClassI].scaleupClass) {
                    const geneI = newClassI * 3;
                    const newRoomI = entity.chromosome[geneI] % engineInput.rooms.length;  // RoomI
                    const oldClassI = entity.chromosome[geneI + 1] % engineInput.subjects[engineInput.newClasses[newClassI].subjectI].classes.length;    // oldClassI
                    const extraGene = entity.chromosome[geneI + 2];
                    
                    let geneEval = scaleupClassEvaluate({
                        score: engineInput.newClasses.length,
                        penalty: penalty,
                        newClassI: newClassI,
                        oldClassI: oldClassI,
                        newRoomI: newRoomI,
                        newRoomI_2: extraGene % engineInput.rooms.length,
                        newWeekday: extraGene % engineInput.newClasses[newClassI].preferedWeekday.length,
                        newStartPeriodI: Math.floor(extraGene / 7),
                        extendedInput: extendedInput,
                        modifiedClasses: modifiedClasses,
                    });

                    // Parsed class
                    let refClass: IEngineOutputResult = {
                        id: `${engineInput.newClasses[newClassI].id} - scaleup from #N/A`,
                        subject: `${engineInput.subjects[engineInput.newClasses[newClassI].subjectI].id} - ${engineInput.subjects[engineInput.newClasses[newClassI].subjectI].name}`,
                        instructor: `N/A`,
                        type: engineInput.newClasses[newClassI].type,
                        entrants: 0,
                        room: "N/A",
                        weekday: "N/A",
                        period: "N/A",
                        time: "N/A",
                        capableStudents: [],
                    }
                    // Acceptable class
                    if (geneEval > 0) {
                        // -- Update info of new class
                        // Id & instructor's info
                        refClass.id = `${engineInput.newClasses[newClassI].id} - scaleup from #${engineInput.timetable[oldClassI].id}`,
                        refClass.instructor = `${engineInput.instructors[engineInput.timetable[oldClassI].instructorI].id} - ${engineInput.instructors[engineInput.timetable[oldClassI].instructorI].name}`

                        // Room
                        const roomI = modifiedClasses.find((modClass) => {
                            return modClass.id === engineInput.timetable[oldClassI].id;
                        })?.roomI ?? engineInput.timetable[oldClassI].roomI;
                        refClass.room = engineInput.rooms[roomI].id;

                        // Schedule
                        const weekday = engineInput.timetable[oldClassI].weekday
                        const resWeekday = Object.keys(EWeekday).find((key) => EWeekday[key] === weekday)!;
                        refClass.weekday = resWeekday;
                        const startPeriod: IEngineInputPeriod = engineInput.periods[engineInput.timetable[oldClassI].startPeriod];
                        const endPeriod: IEngineInputPeriod = engineInput.periods[engineInput.timetable[oldClassI].endPeriod];
                        refClass.period = `${startPeriod.id}-${endPeriod.id}`;
                        refClass.time = `${startPeriod.startTime}-${endPeriod.endTime}`;

                        // Student
                        refClass.capableStudents = checkCapableStudent({
                            weekday: weekday,
                            startPeriodI: engineInput.timetable[oldClassI].startPeriod,
                            periodCount: engineInput.timetable[oldClassI].endPeriod - engineInput.timetable[oldClassI].startPeriod + 1,
                            subjectI: engineInput.timetable[oldClassI].subjectI,
                            roomI: roomI,
                        });
                        refClass.capableStudents = refClass.capableStudents.map((studentI: number) => {
                            return `${engineInput.students[studentI].id} - ${engineInput.students[studentI].name}`
                        });
                    }
                    this.classResult[suggestionI].push(refClass);
                    

                } else {
                    const geneI = newClassI * 3;
                    const roomI = entity.chromosome[geneI] % engineInput.rooms.length;  // RoomI
                    const classInfo = entity.chromosome[geneI + 1];                       // instructorI & weekday & startperiodI
                    const instructorI = Math.floor(classInfo / (7 * engineInput.periods.length)) % engineInput.newClasses[newClassI].instructors.length;
                    const weekday = classInfo % (7 * engineInput.periods.length) % engineInput.newClasses[newClassI].preferedWeekday.length;
                    const startPeriodI = Math.floor(classInfo % (7 * engineInput.periods.length) / 7); // Check from preferred period range for suitability
                    const newRoomI = entity.chromosome[geneI + 2];

                    let geneEval = newClassEvaluate({
                        score: engineInput.newClasses.length,
                        penalty: penalty,
                        newClassI: newClassI,
                        weekday: weekday,
                        startPeriodI: startPeriodI,
                        roomI: roomI,
                        newRoomI: engineInput.newClasses[newClassI].unrestricted ? newRoomI : undefined,
                        instructorI: instructorI,
                        extendedInput: extendedInput,
                        modifiedClasses: modifiedClasses,
                    });

                    // Parsed class
                    let refClass: IEngineOutputResult = {
                        id: engineInput.newClasses[newClassI].id,
                        subject: `${engineInput.subjects[engineInput.newClasses[newClassI].subjectI].id} - ${engineInput.subjects[engineInput.newClasses[newClassI].subjectI].name}`,
                        instructor: `${engineInput.instructors[engineInput.newClasses[newClassI].instructors[instructorI]].id} - ${engineInput.instructors[engineInput.newClasses[newClassI].instructors[instructorI]].name}`,
                        type: engineInput.newClasses[newClassI].type,
                        entrants: 0,
                        room: "N/A",
                        weekday: "N/A",
                        period: "N/A",
                        time: "N/A",
                        capableStudents: [],
                    }
                    // Acceptable class
                    if (geneEval > 0) {
                        // -- Update info of new class
                        // Room
                        refClass.room = engineInput.rooms[roomI].id;

                        // Schedule
                        const resWeekday: string = Object.keys(EWeekday).find((key) => EWeekday[key] === weekday)!;
                        refClass.weekday = resWeekday;
                        const startPeriod: IEngineInputPeriod = engineInput.periods[startPeriodI];
                        const endPeriod: IEngineInputPeriod = engineInput.periods[startPeriodI + engineInput.newClasses[newClassI].period - 1];
                        refClass.period = `${startPeriod.id}-${endPeriod.id}`;
                        refClass.time = `${startPeriod.startTime}-${endPeriod.endTime}`;

                        // Student
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
    let modifiedClasses: IEngineInputClass[] = [];
    let score = 1;
    let penalty = 1;

    const maxI = engineInput.newClasses.length;
    for (let newClassI = 0; newClassI < maxI; ++newClassI) {
        if (engineInput.newClasses[newClassI].scaleupClass) {
            const geneI = newClassI * 3;
            const newRoomI = entity.chromosome[geneI] % engineInput.rooms.length;  // RoomI
            const oldClassI = entity.chromosome[geneI + 1] % engineInput.subjects[engineInput.newClasses[newClassI].subjectI].classes.length;    // oldClassI
            const extraGene = entity.chromosome[geneI + 2];
            
            let geneEval = scaleupClassEvaluate({
                score: engineInput.newClasses.length,
                penalty: penalty,
                newClassI: newClassI,
                oldClassI: oldClassI,
                newRoomI: newRoomI,
                newRoomI_2: extraGene % engineInput.rooms.length,
                newWeekday: extraGene % engineInput.newClasses[newClassI].preferedWeekday.length,
                newStartPeriodI: Math.floor(extraGene / 7),
                extendedInput: extendedInput,
                modifiedClasses: modifiedClasses,
            });
            score += geneEval; 
        } else {
            const geneI = newClassI * 3;
            const roomI = entity.chromosome[geneI] % engineInput.rooms.length;  // RoomI
            const classInfo = entity.chromosome[geneI + 1];                       // instructorI & weekday & startperiodI
            const instructorI = Math.floor(classInfo / (7 * engineInput.periods.length)) % engineInput.newClasses[newClassI].instructors.length;
            const weekday = classInfo % (7 * engineInput.periods.length) % engineInput.newClasses[newClassI].preferedWeekday.length;
            const startPeriodI = Math.floor(classInfo % (7 * engineInput.periods.length) / 7); // Raw iteration; modulus to max possible length of each prefered period range for usable iteration
            const newRoomI = entity.chromosome[geneI + 2];
    
            let geneEval = newClassEvaluate({
                score: engineInput.newClasses.length,
                penalty: penalty,
                newClassI: newClassI,
                weekday: weekday,
                startPeriodI: startPeriodI,
                roomI: roomI,
                newRoomI: engineInput.newClasses[newClassI].unrestricted ? newRoomI : undefined,
                instructorI: instructorI,
                extendedInput: extendedInput,
                modifiedClasses: modifiedClasses,
            });
            score += geneEval;
        }
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
        chromosomeLength: engineInput.newClasses.length * 3,    // [roomI, classInfo, unrestrictedClasses]
        geneCount: engineInput.rooms.length,
        generation: 5000,
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
        let crossPoint = randInt(1, length) * 3 // At least 1 gene should be able to crossover
    
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
            if (loop % 1000 == 0) {
                console.log(`${(topResultCount-i-1)*engineClassConfig.generation + loop} iteration left`);
            }
        }
        bestRes.push(engine.run(dump)[0]);
    }
    console.log("-- Done!");

    // Parse engine result to readable result
    console.log("Reading population...");
    let engineOutput: EngineOutput = new EngineOutput(engineInput, bestRes);
    console.log("-- Done!");


    // console.log(JSON.stringify(engineOutput.classResult));

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
import _ from "lodash";

import { Entity, GeneticAlgorithm } from "./GeneticAlgorithm";
import { ICoord, IEngineInput, IEngineInputClass, IEngineInputFreeSlot, IEngineInputInstructor, IEngineInputNewClass, IEngineInputRoom, IEngineInputSubject, ITime } from "./type";


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
        return dist >= 100000 ? 2 : 0;
    }
}

class Time implements ITime {
    hour: number = 0;
    minute: number = 0;

    constructor(epoch?: number | string) {
        switch (typeof epoch) {
            case 'number': {
                this.hour = epoch / 60;
                this.minute = epoch % 60;
                break;
            }
            case 'string': {
                const time = epoch.split(':').map((part: any) => parseInt(part))
                this.hour = time[0];
                this.minute = time[1];
                break;
            }
            default:
                break;
        }
    }

    toInt() {
        return this.hour * 60 + this.minute;
    }
    toString() {
        return `${this.hour}:${('00' + this.minute.toString()).slice(-2)}`;
    }
}

class EngineInput implements IEngineInput {
    freeSlots: IEngineInputFreeSlot[] = [];
    instructors: IEngineInputInstructor[] = [];
    newClasses: IEngineInputNewClass[] = [];
    rooms: IEngineInputRoom[] = [];
    subjects: IEngineInputSubject[] = [];
    timetable: IEngineInputClass[] = [];
    periodCount: number = 0;

    constructor(input: any[]) {
        let enrollmentInput: any[] = [];
        let instructorInput: any[] = [];
        let newClassInput: any[] = [];
        let periodInput: any[] = [];
        let roomInput: any[] = [];
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
        this.convertClasses(newClassInput);
        this.convertInstructor(instructorInput);
        this.convertRoom(roomInput);
        this.convertSubject(subjectInput);
        // Phase 2 parsing (ordered)
        this.convertTimetable(timetableInput);
        this.convertSlot(periodInput);
        this.convertEnrollment(enrollmentInput);
    }

    // Phase 1 parser (inordered)
    convertClasses(input: any[]) {
        input.forEach((item: any) => {
            const obj: IEngineInputNewClass = {
                id: item.id,
                type: item.type,
                period: parseInt(item.period),
                capacity: parseInt(item.capacity),
                instructors: this.subjects
                    .find((subject) => subject.id === item.subjectId)
                    ?.instructors
                    ?? []
                    ,
                preferedWeekday: item.preferedWeekDay
                    .toString()
                    .split(",")
                    .map((weekday: any) => weekday)
                    ,
                preferedTime: item.preferedTime
                    .toString()
                    .split(",")
                    .map((timeRange: any) => {
                        return timeRange
                            .split("-")
                            .map((time: any) => time);
                    })
                    ,
            }
            this.newClasses.push(obj);
        })
    }

    convertInstructor(input: any[]) {
        input.forEach((item: any) => {
            const obj: IEngineInputInstructor = {
                id: item.id,
                name: item.name,
                department: item.department,
                activeClasses: {},
            };
            this.instructors.push(obj);
        });
    }
    
    convertRoom(input: any[]) {
        input.forEach((item: any) => {
            const obj: IEngineInputRoom = {
                id: item.id,
                label: item.label,
                type: item.classType,
                capacity: item.capacity,
                coord: new Coord(item.label),
            };
            this.rooms.push(obj);
        });
    }
    
    convertSubject(input: any[]) {
        input.forEach((item: any) => {
            const obj: IEngineInputSubject = {
                id: item.id,
                name: item.name,
                department: item.department,
                instructors: item.instructors
                    .toString()
                    .split(",")
                    .map((instructor: any) => instructor)
                    ,
                newStudents: {},
            };
            this.subjects.push(obj);
        });
    }
    // Phase 2 parser (ordered)
    convertTimetable(input: any[]) {
        input.forEach((item: any) => {
            // Create timetable
            const obj: IEngineInputClass = {
                id: item.id,
                name: item.name,
                subjectId: item.subjectId,
                instructorId: item.instructorId,
                roomId: item.roomId,
                weekday: item.weekDay,
                startTime: item.startTime, 
                endTime: item.endTime,
            };
            this.timetable.push(obj);
            // Create active class for instructors

        });
    }

    convertSlot(periods: any[]) {
        // Create free slots
        this.periodCount = periods.length;
        const roomCount = this.rooms.length;
        for (let roomI = 0; roomI < roomCount; ++roomI) {
            const room = this.rooms[roomI];
            for (let periodI = 0; periodI < this.periodCount; ++periodI) {
                const period = periods[periodI];
                const obj: IEngineInputFreeSlot = {
                    roomId: room.id,
                    roomType: room.type,
                    roomCapacity: room.capacity,
                    roomCoord: room.coord,
                    timeFrame: {
                        id: period.id,
                        start: period.startTime,
                        end: period.endTime,
                    },
                    activeClasses: {},
                    activeInstructors: {},
                    activeStudents: {},
    
                };
                this.freeSlots.push(obj);
            }
        }
        // Add active instructors to corresponding slot
        const classCount = this.timetable.length;
        for (let classI = 0; classI < classCount; ++classI) {
            const slotI = this.freeSlots.findIndex((slot: any) => {
                return slot.roomId === this.timetable[classI].roomId
                    && slot.timeFrame.start === this.timetable[classI].startTime;
            });
            const classWeekday = this.timetable[classI].weekday;
            this.freeSlots[slotI].activeClasses[classWeekday] = this.timetable[classI].id;
            this.freeSlots[slotI].activeInstructors[classWeekday] = this.timetable[classI].instructorId;
        }
    }

    convertEnrollment(input: any[]) {
        input.forEach((item: any) => {
            const classId = item.classId;
            if (classId !== undefined) {
                const slotI = this.freeSlots.findIndex((slot: any) => {
                    return slot.roomId === this.timetable[classId].roomId
                        && slot.timeFrame.start === this.timetable[classId].startTime;
                });
                const classWeekday = this.timetable[classId].weekday;
                this.freeSlots[slotI].activeStudents[classWeekday][item.subjectId] = true;
            } else {
                const subjectI = this.subjects.findIndex((subject: any) => {
                    return subject.id === item.subjectId;
                });
                this.subjects[subjectI].newStudents[item.studentId] = true;
            }
        });
    }
}
let engineInput: EngineInput;

class EngineOutput {
    result: any[];

    constructor(engineInput: EngineInput, engineOutput: Entity[]) {
        this.result = [];

    }
}


const geneEvaluate = ({
        freeSlots,
        newClassIndex,
        slotId, 
        instructorId,
    }: any) => {
    let score = 1;

    let maxI = 0; // Maximum value for iterative variable
    let isNotFit = false; // True if any invalid hard constraints caught
    let newClassInfo = {
        weekday: "",
        timeFrame: {
            id: slotId % engineInput.periodCount,
            start: freeSlots[slotId].timeFrame.start.toInt(),
            end: freeSlots[slotId + engineInput.newClasses[newClassIndex].period - 1].timeFrame.end.toInt(),
        },
        instructor: "",
    }

    do {
        // Satisfied all hard constraints, return 0 score if fails any
        // Check valid slot (class - room)
        //-- Time availability
        const preferedWeekdayCount = engineInput.newClasses[newClassIndex].preferedWeekday.length;
        maxI = engineInput.newClasses[newClassIndex].period;
        // Time overflowed
        if (slotId % engineInput.periodCount + maxI > engineInput.periodCount) {
            score *= 0;
            break;
        }
        // Skim for slot
        for (let weekdayI = 0; weekdayI < preferedWeekdayCount; ++weekdayI) {
            const weekdayId = engineInput.newClasses[newClassIndex].preferedWeekday[weekdayI];
            for (let periodI = 0; periodI < maxI; ++periodI) {
                if (freeSlots[slotId + periodI].activeClasses[weekdayId] === undefined) {
                    newClassInfo.weekday = weekdayId;
                } else {
                    isNotFit = true;
                    break;
                }
            }
        }
        if (isNotFit) {
            score *= 0;
            break;
        }
        // Check if selected slot is in a prefered time frame
        isNotFit = true; // Change to false if found a prefered time frame
        maxI = engineInput.newClasses[newClassIndex].preferedTime.length;
        for (let timeFrameI = 0; timeFrameI < maxI; ++timeFrameI) {
            const timeFrame = engineInput.newClasses[newClassIndex].preferedTime[timeFrameI];
            if (
                timeFrame.start.toInt() <= newClassInfo.timeFrame.start.toInt()
                && newClassInfo.timeFrame.end.toInt() <= timeFrame.end.toInt()
            ) {
                isNotFit = false;
                break;
            }
        }
        if (isNotFit) {
            score *= 0;
            break;
        }
        // Check room's conditions
        if (freeSlots[slotId].type != engineInput.newClasses[newClassIndex].type) {
            score *= 0;
            break;
        }
        // Capacity availability
        if (freeSlots[slotId].capacity < engineInput.newClasses[newClassIndex].capacity) {
            score *= 0;
            break;
        }

        // Check instructor time
        if (instructors[instructorId].slotAvailability[slotId].time[0] >= instructor[instructorId].slotAvailability[slotId].time[1]) {
            res.score *= 0;
            break;
        }
        // Check distance
        const proxRoomId = engineInput.instructor[instructorId].slotAvailability[slotId].proxRoomId;
        if (proxRoomId !== undefined) {
            const dist = engineInput.room[proxRoomId].coord.distanceTo(availableRoomSlot[slotId].coord);
            if (dist > 0) {
                res.score *= 0;
                break;
            }
        }

        // TODO: Check student count
    } while (false);
    
    maxI = engineInput.newClasses[newClassIndex].period;
    for (let periodI = 0; periodI < maxI; ++periodI) {
        freeSlots[slotId + periodI].activeClasses[newClassInfo.weekday] = newClassIndex;
    }

    return score;
}

const fitness = (entity: Entity) => {
    let score = 0;
    // Cloning data
    let freeSlots = _.cloneDeep(engineInput.freeSlots);

    const freeSlotCount = engineInput.freeSlots.length;
    entity.chromosome.forEach((value: number, newClassIndex: number) => {
        const slotId = value % freeSlotCount;
        const instructorId = Math.floor(value / freeSlotCount) % engineInput.newClasses[newClassIndex].instructors.length;

        let geneEval = geneEvaluate({
            freeSlots: freeSlots,
            newClassIndex: newClassIndex,
            slotId: slotId,
            instructorId: instructorId,
        });
        score += geneEval.score;
    });


    return score;
}

export const engine = (input: any) => {
    engineInput = new EngineInput(input);
    let geneCount = 0;
    for (let i = 0; i < engineInput.subjects.length; ++i) {
        geneCount = Math.max(geneCount, engineInput.subjects[i].instructors.length);
    }
    geneCount = geneCount * engineInput.freeSlots.length;
    
    let engine = new GeneticAlgorithm();
    engine.configurate({
        chromosomeLength: engineInput.newClasses.length,
        geneCount: geneCount,
        generation: 100,
        mutationRate: 0.01,
        maxPopulationSize: 20,
        fitness: fitness,
        eliteRate: 0.1,
        // initialPopulation: [
        //     new Entity(10, 10, [0, 9, 1, 7, 4, 5, 0, 1, 4, 2]),
        //     new Entity(10, 10, [0, 4, 2, 7, 2, 5, 0, 1, 0, 2]),
        // ]
    });

    let res = engine.run();

    let engineOutput = new EngineOutput(engineInput, res);

    return {
        result: engineOutput.result,
    };
}
import _ from "lodash";

import { Entity, GeneticAlgorithm, randInt } from "./GeneticAlgorithm";
import { ICoord, IEngineInput, IEngineInputClass, IEngineInputFreeSlot, IEngineInputInstructor, IEngineInputNewClass, IEngineInputRoom, IEngineInputSubject } from "./type";


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

class EngineInput implements IEngineInput {
    freeSlots: IEngineInputFreeSlot[] = [];
    instructors: IEngineInputInstructor[] = [];
    newClasses: IEngineInputNewClass[] = [];
    rooms: IEngineInputRoom[] = [];
    subjects: IEngineInputSubject[] = [];
    timetable: IEngineInputClass[] = [];
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
        this.convertInstructor(instructorInput);
        this.convertRoom(roomInput);
        this.convertSubject(subjectInput);
        this.convertTimetable(timetableInput);
        // Phase 2 parsing (ordered)
        this.convertClasses(newClassInput);
        this.convertSlot();
        this.convertEnrollment(enrollmentInput);
    }

    // Phase 1 parser (inordered)
    convertInstructor(input: any[]) {
        input.forEach((item: any) => {
            const obj: IEngineInputInstructor = {
                id: item.id,
                name: item.name,
                department: item.department,
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
                    .map((ele: any) => parseInt(ele)),
            };
            this.subjects.push(obj);
        });
    }
    
    convertTimetable(input: any[]) {
        input.forEach((item: any, i: number) => {
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
        });
    }

    // Phase 2 parser (ordered)
    convertClasses() {

    }

    convertEnrollment() {

    }

    convertSlot() {

    }
}
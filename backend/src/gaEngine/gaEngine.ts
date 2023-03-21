import _ from "lodash";

import { Entity, GeneticAlgorithm, randInt } from "./GeneticAlgorithm";

/**
 * Genetic Algorithm chromosome result: 0, 1, 2, 3, 4, 5, 6, 7...
 * Each number in gene represents: Free room slot + Lecturer * (coefficient: total room slot)
 * Each gene (slot) represents: Class
 */

/**
 * List phòng: [0, 1, 2, 3, 4, 5, 6, 7, 8]
 * List môn học: [0, 1, 2, 3, ...]
 * List lớp: [0, 1, 2, 3, 4, 5...] => thời khóa biểu gốc
 * {
        id: 0,
        name: 'L01',
        subject: 'Physic 1',
        weekday: 'Monday',
        period: [12, 14], // 12h to 14h
        room: 'H1-101',
        lecturer: 'N.V.An',
     }
 * List môn học cần thêm mới: [0, 1, 2, 3, 4]
     50 sv => ? lớp
 */

// Stage 1

/**
 * List chỗ trống: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ....] => length2
 * -- #1: Intersection of classes' preferred time (given) and rooms' available time (deduced)
 * -- #2: Union all slot from #1
 *
 * List lớp cần thêm mới: [0, 1, 2, 3, 4, 5, 6]:
 * -- Deduced or given?
 *
 * List giảng viên dạy cho từng lớp: [[0, 1, 2], [0, 1], [0, 1, 2, 3], ....] => maxLength
 * List giảng viên [0, 1, 2, 3, 4...]
 * {
 *   List môn giảng viên dạy được: [0, 1, 3, 6]
 *   List chỗ trống
 * }
 * -- Can be done by merging 2 lists into 1, which each record represents individual instructor/class relationship
 *
 * length2 * maxLength
 */

class Coord {
    building: string[] = ["B1", "B2"];
    value: number = 0;
    constructor(label: string) {
        let coord = label.split("-");
        let value = 0;
        if (coord[0][0] == "H") {
            value += 100000 + (parseInt(coord[0][1]) - 1) * 1000;
        } else {
            value += this.building.findIndex((x) => x == coord[0]) * 1000;
        }
        value += parseInt(coord[1]);
        this.value = value;
    }

    distanceTo(point: Coord) {
        let dist = Math.abs(this.value - point.value);
        return dist >= 100000 ? 2 : 0;
    }
}

class EngineInput {
    // Data
    public subject: any[] = []; // Subject information
    public timetable: any[] = []; // List of classes in origin timetable
    public room: any[] = []; // List of rooms
    public availableRoomSlot: any[] = []; // Each item represents info of rooms' available slots (available time, which weekday, which room)
    public instructor: any[] = []; // Each item represent instructors' info (availability for each room slot)
    public enrollment: any[] = []; // Enrollment list, each index represent class id
    public classes: any[] = []; // Classes to be added to timetable

    // Unused yet
    studentTimetable: any[] = []; // List of student in each class

    public constructor(input: any[]) {
        let subjectInput: any[] = [];
        let roomInput: any[] = [];
        let timetableInput: any[] = [];
        let instructorInput: any[] = [];
        let enrollmentInput: any[] = [];

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
                default: {
                    // Undefined sheet
                    break;
                }
            }
        });

        this.convertSubject(subjectInput);
        this.convertTimetable(timetableInput);
        this.convertRoom(roomInput);
        this.convertInstructor(instructorInput);
        this.convertEnrollment(enrollmentInput);

        this.convertClasses();
        this.convertSlot();
    }

    private convertClasses() {
        const originClassCount = this.timetable.length;

        this.enrollment.forEach((item: any) => {
            // TODO: Divide classes base on student count (open new class or change room of old class)
            let lecClassCount = item.students.length / item.lecCapacity;
            if (lecClassCount < 0.5) {
                lecClassCount = 0;
            } else {
                lecClassCount = Math.ceil(lecClassCount);
            }
            let labClassCount =
                lecClassCount == 0
                    ? 0
                    : Math.ceil(item.students.length / item.labCapacity);
            // Assign classes to be added
            let newClassId = originClassCount;
            for (let i = 0; i < lecClassCount; ++i) {
                const obj = {
                    id: newClassId++,
                    type: "lec",
                    period: parseInt(item.numLecHours),
                    capacity: item.lecCapacity,
                    instructors: item.instructors,
                };
                this.classes.push(obj);
            }
            for (let i = 0; i < labClassCount; ++i) {
                const obj = {
                    id: newClassId++,
                    type: item.labType,
                    period: parseInt(item.numLabHours),
                    capacity: item.labCapacity,
                    instructors: item.instructors,
                };
                this.classes.push(obj);
            }
        });
    }

    private convertEnrollment(input: any[]) {
        // IEnrollment[]
        const originClassCount = this.timetable.length;
        let currId = -1;

        input.forEach((item: any) => {
            if (item.classId !== undefined) {
                if (item.classId != currId) {
                    // Iterate to next class
                    currId = item.classId;
                    this.studentTimetable.push([]);
                }
                this.studentTimetable[item.classId].push(item.studentId);
            } else {
                if (item.subjectId != currId) {
                    // Iterate to next new subject
                    currId = item.subjectId;
                    // Store enrolled student
                    const obj = {
                        subjectId: item.subjectId,
                        students: [item.studentId],
                    };
                    this.enrollment.push(obj);
                } else {
                    this.enrollment[this.enrollment.length - 1].students.push(
                        item.studentId
                    );
                }
            }
        });
    }

    private convertInstructor(input: any[]) {
        // IInstructor[]
        input.forEach((item: any, i: number) => {
            const obj = {
                id: i,
                name: item.name,
                department: item.department,
            };
            this.instructor.push(obj);
        });
    }

    private convertRoom(input: any[]) {
        // IRoom[]
        input.forEach((item: any, i: number) => {
            const obj = {
                id: i,
                label: item.label,
                type: item.classType,
                capacity: item.capacity,
                coord: new Coord(item.label),
            };
            this.room.push(obj);
        });
    }

    // engineInput.availableRoomSlot = [
    //     {
    //         id: 0, // refer to room id
    //         type: 'lec',
    //         capacity: 4,
    //         // Additional info for engine
    //         weekday: 0, // Monday -> Sunday == 0 -> 6
    //         time: [7, 12],
    //         coord: new Coord("H1-101"),
    //     }
    // ]
    private convertSlot() {
        // NOTED: May need a future rework here
        // Remove unused information and add timeSlot attribute in order to split room into available slots
        let tempSlots: any[] = [];
        this.room.forEach((item: any) => {
            const obj = {
                id: item.id,
                type: item.type,
                capacity: item.capacity,
                timeSlot: [...Array(3).keys()].map((item: number) => {
                    return {
                        weekday: item,
                        time: [7, 18],
                    };
                }),
                coord: item.coord,
            };
            tempSlots.push(obj);
        });
        // Sieve available slot
        this.timetable.forEach((classItem: any) => {
            const maxI = tempSlots[classItem.roomId].timeSlot.length;
            for (let i = 0; i < maxI; ++i) {
                let timeSlotItem = tempSlots[classItem.roomId].timeSlot[i];
                // Slot is not occupied
                if (classItem.weekday != timeSlotItem.weekday) {
                    continue;
                }
                if (
                    classItem.time[1] <= timeSlotItem.time[0] ||
                    timeSlotItem.time[1] <= classItem.time[0]
                ) {
                    continue;
                }
                // Find split point from occupied slot
                let split1: any = timeSlotItem.time[1];
                let split2: any = timeSlotItem.time[0];
                if (timeSlotItem.time[0] < classItem.time[0]) {
                    split1 = classItem.time[0];
                }
                if (classItem.time[1] < timeSlotItem.time[1]) {
                    split2 = classItem.time[1];
                }
                // Split slot and replace occupied one
                if (timeSlotItem.time[0] < split1) {
                    split1 = {
                        weekday: timeSlotItem.weekday,
                        time: [timeSlotItem.time[0], split1],
                    };
                }
                if (split2 < timeSlotItem.time[1]) {
                    split2 = {
                        weekday: timeSlotItem.weekday,
                        time: [split2, timeSlotItem.time[1]],
                    };
                }
                tempSlots[classItem.roomId].timeSlot.splice(
                    i,
                    1,
                    split1,
                    split2
                );
                break;
            }
        });
        // Convert to availableRoomSlot
        tempSlots.forEach((item: any) => {
            item.timeSlot.forEach((timeSlotItem: any) => {
                const obj = {
                    id: item.id,
                    type: item.type,
                    capacity: item.capacity,
                    weekday: timeSlotItem.weekday,
                    time: timeSlotItem.time,
                    coord: item.coord,
                };
                this.availableRoomSlot.push(obj);
            });
        });

        // // TODO: add instructor's slotAvailability
        // this.timetable.forEach((item: any) => {

        // });
    }

    private convertSubject(input: any[]) {
        input.forEach((item: any, i: number) => {
            const obj = {
                id: i,
                name: item.name,
                department: item.department,
                instructors: item.instructors
                    .toString()
                    .split(",")
                    .map((ele: any) => parseInt(ele)),
            };
            this.subject.push(obj);
        });
    }

    private convertTimetable(input: any[]) {
        // IClass[]
        input.forEach((item: any, i: number) => {
            const obj = {
                id: i,
                name: item.name,
                subjectId: item.subjectId,
                weekday: item.weekDay,
                time: [item.startTime, item.endTime],
                roomId: item.roomId,
                instructorId: item.instructorId,
            };
            this.timetable.push(obj);
        });
    }
}

let engineInput: any;

const fitness = (entity: Entity) => {
    let score = 0;

    // Cloning data
    let availableRoomSlot = _.cloneDeep(engineInput.availableRoomSlot); // Clone of available room slot
    let instructor = _.cloneDeep(engineInput.instructor); // Clone of instructors

    const totalFreeSlot = engineInput.availableRoomSlot.length;
    entity.chromosome.forEach((value: number, newClassIndex: number) => {
        const slotId = value % totalFreeSlot;
        const instructorId = Math.floor(value / totalFreeSlot);

        // Check for appropritate instructor (instructor - class)
        if (
            instructorId >=
            engineInput.classes[newClassIndex].instructors.length
        ) {
            return;
        }
        // Check for valid slot (class - room)
        // Time availability
        const timeLeft =
            availableRoomSlot[slotId].time[1] -
            availableRoomSlot[slotId].time[0]; // Timeleft = slot's time - occupied time
        if (
            timeLeft <= 0 ||
            timeLeft < engineInput.classes[newClassIndex].period
        ) {
            return;
        }
        // Type match
        if (
            availableRoomSlot[slotId].type !=
            engineInput.classes[newClassIndex].type
        ) {
            return;
        }
        // Capacity availability
        if (
            availableRoomSlot[slotId].capacity <
            engineInput.classes[newClassIndex].capacity
        ) {
            return;
        }

        // TODO: Check for distance
        const proxId = 0; //engineInput.instructor[instructorId].slotAvailability[slotId].proximateClass;
        const proxRoomId = engineInput.timetable[proxId].roomId;
        const dist = engineInput.room[proxRoomId].coord.distanceTo(
            engineInput.availableRoomSlot[slotId].coord
        );
        if (dist > 0) {
            return;
        }

        // TODO: Check for student count

        // TODO: Satisfied all hard constraints
        // instructor[instructorId].slotAvailability[slotId].time[0] +=
        //     engineInput.classes[newClassIndex].period;
        availableRoomSlot[slotId].time[0] +=
            engineInput.classes[newClassIndex].period;
        score += 1;
    });
    return score;
};

// Test
export const engine = (input: any) => {
    engineInput = new EngineInput(input);
    let geneCount = 0;
    engineInput.classes.forEach((item: any) => {
        geneCount = Math.max(geneCount, item.instructors.length);
    });
    geneCount = geneCount * engineInput.availableRoomSlot.length;

    let engine = new GeneticAlgorithm();
    engine.configurate({
        chromosomeLength: engineInput.classes.length,
        geneCount: geneCount,
        generation: 1000,
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

    return {
        result: res,
    };
};

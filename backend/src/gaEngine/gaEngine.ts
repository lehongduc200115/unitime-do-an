import { Entity, GeneticAlgorithm, randInt } from "./GeneticAlgorithm"


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
 * -- TODO: Deduced or given?
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
    building: string[] = ['B1', 'B2'];
    value: number = 0;
    constructor(label: string) {
        let coord = label.split('-')
        let value = 0;
        if (coord[0][0] == 'H') {
            value += 100000 + (parseInt(coord[0][1]) - 1) * 1000
        } else {
            value += this.building.findIndex((x) => (x == coord[0]))*1000
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
    subject: any[] = []; // Subject information
    timetable: any[] = []; // List of classes in origin timetable
    room: any[] = []; // List of rooms
    availableRoomSlot: any[] = []; // Each item represents info of rooms' available slots (available time, which weekday, which room)
    instructor: any[] = []; // Each item represent instructors' info (availability for each room slot)
    enrollment: any[] = []; // Enrollment list, each index represent class id
    classes: any[] = []; // Classes to be added to timetable

    // Unused yet
    studentTimetable: any[] = []; // List of student in each class
    
    constructor(input: any[]) {
        let subjectInput: any[] = [];
        let roomInput: any[] = [];
        let timetableInput: any[] = [];
        let instructorInput: any[] = [];
        let classesInput: any[] = [];


        input.forEach((item: any) => {
            switch (item.sheetName) {
                case "Subject": {
                    subjectInput.push(item);
                    break;
                }
                case "Room": {
                    roomInput.push(item);
                    break;
                }
                case "Instructor": {
                    instructorInput.push(item);
                    break;
                }
                case "Student": {
                    break;
                }
                case "Enrollment": {
                    break;
                }
                case "Class": {
                    timetableInput.push(item);
                    break;
                }
                case "NewSubject": {
                    classesInput.push(item);
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
    }

    private convertSubject(input: any[]) {
        // TODO: 
        // - Change CLASS_TYPE in Excel to LAB_TYPE
        // - Split CAPACITY in Excel to LEC_CAPACITY and LAB_CAPACITY
        input.forEach((item: any, i: number) => {
            let res = {
                id: i,
                name: item.name,
                department: item.department,
                numLecHours: item.numLecHours,
                numLabHours: item.numLabHours,
                preferedWeekDay: item.preferedWeekDay,
                preferedTime: item.preferedTime,
                lecCapacity: item.lecCapacity,
                labCapacity: item.labCapacity,
                labType: item.labType,
                instructors: item.instructors.split(",").map((ele: any) => parseInt(ele))
            }
            this.subject.push(res);
        });
    }

    private convertTimetable(input: any[]) {
        input.forEach((item: any, i: number) => {
            let res = {
                id: i,
                name: item.name,
                subjectId: item.subjectId,
                weekDay: item.weekDay,
                time: [item.startTime, item.endTime], 
                roomId: item.roomId,
                instructorId: item.instructorId,
            }
            this.timetable.push(res);
        });
    }

    private convertRoom(input: any[]) {
        input.forEach((item: any, i: number) => {
            let res = {
                id: i,
                label: item.label,
                type: item.type,
                capacity: item.capacity,
                coord: new Coord(item.label),
            }
            this.room.push(res);
        });
    }

    private convertEnrollment(input: any[]) {
        const originClassCount = this.timetable.length;
        let currClassId = -1;

        input.forEach((item: any) => {
            if (item.classId < originClassCount) {
                if (item.classId != currClassId) { // Iterate to next class
                    currClassId = item.classId;
                    this.studentTimetable.push([]);
                }
                this.studentTimetable[item.classId].push(item.studentId);
            } else {
                if (item.classId != currClassId) { // Iterate to next new subject
                    currClassId = item.classId;
                    // Store enrolled student first, then divide classes later
                    let res = {
                        numLecHours: this.subject[item.subjectId].numLecHours,
                        numLabHours: this.subject[item.subjectId].numLabHours,
                        lecCapacity: this.subject[item.subjectId].lecCapacity,
                        labCapacity: this.subject[item.subjectId].labCapacity,
                        labType: this.subject[item.subjectId].labType,
                        instructors: this.subject[item.subjectId].instructors,
                        students: [item.studentId]
                    }
                    this.enrollment.push(res);
                } else {
                    this.enrollment[-1].students.push(item.studentId);
                }
            }
        });
    }

    private convertClasses() {
        const originClassCount = this.timetable.length;
        this.enrollment.forEach((item: any) => {
            // TODO: divide classes base on student count
            const lecClassCount = item.lecClassCount;
            const labClassCount = item.labClassCount;
            let newClassId = originClassCount;
            for (let i = 0; i < lecClassCount; ++i) {
                let res = {
                    id: newClassId++,
                    type: "lec",
                    period: item.numLecHours,
                    capacity: item.lecCapacity,
                    instructors: item.instructors,
                }
                this.classes.push(res);
            }
            for (let i = 0; i < labClassCount; ++i) {
                let res = {
                    id: newClassId++,
                    type: item.labType,
                    period: item.numLabHours,
                    capacity: item.labCapacity,
                    instructors: item.instructors,
                }
                this.classes.push(res);
            }
        });
    }
}

let engineInput: EngineInput;
// engineInput.timetable = [
//     {
//         id: 0,
//         name: 'L01',
//         subject: 'Physic 1',
//         weekday: 'Monday',
//         time: [12, 14], // 12h to 14h
//         roomId: 0,
//         lecturerId: 2,
//     }
// ]
// engineInput.room = [
//     {
//         id: 0,
//         name: 'H1-101',
//         type: 'lec',
//         capacity: 4,
//         coord: new Coord("H1-101"),
//     }
// ]
// engineInput.availableRoomSlot = [
//     {
//         id: 0, // refer to room id
//         type: 'lec',
//         capacity: 4,
//         // Additional info for engine
//         time: [7, 12],
//         coord: new Coord("H1-101"),
//     }
// ]
// engineInput.instructor = [
//     {
//         id: 0, // refer to instructor id
//         // Additional for engine
//         4 [{}, {}, {}, {}]
//         slotAvailability: [ // represents availability time of instructor per slot id
//             {
//                 time: [12, 14],
//                 proximateClass: 0, // represent classId contains main zone where instructor teaches
//             }
//         ],
//     }
// ]
// engineInput.classes = [
//     {
//         id: 11, // n+1 , represent new class ID after appended to timetable
//         type: "lec",
//         period: 2,
//         enroll: 4,
//         instructor: [0, 1] // id of instructor who can teach this class
//     }
// ]
// engineInput.studentTimetable = [
//     {

//     }
// ]

const fitness = (entity: Entity) => {
    let score = 0;

    // Cloning data to check constraints
    let availableRoomSlot = engineInput.availableRoomSlot.map(e => ({...e})); // Clone of available room slot
    let instructor = engineInput.instructor.map(e => ({...e}));

    // TODO
    // - Clone EngineInput data
    let availableSlotCount: number = engineInput.availableRoomSlot.length;
    // - Assign chromosome to clone data
    let appendedSlot = Array(availableSlotCount).fill([]); // Newly successful appended class (each array represents available slot and contains class index)

    const totalFreeSlot = 9; // EngineInput availableRoomSlot length
    entity.chromosome.forEach((value: number, newClassIndex: number) => {
        const slotId = value % totalFreeSlot;
        const instructorId = Math.floor(value / totalFreeSlot);


        // Check for appropritate instructor (instructor - class)
        if (engineInput.classes[newClassIndex].instructor.indexOf(instructorId) < 0) {
            return;
        }
        // Check for valid slot (class - room)
        // Time availability
        const timeLeft = availableRoomSlot[slotId].time[1] - availableRoomSlot[slotId].time[0]; // Timeleft = slot's time - occupied time
        if (timeLeft <= 0 || timeLeft < engineInput.classes[newClassIndex].period) {
            return;
        }
        // Type match
        if (availableRoomSlot[slotId].type !== engineInput.classes[newClassIndex].type) {
           return; 
        }
        // Capacity availability
        if (availableRoomSlot[slotId].capacity < engineInput.classes[newClassIndex].enroll) {
            return;
        }

        // TODO: Check for distance
        const proxId = engineInput.instructor[instructorId].slotAvailability[slotId].proximateClass;
        const proxRoomId = engineInput.timetable[proxId].roomId;
        const dist = engineInput.room[proxRoomId].coord.distanceTo(engineInput.availableRoomSlot[slotId].coord);
        if (dist > 0) {
            return;
        }
        
        // TODO: Check for student count

        // Satisfied all hard constraints
        appendedSlot[slotId].push(newClassIndex);
        instructor[instructorId].slotAvailability[slotId].time[0] += engineInput.classes[newClassIndex].period;
        availableRoomSlot[slotId].time[0] += engineInput.classes[newClassIndex].period;
        score += 1;
    });
    return score;
}


// Test
export const engine = (input: any) => {
    engineInput = new EngineInput(input);
    let engine = new GeneticAlgorithm();
    engine.configurate({
        chromosomeLength: 10,
        geneCount: 10,
        generation: 100,
        mutationRate: 0.01,
        maxPopulationSize: 100,
        fitness: fitness,
        eliteRate: 0.1,
        // initialPopulation: [
        //     new Entity(10, 10, [0, 9, 1, 7, 4, 5, 0, 1, 4, 2]),
        //     new Entity(10, 10, [0, 4, 2, 7, 2, 5, 0, 1, 0, 2]),
        // ]
    })
    
    let res = engine.run();

    return {
        result: res
    }
};
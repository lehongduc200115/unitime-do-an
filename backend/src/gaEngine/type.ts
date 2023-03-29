// General type
export interface ICoord {
    building: ["B1", "B2"],
    value: number,
    distanceTo: (point: ICoord) => number,
}

// Engine input type
export interface IEngineInput {
    freeSlots: IEngineInputFreeSlot[],
    instructors: IEngineInputInstructor[],
    newClasses: IEngineInputNewClass[],
    rooms: IEngineInputRoom[],
    subjects: IEngineInputSubject[],
    timetable: IEngineInputClass[],
}

export interface IEngineInputFreeSlot {
    roomId: string,
    roomType: string,
    roomCapacity: number,
    timeFrame: {
        start: any,
        end: any
    }
    // Next following 3 attributes represent entities that take the slot
    activeClasses: {
        [key: string]: string,
    }
    activeStudents: {
        [key: string]: string,
    }
    activeInstructors: {
        [key: string]: string,
    }
    coord: ICoord,
}

export interface IEngineInputClass {
    id: string,
    name: string,
    subjectId: string,
    instructorId: string,
    roomId: string,
    weekday: any,
    startTime: any,
    endTime: any,
}

export interface IEngineInputInstructor {
    id: string,
    name: string,
    department: string,
}

export interface IEngineInputNewClass {
    id: string,
    type: string,
    period: number,
    capacity: number,
    instructors: string[],
    preferedWeekday: any[],
    preferedTime: any[],
}

export interface IEngineInputRoom {
    id: string,
    label: string,
    type: string,
    capacity: number,
    coord: ICoord,
}

export interface IEngineInputSubject {
    id: string,
    name: string,
    department: string,
    instructors: string[],
    newStudent?: string[],
}


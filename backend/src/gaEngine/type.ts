// General type
export interface ICoord {
    building: ["B1", "B2"],
    value: number,
    distanceTo: (point: ICoord) => number,
}

export interface ITimeFrame {
    id: string,
    start: ITime,
    end: ITime,
}

export interface ITime {
    hour: number,
    minute: number,
    toInt: () => number,
    toString: () => string,
}


// Engine input type
export interface IEngineInput {
    freeSlots: IEngineInputFreeSlot[],
    instructors: IEngineInputInstructor[],
    newClasses: IEngineInputNewClass[],
    rooms: IEngineInputRoom[],
    subjects: IEngineInputSubject[],
    timetable: IEngineInputClass[],
    periodCount: number,
}

export interface IEngineInputFreeSlot {
    roomId: string,
    roomType: string,
    roomCapacity: number,
    roomCoord: ICoord,
    timeFrame: ITimeFrame,
    // Next following 3 attributes represent entities that take the slot
    activeClasses: { [key: string]: any },
    activeStudents: { [key: string]: any },
}

export interface IEngineInputClass {
    id: string,
    name: string,
    subjectId: string,
    instructorId: string,
    roomId: string,
    weekday: any,
    startTime: ITime,
    endTime: ITime,
}

export interface IEngineInputInstructor {
    id: string,
    name: string,
    department: string,
    activeClasses: { 
        [weekday: string]: {
            [periodId: string]: any,
        }
    },
}

export interface IEngineInputNewClass {
    id: string,
    type: string,
    period: number,
    capacity: number,
    instructors: string[],
    preferedWeekday: any[],
    preferedTime: ITimeFrame[],
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
    newStudents: { [key: string]: any },
}


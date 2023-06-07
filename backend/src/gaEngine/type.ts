// General type
export const EWeekday: { [weekday: string]: number } = {
    '2': 0,
    '3': 1,
    '4': 2,
    '5': 3,
    '6': 4,
    '7': 5,
    'CN': 6,
}


// Engine input type
export interface IEngineInput {
    instructors: IEngineInputInstructor[],
    newClasses: IEngineInputNewClass[],
    periods: IEngineInputPeriod[],
    rooms: IEngineInputRoom[],
    students: IEngineInputStudent[],
    subjects: IEngineInputSubject[],
    timetable: IEngineInputClass[],
}

export interface IEngineInputClass {
    id: string,
    name: string,
    subjectI: number,       // Use engine's index
    instructorI: number,    // Use engine's index
    roomI: number,          // Use engine's index
    weekday: number,        // Parsed from EWeekday
    startPeriod: number,    // Use engine's index
    endPeriod: number,      // Use engine's index
    students: number[]      // Use engine's index
}

export interface IEngineInputInstructor {
    id: string,
    name: string,
    department: string,
    activeClasses: number[][],  // 1st index is weekday, 2nd index is periodI, value is classI
}

export interface IEngineInputNewClass {
    id: string,
    subjectI: number,
    type: string,
    period: number,
    minEntrants: number,
    maxEntrants: number,
    instructors: number[],      // Use engine's index (instructorI)
    preferedWeekday: number[],
    preferedPeriod: number[][], // Array of prefered startPeriodI, e.g. [[0,6],[7,11]]... (value is refined from origin, which still includes endPeriodId)
    preferedCampus: string,
    preferedRoom: number[],
    scaleupClass: boolean,
    unrestricted: boolean,
}

export interface IEngineInputPeriod {
    id: string,
    startTime: string,
    endTime: string,
    breakInterval: number,
}

export interface IEngineInputRoom {
    id: string,
    label: string,
    campus: string,
    type: string,
    capacity: number,
    activeClasses: number[][],  // 1st index is weekday, 2nd index is periodI, value is classI
}

export interface IEngineInputStudent {
    id: string,
    name: string,
    department: string,
    activeClasses: number[][],  // 1st index is weekday, 2nd index is periodI, value is classI
}

export interface IEngineInputSubject {
    id: string,
    name: string,
    department: string,
    instructors: number[],  // Use engine's index
    classes: number[],      // Use engine's index
    newStudents: number[],  // Use engine's index
    newClasses: number[],   // Use engine's index
}
interface IEngineOutputClassOmit {
    name: string,
    subjectI: number,       // Use engine's index
    instructorI: number,    // Use engine's index
    roomI: number,          // Use engine's index
    weekday: number         // 
    startPeriod: number,    // Use engine's index
    endPeriod: number,      // Use engine's index
    students: number[]      // Use engine's index
}

export interface IEngineOutputClass {
    id: string,
    subject: string,
    instructor: string,
    room: string,
    weekday: string,
    period: string,
    time: string,
    entrants: number,
    capableStudents: string[],
    type: "not_available" | "unscalable" | "origin" | "new" | "modified" | "scaleup" | "scaleup_modified";
}

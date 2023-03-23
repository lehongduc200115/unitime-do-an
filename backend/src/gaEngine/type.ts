export interface ICoord {
    building: ["B1", "B2"],
    value: number,
}

export interface IEngineInputClass {
    id: number,
    subjectId: number,
    type: string,
    period: number,
    capacity: number,
    instructors: number[],
}

export interface IEngineInputInstructor {

}

export interface IEngineInputRoom {
    id: number,
    label: string,
    type: string,
    capacity: number,
    coord: ICoord,
}

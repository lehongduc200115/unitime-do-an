const LEC = 0;
const LAB = 1;


class Coordinate {
    constructor() {
        
    }
}

const dRoom = [
    {
        id: 0,
        label: 'H1-101',
        capacity: 4,
        type: LEC,
    },
    {
        id: 1,
        label: 'H1-102',
        capacity: 3,
        type: LEC,
    },
    {
        id: 2,
        label: 'H1-201',
        capacity: 3,
        type: LEC,
    },
    {
        id: 3,
        label: 'H1-202',
        capacity: 2,
        type: LAB,
    },
    {
        id: 4,
        label: 'H2-201',
        capacity: 2,
        type: LAB,
    },
    {
        id: 5,
        label: 'H2-202',
        capacity: 2,
        type: LAB,
    },
    {
        id: 6,
        label: 'B1-101',
        capacity: 4,
        type: LEC,
    },
    {
        id: 7,
        label: 'B1-201',
        capacity: 2,
        type: LAB,
    },
    {
        id: 8,
        label: 'B2-101',
        capacity: 3,
        type: LEC,
    },
    {
        id: 9,
        label: 'B2-102',
        capacity: 2,
        type: LAB,
    },
    {
        id: 10,
        label: 'B2-201',
        capacity: 2,
        type: LAB,
    },
]

const dSubject = [
    {
        id: 0,
        name: 'GT1',
        department: 'AS',
    },
    {
        id: 1,
        name: 'VL1',
        department: 'AS',
    },
    {
        id: 2,
        name: 'KTLT',
        department: 'CO',
    },
    {
        id: 3,
        name: 'NMDT',
        department: 'CO',
    },
    {
        id: 4,
        name: 'MDT',
        department: 'EE',
    },
    {
        id: 5,
        name: 'VT',
        department: 'EE',
    },
    {
        id: 6,
        name: 'HDC',
        department: 'CH',
    },
    {
        id: 7,
        name: 'HVC',
        department: 'CH',
    },
]

const dInstructor = [
    {
        id: 0,
        name: 'N.V.A',
        deparment: 'AS'
    },
    {
        id: 1,
        name: 'T.T.B',
        deparment: 'AS'
    },
    {
        id: 2,
        name: 'L.T.C',
        deparment: 'AS'
    },
    {
        id: 3,
        name: 'T.N.D',
        deparment: 'CO'
    },
    {
        id: 4,
        name: 'L.V.E',
        deparment: 'CO'
    },
    {
        id: 5,
        name: 'D.T.G',
        deparment: 'EE'
    },
    {
        id: 6,
        name: 'P.M.H',
        deparment: 'EE'
    },
    {
        id: 7,
        name: 'P.T.I',
        deparment: 'CH'
    },
    {
        id: 8,
        name: 'N.V.K',
        deparment: 'CH'
    }
]

const dClass = [
    {
        id: 0,
        subjectId: 0,
        instructorId: 0,
        name: 'L01',
        weekday: 'Monday',
        time: [7, 9],
        room: 'H1-101',
    },
    {
        id: 1,
        subjectId: 0,
        instructorId: 0,
        name: 'L02',
        weekday: 'Monday',
        time: [9, 11],
        room: 'H1-101',
    },
    {
        id: 2,
        subjectId: 0,
        instructorId: 1,
        name: 'L03',
        weekday: 'Tuesday',
        time: [12, 14],
        room: 'H1-101',
    },
    {
        id: 3,
        subjectId: 0,
        instructorId: 1,
        name: 'L04',
        weekday: 'Tuesday',
        time: [14, 16],
        room: 'H1-101',
    },
    {
        id: 4,
        subjectId: 1,
        instructorId: 1,
        name: 'L01',
        weekday: 'Monday',
        time: [12, 14],
        room: 'H1-101',
    },
    {
        id: 5,
        subjectId: 1,
        instructorId: 1,
        name: 'L02',
        weekday: 'Monday',
        time: [14, 16],
        room: 'H1-102',
    },
    {
        id: 6,
        subjectId: 1,
        instructorId: 2,
        name: 'L03',
        weekday: 'Monday',
        time: [7, 9],
        room: 'H1-102',
    },
    {
        id: 7,
        subjectId: 2,
        instructorId: 3,
        name: 'L01',
        weekday: 'Monday',
        time: [10, 12],
        room: 'H1-101',
    },
    {
        id: 8,
        subjectId: 0,
        instructorId: 0,
        name: 'L01',
        weekday: 'Monday',
        time: [9, 11],
        room: 'H1-101',
    },
    {
        id: 9,
        subjectId: 0,
        instructorId: 0,
        name: 'L01',
        weekday: 'Monday',
        time: [9, 11],
        room: 'H1-101',
    },
    {
        id: 10,
        subjectId: 0,
        instructorId: 0,
        name: 'L01',
        weekday: 'Monday',
        time: [9, 11],
        room: 'H1-101',
    },
    {
        id: 11,
        subjectId: 0,
        instructorId: 0,
        name: 'L01',
        weekday: 'Monday',
        time: [9, 11],
        room: 'H1-101',
    },
    {
        id: 12,
        subjectId: 0,
        instructorId: 0,
        name: 'L01',
        weekday: 'Monday',
        time: [9, 11],
        room: 'H1-101',
    }
]
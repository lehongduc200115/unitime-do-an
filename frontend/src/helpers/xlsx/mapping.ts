export const excelSchemaMapping: Record<string, any> = {
  student: {
    ID: "id",
    NAME: "name",
    // WEEKLY_TIME_TALBLE: "weeklyTimetable",s
    // CLASS_TYPE: "classType",
    DEPARTMENT: "department",
  },
  enrollment: {
    ID: "id",
    CLASS_ID: "classId",
    STUDENT_ID: "studentId",
  },
  room: {
    ID: "id",
    LABEL: "label",
    DEPARTMENT: "department",
    // WEEKLY_TIME_TALBLE: "weeklyTimetable",s
    CAPACITY: "capacity",
    CLASS_TYPE: "classType",
    // COORDINATE: {
    //   coordinate: {
    //     ZONE: "zone",
    //     BLOCK: "block",
    //     LEVEL: "level",
    //   },
    // },
  },
  instructor: {
    ID: "id",
    DEPARTMENT: "department",
    NAME: "name",
  },
  subject: {
    ID: "id",
    NAME: "name",
    DEPARTMENT: "department",
    // CLASS_TYPE: "classType",
    // HOUR: {
    //   hour: {
    //     NUM_LAB_HOURS: "lab",
    //     NUM_LEC_HOURS: "lec",
    //   },
    // },
  },
  class: {
    ID: "id",
    SUBJECT_ID: "subjectId",
    INSTRUCTOR_ID: "instructorId",
    ROOM_ID: "roomId",
    NAME: "name",
    WEEKDAY: "weekDay",
    START_TIME: "startTime",
    END_TIME: "endTime",
  },
  newSubject: {
    DEPARTMENT: "department",
    NAME: "name",
    NUM_LAB_HOURS: "numLabHours",
    NUM_LEC_HOURS: "numLecHours",
    PREFERED_WEEKDAY: "preferedWeekDay",
    PREFERED_TIME: "preferedTime",
    CAPACITY: "capacity",
    CLASS_TYPE: "classType",
    INSTRUCTORS: "instructors",
  },
};

export const timetableMapping: Record<string, any> = {
  subject: { table: "Subject" },
  room: { table: "Room" },
  instructor: { table: "Instructor" },
  student: { table: "Student" },
  enrollment: { table: "Enrollment" },
  class: { table: "Class" },
  newSubject: { table: "NewSubject" },
  // instructor: { table: "Instructor Timetable", refId: "instructorId" },
  // instructor: { table: "Instructor Timetable", refId: "instructorId" },
  // instructor: { table: "Instructor Timetable", refId: "instructorId" },
  // instructor: { table: "Instructor Timetable", refId: "instructorId" },
};

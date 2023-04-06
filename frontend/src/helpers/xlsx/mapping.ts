export const excelSchemaMapping: Record<string, any> = {
  student: {
    ID: "id",
    NAME: "name",
    // WEEKLY_TIME_TALBLE: "weeklyTimetable",s
    // CLASS_TYPE: "classType",
    DEPARTMENT: "department",
  },
  room: {
    ID: "id",
    LABEL: "label",
    DEPARTMENT: "department",
    CAPACITY: "capacity",
    CLASS_TYPE: "classType",
  },
  enrollment: {
    ID: "id",
    CLASS_ID: "classId",
    SUBJECT_ID: "subjectId",
    STUDENT_ID: "studentId",
  },
  instructor: {
    ID: "id",
    DEPARTMENT: "department",
    NAME: "name",
  },
  class: {
    ID: "id",
    SUBJECT_ID: "subjectId",
    INSTRUCTOR_ID: "instructorId",
    ROOM_ID: "roomId",
    NAME: "name",
    WEEKDAY: "weekDay",
    START_PERIOD: "startPeriod",
    END_PERIOD: "endPeriod",
  },
  subject: {
    ID: "id",
    DEPARTMENT: "department",
    NAME: "name",
    // NUM_LAB_HOURS: "numLabHours",
    // NUM_LEC_HOURS: "numLecHours",
    // PREFERED_WEEKDAY: "preferedWeekDay",
    // PREFERED_TIME: "preferedTime",
    // LEC_CAPACITY: "lecCapacity",
    // LAB_CAPACITY: "labCapacity",
    // LAB_TYPE: "labType",
    INSTRUCTORS: "instructors",
  },
  newClass: {
    ID: "id",
    SUBJECT_ID: "subjectId",
    TYPE: "type",
    PREFERED_WEEKDAY: "preferedWeekDay",
    PREFERED_PERIOD: "preferedPeriod",
    CAPACITY: "capacity",
    PERIOD: "period",
  },
  period: {
    ID: "id",
    START_TIME: "startTime",
    END_TIME: "endTime",
    BREAK_INTERVAL: "breakInterval"
  }
};

export const timetableMapping: Record<string, any> = {
  subject: { table: "Subject" },
  room: { table: "Room" },
  instructor: { table: "Instructor" },
  student: { table: "Student" },
  enrollment: { table: "Enrollment" },
  class: { table: "Class" },
  newClass: { table: "NewClass" },
  period: { table: "Period" },
};

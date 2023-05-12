export const excelSchemaMapping: Record<string, any> = {
  student: {
    ID: "id",
    NAME: "name",
    DEPARTMENT: "department",
  },
  room: {
    ID: "id",
    LABEL: "label",
    DEPARTMENT: "department",
    CAPACITY: "capacity",
    CAMPUS: "campus",
    TYPE: "classType",
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
    INSTRUCTORS: "instructors",
  },
  newClass: {
    ID: "id",
    SUBJECT_ID: "subjectId",
    TYPE: "type",
    PREFERED_WEEKDAY: "preferedWeekDay",
    PREFERED_PERIOD: "preferedPeriod",
    PREFERED_CAMPUS: "preferedCampus",
    PREFERED_ROOM: "preferedRoom",
    UNRESTRICTED: "unrestricted",
    MIN_ENTRANTS: "minEntrants",
    MAX_ENTRANTS: "maxEntrants",
    CAPACITY: "capacity",
    PERIOD: "period",
    SCALEUP_CLASS: "scaleUpClass",
  },
  period: {
    ID: "id",
    START_TIME: "startTime",
    END_TIME: "endTime",
    BREAK_INTERVAL: "breakInterval",
  },
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

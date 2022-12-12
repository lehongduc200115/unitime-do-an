export const excelSchemaMapping: Record<string, any> = {
  lecturer: {
    NAME: "name",
    WEEKLY_TIME_TALBLE: "weeklyTimetable",
    CLASS_TYPE: "classType",
    DEPARTMENT: "department",
  },
  room: {
    DEPARTMENT: "department",
    WEEKLY_TIME_TALBLE: "weeklyTimetable",
    CLASS_TYPE: "classType",
    COORDINATE: {
      coordinate: {
        ZONE: "zone",
        BLOCK: "block",
        LEVEL: "level",
      },
    },
  },
  subject: {
    DEPARTMENT: "department",
    CLASS_TYPE: "classType",
    HOUR: {
      hour: {
        NUM_LAB_HOURS: "lab",
        NUM_LEC_HOURS: "lec",
      },
    },
  },
  roomTimetable: {
    ROOM_ID: "roomId",
    WEEKDAY: "weekday",
    PERIOD: "period",
  },
  lecturerTimetable: {
    LECTURER_ID: "lecturerId",
    WEEKDAY: "weekday",
    PERIOD: "period",
  },
};

export const timetableMapping: Record<string, any> = {
  room: { table: "Room Timetable", refId: "roomId" },
  lecturer: { table: "Lecturer Timetable", refId: "lecturerId" },
};

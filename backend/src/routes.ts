import sheetController from "./sheet/sheet.controller";
import instructorController from "./instructor/instructor.controller";
import pingController from "./ping/ping.controller";
import roomController from "./room/room.controller";
import subjectController from "./subject/subject.controller";
import userController from "./user/user.controller";
import enrollmentController from "./enrollment/enrollment.controller";
import newSubjectController from "./new_subject/newSubject.controller";
import studentController from "./student/student.controller";

const routes = [
  ...pingController,
  ...userController,
  ...roomController,
  ...instructorController,
  ...subjectController,
  ...sheetController,
  ...enrollmentController,
  ...newSubjectController,
  ...studentController,
];

export { routes };

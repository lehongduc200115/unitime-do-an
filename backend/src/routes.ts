import lecturerController from "./lecturer/lecturer.controller";
import pingController from "./ping/ping.controller";
import roomController from "./room/room.controller";
import subjectController from "./subject/subject.controller";
import userController from "./user/user.controller";

const routes = [
  ...pingController,
  ...userController,
  ...roomController,
  ...lecturerController,
  ...subjectController,
];

export { routes };

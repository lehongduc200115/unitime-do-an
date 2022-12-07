import pingController from "./ping/ping.controller";
import roomController from "./room/room.controller";
import userController from "./user/user.controller";

const routes = [...pingController, ...userController, ...roomController];

export { routes };

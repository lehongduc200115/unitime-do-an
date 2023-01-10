import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { RoomModel } from "./room.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./room.constant";
import { createValidator, getValidator } from "./room.validator";
import { IRoomRequest } from "./room.interface";
import { utils } from "../common/utils";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.ROOM_PATH}`,
  options: {
    description: "Get all rooms",
    tags: ["api", "room"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await RoomModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.ROOM_PATH}/{id}`,
  options: {
    description: "Get room by id",
    tags: ["api", "room"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await RoomModel.findById(request.params.id);
      return h
        .response({
          data: data,
        })
        .code(200);
    },
  },
};

const post: ServerRoute = {
  method: HttpMethod.POST,
  path: `/${constants.ROOM_PATH}`,
  options: {
    description: "Create list of rooms",
    tags: ["api", "room"],
    validate: createValidator,
    handler: async (request: IRoomRequest, h: ResponseToolkit) => {
      let timetable = request.payload.map((it) => it.weeklyTimetable);
      timetable = timetable.map(
        (it) =>
          it.map((day) => utils.fillWith(day, 11, false)) as any as [
            IDailyTimetable
          ]
      );
      const payload = request.payload.map((it, index) => {
        return {
          ...it,
          weeklyTimetable: utils.fillWith(
            timetable[index],
            5,
            utils.fillWith(Array(), 11, false)
          ),
        };
      });
      const data = await RoomModel.insertMany(payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const roomController: ServerRoute[] = [getList, get, post];
export default roomController;

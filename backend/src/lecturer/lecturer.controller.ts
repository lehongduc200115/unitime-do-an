import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { LecturerModel } from "./lecturer.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./lecturer.constant";
import { createValidator, getValidator } from "./lecturer.validator";
import { ILecturerRequest } from "./lecturer.interface";
import { utils } from "../common/utils";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.LECTURER_PATH}`,
  options: {
    description: "Get all lecturers",
    tags: ["api", "lecturer"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await LecturerModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.LECTURER_PATH}/{id}`,
  options: {
    description: "Get lecturer by id",
    tags: ["api", "lecturer"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await LecturerModel.findById(request.params.id);
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
  path: `/${constants.LECTURER_PATH}`,
  options: {
    description: "Create list of lecturers",
    tags: ["api", "lecturer"],
    validate: createValidator,
    handler: async (request: ILecturerRequest, h: ResponseToolkit) => {
      let timetable = request.payload.map((it) => it.weeklyTimetable);
      timetable = timetable.map(
        (it) =>
          it.map((day) => utils.fillWith(day, 10, false)) as any as [
            IDailyTimetable
          ]
      );
      const payload = request.payload.map((it, index) => {
        return {
          ...it,
          weeklyTimetable: utils.fillWith(
            timetable[index],
            7,
            utils.fillWith(Array(), 10, false)
          ),
        };
      });
      const data = await LecturerModel.insertMany(payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const lecturerController: ServerRoute[] = [getList, get, post];
export default lecturerController;

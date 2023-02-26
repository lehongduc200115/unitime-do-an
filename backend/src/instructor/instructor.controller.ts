import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { InstructorModel } from "./instructor.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./instructor.constant";
import { createValidator, getValidator } from "./instructor.validator";
import { IInstructorRequest } from "./instructor.interface";
import { utils } from "../common/utils";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.LECTURER_PATH}`,
  options: {
    description: "Get all instructors",
    tags: ["api", "instructor"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await InstructorModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.LECTURER_PATH}/{id}`,
  options: {
    description: "Get instructor by id",
    tags: ["api", "instructor"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await InstructorModel.findById(request.params.id);
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
    description: "Create list of instructors",
    tags: ["api", "instructor"],
    validate: createValidator,
    handler: async (request: IInstructorRequest, h: ResponseToolkit) => {
      const data = await InstructorModel.insertMany(request.payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const instructorController: ServerRoute[] = [getList, get, post];
export default instructorController;

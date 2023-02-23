import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { StudentModel } from "./student.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./student.constant";
import { createValidator, getValidator } from "./student.validator";
import { IStudentRequest } from "./student.interface";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.STUDENT_PATH}`,
  options: {
    description: "Get all students",
    tags: ["api", "student"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await StudentModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.STUDENT_PATH}/{id}`,
  options: {
    description: "Get student by id",
    tags: ["api", "student"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await StudentModel.findById(request.params.id);
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
  path: `/${constants.STUDENT_PATH}`,
  options: {
    description: "Create list of students",
    tags: ["api", "student"],
    validate: createValidator,
    handler: async (request: IStudentRequest, h: ResponseToolkit) => {
      const data = await StudentModel.insertMany(request.payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const studentController: ServerRoute[] = [getList, get, post];
export default studentController;

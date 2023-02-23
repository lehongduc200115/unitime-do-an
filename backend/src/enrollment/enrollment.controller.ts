import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { EnrollmentModel } from "./enrollment.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./enrollment.constant";
import { createValidator, getValidator } from "./enrollment.validator";
import { IEnrollmentRequest } from "./enrollment.interface";
import { utils } from "../common/utils";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.ENROLLMENT_PATH}`,
  options: {
    description: "Get all enrollments",
    tags: ["api", "enrollment"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await EnrollmentModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.ENROLLMENT_PATH}/{id}`,
  options: {
    description: "Get enrollment by id",
    tags: ["api", "enrollment"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await EnrollmentModel.findById(request.params.id);
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
  path: `/${constants.ENROLLMENT_PATH}`,
  options: {
    description: "Create list of enrollments",
    tags: ["api", "enrollment"],
    validate: createValidator,
    handler: async (request: IEnrollmentRequest, h: ResponseToolkit) => {
      const data = await EnrollmentModel.insertMany(request.payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const enrollmentController: ServerRoute[] = [getList, get, post];
export default enrollmentController;

import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { ClassModel } from "./class.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./class.constant";
import { createValidator, getValidator } from "./class.validator";
import { IClassRequest } from "./class.interface";
import { utils } from "../common/utils";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.CLASS_PATH}`,
  options: {
    description: "Get all classes",
    tags: ["api", "class"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await ClassModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.CLASS_PATH}/{id}`,
  options: {
    description: "Get class by id",
    tags: ["api", "class"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await ClassModel.findById(request.params.id);
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
  path: `/${constants.CLASS_PATH}`,
  options: {
    description: "Create list of classes",
    tags: ["api", "class"],
    validate: createValidator,
    handler: async (request: IClassRequest, h: ResponseToolkit) => {
      const data = await ClassModel.insertMany(request.payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const classController: ServerRoute[] = [getList, get, post];
export default classController;

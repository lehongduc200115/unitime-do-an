import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { NewClassModel } from "./newClass.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./newClass.constant";
import { createValidator, getValidator } from "./newClass.validator";
import { INewClassRequest } from "./newClass.interface";
import { utils } from "../common/utils";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.NEW_CLASS_PATH}`,
  options: {
    description: "Get all newClasses",
    tags: ["api", "newClass"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await NewClassModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.NEW_CLASS_PATH}/{id}`,
  options: {
    description: "Get newClass by id",
    tags: ["api", "newClass"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await NewClassModel.findById(request.params.id);
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
  path: `/${constants.NEW_CLASS_PATH}`,
  options: {
    description: "Create list of newClasses",
    tags: ["api", "newClass"],
    validate: createValidator,
    handler: async (request: INewClassRequest, h: ResponseToolkit) => {
      const data = await NewClassModel.insertMany(request.payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const newClassController: ServerRoute[] = [getList, get, post];
export default newClassController;

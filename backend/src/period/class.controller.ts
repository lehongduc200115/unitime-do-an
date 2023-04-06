import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { PeriodModel } from "./period.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./period.constant";
import { createValidator, getValidator } from "./period.validator";
import { IPeriodRequest } from "./period.interface";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.PERIOD_PATH}`,
  options: {
    description: "Get all periodes",
    tags: ["api", "period"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await PeriodModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.PERIOD_PATH}/{id}`,
  options: {
    description: "Get period by id",
    tags: ["api", "period"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await PeriodModel.findById(request.params.id);
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
  path: `/${constants.PERIOD_PATH}`,
  options: {
    description: "Create list of periodes",
    tags: ["api", "period"],
    validate: createValidator,
    handler: async (request: IPeriodRequest, h: ResponseToolkit) => {
      const data = await PeriodModel.insertMany(request.payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const periodController: ServerRoute[] = [getList, get, post];
export default periodController;

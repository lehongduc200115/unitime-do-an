import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { SubjectModel } from "./subject.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./subject.constant";
import { createValidator, getValidator } from "./subject.validator";
import { ISubjectRequest } from "./subject.interface";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.SUBJECT_PATH}`,
  options: {
    description: "Get all subjects",
    tags: ["api", "subject"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await SubjectModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.SUBJECT_PATH}/{id}`,
  options: {
    description: "Get subject by id",
    tags: ["api", "subject"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await SubjectModel.findById(request.params.id);
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
  path: `/${constants.SUBJECT_PATH}`,
  options: {
    description: "Create list of subjects",
    tags: ["api", "subject"],
    validate: createValidator,
    handler: async (request: ISubjectRequest, h: ResponseToolkit) => {
      console.log(`subject.post: ${JSON.stringify(request)}`);
      const data = await SubjectModel.insertMany(request.payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const subjectController: ServerRoute[] = [getList, get, post];
export default subjectController;

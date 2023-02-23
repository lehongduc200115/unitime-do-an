import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { NewSubjectModel } from "./newSubject.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import { constants } from "./newSubject.constant";
import { createValidator, getValidator } from "./newSubject.validator";
import { INewSubjectRequest } from "./newSubject.interface";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.NEW_SUBJECT_PATH}`,
  options: {
    description: "Get all newSubjects",
    tags: ["api", "newSubject"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await NewSubjectModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/${constants.NEW_SUBJECT_PATH}/{id}`,
  options: {
    description: "Get newSubject by id",
    tags: ["api", "newSubject"],
    validate: getValidator,
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await NewSubjectModel.findById(request.params.id);
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
  path: `/${constants.NEW_SUBJECT_PATH}`,
  options: {
    description: "Create list of newSubjects",
    tags: ["api", "newSubject"],
    validate: createValidator,
    handler: async (request: INewSubjectRequest, h: ResponseToolkit) => {
      console.log(`newSubject.post: ${JSON.stringify(request)}`);
      const data = await NewSubjectModel.insertMany(request.payload);
      return h
        .response({
          data: data,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const newSubjectController: ServerRoute[] = [getList, get, post];
export default newSubjectController;

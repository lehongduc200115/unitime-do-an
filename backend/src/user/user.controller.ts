import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { UserModel } from "./user.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/user`,
  options: {
    description: "Get all users",
    tags: ["api", "user"],
    handler: async (_request: Request, h: ResponseToolkit) => {
      const data = await UserModel.find({});
      return h.response(data).code(HttpStatus.OK);
    },
  },
};

const get: ServerRoute = {
  method: HttpMethod.GET,
  path: `/user/{id}`,
  options: {
    description: "Get user by id",
    tags: ["api", "user"],
    handler: async (request: Request, h: ResponseToolkit) => {
      const data = await UserModel.findById(request.params.id);
      return h
        .response({
          data: data,
        })
        .code(200);
    },
  },
};

const userController: ServerRoute[] = [getList, get];
export default userController;

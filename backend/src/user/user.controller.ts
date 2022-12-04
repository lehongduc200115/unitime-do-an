import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { UserModel } from "./user.model";
import { HttpMethod, HttpStatus } from "../common/httpConstant";

const getList: ServerRoute = {
  method: HttpMethod.GET,
  path: `/user`,
  options: {
    description: "Get all users",
    tags: ["api", "User"],
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
    tags: ["api", "User"],
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

const login: ServerRoute = {
  method: HttpMethod.POST,
  path: `/login`,
  options: {
    description: "Post login by email, passwd",
    handler: async (request: Request, res: ResponseToolkit) => {
      const { email, password } = request.payload as any;
      const users = await UserModel.findOne({
        email: email,
        password: password,
      }).exec();

      return res
        .response({
          email: users ? users.email : null,
        })
        .code(HttpStatus.OK);
    },
  },
};

const register: ServerRoute = {
  method: HttpMethod.POST,
  path: `/register`,
  options: {
    description: "Register new user",
    handler: async (request: Request, res: ResponseToolkit) => {
      const { email, password, phone } = request.payload as any;
      const users = await UserModel.findOne({ email: email }).exec();
      console.log(`users: ${JSON.stringify(users)}`);
      let doc = null;
      if (!users) {
        doc = await UserModel.create({
          email: email,
          password: password,
          phone: phone,
        });
      }
      return res
        .response({
          email: doc ? doc.email : null,
          isExist: !!users,
        })
        .code(HttpStatus.CREATED);
    },
  },
};

const verify: ServerRoute = {
  method: HttpMethod.GET,
  path: `/user/verify`,
  options: {
    description: "Verify user by emailing",
    handler: async (request: Request, res: ResponseToolkit) => {
      const { email } = request.query as any;
      const foundUser = await UserModel.findOneAndUpdate(
        {
          email: email,
          isVerified: false,
        },
        {
          isVerified: true,
        }
      );

      return res
        .response({
          isVerified: !!foundUser,
        })
        .code(HttpStatus.OK);
    },
  },
};

const userController: ServerRoute[] = [getList, get, login, register, verify];
export default userController;

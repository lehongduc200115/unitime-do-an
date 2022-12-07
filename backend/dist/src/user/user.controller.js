"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./user.model");
const httpConstant_1 = require("../common/httpConstant");
const getList = {
    method: httpConstant_1.HttpMethod.GET,
    path: `/user`,
    options: {
        description: "Get all users",
        tags: ["api", "user"],
        handler: async (_request, h) => {
            const data = await user_model_1.UserModel.find({});
            return h.response(data).code(httpConstant_1.HttpStatus.OK);
        },
    },
};
const get = {
    method: httpConstant_1.HttpMethod.GET,
    path: `/user/{id}`,
    options: {
        description: "Get user by id",
        tags: ["api", "user"],
        handler: async (request, h) => {
            const data = await user_model_1.UserModel.findById(request.params.id);
            return h
                .response({
                data: data,
            })
                .code(200);
        },
    },
};
const userController = [getList, get];
exports.default = userController;
//# sourceMappingURL=user.controller.js.map
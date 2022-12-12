"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_model_1 = require("./room.model");
const httpConstant_1 = require("../common/httpConstant");
const room_constant_1 = require("./room.constant");
const room_validator_1 = require("./room.validator");
const utils_1 = require("../common/utils");
const getList = {
    method: httpConstant_1.HttpMethod.GET,
    path: `/${room_constant_1.constants.ROOM_PATH}`,
    options: {
        description: "Get all rooms",
        tags: ["api", "room"],
        handler: async (_request, h) => {
            const data = await room_model_1.RoomModel.find({});
            return h.response(data).code(httpConstant_1.HttpStatus.OK);
        },
    },
};
const get = {
    method: httpConstant_1.HttpMethod.GET,
    path: `/${room_constant_1.constants.ROOM_PATH}/{id}`,
    options: {
        description: "Get room by id",
        tags: ["api", "room"],
        validate: room_validator_1.getValidator,
        handler: async (request, h) => {
            const data = await room_model_1.RoomModel.findById(request.params.id);
            return h
                .response({
                data: data,
            })
                .code(200);
        },
    },
};
const post = {
    method: httpConstant_1.HttpMethod.POST,
    path: `/${room_constant_1.constants.ROOM_PATH}`,
    options: {
        description: "Create list of rooms",
        tags: ["api", "room"],
        validate: room_validator_1.createValidator,
        handler: async (request, h) => {
            let timetable = request.payload.map((it) => it.weeklyTimetable);
            timetable = timetable.map((it) => it.map((day) => utils_1.utils.fillWith(day, 11, false)));
            const payload = request.payload.map((it, index) => {
                return {
                    ...it,
                    weeklyTimetable: utils_1.utils.fillWith(timetable[index], 5, utils_1.utils.fillWith(Array(), 11, false)),
                };
            });
            const data = await room_model_1.RoomModel.insertMany(payload);
            return h
                .response({
                data: data,
            })
                .code(httpConstant_1.HttpStatus.CREATED);
        },
    },
};
const roomController = [getList, get, post];
exports.default = roomController;
//# sourceMappingURL=room.controller.js.map
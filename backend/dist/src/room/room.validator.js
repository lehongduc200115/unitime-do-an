"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidator = exports.getValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../common/enum");
const idParamValidator = joi_1.default.object({
    id: joi_1.default.string().hex().length(24),
});
exports.getValidator = {
    params: idParamValidator,
};
exports.createValidator = {
    payload: joi_1.default.array().items(joi_1.default.object({
        id: joi_1.default.string(),
        department: joi_1.default.string(),
        weeklyTimetable: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.boolean())),
        capacity: joi_1.default.number(),
        classType: joi_1.default.string()
            .valid(...Object.values(enum_1.ClassType))
            .default(enum_1.ClassType.LEC),
        coordinate: joi_1.default.object({
            zone: joi_1.default.string().valid("TD", "Q10"),
            block: joi_1.default.string(),
            level: joi_1.default.number(),
        }),
    })),
};
exports.default = {
    getValidator: exports.getValidator,
    createValidator: exports.createValidator,
};
//# sourceMappingURL=room.validator.js.map
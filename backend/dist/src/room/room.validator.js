"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidator = exports.getValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const idParamValidator = joi_1.default.object({
    id: joi_1.default.string().hex().length(24),
});
exports.getValidator = {
    params: idParamValidator,
};
exports.createValidator = {
    payload: joi_1.default.array().items(joi_1.default.object({
        id: joi_1.default.string(),
        label: joi_1.default.string().optional(),
        campus: joi_1.default.string().optional(),
        department: joi_1.default.string().optional(),
        capacity: joi_1.default.number(),
        classType: joi_1.default.string().optional(),
    })),
};
exports.default = {
    getValidator: exports.getValidator,
    createValidator: exports.createValidator,
};
//# sourceMappingURL=room.validator.js.map
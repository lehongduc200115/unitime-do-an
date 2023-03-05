"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const sheet_controller_1 = __importDefault(require("./sheet/sheet.controller"));
const instructor_controller_1 = __importDefault(require("./instructor/instructor.controller"));
const ping_controller_1 = __importDefault(require("./ping/ping.controller"));
const room_controller_1 = __importDefault(require("./room/room.controller"));
const subject_controller_1 = __importDefault(require("./subject/subject.controller"));
const user_controller_1 = __importDefault(require("./user/user.controller"));
const enrollment_controller_1 = __importDefault(require("./enrollment/enrollment.controller"));
const student_controller_1 = __importDefault(require("./student/student.controller"));
const routes = [
    ...ping_controller_1.default,
    ...user_controller_1.default,
    ...room_controller_1.default,
    ...instructor_controller_1.default,
    ...subject_controller_1.default,
    ...sheet_controller_1.default,
    ...enrollment_controller_1.default,
    ...student_controller_1.default,
];
exports.routes = routes;
//# sourceMappingURL=routes.js.map
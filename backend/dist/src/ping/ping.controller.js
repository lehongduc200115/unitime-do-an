"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Method, StatusCode } from '@swat/hapi-common';
const ping = {
    method: "GET",
    path: `/ping`,
    options: {
        auth: false,
        description: "Pongs back",
        notes: "To check is service pongs on a ping",
        tags: ["api", "ping"],
        handler: async (_, h) => {
            return h.response("pong").code(204);
        },
    },
};
const healthController = [ping];
exports.default = healthController;
//# sourceMappingURL=ping.controller.js.map
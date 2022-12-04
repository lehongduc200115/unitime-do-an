"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Method, StatusCode } from '@swat/hapi-common';
const Joi = require('@hapi/joi');
const ping = {
    method: 'GET',
    path: `/ping`,
    options: {
        auth: false,
        description: 'Pongs back',
        notes: 'To check is service pongs on a ping',
        tags: ['api'],
        handler: async (_, h) => {
            return h.response('pong').code(200);
        }
    }
};
const ping2 = {
    method: 'GET',
    path: `/ping2`,
    options: {
        auth: false,
        description: 'Pongs back',
        notes: 'To check is service pongs on a ping',
        tags: ['api'],
        handler: async (_, h) => {
            return h.response('pong2').code(200);
        }
    }
};
const healthController = [ping, ping2];
exports.default = healthController;
//# sourceMappingURL=ping.controller.js.map
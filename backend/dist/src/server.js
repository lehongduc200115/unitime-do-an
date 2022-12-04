"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.init = void 0;
const hapi_1 = require("@hapi/hapi");
const config_1 = __importDefault(require("./config"));
const HapiSwagger = __importStar(require("hapi-swagger"));
const inert_1 = __importDefault(require("@hapi/inert"));
const vision_1 = __importDefault(require("@hapi/vision"));
const mongoDb_1 = require("./common/mongoDb");
// import Swagger from './hapiPlugins/swagger';
const routes_1 = require("./routes");
const logger_1 = __importDefault(require("./logger"));
const swaggerOptions = {
    info: {
        title: "Backend API Documentation",
    },
};
const createServer = async () => {
    const server = new hapi_1.Server({
        port: config_1.default.serverPort,
        host: config_1.default.serverHost,
        routes: {
            validate: {
                options: {
                    abortEarly: false,
                },
            },
            cors: true,
        },
    });
    const plugins = [
        {
            plugin: inert_1.default,
        },
        {
            plugin: vision_1.default,
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions,
        },
    ];
    // Register routes
    await server.register(plugins);
    server.route(routes_1.routes);
    return server;
};
const init = async () => {
    await (0, mongoDb_1.connectMongo)();
    const server = await createServer();
    await server
        .initialize()
        .then(() => logger_1.default.info(`______      SERVER LISTENING AT   ${server.info.host}:${server.info.port}      ______`));
    return server;
};
exports.init = init;
const start = async (module) => {
    if (!module.parent) {
        await (0, exports.init)()
            .then(async (server) => {
            await server.start();
            // start queues should be at last
            // await kafkaConsumer.connect();
            // await kafkaProducer.connect();
        })
            .catch((err) => {
            logger_1.default.error("Server cannot start", err.stack);
            console.log(err);
            logger_1.default.on("finish", () => {
                process.exit(1);
            });
            logger_1.default.end();
        });
    }
};
exports.start = start;
logger_1.default.info(`Server is starting in ${__dirname} executed in ${process.env.PWD}`);
(0, exports.start)(module);
//# sourceMappingURL=server.js.map
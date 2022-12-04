"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = void 0;
const mongoose_1 = require("mongoose");
const logger_1 = __importDefault(require("../logger"));
const config_1 = __importDefault(require("../config"));
const connectMongo = () => new Promise((resolve, reject) => {
    const mongoUri = config_1.default.mongoUri;
    const connectionOptions = {
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
        // poolSize: config.mongoPoolSize
        minPoolSize: config_1.default.mongoPoolSize
    };
    if (!mongoUri) {
        throw new Error('Mongo URI is require to connect Db');
    }
    mongoose_1.connection.on('error', (err) => {
        logger_1.default.error('error while connecting to mongodb', err);
    });
    mongoose_1.connection.once('error', reject); // reject first error
    mongoose_1.connection.once('open', () => {
        mongoose_1.connection.off('error', reject);
        resolve();
    });
    mongoose_1.connection.on('reconnected', () => {
        logger_1.default.info('Connection to mongodb is resumed');
    });
    mongoose_1.connection.on('disconnected', () => {
        logger_1.default.error('Mongodb disconnected');
    });
    // set('useCreateIndex', true);
    (0, mongoose_1.connect)(mongoUri, connectionOptions);
});
exports.connectMongo = connectMongo;
//# sourceMappingURL=mongoDb.js.map
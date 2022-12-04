"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfigs = exports.loadJsonConfigs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const env = process.env.NODE_ENV;
const configDir = `${__dirname}/configs`;
logger_1.default.info(`Loading config from ${configDir} for ${env}`);
const loadJsonConfigs = () => {
    let jsonConfig = {};
    if (env && (0, fs_1.existsSync)(`${configDir}/${env}.json`)) {
        jsonConfig = require(`${configDir}/${env}.json`);
    }
    if ((0, fs_1.existsSync)(`${configDir}/default.json`)) {
        jsonConfig = (0, lodash_1.merge)(require(`${configDir}/default.json`), jsonConfig);
    }
    return jsonConfig;
};
exports.loadJsonConfigs = loadJsonConfigs;
const loadConfigs = () => {
    const jsonConfigs = (0, exports.loadJsonConfigs)();
    const merged = (0, lodash_1.merge)(jsonConfigs, {
        serviceName: process.env.SERVICE_NAME || jsonConfigs.serviceName,
        serverHost: process.env.SERVER_HOST || jsonConfigs.server.host,
        serverPort: process.env.SERVER_PORT || jsonConfigs.server.port,
        mongoUri: process.env.MONGO_URI || jsonConfigs.mongoUri,
        mongoPoolSize: Number(process.env.MONGO_POOLSIZE || 5),
        rewardsValidateUrl: process.env.REWARDS_VALIDATE_URL || jsonConfigs.rewardsValidateUrl,
        membershipEndpoint: process.env.MEMBERSHIP_ENDPOINT || jsonConfigs.membershipEndpoint,
        kafkaBrokers: process.env.KAFKA_BROKERS
            ? process.env.KAFKA_BROKERS.split(',')
            : jsonConfigs.kafkaBrokers,
        kafkaPartitionsConsumedConcurrently: process.env.PARTITIONS_CONSUMED_CONCURRENTLY ||
            jsonConfigs.kafkaPartitionsConsumedConcurrently,
        redisUri: process.env.REDIS_URI,
        SWAGGER_BASE_PATH: process.env.SWAGGER_BASE_PATH || jsonConfigs.SWAGGER_BASE_PATH,
        rundeck: {
            apiURL: process.env.RUNDECK_URI || jsonConfigs.rundeckUri,
            apiVersion: 40,
            projectName: process.env.RUNDECK_PROJECT_NAME || jsonConfigs.rundeckProjectName,
            accessToken: process.env.RUNDECK_ACCESS_TOKEN || jsonConfigs.rundeckAccessToken,
            hostUrl: process.env.HOST_URL || jsonConfigs.hostUrl,
            callbackEndpoint: process.env.RUNDECK_CALLBACK_ENDPOINT ||
                jsonConfigs.rundeckCallbackEndpoint,
        },
        mailUsername: process.env.MAIL_USERNAME,
        mailPassword: process.env.MAIL_PASSWORD,
    });
    console.log(`merged: ${JSON.stringify(merged)}`);
    return merged;
};
exports.loadConfigs = loadConfigs;
exports.default = (0, exports.loadConfigs)();
//# sourceMappingURL=config.js.map
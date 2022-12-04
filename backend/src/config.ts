import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { merge } from 'lodash';

import logger from './logger';


dotenv.config();
const env = process.env.NODE_ENV;
const configDir = `${__dirname}/configs`;
logger.info(`Loading config from ${configDir} for ${env}`);

export const loadJsonConfigs = (): any => {
  let jsonConfig = {};
  if (env && existsSync(`${configDir}/${env}.json`)) {
    jsonConfig = require(`${configDir}/${env}.json`);
  }

  if (existsSync(`${configDir}/default.json`)) {
    jsonConfig = merge(require(`${configDir}/default.json`), jsonConfig);
  }
  return jsonConfig;
};

export const loadConfigs = (): any => {
  const jsonConfigs = loadJsonConfigs();
  const merged = merge(jsonConfigs, {
    serviceName: process.env.SERVICE_NAME || jsonConfigs.serviceName,
    serverHost: process.env.SERVER_HOST || jsonConfigs.server.host,
    serverPort: process.env.SERVER_PORT || jsonConfigs.server.port,
    mongoUri: process.env.MONGO_URI || jsonConfigs.mongoUri,
    mongoPoolSize: Number(process.env.MONGO_POOLSIZE || 5),
    rewardsValidateUrl:
      process.env.REWARDS_VALIDATE_URL || jsonConfigs.rewardsValidateUrl,
    membershipEndpoint:
      process.env.MEMBERSHIP_ENDPOINT || jsonConfigs.membershipEndpoint,
    kafkaBrokers: process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(',')
      : jsonConfigs.kafkaBrokers,
    kafkaPartitionsConsumedConcurrently:
      process.env.PARTITIONS_CONSUMED_CONCURRENTLY ||
      jsonConfigs.kafkaPartitionsConsumedConcurrently,
    redisUri: process.env.REDIS_URI,
    SWAGGER_BASE_PATH:
      process.env.SWAGGER_BASE_PATH || jsonConfigs.SWAGGER_BASE_PATH,
    rundeck: {
      apiURL: process.env.RUNDECK_URI || jsonConfigs.rundeckUri,
      apiVersion: 40,
      projectName:
        process.env.RUNDECK_PROJECT_NAME || jsonConfigs.rundeckProjectName,
      accessToken:
        process.env.RUNDECK_ACCESS_TOKEN || jsonConfigs.rundeckAccessToken,
      hostUrl: process.env.HOST_URL || jsonConfigs.hostUrl,
      callbackEndpoint:
        process.env.RUNDECK_CALLBACK_ENDPOINT ||
        jsonConfigs.rundeckCallbackEndpoint,
    },
    mailUsername: process.env.MAIL_USERNAME,
    mailPassword: process.env.MAIL_PASSWORD,
  });
  console.log(`merged: ${JSON.stringify(merged)}`);
  return merged;
};

export default loadConfigs();
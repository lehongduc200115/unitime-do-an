import { Server } from "@hapi/hapi";
import config from "./config";

import { connectMongo } from "./common/mongoDb";
// import Swagger from './hapiPlugins/swagger';

import { routes } from "./routes";
import logger from "./logger";

const createServer = async () => {
  const server = new Server({
    port: config.serverPort,
    host: config.serverHost,
    routes: {
      validate: {
        options: {
          abortEarly: false,
        },
      },
      cors: true,
    },
  });

  // Register routes
  server.route(routes);

  return server;
};

export const init = async () => {
  await connectMongo();
  const server = await createServer();
  await server
    .initialize()
    .then(() =>
      logger.info(
        `______      SERVER LISTENING AT   ${server.info.host}:${server.info.port}      ______`
      )
    );
  return server;
};

export const start = async (module: NodeModule) => {
  if (!module.parent) {
    await init()
      .then(async (server) => {
        await server.start();
        // start queues should be at last
        // await kafkaConsumer.connect();
        // await kafkaProducer.connect();
      })
      .catch((err) => {
        logger.error("Server cannot start", err.stack);
        console.log(err)
        logger.on("finish", () => {
          process.exit(1);
        });
        logger.end();
      });
  }
};

logger.info(
  `Server is starting in ${__dirname} executed in ${process.env.PWD}`
);
start(module);

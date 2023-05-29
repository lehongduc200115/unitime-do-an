module.exports = {
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/__jest__/setup.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        /* ts-jest config goes here in Jest */
        diagnostics: false,
      },
    ],
  },
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  setupFiles: ["dotenv/config"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.(interface|constant|type|validator|redisClient|index|enum).{ts,js}",
    "!src/**/(interface|constant|type|validator|redisClient|index|enum).{ts,js}",
    "!**/__mocks__/**",
    "!**/node_modules/**",
    "!**/internalAdapter/**",
    "!**/tracking/**",
    "!**/common/mongoDb.{ts,js}",
    "!**/common/kafka/kafkaTopics.{ts,js}",
  ],
};

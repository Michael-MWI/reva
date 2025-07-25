/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        fastify: true,
      },
    ],
  },
  globalSetup: "./test/jestGlobalSetup.ts",
  setupFilesAfterEnv: ["./test/jestSetupFilesAfterEnv.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

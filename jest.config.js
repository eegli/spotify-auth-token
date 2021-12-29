/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src', './test'],
  setupFilesAfterEnv: ['./src/test/setup.ts'],
};

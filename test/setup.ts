import * as utils from '../src/utils';

jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
    promises: {
      mkdir: jest.fn(),
      writeFile: jest.fn(),
    },
  };
});

jest.mock('../src/request');

jest
  .useFakeTimers('modern')
  .setSystemTime(new Date('1996-04-20T22:00:00.000Z'));

jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/dir');

// For tests, throw an error instead of exiting
jest.spyOn(utils, 'exit').mockImplementation((msg) => {
  throw new Error(msg);
});

jest.spyOn(console, 'error').mockImplementation(jest.fn());

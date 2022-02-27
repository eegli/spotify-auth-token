import * as utils from '../src/utils';

jest.mock('../src/request');
jest.mock('fs-extra');

jest
  .useFakeTimers('modern')
  .setSystemTime(new Date('1996-04-20T22:00:00.000Z'));

jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/dir');

// Math.random().toString(36).slice(2) now returns "ou8n1fu8n1"
jest.spyOn(Math, 'random').mockReturnValue(0.69);

// For tests, throw an error instead of exiting
jest.spyOn(utils, 'exit').mockImplementation((msg) => {
  throw new Error(msg);
});

jest.spyOn(console, 'error').mockImplementation(jest.fn());

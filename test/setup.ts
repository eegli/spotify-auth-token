jest.mock('fs');

jest
  .useFakeTimers('modern')
  .setSystemTime(new Date('1996-04-20T22:00:00.000Z'));

jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/dir');

// For tests, throw an error instead of exiting
jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error();
});

jest.spyOn(console, 'error').mockImplementation(jest.fn());

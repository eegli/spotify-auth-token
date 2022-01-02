jest
  .useFakeTimers('modern')
  .setSystemTime(new Date('1996-04-20T22:00:00.000Z'));

jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/dir');
jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error();
});
// Math.random().toString(36).slice(2) now returns "ou8n1fu8n1"
jest.spyOn(Math, 'random').mockReturnValue(0.69);

import fs from 'fs';
import * as request from '../src/request';

jest
  .useFakeTimers('modern')
  .setSystemTime(new Date('1996-04-20T22:00:00.000Z'));

jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/dir');

jest.spyOn(global.console, 'error').mockImplementation(jest.fn()); // Math.random().toString(36).slice(2) now returns ou8n1fu8n1
jest.spyOn(Math, 'random').mockReturnValue(0.69);

export const consoleInfoSpy = jest
  .spyOn(global.console, 'info')
  .mockImplementation(jest.fn());
export const exitSpy = jest
  .spyOn(process, 'exit')
  .mockImplementation((number) => {
    throw new Error('process.exit: ' + number);
  });

jest.mock('fs');
jest.mock('../src/request');
export const mockedFs = fs as jest.Mocked<typeof fs>;
export const mockedRequest = request as jest.Mocked<typeof request>;

mockedRequest.getLocalhostUrl.mockImplementation(() => {
  return Promise.resolve(`?code=AQDKHwNyRapw&state=ou8n1fu8n1`);
});
mockedRequest.request.mockResolvedValue({
  access_token: 'BQC2fMYf9',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'OFuVRQAzVzq0Wy_Py_W4KiMr8H0',
  scope: 'user-library-read',
});

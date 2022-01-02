import fs from 'fs';
import path from 'path';
import auth from '../src/index';
import * as request from '../src/request';
import { AppConfig } from '../src/types';

jest.mock('fs');
jest.mock('../src/request');

const consoleInfoSpy = jest
  .spyOn(global.console, 'info')
  .mockImplementation(jest.fn());

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedRequest = request as jest.Mocked<typeof request>;

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

afterEach(() => {
  jest.clearAllMocks();
});

describe('App', () => {
  const testConfigs: AppConfig[] = [
    {
      clientId: 'cid',
      clientSecret: 'cs',
      port: 1,
      outDir: 'out/token/',
      outFileName: 'mytoken',
      scopes: 'scopes1,scropes2',
    },
    {
      clientId: 'cid',
      clientSecret: 'cs',
      port: 59,
      outDir: '/out/token/',
      outFileName: 'token',
      scopes: 'scopes1',
    },
    {
      clientId: 'cid',
      clientSecret: 'cs',
      port: 69,
      outDir: '/out/',
      outFileName: 'spotify-token.json',
      scopes: 'scropes2',
    },
  ];

  testConfigs.forEach((config, idx) => {
    it(`works with config ${idx}`, async () => {
      await auth(config);

      expect(consoleInfoSpy.mock.calls[1][0]).toMatchSnapshot(
        `config ${idx}, auth url`
      );
      expect(mockedRequest.getLocalhostUrl).toHaveBeenCalledWith(config.port);
      expect(mockedRequest.request.mock.calls[0][0]).toMatchSnapshot(
        `config ${idx}, spotify request`
      );
      const outDirPath = (
        mockedFs.writeFileSync.mock.calls[0][0] as string
      ).replace(/\\|\//gi, '/');
      expect(path.parse(outDirPath)).toMatchSnapshot(`config ${idx}, out dir`);
      expect(
        JSON.parse(mockedFs.writeFileSync.mock.calls[0][1] as string)
      ).toMatchSnapshot(`config ${idx}, written data`);
    });
  });
});

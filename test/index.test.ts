import fs from 'fs';
import auth from '../src/index';
import * as request from '../src/request';
import { AppConfig } from '../src/types';
import * as utils from '../src/utils';

jest.useFakeTimers('modern').setSystemTime(new Date(1996, 3, 21));

const mockId = '1234';

jest.spyOn(utils, 'id').mockReturnValue(mockId);

const writeFileSpy = jest
  .spyOn(fs, 'writeFileSync')
  .mockImplementation(() => null);

const consoleInfoSpy = jest
  .spyOn(global.console, 'info')
  .mockImplementation(() => null);

const localhostSpy = jest
  .spyOn(request, 'getLocalhostUrl')
  .mockImplementation(() => {
    return Promise.resolve(`?code=AQDKHwNyRapw&state=${mockId}`);
  });

const requestSpy = jest.spyOn(request, 'request').mockImplementation(() => {
  return Promise.resolve({
    access_token: 'BQC2fMYf9',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'OFuVRQAzVzq0Wy_Py_W4KiMr8H0',
    scope: 'user-library-read',
  });
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
      outDir: 'out/token',
      outFileName: 'mytoken',
      scopes: 'scopes1,scropes2',
    },
    {
      clientId: 'cid',
      clientSecret: 'cs',
      port: 59,
      outDir: '/out/token/',
      outFileName: 'spotify-token',
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
      expect(localhostSpy).toHaveBeenCalledWith(config.port);
      expect(requestSpy.mock.calls[0][0]).toMatchSnapshot(
        `config ${idx}, spotify request`
      );
      const str = writeFileSpy.mock.calls[0][0] as string;
      const filePath = str.replace(/\\|\//g, ',').split(',').filter(Boolean);
      expect(filePath).toMatchSnapshot(`config ${idx}, out dir`);
      expect(
        JSON.parse(writeFileSpy.mock.calls[0][1] as string)
      ).toMatchSnapshot(`config ${idx}, written data`);
    });
  });
});

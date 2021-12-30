import path from 'path';
import auth from '../src/index';
import { AppConfig } from '../src/types';
import { consoleInfoSpy, mockedFs, mockedRequest } from './setup';

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

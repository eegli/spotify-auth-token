import auth from '../src/index';
import * as request from '../src/request';
import { AppConfig } from '../src/types';
import * as utils from '../src/utils';

jest.mock('../src/request');

const mockedRequest = request as jest.Mocked<typeof request>;

// Math.random().toString(36).slice(2) now returns "ou8n1fu8n1"
jest.spyOn(Math, 'random').mockReturnValue(0.69);

const testState = 'ou8n1fu8n1';

mockedRequest.getLocalhostUrl.mockResolvedValue(
  `?code=AQDKHwNyRapw&state=${testState}`
);

mockedRequest.request.mockResolvedValue({
  access_token: 'BQC2fMYf9',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'OFuVRQAzVzq0Wy_Py_W4KiMr8H0',
  scope: 'user-library-read',
});

const consoleInfoSpy = jest
  .spyOn(global.console, 'info')
  .mockImplementation(jest.fn());
const writeSpy = jest.spyOn(utils, 'write');
const stringifySpy = jest.spyOn(JSON, 'stringify');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Authorize with params', () => {
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
      scopes: 'user-read-a-book',
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

      expect(consoleInfoSpy.mock.calls[1][0]).toMatchSnapshot('auth url');
      expect(mockedRequest.getLocalhostUrl).toHaveBeenCalledWith(config.port);
      expect(mockedRequest.request.mock.calls[0][0]).toMatchSnapshot(
        'spotify request'
      );

      const outDirPath = (writeSpy.mock.results[0].value as string).replace(
        /\\|\//gi,
        '/'
      );

      expect(outDirPath).toMatchSnapshot(`out dir`);
      expect(stringifySpy.mock.calls[0][0]).toMatchSnapshot('written data');
    });
  });

  it("throws if states don't match", async () => {
    mockedRequest.getLocalhostUrl.mockResolvedValueOnce(
      `?code=AQDKHwNyRapw&state=${testState}XXX`
    );
    await expect(
      auth({ clientId: 'cid', clientSecret: 'cs' })
    ).rejects.toThrow();
  });
  it('throws if no code is received', async () => {
    mockedRequest.getLocalhostUrl.mockResolvedValueOnce(`?state=${testState}`);
    await expect(
      auth({ clientId: 'cid', clientSecret: 'cs' })
    ).rejects.toThrow();
  });
});

describe('Authorize with process.argv', () => {
  [
    ['', '', '--clientId', '111', '--clientSecret', '111'],
    ['', '', '--clientId', '333', '--clientSecret', '333', '--port', '4000'],
  ].forEach(async (args) => {
    process.argv = args;
    // @ts-expect-error - get args from process.argv
    await expect(auth()).resolves.not.toThrow();
  });
});

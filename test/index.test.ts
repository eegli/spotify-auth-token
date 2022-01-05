import auth from '../src/index';
import * as request from '../src/request';
import { AppConfig } from '../src/types';
import * as utils from '../src/utils';

const mockRequest = request as jest.Mocked<typeof request>;

// Math.random().toString(36).slice(2) now returns "ou8n1fu8n1"
jest.spyOn(Math, 'random').mockReturnValue(0.69);

const testState = 'ou8n1fu8n1';

mockRequest.getLocalhostUrl.mockResolvedValue(
  `?code=AQDKHwNyRapw&state=${testState}`
);

mockRequest.request.mockResolvedValue({
  access_token: 'BQC2fMYf9',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'OFuVRQAzVzq0Wy_Py_W4KiMr8H0',
  scope: 'user-library-read',
});

const consoleSpy = jest
  .spyOn(global.console, 'info')
  .mockImplementation(jest.fn());

const writeSpy = jest.spyOn(utils, 'write').mockImplementation(jest.fn());

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
      show: false,
    },
    {
      clientId: 'cid',
      clientSecret: 'cs',
      port: 59,
      outDir: '/out/token/',
      outFileName: 'token',
      scopes: 'user-read-a-book',
      show: false,
    },
    {
      clientId: 'cid',
      clientSecret: 'cs',
      port: 69,
      outDir: '/out/',
      outFileName: 'spotify-token.json',
      scopes: 'scropes2',
      show: false,
    },
  ];

  testConfigs.forEach((config, idx) => {
    it(`works with config ${idx}`, async () => {
      await auth(config);

      expect(consoleSpy.mock.calls[1][0]).toMatchSnapshot('auth url');
      expect(mockRequest.getLocalhostUrl).toHaveBeenCalledWith(config.port);
      expect(mockRequest.request.mock.calls[0][0]).toMatchSnapshot(
        'spotify request'
      );
      expect(writeSpy.mock.calls[0]).toMatchSnapshot('write data');
    });
  });

  it("throws if states don't match", async () => {
    mockRequest.getLocalhostUrl.mockResolvedValueOnce(
      `?code=AQDKHwNyRapw&state=${testState}XXX`
    );
    await expect(
      auth({ clientId: 'cid', clientSecret: 'cs' })
    ).rejects.toThrow();
  });
  it('throws if no code is received', async () => {
    mockRequest.getLocalhostUrl.mockResolvedValueOnce(`?state=${testState}`);
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

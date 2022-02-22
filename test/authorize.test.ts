import auth from '../src/index';
import * as request from '../src/request';
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
  scope: 'user-library-read user-top-read',
});

const consoleSpy = jest
  .spyOn(global.console, 'info')
  .mockImplementation(jest.fn());

const writeSpy = jest
  .spyOn(utils, 'write')
  .mockImplementation((path) => Promise.resolve(path));

afterEach(() => {
  jest.clearAllMocks();
});

describe('Authorize with params', () => {
  it('fails with missing clientId', async () => {
    // @ts-expect-error test input
    await expect(auth({ clientId: 'id' })).rejects.toThrow();
  });

  it('fails with missing clientSecret', async () => {
    // @ts-expect-error test input
    await expect(auth({ clientSecret: 'secret' })).rejects.toThrow();
  });

  it("fails if states don't match", async () => {
    mockRequest.getLocalhostUrl.mockResolvedValueOnce(
      `?code=AQDKHwNyRapw&state=${testState}XXX`
    );
    await expect(
      auth({ clientId: 'cid', clientSecret: 'cs' })
    ).rejects.toThrow();
  });

  it('fails if no code is received', async () => {
    mockRequest.getLocalhostUrl.mockResolvedValueOnce(`?state=${testState}`);
    await expect(
      auth({ clientId: 'cid', clientSecret: 'cs' })
    ).rejects.toThrow();
  });

  it('works with emit mode', async () => {
    const config = {
      clientId: 'cid',
      clientSecret: 'cs',
      port: 1000,
      outDir: 'out/token/',
      fileName: 'mytoken',
      scopes: 'user-do-nothing user-balabla',
    };
    const result = await auth(config);
    expect(result).toBeDefined();
    expect(consoleSpy.mock.calls[1][0]).toMatchSnapshot('auth url');
    expect(mockRequest.getLocalhostUrl).toHaveBeenCalledWith(config.port);
    expect(mockRequest.request.mock.calls[0][0]).toMatchSnapshot(
      'spotify request'
    );
    expect(writeSpy.mock.calls[0]).toMatchSnapshot('write data');
    expect(consoleSpy.mock.calls[3][0]).toMatch(new RegExp(config.outDir));
  });

  it('works with no emit mode', async () => {
    const result = await auth({
      clientId: 'cid',
      clientSecret: 'cs',
      noEmit: true,
    });
    expect(result).toBeDefined();
    expect(writeSpy).not.toHaveBeenCalled();
  });
});

describe('Authorize with process.argv', () => {
  it('fails with missing clientId', async () => {
    process.argv = ['', ''];
    // @ts-expect-error - get args from process.argv
    await expect(auth()).rejects.toThrow();
  });
  [
    ['', '', '--clientId', '111x', '--clientSecret', '111x'],
    ['', '', '--clientId', '333x', '--clientSecret', '333x', '--port', '4000'],
  ].forEach(async (args) => {
    process.argv = args;
    // @ts-expect-error - get args from process.argv
    await expect(auth()).resolves.not.toThrow();
  });
});

import auth, { UserConfig } from '../src/index';
import * as request from '../src/request';
import * as utils from '../src/utils';

jest.useFakeTimers('modern').setSystemTime(new Date(1996, 3, 21));

const mockId = '1234';

const spies = {
  id: jest.spyOn(utils, 'id').mockReturnValue(mockId),
  writeFile: jest.spyOn(utils, 'write').mockImplementation(jest.fn),
  consoleInfo: jest.spyOn(global.console, 'info').mockImplementation(jest.fn),
  localhost: jest.spyOn(request, 'getLocalhostUrl').mockImplementation(() => {
    return Promise.resolve(`?code=AQDKHwNyRapw&state=${mockId}`);
  }),
  request: jest.spyOn(request, 'request').mockImplementation(() => {
    return Promise.resolve({
      access_token: 'BQC2fMYf9',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'OFuVRQAzVzq0Wy_Py_W4KiMr8H0',
      scope: 'user-library-read',
    });
  }),
};
afterEach(() => {
  jest.clearAllMocks();
});

const config: UserConfig = {
  clientId: 'cid',
  clientSecret: 'cs',
  port: 69,
  outDir: 'out/token',
  outFileName: 'mytoken',
};

describe('App', () => {
  it('gets token', async () => {
    await auth(config);
    expect(spies.consoleInfo.mock.calls).toMatchSnapshot('console output');
    expect(spies.localhost).toHaveBeenCalledWith(config.port);
    expect(spies.request.mock.calls).toMatchSnapshot('request');
    expect(spies.writeFile.mock.calls).toMatchSnapshot('write');
  });
});

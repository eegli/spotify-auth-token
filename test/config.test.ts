import { configFactory, defaultConfig } from '../src/config';

jest.spyOn(global.console, 'error').mockImplementation(jest.fn());

const createConfig = configFactory(defaultConfig, 'clientId', 'clientSecret');

describe('createConfig, programmatic use', () => {
  [
    { clientId: 'cid', clientSecret: 'cs' },
    {
      clientId: 'cid',
      clientSecret: 'cs',
      port: 1000,
      scopes: 'scopes',
      outDir: 'secrets',
      outFileName: 'mytoken',
    },
  ].forEach((config, idx) => {
    it(`works #${idx}`, () => {
      expect(createConfig(config)).toMatchSnapshot();
    });
  });

  [
    { clientSecret: 'cs' },
    {
      clientId: 'cid',
    },
  ].forEach((config, idx) => {
    it(`fails #${idx}`, () => {
      expect(() => {
        createConfig(config);
      }).toThrow();
    });
  });
});

describe('createConfig, cli use', () => {
  [
    ['--clientId', '111', '--clientSecret', '111'],
    ['--clientId', '111', '--clientSecret', '111', '--show'],
    ['--clientId', '333', '--clientSecret', '333', '--show', '--port', '4000'],
    ['--clientId', '777', '--clientSecret', '888', '--random', 'nothing'],
    [
      '--clientId',
      '222',
      '--clientSecret',
      '222',
      '--port',
      '1000',
      '--scopes',
      'scopes',
      '--outDir',
      'secrets/spotify',
      '--outFileName',
      'mytoken',
    ],
  ].forEach((config, idx) => {
    it(`works #${idx}`, () => {
      expect(createConfig(config)).toMatchSnapshot();
    });
  });
  [
    ['--clientId', 'cid'],
    ['--clientSecret', 'cs'],
  ].forEach((config, idx) => {
    it(`fails #${idx}`, () => {
      expect(() => {
        createConfig(config);
      }).toThrow();
    });
  });
});

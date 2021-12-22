import { createConfig } from '../src/create-config';

describe('createConfig', () => {
  it('programmatic use', () => {
    expect(
      createConfig({ clientId: 'cid', clientSecret: 'cs' })
    ).toMatchSnapshot('minimum input config');
    expect(
      createConfig({
        clientId: 'cid',
        clientSecret: 'cs',
        port: 1000,
        scopes: 'scopes',
        outDir: '/secrets',
        outFileName: 'mytoken',
      })
    ).toMatchSnapshot('full input config');
  });
  it('cli use', () => {
    expect(
      createConfig(['--clientId', 'cid', '--client_secret', 'cs'])
    ).toMatchSnapshot('minimum input config');
    expect(
      createConfig([
        '--clientId',
        'cid',
        '-client_secret',
        'cs',
        '--port',
        '1000',
        '--scopes',
        'scopes',
        '--outDir',
        '/secrets',
        '--outFileName',
        'mytoken',
      ])
    ).toMatchSnapshot('full input config');
  });
  expect(
    createConfig(['--clientId', 'cid', '-client_secret', 'cs', 'port', '4000'])
  ).toMatchSnapshot('ignores invalid args');
});

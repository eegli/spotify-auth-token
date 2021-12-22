import path from 'path';
import { defaultConfig } from './config';
import { getLocalhostUrl, request } from './request';
import type {
  AuthConfig,
  OptionalConfig,
  RequiredConfig,
  SpotifyTokenResponse,
} from './types';
import { id, read, write } from './utils';

export type { AuthConfig };

export default async function run(opts: AuthConfig): Promise<void> {
  try {
    let config = {} as RequiredConfig & OptionalConfig;

    // Programmatic use
    if (opts) {
      config = Object.assign(defaultConfig, opts);

      // CLI us
    } else {
      const usrConfigFilePath = process.argv[2];

      if (!usrConfigFilePath) {
        console.error('Error: No credentials file specified');
        process.exit(1);
      }

      const userConfig: AuthConfig = read(
        path.join(process.cwd(), usrConfigFilePath)
      );

      if (!userConfig.client_id || !userConfig.client_secret) {
        console.error('Error: Invalid config file');
        process.exit(1);
      }
      config = Object.assign(defaultConfig, userConfig);
    }

    const redirectUri = `http://localhost:${config.port}`;
    const state = id();

    const spotifyUrl =
      'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        response_type: 'code',
        show_dialog: 'true',
        state: encodeURIComponent(state),
        client_id: encodeURIComponent(config.client_id),
        redirect_uri: redirectUri,
        scope: encodeURIComponent(config.scopes),
      }).toString();

    console.info('Please click the link to login to Spotify in the browser\n');
    console.info(spotifyUrl + '\n');

    const authUrl = await getLocalhostUrl(config.port);
    const params = new URLSearchParams(authUrl);
    const receivedCode = params.get('code');
    const receivedState = params.get('state');

    if (receivedState !== state) {
      throw new Error('Received and original state do not match');
    }

    if (!receivedCode) {
      console.error(receivedCode);
      throw new Error('No code received');
    }

    console.info('Login successfull!');

    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: receivedCode,
      redirect_uri: redirectUri,
    });

    const token: SpotifyTokenResponse = await request(
      {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(config.client_id + ':' + config.client_secret).toString(
              'base64'
            ),
        },
      },
      tokenRequestBody.toString()
    );

    token.date_obtained = new Date().toLocaleString();
    const outDir = path.join(process.cwd(), path.normalize(config.outDir));
    write(outDir, config.outFileName, token);

    console.info('Saved Spotify access token');
    process.exit(0);
  } catch (e) {
    console.error('Something went wrong', e);
    process.exit(1);
  }
}

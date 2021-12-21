import { join } from 'path';
import { defaultConfig } from './config';
import { getLocalhostUrl, request } from './request';
import type { CLIInputConfig, SpotifyTokenResponse } from './types';
import { id, read, write } from './utils';

export const cli = async (): Promise<void> => {
  try {
    const usrConfigFilePath = process.argv[2];

    if (!usrConfigFilePath) {
      console.error('Error: No credentials file specified');
      process.exit(1);
    }

    const userConfig: CLIInputConfig = read(
      join(process.cwd(), usrConfigFilePath)
    );

    if (!userConfig.client_id || !userConfig.client_secret) {
      console.error('Error: Invalid config file');
      process.exit(1);
    }

    const { client_id, client_secret, port, scopes } = Object.assign(
      defaultConfig,
      userConfig
    );

    const redirectUri = `http://localhost:${port}`;
    const state = id();
    const spotifyUrl =
      'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        response_type: 'code',
        show_dialog: 'true',
        state: encodeURIComponent(state),
        client_id: encodeURIComponent(client_id),
        redirect_uri: redirectUri,
        scope: encodeURIComponent(scopes),
      }).toString();

    console.info('Please click the link to login to Spotify in the browser\n');
    console.info(spotifyUrl + '\n');

    const authUrl = await getLocalhostUrl(port);
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
            Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
      },
      tokenRequestBody.toString()
    );

    token.date_obtained = new Date().toLocaleString();

    write(join(process.cwd(), 'token.json'), token);

    console.info('Saved Spotify access token');
    process.exit(0);
  } catch (e) {
    console.error('Something went wrong', e);
    process.exit(1);
  }
};

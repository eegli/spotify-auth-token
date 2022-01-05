import { configFactory, defaultConfig } from './config';
import { getLocalhostUrl, request } from './request';
import type { SpotifyTokenResponse, UserConfig } from './types';
import { goodBye, id, write } from './utils';

const createConfig = configFactory(defaultConfig, 'clientId', 'clientSecret');

export async function authorize(userConfig: UserConfig): Promise<void> {
  try {
    const config = userConfig
      ? createConfig(userConfig)
      : createConfig(process.argv.slice(2));

    const redirectUri = `http://localhost:${config.port}`;
    const state = id();

    const spotifyUrl =
      'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        response_type: 'code',
        show_dialog: 'true',
        state: encodeURIComponent(state),
        client_id: encodeURIComponent(config.clientId),
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
      goodBye('Received and original state do not match');
    }

    if (!receivedCode) {
      goodBye('No code received');
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
            Buffer.from(config.clientId + ':' + config.clientSecret).toString(
              'base64'
            ),
        },
      },
      tokenRequestBody.toString()
    );

    token.date_obtained = new Date().toUTCString();
    const outDir = write(config.outDir, config.outFileName, token);
    console.info("Success! Saved Spotify access token to '%s'", outDir);
  } catch (e) {
    goodBye('Something went wrong: ' + e);
  }
}

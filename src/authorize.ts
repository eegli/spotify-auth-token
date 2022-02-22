import { ValidationError } from '@eegli/tinyparse';
import { configParser } from './config';
import { getLocalhostUrl, request } from './request';
import type { AuthFunction, SpotifyTokenResponse } from './types';
import { goodbye, id, write } from './utils';

export const authorize: AuthFunction = async (userConfig) => {
  try {
    const config = userConfig
      ? await configParser(userConfig)
      : await configParser(process.argv.slice(2));

    const redirectUri = `http://localhost:${config.port}`;
    const state = id();

    const spotifyUrl =
      'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        response_type: 'code',
        show_dialog: 'true',
        state,
        client_id: config.clientId,
        redirect_uri: redirectUri,
        scope: config.scopes,
      }).toString();

    console.info('Please click the link to login to Spotify in the browser\n');
    console.info(spotifyUrl + '\n');

    const authUrl = await getLocalhostUrl(config.port);
    const params = new URLSearchParams(authUrl);
    const receivedCode = params.get('code');
    const receivedState = params.get('state');

    if (receivedState !== state) {
      goodbye('Received and original state do not match');
    }

    if (!receivedCode) {
      goodbye('No code received');
    }

    console.info('Login successfull! Cleaning up...\n');

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

    if (!config.noEmit) {
      const outDir = await write(config.outDir, config.fileName, token);
      console.info(`Success! Saved Spotify access token to "${outDir}"`);
    }

    return token;
  } catch (e) {
    if (e instanceof ValidationError) {
      goodbye(e.message);
    }
    goodbye('Something went wrong: ' + e);
  }
};

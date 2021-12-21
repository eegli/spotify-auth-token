import type { Config, SpotifyTokenResponse } from './types';
import { nanoid } from 'nanoid';
import open from 'open';
import fetch from 'node-fetch';
import { createServerOnce } from './server';

export const getSpotifyToken = async (parms: Config) => {
  const { client_id, client_secret, port, scopes } = parms;
  const state = nanoid(12);
  // const server = app.listen(port);
  const spotifyUrl =
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      show_dialog: 'true',
      state: encodeURIComponent(state),
      client_id: encodeURIComponent(client_id),
      redirect_uri: `http://localhost:${port}`,
      scope: encodeURIComponent(scopes),
    }).toString();

  console.info('Please login with Spotify in the browser...');

  const authUrl = await createServerOnce(port, () => open(spotifyUrl));
  const params = new URLSearchParams(authUrl);
  const receivedCode = params.get('code') || '';
  const receivedState = params.get('state') || '';

  if (receivedState !== state) {
    throw new Error('Received and original state do not match');
  }

  if (!receivedCode) {
    console.error(receivedCode);
    throw new Error('No code received');
  }

  console.info('Login successfull!');

  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    code: receivedCode,
    redirect_uri: 'http://localhost:3000',
  });

  const token: SpotifyTokenResponse = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      body: tokenParams.toString(),
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    }
  ).then(res => res.json());

  token.date_obtained = new Date().toLocaleString();
  return token;
};

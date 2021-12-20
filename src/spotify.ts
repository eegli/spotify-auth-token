import { Config, SpotifyAuthResponse, SpotifyTokenResponse } from './types';
import express from 'express';
import { nanoid } from 'nanoid';
import open from 'open';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
const state = nanoid(12);

export const getSpotifyToken = async (parms: Config) => {
  const { client_id, client_secret, port, scopes } = parms;

  const server = app.listen(port);
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

  await open(spotifyUrl);

  console.info('Please login with Spotify in the browser...');

  const authResonse = await new Promise<SpotifyAuthResponse>(
    (resolve, reject) => {
      app.get('/', (req, res) => {
        res.end('You can now close this window');
        if (req.query.code && req.query.state === state) {
          resolve(req.query as SpotifyAuthResponse);
        } else {
          reject('Something went wrong');
        }
        server.close();
      });
    }
  );

  console.info('Login successfull!');

  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authResonse.code,
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

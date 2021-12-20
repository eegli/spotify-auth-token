import {
  SpotifyCreds,
  SpotifyTokenResponse,
  SpotifyTokenSuccess,
} from './types';
import express from 'express';
import fs from 'fs';
import { nanoid } from 'nanoid';
import open from 'open';
import { config } from './config';
import http2 from 'http2';

export const server = (credentials: SpotifyCreds) => {
  // Port must correspond to the port set in the Spotify app
  const port = config.port;
  const scopes = config.scopes;

  const TOKEN_PATH = 'spotify_token.json';

  const { client_id, client_secret } = credentials;
  const state = nanoid(12);

  if (!client_id || !client_secret) {
    throw new Error('Did you forget to pass in a client id/secret?');
  }

  /*   const getCode = new Promise(resolve => {
    const server = http2.createServer((req, res) => {
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.write(
        '<h1>🎰 tokenify: SUCCESS!</h1><h2>Close this and go back to terminal.</h2>'
      );
      res.end();
      const {
        query: { code },
      } = url.parse(req.url, true);
      res.once('finish', () => {
        server.close();
      });
      resolve(code);
    });
    server.listen(3000);
  }); */

  const app = express();
  app.use(express.json());

  // Get compiled client script
  const script = fs.readFileSync(__dirname + '/client.js', 'utf8');

  // This will be sent to the client
  const template = `<html><body><script>${script}</script></body></html>`;

  const spotifyUrl = () => {
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&show_dialog=true';
    url += '&state=' + encodeURIComponent(state);
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&redirect_uri=' + encodeURIComponent('http://localhost:3000');
    url += '&scope=' + encodeURIComponent(scopes);
    return url;
  };

  open(spotifyUrl());

  app.get('/', (_, res) => {
    res.send(template);
  });

  app.get('/credentials', (_, res: express.Response<SpotifyTokenResponse>) => {
    res.json({ ...credentials, state });
  });

  app.post('/submit', (req, res) => {
    const jsonData: SpotifyTokenSuccess = req.body;
    if (jsonData.access_token) {
      console.log(`Success! Saved token to file`);
      jsonData.dateObtained = new Date().toLocaleString();
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(jsonData, null, 2));
      res.send('Successful! You can now close this window');
      process.exit(0);
    }
    throw new Error(
      'No token obtained.\nDid you click "cancel" in the Spotify auth window?'
    );
  });

  app.listen(port);
};

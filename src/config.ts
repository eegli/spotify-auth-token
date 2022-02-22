import { parserFactory } from '@eegli/tinyparse';
import { AppConfig } from './types';

export const defaultConfig: AppConfig = {
  clientId: '',
  clientSecret: '',
  port: 3000,
  noEmit: false,
  outDir: '',
  fileName: 'spotify-token',
  scopes: 'user-read-email',
};

export const configParser = parserFactory(defaultConfig, {
  required: [
    {
      argName: 'clientId',
      errorMessage:
        'Please specify your Spotify client id.\nFor more info, visit https://github.com/eegli/spotify-auth-token',
    },
    {
      argName: 'clientSecret',
      errorMessage:
        'Please specify your Spotify client secret.\nFor more info, visit https://github.com/eegli/spotify-auth-token',
    },
  ],
  shortFlags: {
    '-ci': 'clientId',
    '-cs': 'clientSecret',
    '-p': 'port',
    '-o': 'outDir',
    '-f': 'fileName',
    '-s': 'scopes',
  },
});

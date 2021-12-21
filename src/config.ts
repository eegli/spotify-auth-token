import { OptionalConfig } from './types';

export const defaultConfig: OptionalConfig = {
  port: 3000,
  outFileName: 'spotify-token',
  scopes:
    'user-read-email user-top-read user-library-read user-read-recently-played',
};

import { AppConfig } from './types';

export const defaultConfig: AppConfig = {
  clientId: '',
  clientSecret: '',
  port: 3000,
  outDir: '',
  outFileName: 'spotify-token',
  scopes: 'user-read-email',
};

import { parserFactory } from '@eegli/tinyparse';
import { AppConfig } from './types';

export const defaultConfig: AppConfig = {
  clientId: '',
  clientSecret: '',
  port: 3000,
  outDir: '',
  fileName: 'spotify-token',
  scopes: 'user-read-email',
};

export const configParser = parserFactory(defaultConfig, {
  required: ['clientId', 'clientSecret'],
  shortFlags: {
    '-ci': 'clientId',
    '-cs': 'clientSecret',
    '-p': 'port',
    '-o': 'outDir',
    '-f': 'fileName',
    '-s': 'scopes',
  },
});

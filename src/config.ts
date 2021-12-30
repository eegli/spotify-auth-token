import { UserConfig } from './index';
import { AppConfig } from './types';
import { goodBye, hasOwnProperty } from './utils';

const defaultConfig: AppConfig = {
  clientId: '',
  clientSecret: '',
  port: 3000,
  outDir: process.cwd(),
  outFileName: 'spotify-token',
  scopes: 'user-read-email',
};

export const createConfig = (args: UserConfig | string[]): AppConfig => {
  const config: AppConfig = { ...defaultConfig };

  // CLI use
  if (Array.isArray(args)) {
    args.forEach((val, idx, orig) => {
      if (val.startsWith('--')) {
        const key = val.slice(2);
        if (hasOwnProperty(config, key)) {
          config[key] = orig[idx + 1];
        }
      }
    });

    // Programmatic use
  } else {
    Object.entries(args).forEach(([key, val]) => {
      if (hasOwnProperty(config, key)) {
        config[key] = val;
      }
    });
  }
  if (!config.clientId || !config.clientSecret) {
    goodBye('Error: Missing client id or client secret');
  }

  if (typeof config.port === 'string') {
    // Convert to number
    config.port = +config.port;
  }

  return config;
};

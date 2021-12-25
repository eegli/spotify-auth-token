import { defaultConfig } from './config';
import { UserConfig } from './index';
import { AppConfig } from './types';
import { goodBye } from './utils';

function isNumeric(value: string) {
  return /^\d+$/.test(value);
}

export const createConfig = (
  configOrArgs: UserConfig | string[]
): AppConfig => {
  let config: Record<string, string | number> = {};
  // CLI use
  if (Array.isArray(configOrArgs)) {
    config = configOrArgs.reduce((acc, curr, idx, orig) => {
      if (curr.startsWith('--')) {
        const key = curr.slice(2);
        acc[key] = orig[idx + 1];
      }
      return acc;
    }, config);
    // Programmatic use
  } else {
    config = configOrArgs;
  }
  if (!config.clientId || !config.clientSecret) {
    goodBye('Error: Missing client id or client secret');
  }

  if (typeof config.port === 'string') {
    // Convert to number
    config.port = +config.port;
  }

  return { ...defaultConfig, ...config } as AppConfig;
};

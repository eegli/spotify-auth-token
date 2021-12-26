import { defaultConfig } from './config';
import { UserConfig } from './index';
import { AppConfig } from './types';
import { goodBye } from './utils';

function hasOwnProperty<
  T extends Record<PropertyKey, unknown>,
  K extends PropertyKey
>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return obj.hasOwnProperty(prop);
}

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

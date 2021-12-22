import { UserConfig } from '.';
import { defaultConfig } from './config';
import { AppConfig } from './types';

function isNumeric(value: string) {
  return /^\d+$/.test(value);
}

export const createConfig = (
  configOrArgs: UserConfig | string[]
): AppConfig => {
  // Programmatic use
  if (!Array.isArray(configOrArgs)) {
    return Object.assign(defaultConfig, configOrArgs);
  }

  // CLI use
  const cliArgs = configOrArgs.reduce((acc, curr, idx, orig) => {
    if (curr.startsWith('--')) {
      const key = curr.slice(2);
      let value: string | number = orig[idx + 1];
      // Convert to number
      if (isNumeric(value)) value = +value;
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string | number>);

  const config = defaultConfig as AppConfig;

  if (typeof cliArgs.clientId === 'string') {
    config.clientId = cliArgs.clientId;
  }
  if (typeof cliArgs.clientSecret === 'string') {
    config.clientSecret = cliArgs.clientSecret;
  }
  if (typeof cliArgs.port === 'number') {
    config.port = cliArgs.port;
  }
  if (typeof cliArgs.scopes === 'string') {
    config.scopes = cliArgs.scopes;
  }
  if (typeof cliArgs.outFileName === 'string') {
    config.outFileName = cliArgs.outFileName;
  }
  if (typeof cliArgs.outDir === 'string') {
    config.outDir = cliArgs.outDir;
  }

  return config;
};

import path from 'path';
import { CLIInputConfig } from './types';
import { read } from './utils';

export const parseArgs = (): CLIInputConfig => {
  const optsFile = process.argv[2];

  if (!optsFile) {
    console.error('Error: No credentials file specified');
    process.exit(1);
  }
  const optsFilePath = path.join(process.cwd(), optsFile);
  const config = read<CLIInputConfig>(optsFilePath);
  if (!config.client_id || !config.client_secret) {
    console.error('Error: Invalid config file');
    process.exit(1);
  }
  return config;
};

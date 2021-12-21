import { getSpotifyToken } from './spotify';
import { defaultConfig } from './config';
import { read, write } from './utils';
import path from 'path';
import type { CLIInputConfig } from './types';

export const cli = async (): Promise<void> => {
  try {
    const optsFile = process.argv[2];

    if (!optsFile) {
      console.error('Error: No credentials file specified');
      process.exit(1);
    }
    const optsFilePath = path.join(process.cwd(), optsFile);
    const userConfig = read<CLIInputConfig>(optsFilePath);

    if (!userConfig.client_id || !userConfig.client_secret) {
      console.error('Error: Invalid config file');
      process.exit(1);
    }

    const config = { ...defaultConfig, ...userConfig };

    const token = await getSpotifyToken(config);
    write(process.cwd() + '/token.json', token);

    console.info('Successfully saved Spotify access token!');
    process.exit(0);
  } catch (e) {
    console.error('Something went wrong', e);
    process.exit(1);
  }
};

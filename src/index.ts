import { getSpotifyToken } from './spotify';
import { parseArgs } from './parse';
import { defaultConfig } from './config';
import { write } from './utils';

export const cli = async (): Promise<void> => {
  try {
    const usrconfig = parseArgs();
    const config = { ...defaultConfig, ...usrconfig };
    const token = await getSpotifyToken(config);
    write(process.cwd() + '/token.json', token);

    console.info('Successfully saved Spotify access token!');
    process.exit(0);
  } catch (e) {
    console.error('Something went wrong', e);
    process.exit(1);
  }
};

import { authorize } from './authorize';
import { exit } from './utils';

export const cli = async () => {
  if (process.argv.length < 3) {
    exit(
      `
spotify-auth-token

- A command line utility for generating Spotify refresh tokens.

For docs & help, visit https://github.com/eegli/spotify-auth-token.
    `,
      'yellow'
    );
  }

  await authorize();
};

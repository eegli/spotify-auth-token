import { SpotifyCreds } from './types';
import { read } from './utils';
import { server } from './server';
import { parseArgs } from './parse-args';
import { config } from './config';

export const cli = async () => {
  const { credentials } = parseArgs();
  server(credentials);
};

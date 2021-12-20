import path from 'path';
import { SpotifyCreds } from './types';
import { read } from './utils';

export const parseArgs = () => {
  const credentialsFile = process.argv[2];
  if (!credentialsFile) {
    console.error('Error: No credentials file specified');
    process.exit(1);
  }
  const credentialsPath = path.join(process.cwd(), credentialsFile);
  const credentials = read<SpotifyCreds>(credentialsPath);
  if (!credentials.client_id || !credentials.client_secret) {
    console.error('Error: Invalid credentials file');
    process.exit(1);
  }
  return { credentials };
};

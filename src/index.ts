import { main } from './spotify';

export type { UserConfig } from './types';
export default main;

// Support ESM and CJS
module.exports = main;

import { existsSync, promises as fs } from 'fs';
import { join } from 'path';

export async function write(
  path: string,
  fileName: string,
  data: unknown
): Promise<string> {
  if (!fileName.endsWith('.json')) {
    fileName += '.json';
  }
  path = join(process.cwd(), path, fileName);
  if (!existsSync(path)) {
    await fs.mkdir(path, { recursive: true });
  }
  await fs.writeFile(path, JSON.stringify(data, null, 2));
  return path;
}

export function id(): string {
  return Math.random().toString(36).slice(2);
}

// https://github.com/sindresorhus/yoctocolors/blob/main/index.js
export const yellow = (msg: string) =>
  '\u001B[' + 33 + 'm' + msg + '\u001B[' + 39 + 'm';

export const red = (msg: string) =>
  '\u001B[' + 31 + 'm' + msg + '\u001B[' + 39 + 'm';

export function exit(message: string, color: 'red' | 'yellow' = 'red'): never {
  if (color === 'red') {
    console.error(red(message));
  } else {
    console.info(yellow(message));
  }

  process.exit(1);
}

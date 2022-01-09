import { existsSync, promises as fs } from 'fs';
import { join } from 'path';

export async function write(
  path: string,
  fileName: string,
  data: unknown
): Promise<string> {
  path = join(process.cwd(), path);
  if (!existsSync(path)) {
    await fs.mkdir(path, { recursive: true });
  }
  if (fileName.endsWith('.json')) {
    fileName = fileName.slice(0, -5);
  }
  path = join(path, fileName + '.json');
  await fs.writeFile(path, JSON.stringify(data, null, 2));
  return path;
}

export function id(): string {
  return Math.random().toString(36).slice(2);
}

export function goodbye(message: string): never {
  console.error('\x1b[31m', `Error: ${message}. Goodbye`, '\x1b[0m');
  process.exit(1);
}

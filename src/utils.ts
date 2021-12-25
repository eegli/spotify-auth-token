import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export function write(path: string, fileName: string, data: unknown): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
  path = join(path, fileName + '.json');
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function id(): string {
  return Math.random().toString(36).slice(2);
}

export function goodBye(message: string): never {
  console.error('\x1b[31m', `Error: ${message}. Goodbye`, '\x1b[0m');
  process.exit(1);
}

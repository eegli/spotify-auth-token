import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export function hasOwnProperty<
  T extends Record<PropertyKey, unknown>,
  K extends PropertyKey
>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function write(path: string, fileName: string, data: unknown): string {
  path = join(process.cwd(), path);
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
  if (fileName.endsWith('.json')) {
    fileName = fileName.slice(0, -5);
  }
  path = join(path, fileName + '.json');
  writeFileSync(path, JSON.stringify(data, null, 2));
  return path;
}

export function id(): string {
  return Math.random().toString(36).slice(2);
}

export function goodBye(message: string): never {
  console.error('\x1b[31m', `Error: ${message}. Goodbye`, '\x1b[0m');
  process.exit(1);
}

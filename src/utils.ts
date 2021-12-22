import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export function read<T = any>(path: string): T {
  try {
    const data = readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error: Cannot read file "${path}"`);
    process.exit(1);
  }
}

export function write(path: string, fileName: string, data: unknown): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
  path = join(path, fileName + '.json');
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function id() {
  return Math.random().toString(36).slice(2);
}

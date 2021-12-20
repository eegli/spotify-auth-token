import { readFileSync, writeFileSync } from 'fs';

export function read<T = any>(path: string): T {
  try {
    const data = readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error: Cannot read file "${path}"`);
    process.exit(1);
  }
}

export function write(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2));
}

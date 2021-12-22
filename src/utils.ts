import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

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

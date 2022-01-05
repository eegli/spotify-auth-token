import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export function objectFromEntries<
  Key extends PropertyKey,
  Entries extends Array<[Key, unknown]>
>(
  value: Entries
): {
  [K in Extract<Entries[number], [Key, unknown]>[0]]: Extract<
    Entries[number],
    [K, unknown]
  >[1];
} {
  return Object.fromEntries(value) as {
    [K in Extract<Entries[number], [Key, unknown]>[0]]: Extract<
      Entries[number],
      [K, unknown]
    >[1];
  };
}

export function write(
  relativePath: string,
  fileName: string,
  data: unknown
): string {
  let path = join(process.cwd(), relativePath, fileName);
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
  if (!path.endsWith('.json')) {
    path += '.json';
  }

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

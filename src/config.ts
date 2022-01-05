import { AppConfig } from './types';
import { goodBye } from './utils';

export const defaultConfig: AppConfig = {
  clientId: '',
  clientSecret: '',
  port: 3000,
  outDir: '',
  outFileName: 'spotify-token',
  scopes: 'user-read-email',
  show: false,
};

export function configFactory<
  T extends Record<string, string | number | boolean>,
  R extends keyof T
>(base: T, ...required: Array<R extends string ? R : never>) {
  return function (args: Partial<T> | Array<string>): T {
    const cfmap = new Map(Object.entries(base));

    // [--id, 123, --secret, xyz] --> arg, argVal, arg, argVal

    if (!Array.isArray(args)) {
      Object.entries(args).forEach(([arg, argVal]) => {
        if (cfmap.has(arg)) {
          const configVal = cfmap.get(arg);
          if (typeof configVal === typeof argVal) {
            cfmap.set(arg, argVal);
          } else {
            goodBye(
              `Invalid type for option "${configVal}". Expected ${typeof configVal}, got ${typeof argVal}`
            );
          }
        } else {
          console.warn(`Ignoring unknown option "${arg}"`);
        }
      });
    } else {
      args.forEach((val, idx, orig) => {
        if (val.startsWith('--')) {
          const arg = val.slice(2);
          const key = cfmap.get(arg);
          if (cfmap.has(arg)) {
            let argVal: string | number | boolean = orig[idx + 1];
            // Boolean flag that default to false
            if (typeof key === 'boolean') {
              cfmap.set(arg, true);
            }
            // Convert string input to number
            else if (typeof key === 'number') {
              cfmap.set(arg, +argVal);
            } else if (typeof key === typeof argVal) {
              cfmap.set(arg, argVal);
            } else {
              goodBye(
                `Invalid type for option "--${arg}". Expected ${typeof key}, got ${typeof argVal}`
              );
            }
          } else {
            console.warn(`Ignoring unknown option "--${arg}"`);
          }
        }
      });
    }

    // Check for required properties
    required.forEach((prop) => {
      if (!cfmap.get(prop)) {
        goodBye(`Missing required config property "${prop}"`);
      }
    });

    return Object.fromEntries(cfmap) as T;
  };
}

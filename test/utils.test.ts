import fs from 'fs-extra';
import { defaultConfig } from '../src/config';
import { writeJSON } from '../src/utils';

const mockFS = fs as jest.Mocked<typeof fs>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Utils', () => {
  const writeParams: Parameters<typeof writeJSON>[] = [
    [defaultConfig.outDir, 'test', { data: true }],
    ['tmp', 'test', { data: true }],
    ['tmp/dir', 'test.json', { data: true }],
    ['/tmp/dir/', 'test', { data: true }],
    ['../dir', 'test.json', { data: true }],
  ];
  writeParams.forEach((args, idx) => {
    it(`writes data, ${idx}`, async () => {
      const path = await writeJSON(...args);
      expect(mockFS.outputFile).toHaveBeenCalledWith(
        path,
        JSON.stringify(args[2], null, 2)
      );
      expect(mockFS.outputFile).toHaveBeenCalledTimes(1);
      const cleanPath = path.replace(/\\|\//gi, '/');
      expect(cleanPath).toMatchSnapshot(`file ${idx}`);
    });
  });
});

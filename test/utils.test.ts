import fs from 'fs';
import { defaultConfig } from '../src/config';
import { write } from '../src/utils';

const mockFS = fs.promises as jest.Mocked<typeof fs.promises>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Utils', () => {
  const writeParams: Parameters<typeof write>[] = [
    [defaultConfig.outDir, 'test', { data: true }],
    ['tmp', 'test', { data: true }],
    ['tmp/dir', 'test.json', { data: true }],
    ['/tmp/dir/', 'test', { data: true }],
    ['../dir', 'test.json', { data: true }],
  ];
  writeParams.forEach((args, idx) => {
    it(`writes data, ${idx}`, async () => {
      const path = await write(...args);
      expect(mockFS.writeFile).toHaveBeenCalledWith(
        path,
        JSON.stringify(args[2], null, 2)
      );
      expect(mockFS.writeFile).toHaveBeenCalledTimes(1);
      const cleanPath = path.replace(/\\|\//gi, '/');
      expect(cleanPath).toMatchSnapshot(`file ${idx}`);
    });
  });
});

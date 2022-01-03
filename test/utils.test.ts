import fs from 'fs';
import { write } from '../src/utils';

const mockFS = fs as jest.Mocked<typeof fs>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Utils', () => {
  const writeParams: Parameters<typeof write>[] = [
    ['', 'test', { data: true }],
    ['tmp', 'test', { data: true }],
    ['tmp/dir', 'test.json', { data: true }],
    ['/tmp/dir/', 'test', { data: true }],
    ['../dir', 'test.json', { data: true }],
  ];
  writeParams.forEach((args, idx) => {
    it(`writes data, ${idx}`, () => {
      write(...args);
      expect(mockFS.writeFileSync).toHaveBeenCalledTimes(1);
      const outDirPath = (
        mockFS.writeFileSync.mock.calls[0][0] as string
      ).replace(/\\|\//gi, '/');

      expect(outDirPath).toMatchSnapshot(`write file, ${idx}`);
    });
  });
});

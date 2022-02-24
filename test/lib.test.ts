import authorize from '../src/index';

describe('Lib exports', () => {
  it('exports authorize for TS and ESM', () => {
    expect(authorize).toBeInstanceOf(Function);
  });
});

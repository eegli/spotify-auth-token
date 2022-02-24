describe('Lib exports', () => {
  it('exports authorize for CJS', () => {
    const { authorize } = require('../src/authorize');
    expect(authorize).toBeInstanceOf(Function);
  });
});

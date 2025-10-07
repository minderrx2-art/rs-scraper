const add = (a: number, b: number) => {
  return a + b
}

describe('add_1()', () => {
  test('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('handles negatives', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
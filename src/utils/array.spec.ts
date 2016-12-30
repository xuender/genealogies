import { filter, count, remove } from './array.ts';

describe('array utils', () => {
  const array: number[] = [1, 2, 3, 4, 5];

  describe('filter', () => {
    const a = filter(array, (i) => i % 2 === 0);
    it('filter size', () => expect(a.length).toBe(2));
  });

  describe('count', () => {
    const c = count(array, (i) => i % 2 === 0);
    it('count number', () => expect(c).toBe(2));
  });

  describe('remove', () => {
    const r = remove(array, (i) => i % 2 === 0);
    it('remove size', () => expect(r.length).toBe(3));
  });
});

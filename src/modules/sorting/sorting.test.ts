import { describe, it, expect } from 'vitest';
import { getSortingSnapshots } from './algorithms';
import type { SortingAlgorithmKey } from '../../types/sorting';

const algorithms: SortingAlgorithmKey[] = ['bubble', 'insertion', 'selection', 'merge', 'quick', 'heap'];

describe('Sorting Algorithm Snapshot Generators', () => {
  const testCases = [
    { name: 'Standard random array', input: [45, 12, 85, 32, 89, 39, 69, 44, 42, 1, 45] },
    { name: 'Already sorted', input: [1, 2, 3, 4, 5, 6, 7] },
    { name: 'Reverse sorted', input: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
    { name: 'Duplicate elements', input: [5, 5, 5, 2, 2, 8, 8, 1] },
    { name: 'Single element', input: [42] },
    { name: 'Two elements inverted', input: [20, 10] },
  ];

  algorithms.forEach((algo) => {
    describe(`Algorithm: ${algo}`, () => {
      testCases.forEach(({ name, input }) => {
        it(`correctly sorts: ${name}`, () => {
          const snapshots = getSortingSnapshots(algo, input);
          expect(snapshots.length).toBeGreaterThan(0);

          const finalSnapshot = snapshots[snapshots.length - 1];
          const finalValues = finalSnapshot.array.map((el) => el.value);
          const expectedSorted = [...input].sort((a, b) => a - b);

          expect(finalValues).toEqual(expectedSorted);
        });
      });
    });
  });
});

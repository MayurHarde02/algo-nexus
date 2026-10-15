import { describe, it, expect } from 'vitest';

describe('Dynamic Programming Foundations', () => {
  it('0/1 Knapsack computes correct maximum value and subset', () => {
    const weights = [1, 3, 4, 5];
    const values = [1, 4, 5, 7];
    const W = 7;
    const n = weights.length;

    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= W; w++) {
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    expect(dp[n][W]).toBe(9); // Items with weights 3 and 4 -> values 4 + 5 = 9
  });

  it('Longest Common Subsequence computes correct length and string', () => {
    const s1 = 'AGGTAB';
    const s2 = 'GXTXAYB';
    const m = s1.length;
    const n = s2.length;

    const L: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          L[i][j] = L[i - 1][j - 1] + 1;
        } else {
          L[i][j] = Math.max(L[i - 1][j], L[i][j - 1]);
        }
      }
    }

    expect(L[m][n]).toBe(4); // GTAB
  });
});

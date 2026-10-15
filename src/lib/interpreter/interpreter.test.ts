import { describe, it, expect } from 'vitest';
import { tokenize } from './lexer';
import { parseProgram } from './parser';
import { evaluateProgram } from './evaluator';
import { SANDBOX_PRESETS } from './presets';

describe('AST Pseudocode Interpreter Suite', () => {
  it('Tokenizes and parses variable declarations and arithmetic', () => {
    const code = `
      let x = 10
      let y = x + 5 * 2
    `;
    const tokens = tokenize(code);
    expect(tokens.length).toBeGreaterThan(0);

    const ast = parseProgram(tokens);
    expect(ast.statements.length).toBe(2);

    const snapshots = evaluateProgram(ast);
    const last = snapshots[snapshots.length - 1];
    expect(last.variables['x']).toBe(10);
    expect(last.variables['y']).toBe(20);
  });

  it('Executes Bubble Sort preset correctly', () => {
    const bubbleSortPreset = SANDBOX_PRESETS.find((p) => p.id === 'bubbleSort')!;
    const tokens = tokenize(bubbleSortPreset.code);
    const ast = parseProgram(tokens);
    const snapshots = evaluateProgram(ast);

    expect(snapshots.length).toBeGreaterThan(10);
    const last = snapshots[snapshots.length - 1];
    expect(last.variables['arr']).toEqual([11, 12, 22, 25, 34, 64, 90]);
  });

  it('Executes Binary Search preset and finds target element', () => {
    const binarySearchPreset = SANDBOX_PRESETS.find((p) => p.id === 'binarySearch')!;
    const tokens = tokenize(binarySearchPreset.code);
    const ast = parseProgram(tokens);
    const snapshots = evaluateProgram(ast);

    const last = snapshots[snapshots.length - 1];
    expect(last.variables['found']).toBe(5); // arr[5] == 23
  });

  it('Executes Two-Pointers In-Place Reversal preset', () => {
    const reversePreset = SANDBOX_PRESETS.find((p) => p.id === 'twoPointersReverse')!;
    const tokens = tokenize(reversePreset.code);
    const ast = parseProgram(tokens);
    const snapshots = evaluateProgram(ast);

    const last = snapshots[snapshots.length - 1];
    expect(last.variables['arr']).toEqual([60, 50, 40, 30, 20, 10]);
  });

  it('Executes Kadanes algorithm preset correctly', () => {
    const kadanePreset = SANDBOX_PRESETS.find((p) => p.id === 'kadane')!;
    const tokens = tokenize(kadanePreset.code);
    const ast = parseProgram(tokens);
    const snapshots = evaluateProgram(ast);

    const last = snapshots[snapshots.length - 1];
    expect(last.variables['maxSoFar']).toBe(6); // Maximum subarray sum for [-2, 1, -3, 4, -1, 2, 1, -5, 4] is [4, -1, 2, 1] = 6
  });

  it('Catches syntax error when missing brace', () => {
    const code = `
      if x > 5
        let y = 1
    `;
    const tokens = tokenize(code);
    expect(() => parseProgram(tokens)).toThrowError(/Expected '{'/);
  });

  it('Halts and prevents infinite loop via execution budget', () => {
    const infiniteLoopCode = `
      let x = 1
      while x > 0 {
        x = x + 1
      }
    `;
    const tokens = tokenize(infiniteLoopCode);
    const ast = parseProgram(tokens);
    expect(() => evaluateProgram(ast, 50)).toThrowError(/Execution budget exceeded/);
  });
});

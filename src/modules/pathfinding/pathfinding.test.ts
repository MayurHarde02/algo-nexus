import { describe, it, expect } from 'vitest';
import { createEmptyGrid, runPathfinding } from './algorithms';

describe('Pathfinding Engine Unit Tests', () => {
  it('BFS finds optimal path on open grid', () => {
    const grid = createEmptyGrid(10, 10);
    const start = { row: 0, col: 0 };
    const target = { row: 3, col: 4 };

    const snapshots = runPathfinding('bfs', grid, start, target);
    const finalSnapshot = snapshots[snapshots.length - 1];

    expect(finalSnapshot.hasPath).toBe(true);
    // Manhattan distance on open grid without diagonal movement is |3-0| + |4-0| = 7
    expect(finalSnapshot.pathLength).toBe(7);
  });

  it('Reports no path when destination is completely enclosed by walls', () => {
    const grid = createEmptyGrid(5, 5);
    const start = { row: 0, col: 0 };
    const target = { row: 4, col: 4 };

    // Wall off row 2 completely
    for (let c = 0; c < 5; c++) {
      grid[2][c] = 'wall';
    }

    const snapshots = runPathfinding('bfs', grid, start, target);
    const finalSnapshot = snapshots[snapshots.length - 1];

    expect(finalSnapshot.hasPath).toBe(false);
    expect(finalSnapshot.pathLength).toBe(0);
  });

  it('A* finds path through a corridor', () => {
    const grid = createEmptyGrid(6, 6);
    const start = { row: 0, col: 0 };
    const target = { row: 0, col: 4 };

    // Wall off direct path with one opening at bottom
    for (let r = 0; r < 5; r++) {
      grid[r][2] = 'wall';
    }

    const snapshots = runPathfinding('astar', grid, start, target);
    const finalSnapshot = snapshots[snapshots.length - 1];

    expect(finalSnapshot.hasPath).toBe(true);
    expect(finalSnapshot.pathLength).toBeGreaterThan(0);
  });
});

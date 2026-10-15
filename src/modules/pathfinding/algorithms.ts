import type {
  CellType,
  TerrainType,
  PathfindingAlgorithmKey,
  PathfindingMetadata,
  PathfindingSnapshot,
} from '../../types/pathfinding';
import { TERRAIN_COSTS } from '../../types/pathfinding';

export const PATHFINDING_METADATA: Record<PathfindingAlgorithmKey, PathfindingMetadata> = {
  bfs: {
    key: 'bfs',
    name: 'Breadth-First Search (BFS)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    weighted: false,
    heuristic: 'None (FIFO Queue)',
    description:
      'Explores the grid uniformly in concentric frontier rings using a First-In First-Out (FIFO) queue. Guarantees minimum hop count on unweighted grids, but ignores terrain weights.',
  },
  dfs: {
    key: 'dfs',
    name: 'Depth-First Search (DFS)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: false,
    weighted: false,
    heuristic: 'None (LIFO Stack)',
    description:
      'Explores as deep as possible along each branch before backtracking using a Last-In First-Out (LIFO) stack. Does not guarantee the shortest path and may explore vast detours.',
  },
  dijkstra: {
    key: 'dijkstra',
    name: "Dijkstra's Algorithm",
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    weighted: true,
    heuristic: 'Cumulative Edge Weight',
    description:
      'Greedy shortest-path algorithm using a priority queue. Always expands the lowest cumulative cost g(n), intelligently detouring around high-cost mud and water.',
  },
  astar: {
    key: 'astar',
    name: 'A* Search',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    weighted: true,
    heuristic: 'Manhattan Distance |x1 - x2| + |y1 - y2|',
    description:
      'Informed search combining cumulative path cost g(n) with an admissible Manhattan heuristic h(n) to prioritize nodes directed toward the destination.',
  },
};

interface Pos {
  row: number;
  col: number;
}

export function createEmptyGrid(rows: number, cols: number): CellType[][] {
  return Array.from({ length: rows }, () => Array(cols).fill('empty'));
}

export function cloneGrid<T>(grid: T[][]): T[][] {
  return grid.map((r) => [...r]);
}

export function generateRandomMaze(rows: number, cols: number, density: number = 0.28): CellType[][] {
  const grid = createEmptyGrid(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < density) {
        grid[r][c] = 'wall';
      }
    }
  }
  return grid;
}

export function generateRecursiveDivisionMaze(rows: number, cols: number): CellType[][] {
  const grid = createEmptyGrid(rows, cols);

  // Border walls
  for (let r = 0; r < rows; r++) {
    grid[r][0] = 'wall';
    grid[r][cols - 1] = 'wall';
  }
  for (let c = 0; c < cols; c++) {
    grid[0][c] = 'wall';
    grid[rows - 1][c] = 'wall';
  }

  function divide(r1: number, r2: number, c1: number, c2: number) {
    if (r2 - r1 < 2 || c2 - c1 < 2) return;

    const horizontal = r2 - r1 > c2 - c1;
    if (horizontal) {
      const wallR = Math.floor(Math.random() * (r2 - r1 - 1)) + r1 + 1;
      const passC = Math.floor(Math.random() * (c2 - c1 + 1)) + c1;

      for (let c = c1; c <= c2; c++) {
        if (c !== passC) grid[wallR][c] = 'wall';
      }

      divide(r1, wallR - 1, c1, c2);
      divide(wallR + 1, r2, c1, c2);
    } else {
      const wallC = Math.floor(Math.random() * (c2 - c1 - 1)) + c1 + 1;
      const passR = Math.floor(Math.random() * (r2 - r1 + 1)) + r1;

      for (let r = r1; r <= r2; r++) {
        if (r !== passR) grid[r][wallC] = 'wall';
      }

      divide(r1, r2, c1, wallC - 1);
      divide(r1, r2, wallC + 1, c2);
    }
  }

  divide(1, rows - 2, 1, cols - 2);
  return grid;
}

export function generateSwampCrossing(rows: number, cols: number): CellType[][] {
  const grid = createEmptyGrid(rows, cols);
  const midColStart = Math.floor(cols * 0.32);
  const midColEnd = Math.floor(cols * 0.68);

  for (let r = 0; r < rows; r++) {
    for (let c = midColStart; c <= midColEnd; c++) {
      if (r >= 3) {
        grid[r][c] = 'mud';
        // Deep water pool in direct central axis
        if (
          r >= Math.floor(rows * 0.35) &&
          r <= Math.floor(rows * 0.65) &&
          c >= midColStart + 2 &&
          c <= midColEnd - 2
        ) {
          grid[r][c] = 'water';
        }
      }
    }
  }
  return grid;
}

const DIRS = [
  [-1, 0], // Up
  [1, 0],  // Down
  [0, -1], // Left
  [0, 1],  // Right
];

export function runPathfinding(
  algo: PathfindingAlgorithmKey,
  baseGrid: CellType[][],
  start: Pos,
  target: Pos,
  customTerrain?: TerrainType[][]
): PathfindingSnapshot[] {
  const rows = baseGrid.length;
  const cols = baseGrid[0].length;
  const snapshots: PathfindingSnapshot[] = [];

  // Derive terrain grid
  const terrain: TerrainType[][] =
    customTerrain ??
    baseGrid.map((row) =>
      row.map((c) => {
        if (c === 'mud') return 'mud';
        if (c === 'water') return 'water';
        if (c === 'wall') return 'wall';
        return 'empty';
      })
    );

  const getCellCost = (r: number, c: number): number => {
    const t = terrain[r][c];
    return TERRAIN_COSTS[t] ?? 1;
  };

  const currentGrid = cloneGrid(baseGrid);
  currentGrid[start.row][start.col] = 'start';
  currentGrid[target.row][target.col] = 'target';

  const parentMap: Map<string, Pos> = new Map();
  const visited = new Set<string>();
  const keyOf = (p: Pos) => `${p.row},${p.col}`;

  snapshots.push({
    grid: cloneGrid(currentGrid),
    terrain: cloneGrid(terrain),
    visitedCount: 0,
    pathLength: 0,
    pathCost: 0,
    currentCell: start,
    statusText: `Initialized search from (${start.row}, ${start.col}) to (${target.row}, ${target.col}).`,
    isComplete: false,
    hasPath: false,
  });

  let targetFound = false;

  if (algo === 'bfs') {
    const queue: Pos[] = [start];
    visited.add(keyOf(start));

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.row === target.row && current.col === target.col) {
        targetFound = true;
        break;
      }

      if (!(current.row === start.row && current.col === start.col)) {
        currentGrid[current.row][current.col] = 'visited';
      }

      for (const [dr, dc] of DIRS) {
        const nr = current.row + dr;
        const nc = current.col + dc;
        const nKey = `${nr},${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (terrain[nr][nc] !== 'wall' && !visited.has(nKey)) {
            visited.add(nKey);
            parentMap.set(nKey, current);
            if (!(nr === target.row && nc === target.col)) {
              currentGrid[nr][nc] = 'frontier';
            }
            queue.push({ row: nr, col: nc });
          }
        }
      }

      snapshots.push({
        grid: cloneGrid(currentGrid),
        terrain: cloneGrid(terrain),
        visitedCount: visited.size,
        pathLength: 0,
        pathCost: 0,
        currentCell: current,
        statusText: `Visiting (${current.row}, ${current.col}). Active frontier size: ${queue.length}.`,
        isComplete: false,
        hasPath: false,
      });
    }
  } else if (algo === 'dfs') {
    const stack: Pos[] = [start];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const cKey = keyOf(current);

      if (visited.has(cKey)) continue;
      visited.add(cKey);

      if (current.row === target.row && current.col === target.col) {
        targetFound = true;
        break;
      }

      if (!(current.row === start.row && current.col === start.col)) {
        currentGrid[current.row][current.col] = 'visited';
      }

      for (const [dr, dc] of DIRS) {
        const nr = current.row + dr;
        const nc = current.col + dc;
        const nKey = `${nr},${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (terrain[nr][nc] !== 'wall' && !visited.has(nKey)) {
            if (!parentMap.has(nKey)) {
              parentMap.set(nKey, current);
            }
            if (!(nr === target.row && nc === target.col)) {
              currentGrid[nr][nc] = 'frontier';
            }
            stack.push({ row: nr, col: nc });
          }
        }
      }

      snapshots.push({
        grid: cloneGrid(currentGrid),
        terrain: cloneGrid(terrain),
        visitedCount: visited.size,
        pathLength: 0,
        pathCost: 0,
        currentCell: current,
        statusText: `Exploring depth-first at (${current.row}, ${current.col}). Stack depth: ${stack.length}.`,
        isComplete: false,
        hasPath: false,
      });
    }
  } else if (algo === 'dijkstra') {
    const dist = new Map<string, number>();
    dist.set(keyOf(start), 0);
    const unvisited: Pos[] = [start];

    while (unvisited.length > 0) {
      unvisited.sort((a, b) => (dist.get(keyOf(a)) ?? Infinity) - (dist.get(keyOf(b)) ?? Infinity));
      const current = unvisited.shift()!;
      const cKey = keyOf(current);

      if (visited.has(cKey)) continue;
      visited.add(cKey);

      if (current.row === target.row && current.col === target.col) {
        targetFound = true;
        break;
      }

      if (!(current.row === start.row && current.col === start.col)) {
        currentGrid[current.row][current.col] = 'visited';
      }

      const currentDist = dist.get(cKey) ?? 0;

      for (const [dr, dc] of DIRS) {
        const nr = current.row + dr;
        const nc = current.col + dc;
        const nKey = `${nr},${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (terrain[nr][nc] !== 'wall' && !visited.has(nKey)) {
            const edgeWeight = getCellCost(nr, nc);
            const newDist = currentDist + edgeWeight;
            const oldDist = dist.get(nKey) ?? Infinity;

            if (newDist < oldDist) {
              dist.set(nKey, newDist);
              parentMap.set(nKey, current);
              if (!(nr === target.row && nc === target.col)) {
                currentGrid[nr][nc] = 'frontier';
              }
              unvisited.push({ row: nr, col: nc });
            }
          }
        }
      }

      snapshots.push({
        grid: cloneGrid(currentGrid),
        terrain: cloneGrid(terrain),
        visitedCount: visited.size,
        pathLength: 0,
        pathCost: 0,
        currentCell: current,
        statusText: `Relaxing edges from (${current.row}, ${current.col}), cumulative distance: ${currentDist}.`,
        isComplete: false,
        hasPath: false,
      });
    }
  } else if (algo === 'astar') {
    const manhattan = (p: Pos) => Math.abs(p.row - target.row) + Math.abs(p.col - target.col);
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    gScore.set(keyOf(start), 0);
    fScore.set(keyOf(start), manhattan(start));
    const openSet: Pos[] = [start];

    while (openSet.length > 0) {
      openSet.sort((a, b) => (fScore.get(keyOf(a)) ?? Infinity) - (fScore.get(keyOf(b)) ?? Infinity));
      const current = openSet.shift()!;
      const cKey = keyOf(current);

      if (current.row === target.row && current.col === target.col) {
        targetFound = true;
        break;
      }

      visited.add(cKey);
      if (!(current.row === start.row && current.col === start.col)) {
        currentGrid[current.row][current.col] = 'visited';
      }

      const currentG = gScore.get(cKey) ?? 0;

      for (const [dr, dc] of DIRS) {
        const nr = current.row + dr;
        const nc = current.col + dc;
        const nKey = `${nr},${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (terrain[nr][nc] !== 'wall') {
            const edgeWeight = getCellCost(nr, nc);
            const tentativeG = currentG + edgeWeight;
            if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
              parentMap.set(nKey, current);
              gScore.set(nKey, tentativeG);
              const f = tentativeG + manhattan({ row: nr, col: nc });
              fScore.set(nKey, f);

              if (!openSet.some((p) => p.row === nr && p.col === nc)) {
                openSet.push({ row: nr, col: nc });
                if (!(nr === target.row && nc === target.col)) {
                  currentGrid[nr][nc] = 'frontier';
                }
              }
            }
          }
        }
      }

      snapshots.push({
        grid: cloneGrid(currentGrid),
        terrain: cloneGrid(terrain),
        visitedCount: visited.size,
        pathLength: 0,
        pathCost: 0,
        currentCell: current,
        statusText: `A* evaluation at (${current.row}, ${current.col}), g: ${currentG}, f: ${fScore.get(cKey)}.`,
        isComplete: false,
        hasPath: false,
      });
    }
  }

  // Reconstruct path if found
  let pathLen = 0;
  let totalCost = 0;
  if (targetFound) {
    let curr: Pos | undefined = target;
    const pathNodes: Pos[] = [];

    while (curr) {
      pathNodes.push(curr);
      curr = parentMap.get(keyOf(curr));
    }
    pathNodes.reverse();
    pathLen = pathNodes.length - 1;

    for (let i = 0; i < pathNodes.length; i++) {
      const p = pathNodes[i];
      if (i > 0) {
        totalCost += getCellCost(p.row, p.col);
      }
      if (
        !(p.row === start.row && p.col === start.col) &&
        !(p.row === target.row && p.col === target.col)
      ) {
        currentGrid[p.row][p.col] = 'path';
      }
    }

    snapshots.push({
      grid: cloneGrid(currentGrid),
      terrain: cloneGrid(terrain),
      visitedCount: visited.size,
      pathLength: pathLen,
      pathCost: totalCost,
      currentCell: target,
      statusText: `Destination reached. Route length: ${pathLen} hops, total cost: ${totalCost} across ${visited.size} explored nodes.`,
      isComplete: true,
      hasPath: true,
    });
  } else {
    snapshots.push({
      grid: cloneGrid(currentGrid),
      terrain: cloneGrid(terrain),
      visitedCount: visited.size,
      pathLength: 0,
      pathCost: 0,
      currentCell: null,
      statusText: `Target unreachable: no open graph route exists between start and destination.`,
      isComplete: true,
      hasPath: false,
    });
  }

  return snapshots;
}

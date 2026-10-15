# Changelog

All notable changes to ALGO NEXUS will be documented in this file.

## [1.2.0] - 2026-10-15

### Added
- Minimum Spanning Trees (MST): Kruskal's Algorithm with Disjoint Set Union (DSU with union by rank and path compression) and Prim's Algorithm with cut-edge priority queue.
- Bellman-Ford Shortest Paths: $V-1$ edge relaxation passes and negative weight cycle detection pass with explicit cycle highlighting.
- Weighted Graph Visualizer: SVG graph canvas with mid-point edge weight badges, MST edge highlighting, and candidate evaluation states.
- Multi-Cost Terrain Pathfinding: Terrain brushes for Normal (cost 1), Mud (cost 3), Water (cost 5), and Walls (impassable). Dijkstra and A* compute optimal weighted costs, outperforming unweighted hop-count BFS.
- Swamp Crossing Benchmark Map: Terrain preset demonstrating Dijkstra routing around mud/water obstacles.
- AST-Driven Pseudocode Sandbox: Client-side lexer, recursive-descent parser, and deterministic VM stepping through algorithmic DSL without eval(). Includes presets for Bubble Sort, Binary Search, Two-Pointers Reversal, and Kadane's Algorithm.
- Academic Execution Report Generator: One-click export to formal Markdown and LaTeX documents with asymptotic bounds, Master Theorem recurrence solutions, and hardware operational counters.
- Comprehensive Vitest test suite expanded to 66 passing test cases across 10 test suites.

## [1.1.0] - 2026-10-15

### Added
- L1 Hardware Data Cache Simulator: Direct-Mapped and 2-Way Set Associative modeling with LRU replacement, cache hits/misses, and spatial locality inspection.
- AVL Tree Interactive Workbench: Self-balancing BST with live node balance factor calculations ($BF = h_L - h_R$) and automated LL, RR, LR, and RL rotations.
- Binary Min-Heap Visualizer: In-place array $[0..n-1]$ and complete binary tree dual representation with bubble-up insert and sink-down extract-min.
- Dynamic Programming Matrix Workbench: 2D bottom-up memoization tableaux for 0/1 Knapsack and Longest Common Subsequence (LCS) with live subproblem dependency highlights and backtracking route recovery.
- URL State Sharing: Shareable query parameter state encoding allowing users to bookmark and share exact module states.
- Unit test suite expanded to 53 passing test cases across 8 test files.

## [1.0.0] - 2026-10-15

### Added
- Sorting Arena: 6 deterministic sorting algorithms with line-by-line pseudocode highlighting.
- Algorithm Race: Synchronized side-by-side comparative benchmarking.
- Pathfinding Lab: 2D editable grid with BFS, DFS, Dijkstra, and A* search plus maze generators.
- CPU Scheduling Simulator: FCFS, SJF, and Round Robin with interactive Gantt chart and mathematical verification.
- Graph Explorer: Node-link graph traversal with live inspection of FIFO Queue and LIFO Stack memory.
- Complexity Matrix: Master Big-O reference table with search and filtering.
- Full unit test suite with 42 passing test cases across sorting, pathfinding, and CPU scheduling.
- MIT License and comprehensive technical documentation.

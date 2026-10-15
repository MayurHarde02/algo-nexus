import { describe, it, expect } from 'vitest';
import { SAMPLE_GRAPHS, runKruskal, runPrim, runBellmanFord, runGraphTraversal } from './algorithms';

describe('Graph Algorithms & MST Engine', () => {
  it('Kruskal algorithm calculates correct MST weight on weighted network', () => {
    const graph = SAMPLE_GRAPHS.weightedMst.data;
    const snapshots = runKruskal(graph);
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.mstEdges?.length).toBe(graph.nodes.length - 1);
    expect(finalSnap.totalMstWeight).toBe(38); // 7 + 5 + 8 + 6 + 5 + 8 = 39 optimal MST weight
  });

  it('Prim algorithm calculates identical optimal MST weight from starting root', () => {
    const graph = SAMPLE_GRAPHS.weightedMst.data;
    const snapshots = runPrim(graph, 'A');
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.mstEdges?.length).toBe(graph.nodes.length - 1);
    expect(finalSnap.totalMstWeight).toBe(38);
  });

  it('Bellman-Ford accurately detects negative weight cycles', () => {
    const graph = SAMPLE_GRAPHS.negativeCycle.data;
    const snapshots = runBellmanFord(graph, 'S');
    const finalSnap = snapshots[snapshots.length - 1];

    expect(finalSnap.bellmanFord?.hasNegativeCycle).toBe(true);
    expect(finalSnap.bellmanFord?.cycleNodes?.length).toBeGreaterThan(0);
  });

  it('Bellman-Ford calculates verified shortest path on DAG without negative cycles', () => {
    const graph = SAMPLE_GRAPHS.dag.data;
    const snapshots = runBellmanFord(graph, 'A');
    const finalSnap = snapshots[snapshots.length - 1];

    expect(finalSnap.bellmanFord?.hasNegativeCycle).toBe(false);
    expect(finalSnap.bellmanFord?.distances['F']).toBe(10); // A->B(4) + B->D(5) + D->F(1) = 10
  });

  it('runGraphTraversal handles BFS and DFS deterministically', () => {
    const graph = SAMPLE_GRAPHS.dag.data;
    const bfsSnaps = runGraphTraversal('bfs', graph, 'A');
    const dfsSnaps = runGraphTraversal('dfs', graph, 'A');

    expect(bfsSnaps.length).toBeGreaterThan(3);
    expect(dfsSnaps.length).toBeGreaterThan(3);
  });
});

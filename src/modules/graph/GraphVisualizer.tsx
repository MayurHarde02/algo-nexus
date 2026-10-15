import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_GRAPHS, runGraphTraversal } from './algorithms';
import type { GraphAlgorithmKey } from '../../types/graph';
import { usePlayback } from '../../hooks/usePlayback';
import { ControlBar } from '../../components/common/ControlBar';
import { Activity, AlertTriangle, GitMerge, Layers, Route } from 'lucide-react';

export const GraphVisualizer: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof SAMPLE_GRAPHS>('weightedMst');
  const [selectedAlgo, setSelectedAlgo] = useState<GraphAlgorithmKey>('kruskal');
  const [startNode, setStartNode] = useState<string>('A');

  const graphData = SAMPLE_GRAPHS[selectedPreset].data;

  // Set default start node when preset changes
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      setStartNode(graphData.nodes[0].id);
    }
  }, [selectedPreset, graphData]);

  // Adjust preset appropriately if Bellman-Ford is selected
  useEffect(() => {
    if (selectedAlgo === 'bellmanFord' && selectedPreset !== 'negativeCycle' && selectedPreset !== 'dag') {
      setSelectedPreset('negativeCycle');
    } else if ((selectedAlgo === 'kruskal' || selectedAlgo === 'prim') && selectedPreset === 'negativeCycle') {
      setSelectedPreset('weightedMst');
    }
  }, [selectedAlgo]);

  const snapshots = useMemo(() => {
    return runGraphTraversal(selectedAlgo, graphData, startNode);
  }, [selectedAlgo, graphData, startNode]);

  const playback = usePlayback({
    totalSteps: snapshots.length,
    initialSpeed: 400,
  });

  const { reset: resetPlayback } = playback;

  useEffect(() => {
    resetPlayback();
  }, [selectedPreset, selectedAlgo, startNode, resetPlayback]);

  const currentSnapshot = snapshots[playback.currentIndex] || snapshots[0];

  const isMstAlgo = selectedAlgo === 'kruskal' || selectedAlgo === 'prim';
  const isBellman = selectedAlgo === 'bellmanFord';

  return (
    <div className="flex flex-col gap-4">
      {/* Top Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ['weightedMst', 'Weighted Network (MST)'],
              ['negativeCycle', 'Negative Cycle (Bellman-Ford)'],
              ['dag', 'DAG (Acyclic)'],
              ['binaryTree', 'Complete Binary Tree'],
              ['cyclic', 'Cyclic Network'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedPreset(key)}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedPreset === key
                  ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Algorithm & Start Node */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-sm border border-slate-800">
            <span className="text-slate-400">Algorithm:</span>
            {(
              [
                ['bfs', 'BFS'],
                ['dfs', 'DFS'],
                ['kruskal', "Kruskal's MST"],
                ['prim', "Prim's MST"],
                ['bellmanFord', 'Bellman-Ford'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedAlgo(key)}
                className={`px-2 py-0.5 rounded-xs font-mono transition-colors ${
                  selectedAlgo === key
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {(selectedAlgo === 'bfs' || selectedAlgo === 'dfs' || selectedAlgo === 'prim' || selectedAlgo === 'bellmanFord') && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-sm border border-slate-800">
              <span className="text-slate-400">Root Node:</span>
              <select
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2 py-0.5 rounded-xs focus:outline-none"
              >
                {graphData.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas & State Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Graph View (2 cols) */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-md p-4 flex flex-col justify-between relative min-h-[420px]">
          {/* Legend */}
          <div className="absolute top-3 left-3 flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-sm border border-slate-800 z-10 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500"></span> Unvisited
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Frontier
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Active / Relaxed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> In MST / Visited
            </span>
            {isMstAlgo && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Cycle Rejected
              </span>
            )}
          </div>

          <svg className="w-full h-88 overflow-visible">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="22"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#64748b" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="8"
                refX="22"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#fbbf24" />
              </marker>
              <marker
                id="arrowhead-negcycle"
                markerWidth="8"
                markerHeight="8"
                refX="22"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#f43f5e" />
              </marker>
            </defs>

            {/* Edges */}
            {graphData.edges.map((edge) => {
              const src = graphData.nodes.find((n) => n.id === edge.source);
              const tgt = graphData.nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;

              const isEdgeInMst = currentSnapshot.mstEdges?.includes(edge.id);
              const isEdgeRejected = currentSnapshot.rejectedEdges?.includes(edge.id);
              const isEdgeActive =
                currentSnapshot.activeEdge === edge.id ||
                currentSnapshot.activeEdge === `${edge.source}-${edge.target}` ||
                currentSnapshot.activeEdge === `${edge.target}-${edge.source}`;

              let stroke = '#334155';
              let strokeWidth = '1.5';
              let strokeDasharray = 'none';

              if (isEdgeInMst) {
                stroke = '#10b981';
                strokeWidth = '3.5';
              } else if (isEdgeActive) {
                stroke = '#fbbf24';
                strokeWidth = '3';
              } else if (isEdgeRejected) {
                stroke = '#f43f5e';
                strokeWidth = '2';
                strokeDasharray = '4 4';
              }

              // Bellman-Ford active relaxation check
              const isBellmanActive = currentSnapshot.bellmanFord?.activeEdge?.source === edge.source &&
                currentSnapshot.bellmanFord?.activeEdge?.target === edge.target;
              if (isBellmanActive) {
                stroke = currentSnapshot.bellmanFord?.hasNegativeCycle ? '#f43f5e' : '#fbbf24';
                strokeWidth = '3';
              }

              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;
              const weightVal = edge.weight !== undefined ? edge.weight : 1;

              const isDirected = selectedPreset === 'negativeCycle' || selectedPreset === 'dag';

              return (
                <g key={edge.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    markerEnd={
                      isDirected
                        ? isBellmanActive
                          ? currentSnapshot.bellmanFord?.hasNegativeCycle
                            ? 'url(#arrowhead-negcycle)'
                            : 'url(#arrowhead-active)'
                          : 'url(#arrowhead)'
                        : undefined
                    }
                    className="transition-all duration-150"
                  />
                  {/* Weight Badge */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-12}
                      y={-10}
                      width={24}
                      height={20}
                      rx={3}
                      fill="#0b0f17"
                      stroke={isEdgeInMst ? '#059669' : isEdgeActive ? '#f59e0b' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x={0}
                      y={4}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill={isEdgeInMst ? '#34d399' : isEdgeActive ? '#fbbf24' : '#94a3b8'}
                      className="font-mono select-none"
                    >
                      {weightVal}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Nodes */}
            {graphData.nodes.map((node) => {
              const isActive = currentSnapshot.activeNode === node.id;
              const isVisited = currentSnapshot.visitedNodes.includes(node.id);
              const isFrontier = currentSnapshot.frontierNodes.includes(node.id);
              const isNegCycleNode = currentSnapshot.bellmanFord?.cycleNodes?.includes(node.id);

              let fill = '#1e293b';
              let stroke = '#475569';
              let textColor = '#cbd5e1';

              if (isNegCycleNode) {
                fill = '#881337';
                stroke = '#f43f5e';
                textColor = '#ffe4e6';
              } else if (isActive) {
                fill = '#fbbf24';
                stroke = '#f59e0b';
                textColor = '#0f172a';
              } else if (isVisited) {
                fill = '#10b981';
                stroke = '#059669';
                textColor = '#0f172a';
              } else if (isFrontier) {
                fill = '#0284c7';
                stroke = '#38bdf8';
                textColor = '#f8fafc';
              }

              return (
                <g key={node.id} className="cursor-pointer">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2"
                    className="transition-colors duration-150"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill={textColor}
                    className="select-none font-mono"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Action Log Message */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-md text-xs mt-3">
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-medium">Log:</span>
            <span className="text-slate-200 font-mono">{currentSnapshot.description}</span>
          </div>
        </div>

        {/* Dynamic Context Inspection Panel (1 col) */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              {isMstAlgo ? (
                <>
                  <GitMerge className="w-4 h-4 text-emerald-400" />
                  Minimum Spanning Tree
                </>
              ) : isBellman ? (
                <>
                  <Route className="w-4 h-4 text-sky-400" />
                  Bellman-Ford Analysis
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 text-sky-400" />
                  Memory Structure ({selectedAlgo === 'bfs' ? 'FIFO Queue' : 'LIFO Stack'})
                </>
              )}
            </span>
            {isMstAlgo && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-xs">
                Total Weight: {currentSnapshot.totalMstWeight ?? 0}
              </span>
            )}
          </div>

          {/* Kruskal's View */}
          {selectedAlgo === 'kruskal' && (
            <div className="flex flex-col gap-3">
              {/* DSU Sets */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-1">
                  Disjoint Set Union (DSU) Parent Pointers:
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {currentSnapshot.dsuSets?.map((set) => (
                    <div
                      key={set.id}
                      className="p-1.5 bg-slate-950 border border-slate-800 rounded-xs text-center"
                    >
                      <div className="text-[10px] text-slate-500 font-mono">Node {set.id}</div>
                      <div className="text-xs font-mono font-bold text-sky-300">
                        root: {set.parent}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edge Candidate List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-slate-400">
                  Sorted Edges Evaluation:
                </span>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-1">
                  {currentSnapshot.candidateEdges?.map((edge) => {
                    const isAccepted = currentSnapshot.mstEdges?.includes(edge.id);
                    const isRejected = currentSnapshot.rejectedEdges?.includes(edge.id);
                    const isActive = currentSnapshot.activeEdge === edge.id;

                    return (
                      <div
                        key={edge.id}
                        className={`flex items-center justify-between px-2 py-1 text-xs font-mono rounded-xs border ${
                          isAccepted
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                            : isRejected
                            ? 'bg-rose-950/40 border-rose-900 text-rose-400 line-through opacity-75'
                            : isActive
                            ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>
                          ({edge.source} - {edge.target}) weight: {edge.weight}
                        </span>
                        <span className="text-[10px] uppercase font-bold">
                          {isAccepted ? 'MST' : isRejected ? 'Cycle' : isActive ? 'Eval' : 'Wait'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Prim's View */}
          {selectedAlgo === 'prim' && (
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-1">
                  Nodes in Spanning Tree ({currentSnapshot.visitedNodes.length} / {graphData.nodes.length}):
                </span>
                <div className="flex flex-wrap gap-1 font-mono text-xs">
                  {currentSnapshot.visitedNodes.map((n) => (
                    <span
                      key={n}
                      className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xs"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-slate-400">
                  Cut-Edge Priority Queue ({currentSnapshot.candidateEdges?.length ?? 0} cut edges):
                </span>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-1">
                  {currentSnapshot.candidateEdges?.length === 0 ? (
                    <span className="text-slate-600 text-xs font-mono py-2 text-center">
                      [ No active cut edges ]
                    </span>
                  ) : (
                    currentSnapshot.candidateEdges?.map((edge, idx) => (
                      <div
                        key={edge.id}
                        className={`flex items-center justify-between px-2 py-1 text-xs font-mono rounded-xs border ${
                          idx === 0
                            ? 'bg-amber-950/40 border-amber-800 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>
                          ({edge.source} - {edge.target})
                        </span>
                        <span>w = {edge.weight}</span>
                        <span className="text-[10px]">{idx === 0 ? 'Min Pick' : `#${idx + 1}`}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bellman-Ford View */}
          {isBellman && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Relaxation Pass:</span>
                <span className="text-sky-400 font-bold">
                  {currentSnapshot.bellmanFord?.pass} / {currentSnapshot.bellmanFord?.maxPasses}
                </span>
              </div>

              {currentSnapshot.bellmanFord?.hasNegativeCycle && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-sm text-xs flex items-start gap-2 text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Negative Weight Cycle Detected!</span>
                    <span className="text-[11px] text-rose-400">
                      Cycle nodes: {currentSnapshot.bellmanFord.cycleNodes?.join(' -> ') || 'Detected'}. Distances can be reduced infinitely.
                    </span>
                  </div>
                </div>
              )}

              {/* Distance Table */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-1">
                  Vertex Shortest Distance Vector (dist[v]):
                </span>
                <div className="flex flex-col gap-1">
                  {Object.entries(currentSnapshot.bellmanFord?.distances || {}).map(([nodeId, dist]) => {
                    const isRelaxed = currentSnapshot.bellmanFord?.activeEdge?.target === nodeId;
                    const pred = currentSnapshot.bellmanFord?.predecessors[nodeId];

                    return (
                      <div
                        key={nodeId}
                        className={`flex items-center justify-between px-2.5 py-1 text-xs font-mono rounded-xs border ${
                          isRelaxed
                            ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold">Node {nodeId}</span>
                        <span>
                          dist: {dist === Infinity ? '∞' : dist}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          pred: {pred ?? 'null'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Standard BFS / DFS Frontier Queue / Stack */}
          {!isMstAlgo && !isBellman && (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-mono text-slate-400">
                Frontier Buffer ({currentSnapshot.frontierNodes.length} items):
              </span>
              <div className="flex flex-col gap-1 min-h-[140px] bg-slate-950 p-2.5 rounded-sm border border-slate-800 overflow-y-auto">
                {currentSnapshot.frontierNodes.length === 0 ? (
                  <span className="text-slate-600 text-xs font-mono m-auto">
                    {selectedAlgo === 'bfs' ? '[ Empty Queue ]' : '[ Empty Stack ]'}
                  </span>
                ) : (
                  currentSnapshot.frontierNodes.map((nId, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-2.5 py-1 bg-sky-950/40 border border-sky-800 text-sky-300 font-mono text-xs rounded-xs"
                    >
                      <span>Node {nId}</span>
                      <span className="text-[10px] text-slate-500">
                        {selectedAlgo === 'bfs'
                          ? idx === 0
                            ? 'Next to Dequeue'
                            : `Slot ${idx}`
                          : idx === currentSnapshot.frontierNodes.length - 1
                          ? 'Top of Stack'
                          : `Slot ${idx}`}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Traversal Order Output */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
                <span className="text-xs font-medium text-slate-300">Visited Order Sequence:</span>
                <div className="flex flex-wrap gap-1 font-mono text-xs">
                  {currentSnapshot.traversalOrder.map((id, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-950 border border-slate-700 text-emerald-400 rounded-xs"
                    >
                      {idx + 1}. {id}
                    </span>
                  ))}
                  {currentSnapshot.traversalOrder.length === 0 && (
                    <span className="text-slate-500 text-xs">No nodes visited yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <ControlBar
        isPlaying={playback.isPlaying}
        currentIndex={playback.currentIndex}
        totalSteps={snapshots.length}
        speed={playback.speed}
        onPlayToggle={playback.togglePlay}
        onStepForward={playback.stepForward}
        onStepBackward={playback.stepBackward}
        onReset={playback.reset}
        onSpeedChange={playback.setSpeed}
        onJumpTo={playback.jumpTo}
      />
    </div>
  );
};

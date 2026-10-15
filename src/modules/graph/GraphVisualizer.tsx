import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_GRAPHS, runGraphTraversal } from './algorithms';
import type { TraversalAlgorithmKey } from '../../types/graph';
import { usePlayback } from '../../hooks/usePlayback';
import { ControlBar } from '../../components/common/ControlBar';
import { Activity } from 'lucide-react';

export const GraphVisualizer: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof SAMPLE_GRAPHS>('dag');
  const [selectedAlgo, setSelectedAlgo] = useState<TraversalAlgorithmKey>('bfs');
  const [startNode, setStartNode] = useState<string>('A');

  const graphData = SAMPLE_GRAPHS[selectedPreset].data;

  // Set default start node when preset changes
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      setStartNode(graphData.nodes[0].id);
    }
  }, [selectedPreset, graphData]);

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

  return (
    <div className="flex flex-col gap-4">
      {/* Top Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ['dag', 'DAG (Directed Acyclic)'],
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
            <span className="text-slate-400">Traversal:</span>
            <button
              onClick={() => setSelectedAlgo('bfs')}
              className={`px-2 py-0.5 rounded-xs font-mono ${
                selectedAlgo === 'bfs' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              BFS
            </button>
            <button
              onClick={() => setSelectedAlgo('dfs')}
              className={`px-2 py-0.5 rounded-xs font-mono ${
                selectedAlgo === 'dfs' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              DFS
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-sm border border-slate-800">
            <span className="text-slate-400">Start Root:</span>
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
        </div>
      </div>

      {/* SVG Canvas & Frontier Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Graph View (2 cols) */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-md p-4 flex flex-col justify-between relative min-h-[380px]">
          {/* Legend */}
          <div className="absolute top-3 left-3 flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-sm border border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500"></span> Unvisited
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> In Frontier
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Visited
            </span>
          </div>

          <svg className="w-full h-80">
            {/* Edges */}
            {graphData.edges.map((edge) => {
              const src = graphData.nodes.find((n) => n.id === edge.source);
              const tgt = graphData.nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;

              const isEdgeActive =
                currentSnapshot.activeEdge === `${edge.source}-${edge.target}` ||
                currentSnapshot.activeEdge === `${edge.target}-${edge.source}`;

              return (
                <line
                  key={edge.id}
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isEdgeActive ? '#38bdf8' : '#334155'}
                  strokeWidth={isEdgeActive ? '3' : '1.5'}
                  className="transition-all duration-150"
                />
              );
            })}

            {/* Nodes */}
            {graphData.nodes.map((node) => {
              const isActive = currentSnapshot.activeNode === node.id;
              const isVisited = currentSnapshot.visitedNodes.includes(node.id);
              const isFrontier = currentSnapshot.frontierNodes.includes(node.id);

              let fill = '#1e293b';
              let stroke = '#475569';
              let textColor = '#cbd5e1';

              if (isActive) {
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
          <div className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-md text-xs">
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-medium">Log:</span>
            <span className="text-slate-200 font-mono">{currentSnapshot.description}</span>
          </div>
        </div>

        {/* Memory State & Frontier Inspection (1 col) */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Memory Structure ({selectedAlgo === 'bfs' ? 'FIFO Queue' : 'LIFO Stack'})
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Capacity: {currentSnapshot.frontierNodes.length} items
            </span>
          </div>

          {/* Frontier Box Visualizer */}
          <div className="flex flex-col gap-1 min-h-[140px] bg-slate-950 p-3 rounded-sm border border-slate-800 overflow-y-auto">
            {currentSnapshot.frontierNodes.length === 0 ? (
              <span className="text-slate-600 text-xs font-mono m-auto">
                {selectedAlgo === 'bfs' ? '[ Empty Queue ]' : '[ Empty Stack ]'}
              </span>
            ) : (
              currentSnapshot.frontierNodes.map((nId, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1.5 bg-sky-950/40 border border-sky-800 text-sky-300 font-mono text-xs rounded-xs"
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
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-medium text-slate-300">Visited Order Sequence:</span>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
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

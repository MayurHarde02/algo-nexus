import React, { useState, useMemo, useEffect } from 'react';
import type {
  CellType,
  PathfindingAlgorithmKey,
} from '../../types/pathfinding';
import {
  PATHFINDING_METADATA,
  createEmptyGrid,
  generateRandomMaze,
  generateRecursiveDivisionMaze,
  runPathfinding,
} from './algorithms';
import { usePlayback } from '../../hooks/usePlayback';
import { ControlBar } from '../../components/common/ControlBar';
import {
  Grid,
  MapPin,
  Flag,
  RotateCcw,
  Sparkles,
  Activity,
} from 'lucide-react';

const GRID_ROWS = 18;
const GRID_COLS = 34;

export const PathfindingVisualizer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<PathfindingAlgorithmKey>('astar');
  const [baseGrid, setBaseGrid] = useState<CellType[][]>(() => createEmptyGrid(GRID_ROWS, GRID_COLS));
  const [startPos, setStartPos] = useState({ row: 8, col: 4 });
  const [targetPos, setTargetPos] = useState({ row: 8, col: 29 });
  const [editMode, setEditMode] = useState<'wall' | 'start' | 'target'>('wall');
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Generate snapshots
  const snapshots = useMemo(() => {
    return runPathfinding(selectedAlgo, baseGrid, startPos, targetPos);
  }, [selectedAlgo, baseGrid, startPos, targetPos]);

  const playback = usePlayback({
    totalSteps: snapshots.length,
    initialSpeed: 30,
  });

  const { reset: resetPlayback } = playback;

  useEffect(() => {
    resetPlayback();
  }, [selectedAlgo, baseGrid, startPos, targetPos, resetPlayback]);

  const currentSnapshot = snapshots[playback.currentIndex] || snapshots[0];
  const metadata = PATHFINDING_METADATA[selectedAlgo];

  // Grid editing interaction
  const handleCellInteraction = (row: number, col: number) => {
    if (playback.isPlaying) return;

    if (editMode === 'start') {
      if (row === targetPos.row && col === targetPos.col) return;
      if (baseGrid[row][col] === 'wall') return;
      setStartPos({ row, col });
      setEditMode('wall');
      return;
    }

    if (editMode === 'target') {
      if (row === startPos.row && col === startPos.col) return;
      if (baseGrid[row][col] === 'wall') return;
      setTargetPos({ row, col });
      setEditMode('wall');
      return;
    }

    // Wall toggle
    if ((row === startPos.row && col === startPos.col) || (row === targetPos.row && col === targetPos.col)) {
      return;
    }

    setBaseGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = next[row][col] === 'wall' ? 'empty' : 'wall';
      return next;
    });
  };

  const handleClearWalls = () => {
    setBaseGrid(createEmptyGrid(GRID_ROWS, GRID_COLS));
  };

  const handleGenerateDivisionMaze = () => {
    const maze = generateRecursiveDivisionMaze(GRID_ROWS, GRID_COLS);
    // Ensure start and target remain clear
    maze[startPos.row][startPos.col] = 'empty';
    maze[targetPos.row][targetPos.col] = 'empty';
    setBaseGrid(maze);
  };

  const handleGenerateRandomObstacles = () => {
    const maze = generateRandomMaze(GRID_ROWS, GRID_COLS, 0.28);
    maze[startPos.row][startPos.col] = 'empty';
    maze[targetPos.row][targetPos.col] = 'empty';
    setBaseGrid(maze);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Configuration Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        {/* Algorithm Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ['astar', 'A* Search'],
              ['dijkstra', "Dijkstra's"],
              ['bfs', 'BFS (Breadth-First)'],
              ['dfs', 'DFS (Depth-First)'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedAlgo(key)}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedAlgo === key
                  ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Edit Modes and Maze Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setEditMode('start')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
              editMode === 'start'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reposition Start</span>
          </button>

          <button
            onClick={() => setEditMode('target')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
              editMode === 'target'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-rose-400" />
            <span>Reposition Target</span>
          </button>

          <button
            onClick={handleGenerateDivisionMaze}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
          >
            <Grid className="w-3.5 h-3.5 text-sky-400" />
            <span>Division Maze</span>
          </button>

          <button
            onClick={handleGenerateRandomObstacles}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Random Walls (28%)</span>
          </button>

          <button
            onClick={handleClearWalls}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Grid</span>
          </button>
        </div>
      </div>

      {/* Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Explored Nodes</span>
          <span className="text-lg font-mono font-bold text-sky-400">
            {currentSnapshot.visitedCount}
          </span>
        </div>
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Path Length</span>
          <span className="text-lg font-mono font-bold text-amber-400">
            {currentSnapshot.pathLength > 0 ? `${currentSnapshot.pathLength} units` : '-'}
          </span>
        </div>
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Shortest Path Guarantee</span>
          <span
            className={`text-xs font-mono font-semibold block mt-1 ${
              metadata.guaranteesShortestPath ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {metadata.guaranteesShortestPath ? 'Strictly Guaranteed' : 'Not Guaranteed'}
          </span>
        </div>
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Heuristic / Time Bound</span>
          <span className="text-xs font-mono font-semibold text-slate-200 block mt-1 truncate">
            {metadata.timeComplexity} | {metadata.heuristic}
          </span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-md p-3 flex flex-col items-center select-none overflow-x-auto">
        {/* Legend */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 mb-2 border-b border-slate-900 pb-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span> Start (S)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500"></span> Target (T)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-800 border border-slate-700"></span> Wall
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-500"></span> Frontier
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-700"></span> Visited
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-400"></span> Shortest Route
            </span>
          </div>

          <span className="text-slate-500">Click and drag to toggle walls</span>
        </div>

        {/* 2D Matrix Grid */}
        <div
          className="inline-grid gap-[1px] bg-slate-900 p-[1px] rounded-xs"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
        >
          {currentSnapshot.grid.map((rowArr, r) =>
            rowArr.map((cellType, c) => {
              const isStart = r === startPos.row && c === startPos.col;
              const isTarget = r === targetPos.row && c === targetPos.col;

              let bgClass = 'bg-slate-950 hover:bg-slate-800';
              if (baseGrid[r][c] === 'wall') bgClass = 'bg-slate-800 border border-slate-700';
              if (cellType === 'frontier') bgClass = 'bg-sky-600';
              if (cellType === 'visited') bgClass = 'bg-blue-700';
              if (cellType === 'path') bgClass = 'bg-amber-400';
              if (isStart) bgClass = 'bg-emerald-500 text-slate-950 font-bold';
              if (isTarget) bgClass = 'bg-rose-500 text-slate-950 font-bold';

              return (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => handleCellInteraction(r, c)}
                  onMouseEnter={() => {
                    if (isMouseDown && editMode === 'wall') {
                      handleCellInteraction(r, c);
                    }
                  }}
                  className={`w-6 h-6 flex items-center justify-center text-[10px] cursor-pointer transition-colors duration-75 ${bgClass}`}
                >
                  {isStart ? 'S' : isTarget ? 'T' : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Log Message */}
      <div className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-md text-xs">
        <Activity className="w-4 h-4 text-sky-400 shrink-0" />
        <span className="text-slate-400 font-medium">Log:</span>
        <span className="text-slate-200 font-mono">{currentSnapshot.statusText}</span>
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

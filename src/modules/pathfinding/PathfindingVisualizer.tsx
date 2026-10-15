import React, { useState, useMemo, useEffect } from 'react';
import type {
  CellType,
  PathfindingAlgorithmKey,
  TerrainType,
} from '../../types/pathfinding';
import {
  PATHFINDING_METADATA,
  createEmptyGrid,
  generateRandomMaze,
  generateRecursiveDivisionMaze,
  generateSwampCrossing,
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
  Droplets,
  Waves,
  ShieldAlert,
  Eraser,
} from 'lucide-react';

const GRID_ROWS = 18;
const GRID_COLS = 34;

type BrushMode = 'wall' | 'mud' | 'water' | 'clear' | 'start' | 'target';

export const PathfindingVisualizer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<PathfindingAlgorithmKey>('dijkstra');
  const [baseGrid, setBaseGrid] = useState<CellType[][]>(() => generateSwampCrossing(GRID_ROWS, GRID_COLS));
  const [startPos, setStartPos] = useState({ row: 8, col: 4 });
  const [targetPos, setTargetPos] = useState({ row: 8, col: 29 });
  const [brushMode, setBrushMode] = useState<BrushMode>('mud');
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

  // Grid cell interaction
  const handleCellInteraction = (row: number, col: number) => {
    if (playback.isPlaying) return;

    if (brushMode === 'start') {
      if (row === targetPos.row && col === targetPos.col) return;
      if (baseGrid[row][col] === 'wall') return;
      setStartPos({ row, col });
      setBrushMode('wall');
      return;
    }

    if (brushMode === 'target') {
      if (row === startPos.row && col === startPos.col) return;
      if (baseGrid[row][col] === 'wall') return;
      setTargetPos({ row, col });
      setBrushMode('wall');
      return;
    }

    if ((row === startPos.row && col === startPos.col) || (row === targetPos.row && col === targetPos.col)) {
      return;
    }

    setBaseGrid((prev) => {
      const next = prev.map((r) => [...r]);
      if (brushMode === 'wall') {
        next[row][col] = next[row][col] === 'wall' ? 'empty' : 'wall';
      } else if (brushMode === 'mud') {
        next[row][col] = next[row][col] === 'mud' ? 'empty' : 'mud';
      } else if (brushMode === 'water') {
        next[row][col] = next[row][col] === 'water' ? 'empty' : 'water';
      } else if (brushMode === 'clear') {
        next[row][col] = 'empty';
      }
      return next;
    });
  };

  const handleClearWalls = () => {
    setBaseGrid(createEmptyGrid(GRID_ROWS, GRID_COLS));
  };

  const handleGenerateDivisionMaze = () => {
    const maze = generateRecursiveDivisionMaze(GRID_ROWS, GRID_COLS);
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

  const handleGenerateSwampCrossing = () => {
    const maze = generateSwampCrossing(GRID_ROWS, GRID_COLS);
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
              ['dijkstra', "Dijkstra's (Weighted)"],
              ['astar', 'A* Search (Weighted)'],
              ['bfs', 'BFS (Hop Count Only)'],
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

        {/* Brush Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 font-mono">Paint:</span>
          <button
            onClick={() => setBrushMode('wall')}
            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-mono border transition-colors ${
              brushMode === 'wall'
                ? 'bg-slate-800 border-slate-500 text-white font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-slate-400" />
            <span>Wall (∞)</span>
          </button>

          <button
            onClick={() => setBrushMode('mud')}
            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-mono border transition-colors ${
              brushMode === 'mud'
                ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-400'
            }`}
          >
            <Droplets className="w-3 h-3 text-amber-500" />
            <span>Mud (Cost 3)</span>
          </button>

          <button
            onClick={() => setBrushMode('water')}
            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-mono border transition-colors ${
              brushMode === 'water'
                ? 'bg-sky-950 border-sky-500 text-sky-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-sky-400'
            }`}
          >
            <Waves className="w-3 h-3 text-sky-400" />
            <span>Water (Cost 5)</span>
          </button>

          <button
            onClick={() => setBrushMode('clear')}
            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-mono border transition-colors ${
              brushMode === 'clear'
                ? 'bg-slate-800 border-slate-400 text-white font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eraser className="w-3 h-3" />
            <span>Eraser</span>
          </button>

          <button
            onClick={() => setBrushMode('start')}
            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-mono border transition-colors ${
              brushMode === 'start'
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-emerald-400'
            }`}
          >
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>Set Start</span>
          </button>

          <button
            onClick={() => setBrushMode('target')}
            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-mono border transition-colors ${
              brushMode === 'target'
                ? 'bg-rose-950 border-rose-400 text-rose-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-400'
            }`}
          >
            <Flag className="w-3 h-3 text-rose-400" />
            <span>Set Target</span>
          </button>
        </div>
      </div>

      {/* Preset Map Templates Bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-mono">Map Presets:</span>
          <button
            onClick={handleGenerateSwampCrossing}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-sm text-amber-300 transition-colors"
          >
            <Droplets className="w-3 h-3 text-amber-400" />
            <span>Swamp Crossing (Terrain Benchmark)</span>
          </button>

          <button
            onClick={handleGenerateDivisionMaze}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-sm text-slate-300 transition-colors"
          >
            <Grid className="w-3 h-3 text-sky-400" />
            <span>Recursive Maze</span>
          </button>

          <button
            onClick={handleGenerateRandomObstacles}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-sm text-slate-300 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Random Obstacles (28%)</span>
          </button>

          <button
            onClick={handleClearWalls}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
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
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Path Length (Hops)</span>
          <span className="text-lg font-mono font-bold text-slate-200">
            {currentSnapshot.pathLength > 0 ? `${currentSnapshot.pathLength} steps` : '-'}
          </span>
        </div>
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Path Cost</span>
          <span className="text-lg font-mono font-bold text-amber-400">
            {currentSnapshot.pathCost !== undefined && currentSnapshot.pathCost > 0
              ? `${currentSnapshot.pathCost} cost units`
              : currentSnapshot.pathLength > 0
              ? `${currentSnapshot.pathLength} cost units`
              : '-'}
          </span>
        </div>
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Cost Optimization</span>
          <span
            className={`text-xs font-mono font-semibold block mt-1 ${
              metadata.weighted ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {metadata.weighted ? 'Minimizes Weighted Cost' : 'Minimizes Hop Count Only'}
          </span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-md p-3 flex flex-col items-center select-none overflow-x-auto">
        {/* Legend */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 mb-2 border-b border-slate-900 pb-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span> Start (S)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500"></span> Target (T)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-800 border border-slate-700"></span> Wall (∞)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-950/80 border border-amber-800 text-[9px] text-center font-bold text-amber-400">3</span> Mud (3)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-950/80 border border-sky-800 text-[9px] text-center font-bold text-sky-400">5</span> Water (5)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-600"></span> Frontier
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-700"></span> Visited
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-400"></span> Optimal Route
            </span>
          </div>

          <span className="text-slate-500">Click & drag to paint terrain</span>
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
              const terrainType: TerrainType = (currentSnapshot.terrain?.[r]?.[c] || baseGrid[r][c]) as TerrainType;

              let bgClass = 'bg-slate-950 hover:bg-slate-800';
              let textContent = '';

              if (terrainType === 'mud') {
                bgClass = 'bg-amber-950/60 border border-amber-900/60 text-amber-500/80';
                textContent = '3';
              } else if (terrainType === 'water') {
                bgClass = 'bg-sky-950/70 border border-sky-900/60 text-sky-400/80';
                textContent = '5';
              } else if (terrainType === 'wall') {
                bgClass = 'bg-slate-800 border border-slate-700';
              }

              if (cellType === 'frontier') {
                bgClass = 'bg-sky-600 text-white font-bold';
                textContent = '';
              }
              if (cellType === 'visited') {
                bgClass = terrainType === 'mud' ? 'bg-amber-800/80' : terrainType === 'water' ? 'bg-sky-800/80' : 'bg-blue-700';
                textContent = '';
              }
              if (cellType === 'path') {
                bgClass = 'bg-amber-400 text-slate-950 font-bold';
                textContent = '';
              }
              if (isStart) {
                bgClass = 'bg-emerald-500 text-slate-950 font-bold';
                textContent = 'S';
              }
              if (isTarget) {
                bgClass = 'bg-rose-500 text-slate-950 font-bold';
                textContent = 'T';
              }

              return (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => handleCellInteraction(r, c)}
                  onMouseEnter={() => {
                    if (isMouseDown && (brushMode === 'wall' || brushMode === 'mud' || brushMode === 'water' || brushMode === 'clear')) {
                      handleCellInteraction(r, c);
                    }
                  }}
                  className={`w-6 h-6 flex items-center justify-center text-[10px] cursor-pointer transition-colors duration-75 select-none font-mono ${bgClass}`}
                >
                  {textContent}
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

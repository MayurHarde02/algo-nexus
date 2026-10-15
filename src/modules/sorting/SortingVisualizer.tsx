import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  SORTING_METADATA,
  getSortingSnapshots,
} from './algorithms';
import type { SortingAlgorithmKey } from '../../types/sorting';
import { usePlayback } from '../../hooks/usePlayback';
import { ControlBar } from '../../components/common/ControlBar';
import { PseudocodePanel } from '../../components/pseudocode/PseudocodePanel';
import {
  Shuffle,
  TrendingUp,
  TrendingDown,
  Edit3,
  Activity,
  Sliders,
} from 'lucide-react';

function generateRandomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function generateNearlySortedArray(size: number): number[] {
  const arr = Array.from({ length: size }, (_, i) => Math.floor((i + 1) * (100 / size)));
  // Perform 2 small swaps
  for (let k = 0; k < 2; k++) {
    const idx = Math.floor(Math.random() * (size - 1));
    const temp = arr[idx];
    arr[idx] = arr[idx + 1];
    arr[idx + 1] = temp;
  }
  return arr;
}

function generateReversedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => Math.floor((size - i) * (100 / size)));
}

export const SortingVisualizer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<SortingAlgorithmKey>('bubble');
  const [arraySize, setArraySize] = useState<number>(20);
  const [baseArray, setBaseArray] = useState<number[]>(() => generateRandomArray(20));
  const [customInputStr, setCustomInputStr] = useState<string>('');
  const [customInputError, setCustomInputError] = useState<string | null>(null);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  // Generate snapshots deterministically
  const snapshots = useMemo(() => {
    return getSortingSnapshots(selectedAlgo, baseArray);
  }, [selectedAlgo, baseArray]);

  const playback = usePlayback({
    totalSteps: snapshots.length,
    initialSpeed: 160,
  });

  const { reset: resetPlayback } = playback;

  // Reset playback whenever algorithm or base array changes
  useEffect(() => {
    resetPlayback();
  }, [selectedAlgo, baseArray, resetPlayback]);

  const currentSnapshot = snapshots[playback.currentIndex] || snapshots[0];
  const metadata = SORTING_METADATA[selectedAlgo];

  // Handlers for input presets
  const handleGenerateRandom = useCallback(() => {
    setBaseArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleGenerateNearlySorted = useCallback(() => {
    setBaseArray(generateNearlySortedArray(arraySize));
  }, [arraySize]);

  const handleGenerateReversed = useCallback(() => {
    setBaseArray(generateReversedArray(arraySize));
  }, [arraySize]);

  const handleApplyCustomInput = () => {
    setCustomInputError(null);
    const parts = customInputStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (parts.length < 3) {
      setCustomInputError('Input array must contain at least 3 numbers.');
      return;
    }
    if (parts.length > 60) {
      setCustomInputError('Maximum supported array size is 60 items for clean visualization.');
      return;
    }

    const parsed: number[] = [];
    for (const p of parts) {
      const num = Number(p);
      if (isNaN(num) || num <= 0 || num > 500) {
        setCustomInputError(`Invalid element "${p}". Enter positive integers between 1 and 500.`);
        return;
      }
      parsed.push(num);
    }

    setBaseArray(parsed);
    setArraySize(parsed.length);
    setShowCustomModal(false);
  };

  const maxVal = useMemo(() => {
    return Math.max(...currentSnapshot.array.map((el) => el.value), 1);
  }, [currentSnapshot]);

  // Color mapping for states (NO PURPLE)
  const getBarColor = (state: string) => {
    switch (state) {
      case 'comparing':
        return 'bg-amber-400 border-amber-300 text-slate-950';
      case 'swapping':
        return 'bg-rose-500 border-rose-400 text-white';
      case 'sorted':
        return 'bg-emerald-500 border-emerald-400 text-slate-950';
      case 'pivot':
        return 'bg-sky-400 border-sky-300 text-slate-950';
      case 'auxiliary':
        return 'bg-cyan-600 border-cyan-400 text-white';
      default:
        return 'bg-slate-700 border-slate-600 text-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Config Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        {/* Algorithm Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ['bubble', 'Bubble'],
              ['insertion', 'Insertion'],
              ['selection', 'Selection'],
              ['merge', 'Merge'],
              ['quick', 'Quick'],
              ['heap', 'Heap'],
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

        {/* Array Controls & Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-sm border border-slate-800 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">N:</span>
            <input
              type="range"
              min="8"
              max="45"
              value={arraySize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setArraySize(newSize);
                setBaseArray(generateRandomArray(newSize));
              }}
              className="w-16 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
            />
            <span className="font-mono text-slate-300 w-5">{arraySize}</span>
          </div>

          <button
            onClick={handleGenerateRandom}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
            title="Generate Random Array"
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-400" />
            <span>Random</span>
          </button>

          <button
            onClick={handleGenerateNearlySorted}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
            title="Generate Nearly Sorted Array"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nearly Sorted</span>
          </button>

          <button
            onClick={handleGenerateReversed}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
            title="Generate Reversed Array"
          >
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Reversed</span>
          </button>

          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
            title="Enter Custom CSV Array"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Custom CSV</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: Bars + Pseudocode */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visualizer Canvas & Metrics (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Real Metrics HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Comparisons</span>
              <span className="text-lg font-mono font-bold text-amber-400">
                {currentSnapshot.comparisons}
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Array Writes / Swaps</span>
              <span className="text-lg font-mono font-bold text-rose-400">
                {currentSnapshot.swaps}
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Time Complexity</span>
              <span className="text-xs font-mono font-semibold text-slate-200 block mt-1">
                Avg: {metadata.timeAverage} | Worst: {metadata.timeWorst}
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Memory / Stability</span>
              <span className="text-xs font-mono font-semibold text-slate-200 block mt-1">
                Aux: {metadata.spaceComplexity} | {metadata.stability}
              </span>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="h-80 bg-slate-950 border border-slate-800 rounded-md p-4 flex flex-col justify-end relative overflow-hidden">
            {/* Legend */}
            <div className="absolute top-3 left-3 flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-sm border border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-700"></span> Unsorted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-400"></span> Comparing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span> Swapping/Writing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-sky-400"></span> Pivot
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span> Sorted
              </span>
            </div>

            {/* Bars */}
            <div className="w-full h-56 flex items-end justify-center gap-1">
              {currentSnapshot.array.map((elem, idx) => {
                const heightPercent = Math.max(8, (elem.value / maxVal) * 95);
                const colorClass = getBarColor(elem.state);
                const isDense = currentSnapshot.array.length > 25;

                return (
                  <div
                    key={elem.id}
                    className="flex-1 flex flex-col items-center justify-end h-full min-w-[6px] max-w-[40px] group relative"
                  >
                    {!isDense && (
                      <span className="text-[10px] font-mono text-slate-400 mb-1 select-none">
                        {elem.value}
                      </span>
                    )}

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-xs border-t transition-all duration-75 ${colorClass}`}
                    />

                    {!isDense && (
                      <span className="text-[9px] font-mono text-slate-500 mt-1 select-none">
                        {idx}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Log Message */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-md text-xs">
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-medium">Log:</span>
            <span className="text-slate-200 font-mono">{currentSnapshot.description}</span>
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

        {/* Pseudocode & Specification Panel (1 col) */}
        <div className="h-[520px]">
          <PseudocodePanel
            title={metadata.name}
            lines={metadata.pseudocode}
            activeLine={currentSnapshot.pseudocodeLine}
            invariants={metadata.invariants}
            description={metadata.description}
          />
        </div>
      </div>

      {/* Custom Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-md max-w-md w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-200 text-sm">Configure Custom Array</span>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                CLOSE
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Enter positive integers separated by commas. Values must be between 1 and 500.
            </p>

            <textarea
              value={customInputStr}
              onChange={(e) => setCustomInputStr(e.target.value)}
              placeholder="e.g. 52, 14, 88, 35, 9, 71, 40, 26"
              rows={3}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-400"
            />

            {customInputError && (
              <p className="text-xs text-rose-400 font-medium">{customInputError}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomInput}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-sm text-xs"
              >
                Apply Custom Array
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

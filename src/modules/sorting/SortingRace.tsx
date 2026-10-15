import React, { useState, useMemo, useEffect } from 'react';
import { SORTING_METADATA, getSortingSnapshots } from './algorithms';
import type { SortingAlgorithmKey } from '../../types/sorting';
import { Play, Pause, RotateCcw, Shuffle, Award, CheckCircle2 } from 'lucide-react';

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

export const SortingRace: React.FC = () => {
  const [algoA, setAlgoA] = useState<SortingAlgorithmKey>('quick');
  const [algoB, setAlgoB] = useState<SortingAlgorithmKey>('bubble');
  const [arraySize, setArraySize] = useState<number>(24);
  const [baseArray, setBaseArray] = useState<number[]>(() => generateRandomArray(24));

  const [stepA, setStepA] = useState<number>(0);
  const [stepB, setStepB] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(120);

  const snapshotsA = useMemo(() => getSortingSnapshots(algoA, baseArray), [algoA, baseArray]);
  const snapshotsB = useMemo(() => getSortingSnapshots(algoB, baseArray), [algoB, baseArray]);

  const resetRace = () => {
    setIsPlaying(false);
    setStepA(0);
    setStepB(0);
  };

  useEffect(() => {
    resetRace();
  }, [algoA, algoB, baseArray]);

  // Interval execution
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setStepA((prevA) => {
        const nextA = prevA < snapshotsA.length - 1 ? prevA + 1 : prevA;
        return nextA;
      });
      setStepB((prevB) => {
        const nextB = prevB < snapshotsB.length - 1 ? prevB + 1 : prevB;
        return nextB;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed, snapshotsA.length, snapshotsB.length]);

  // Check completion
  const isAComplete = stepA >= snapshotsA.length - 1;
  const isBComplete = stepB >= snapshotsB.length - 1;

  useEffect(() => {
    if (isAComplete && isBComplete) {
      setIsPlaying(false);
    }
  }, [isAComplete, isBComplete]);

  const snapA = snapshotsA[Math.min(stepA, snapshotsA.length - 1)];
  const snapB = snapshotsB[Math.min(stepB, snapshotsB.length - 1)];

  const metaA = SORTING_METADATA[algoA];
  const metaB = SORTING_METADATA[algoB];

  const maxVal = useMemo(() => Math.max(...baseArray), [baseArray]);

  return (
    <div className="flex flex-col gap-4">
      {/* Race Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isAComplete && isBComplete}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-semibold text-xs text-slate-950 transition-colors ${
              isPlaying ? 'bg-amber-500 hover:bg-amber-400' : 'bg-sky-500 hover:bg-sky-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'PAUSE RACE' : 'START RACE'}</span>
          </button>

          <button
            onClick={resetRace}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <button
            onClick={() => setBaseArray(generateRandomArray(arraySize))}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-400" />
            <span>New Shared Seed</span>
          </button>
        </div>

        {/* Speed & Size */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Array Size:</span>
            <input
              type="range"
              min="10"
              max="35"
              value={arraySize}
              onChange={(e) => {
                const s = Number(e.target.value);
                setArraySize(s);
                setBaseArray(generateRandomArray(s));
              }}
              className="w-16 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
            />
            <span className="font-mono text-slate-300">{arraySize}</span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <span className="text-slate-400">Interval:</span>
            <input
              type="range"
              min="30"
              max="400"
              step="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
            />
            <span className="font-mono text-slate-300">{speed}ms</span>
          </div>
        </div>
      </div>

      {/* Synchronized Side-by-Side Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Track A */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                TRACK A:
              </span>
              <select
                value={algoA}
                onChange={(e) => setAlgoA(e.target.value as SortingAlgorithmKey)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded-sm focus:outline-none focus:border-sky-400"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort (Lomuto)</option>
                <option value="heap">Heap Sort</option>
              </select>
            </div>
            {isAComplete && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-sm border border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> FINISHED
              </span>
            )}
          </div>

          {/* Real Metrics Track A */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-sm">
              <span className="text-[10px] text-slate-400 uppercase block">Comparisons</span>
              <span className="text-sm font-mono font-bold text-amber-400">{snapA.comparisons}</span>
            </div>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-sm">
              <span className="text-[10px] text-slate-400 uppercase block">Writes/Swaps</span>
              <span className="text-sm font-mono font-bold text-rose-400">{snapA.swaps}</span>
            </div>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-sm">
              <span className="text-[10px] text-slate-400 uppercase block">Total Steps</span>
              <span className="text-sm font-mono font-bold text-sky-400">
                {stepA + 1} / {snapshotsA.length}
              </span>
            </div>
          </div>

          {/* Bars Canvas A */}
          <div className="h-56 bg-slate-950 border border-slate-800 rounded-sm p-3 flex items-end justify-center gap-1">
            {snapA.array.map((el) => {
              const h = Math.max(8, (el.value / maxVal) * 95);
              const color =
                el.state === 'comparing'
                  ? 'bg-amber-400'
                  : el.state === 'swapping'
                  ? 'bg-rose-500'
                  : el.state === 'sorted'
                  ? 'bg-emerald-500'
                  : el.state === 'pivot'
                  ? 'bg-sky-400'
                  : 'bg-slate-700';

              return (
                <div
                  key={el.id}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-xs transition-all duration-75 ${color}`}
                />
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-400 truncate">
            {snapA.description}
          </div>
        </div>

        {/* Track B */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                TRACK B:
              </span>
              <select
                value={algoB}
                onChange={(e) => setAlgoB(e.target.value as SortingAlgorithmKey)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded-sm focus:outline-none focus:border-sky-400"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort (Lomuto)</option>
                <option value="heap">Heap Sort</option>
              </select>
            </div>
            {isBComplete && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-sm border border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> FINISHED
              </span>
            )}
          </div>

          {/* Real Metrics Track B */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-sm">
              <span className="text-[10px] text-slate-400 uppercase block">Comparisons</span>
              <span className="text-sm font-mono font-bold text-amber-400">{snapB.comparisons}</span>
            </div>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-sm">
              <span className="text-[10px] text-slate-400 uppercase block">Writes/Swaps</span>
              <span className="text-sm font-mono font-bold text-rose-400">{snapB.swaps}</span>
            </div>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-sm">
              <span className="text-[10px] text-slate-400 uppercase block">Total Steps</span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {stepB + 1} / {snapshotsB.length}
              </span>
            </div>
          </div>

          {/* Bars Canvas B */}
          <div className="h-56 bg-slate-950 border border-slate-800 rounded-sm p-3 flex items-end justify-center gap-1">
            {snapB.array.map((el) => {
              const h = Math.max(8, (el.value / maxVal) * 95);
              const color =
                el.state === 'comparing'
                  ? 'bg-amber-400'
                  : el.state === 'swapping'
                  ? 'bg-rose-500'
                  : el.state === 'sorted'
                  ? 'bg-emerald-500'
                  : el.state === 'pivot'
                  ? 'bg-sky-400'
                  : 'bg-slate-700';

              return (
                <div
                  key={el.id}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-xs transition-all duration-75 ${color}`}
                />
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-400 truncate">
            {snapB.description}
          </div>
        </div>
      </div>

      {/* Comparative Analytical Summary */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono space-y-1">
        <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4 text-sky-400" />
          <span>Empirical Operation Delta:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-400">
          <div>
            Total Step Difference:{' '}
            <span className="text-slate-200 font-bold">
              {Math.abs(snapshotsA.length - snapshotsB.length)} steps
            </span>{' '}
            ({snapshotsA.length < snapshotsB.length ? metaA.name : metaB.name} required fewer logical transitions).
          </div>
          <div>
            Comparison Ratio:{' '}
            <span className="text-slate-200 font-bold">
              {snapA.comparisons} vs {snapB.comparisons}
            </span>
            .
          </div>
          <div>
            Writes/Swaps Ratio:{' '}
            <span className="text-slate-200 font-bold">
              {snapA.swaps} vs {snapB.swaps}
            </span>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

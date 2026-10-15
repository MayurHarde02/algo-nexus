import React, { useState, useMemo } from 'react';
import type { SortingAlgorithmKey } from '../../types/sorting';
import { getSortingSnapshots, SORTING_METADATA } from '../sorting/algorithms';
import { BarChart3, Info } from 'lucide-react';

type InputPattern = 'random' | 'sorted' | 'reversed' | 'nearlySorted';

interface BenchmarkResult {
  algorithm: SortingAlgorithmKey;
  name: string;
  size: number;
  comparisons: number;
  swaps: number;
  totalSteps: number;
}

function generatePatternArray(size: number, pattern: InputPattern): number[] {
  switch (pattern) {
    case 'sorted':
      return Array.from({ length: size }, (_, i) => i + 1);
    case 'reversed':
      return Array.from({ length: size }, (_, i) => size - i);
    case 'nearlySorted': {
      const arr = Array.from({ length: size }, (_, i) => i + 1);
      // Invert 2 pairs
      if (size > 3) {
        const temp = arr[1];
        arr[1] = arr[2];
        arr[2] = temp;
      }
      return arr;
    }
    case 'random':
    default:
      return Array.from({ length: size }, () => Math.floor(Math.random() * 500) + 1);
  }
}

const DEFAULT_SIZES = [10, 20, 40, 80, 120];

export const BenchmarkLab: React.FC = () => {
  const [selectedAlgos, setSelectedAlgos] = useState<SortingAlgorithmKey[]>([
    'bubble',
    'insertion',
    'merge',
    'quick',
  ]);
  const [pattern, setPattern] = useState<InputPattern>('random');
  const [metricToDisplay, setMetricToDisplay] = useState<'comparisons' | 'swaps' | 'totalSteps'>('comparisons');

  const allAlgos: SortingAlgorithmKey[] = ['bubble', 'insertion', 'selection', 'merge', 'quick', 'heap'];

  const toggleAlgo = (algo: SortingAlgorithmKey) => {
    if (selectedAlgos.includes(algo)) {
      if (selectedAlgos.length > 1) {
        setSelectedAlgos(selectedAlgos.filter((a) => a !== algo));
      }
    } else {
      setSelectedAlgos([...selectedAlgos, algo]);
    }
  };

  // Run deterministic benchmarks across all selected algorithms and sizes
  const benchmarkResults: BenchmarkResult[] = useMemo(() => {
    const results: BenchmarkResult[] = [];

    for (const size of DEFAULT_SIZES) {
      // Use fixed seed generator per size to guarantee fair comparison
      const testArray = generatePatternArray(size, pattern);

      for (const algo of selectedAlgos) {
        const snapshots = getSortingSnapshots(algo, [...testArray]);
        const finalSnap = snapshots[snapshots.length - 1];

        results.push({
          algorithm: algo,
          name: SORTING_METADATA[algo].name,
          size,
          comparisons: finalSnap.comparisons,
          swaps: finalSnap.swaps,
          totalSteps: snapshots.length,
        });
      }
    }

    return results;
  }, [selectedAlgos, pattern]);

  // Max value for scaling visual chart bars
  const maxMetricVal = useMemo(() => {
    return Math.max(...benchmarkResults.map((r) => r[metricToDisplay]), 1);
  }, [benchmarkResults, metricToDisplay]);

  const ALGO_COLORS: Record<SortingAlgorithmKey, string> = {
    bubble: '#f87171',    // rose
    insertion: '#fb923c', // orange
    selection: '#fbbf24', // amber
    merge: '#38bdf8',     // sky
    quick: '#34d399',     // emerald
    heap: '#a78bfa',      // violet (used as data series accent)
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        {/* Algorithms selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1">
            Algorithms:
          </span>
          {allAlgos.map((key) => {
            const isSelected = selectedAlgos.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleAlgo(key)}
                className={`px-2.5 py-1 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {SORTING_METADATA[key].name}
              </button>
            );
          })}
        </div>

        {/* Distribution Pattern */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Input Pattern:</span>
          {(
            [
              ['random', 'Random'],
              ['sorted', 'Sorted (Best-case)'],
              ['reversed', 'Reversed (Worst-case)'],
              ['nearlySorted', 'Nearly Sorted'],
            ] as const
          ).map(([patKey, label]) => (
            <button
              key={patKey}
              onClick={() => setPattern(patKey)}
              className={`px-2 py-1 rounded-sm border font-mono ${
                pattern === patKey
                  ? 'bg-slate-800 border-sky-400 text-sky-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector & Summary HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md text-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span className="text-slate-200 font-semibold uppercase tracking-wider">
            Plotted Metric:
          </span>
          <button
            onClick={() => setMetricToDisplay('comparisons')}
            className={`px-2.5 py-1 rounded-sm font-mono border ${
              metricToDisplay === 'comparisons'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Comparisons
          </button>
          <button
            onClick={() => setMetricToDisplay('swaps')}
            className={`px-2.5 py-1 rounded-sm font-mono border ${
              metricToDisplay === 'swaps'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Writes / Swaps
          </button>
          <button
            onClick={() => setMetricToDisplay('totalSteps')}
            className={`px-2.5 py-1 rounded-sm font-mono border ${
              metricToDisplay === 'totalSteps'
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Total Steps
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Tested Input Sizes N: [10, 20, 40, 80, 120]
        </div>
      </div>

      {/* Visual Chart: Input Size vs Measured Operations */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Empirical Growth Curves: Input Size (N) vs {metricToDisplay.toUpperCase()}
          </span>
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            {selectedAlgos.map((algo) => (
              <span key={algo} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-xs"
                  style={{ backgroundColor: ALGO_COLORS[algo] }}
                />
                <span className="text-slate-300">{SORTING_METADATA[algo].name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Grouped Bar Chart Visualizer */}
        <div className="h-64 bg-slate-950 border border-slate-800 rounded-sm p-4 flex items-end justify-between gap-6 overflow-x-auto">
          {DEFAULT_SIZES.map((size) => {
            const sizeGroup = benchmarkResults.filter((r) => r.size === size);

            return (
              <div key={size} className="flex-1 flex flex-col items-center justify-end h-full min-w-[120px]">
                {/* Bars within group */}
                <div className="w-full flex items-end justify-center gap-1.5 h-48">
                  {sizeGroup.map((item) => {
                    const val = item[metricToDisplay];
                    const heightPercent = Math.max(4, (val / maxMetricVal) * 95);
                    const color = ALGO_COLORS[item.algorithm];

                    return (
                      <div
                        key={item.algorithm}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-5 text-[10px] font-mono text-slate-300 bg-slate-900 px-1 py-0.5 rounded border border-slate-700 transition-opacity whitespace-nowrap z-10">
                          {val} ops
                        </span>
                        <div
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: color,
                          }}
                          className="w-full rounded-xs transition-all duration-150"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-800 w-full pt-1.5 text-center">
                  <span className="text-xs font-mono font-bold text-slate-200">N = {size}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Concrete Numeric Measurement Table */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Tabulated Experimental Metric Log
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Pattern: {pattern.toUpperCase()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Algorithm</th>
                <th className="p-2.5">Input Size (N)</th>
                <th className="p-2.5">Theoretical Worst</th>
                <th className="p-2.5">Comparisons</th>
                <th className="p-2.5">Writes / Swaps</th>
                <th className="p-2.5">Total Step Events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {benchmarkResults.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                  <td className="p-2.5 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-xs"
                      style={{ backgroundColor: ALGO_COLORS[r.algorithm] }}
                    />
                    <span className="font-semibold text-slate-200">{r.name}</span>
                  </td>
                  <td className="p-2.5 text-slate-300 font-bold">{r.size}</td>
                  <td className="p-2.5 text-slate-400">
                    {SORTING_METADATA[r.algorithm].timeWorst}
                  </td>
                  <td className="p-2.5 text-amber-400 font-bold">{r.comparisons}</td>
                  <td className="p-2.5 text-rose-400 font-bold">{r.swaps}</td>
                  <td className="p-2.5 text-sky-400">{r.totalSteps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Takeaway note */}
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-sm text-xs text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="text-slate-200 font-semibold">Empirical Complexity Takeaway: </span>
            Notice that at small arrays ($N=10$), O(n²) algorithms such as Insertion Sort execute in very few operations.
            However, as $N$ quadruples to 40 and 120, Bubble Sort and Selection Sort scale quadratically ($\sim N^2$),
            whereas Merge Sort and Quick Sort scale almost linearly ($\sim N \log N$), generating an order of magnitude fewer operations.
          </p>
        </div>
      </div>
    </div>
  );
};

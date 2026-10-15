import React, { useState, useMemo } from 'react';
import { Table } from 'lucide-react';
import { usePlayback } from '../../hooks/usePlayback';
import { ControlBar } from '../../components/common/ControlBar';

type DpAlgorithm = 'knapsack' | 'lcs';

interface KnapsackItem {
  id: string;
  name: string;
  weight: number;
  value: number;
}

interface DpSnapshot {
  matrix: (number | null)[][];
  currentCell: { r: number; c: number } | null;
  depCells: { r: number; c: number }[];
  description: string;
  optimalItems?: string[];
  optimalString?: string;
}

export const DynamicProgrammingWorkbench: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<DpAlgorithm>('knapsack');

  // Knapsack inputs
  const [capacity, setCapacity] = useState<number>(7);
  const [items] = useState<KnapsackItem[]>([
    { id: '1', name: 'Item 1', weight: 1, value: 1 },
    { id: '2', name: 'Item 2', weight: 3, value: 4 },
    { id: '3', name: 'Item 3', weight: 4, value: 5 },
    { id: '4', name: 'Item 4', weight: 5, value: 7 },
  ]);

  // LCS inputs
  const [str1, setStr1] = useState<string>('AGGTAB');
  const [str2, setStr2] = useState<string>('GXTXAYB');

  // Generate snapshots for Knapsack
  const knapsackSnapshots: DpSnapshot[] = useMemo(() => {
    const n = items.length;
    const W = capacity;
    const dp: (number | null)[][] = Array.from({ length: n + 1 }, () => Array(W + 1).fill(null));
    const snapshots: DpSnapshot[] = [];

    // Base row initialization
    for (let w = 0; w <= W; w++) {
      dp[0][w] = 0;
    }
    snapshots.push({
      matrix: dp.map((row) => [...row]),
      currentCell: null,
      depCells: [],
      description: 'Base case initialized: With 0 items available, maximum value is 0 for all capacities.',
    });

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      for (let w = 0; w <= W; w++) {
        const depCells: { r: number; c: number }[] = [{ r: i - 1, c: w }];
        let chosenVal = dp[i - 1][w]!;
        let reason = `Weight ${item.weight} > capacity ${w}. Must exclude ${item.name}. Value remains ${chosenVal}.`;

        if (item.weight <= w) {
          depCells.push({ r: i - 1, c: w - item.weight });
          const includeVal = dp[i - 1][w - item.weight]! + item.value;
          const excludeVal = dp[i - 1][w]!;

          if (includeVal > excludeVal) {
            chosenVal = includeVal;
            reason = `Include ${item.name} (${item.value} + DP[${i - 1}][${w - item.weight}]) > Exclude (${excludeVal}). DP[${i}][${w}] = ${chosenVal}.`;
          } else {
            chosenVal = excludeVal;
            reason = `Exclude ${item.name} (${excludeVal}) >= Include (${includeVal}). DP[${i}][${w}] = ${chosenVal}.`;
          }
        }

        dp[i][w] = chosenVal;

        snapshots.push({
          matrix: dp.map((row) => [...row]),
          currentCell: { r: i, c: w },
          depCells,
          description: `Evaluating DP[${i}][${w}] for ${item.name} (w=${item.weight}, v=${item.value}): ${reason}`,
        });
      }
    }

    // Backtrack to find chosen items
    let curW = W;
    const chosen: string[] = [];
    for (let i = n; i > 0 && curW > 0; i--) {
      if (dp[i][curW] !== dp[i - 1][curW]) {
        chosen.push(items[i - 1].name);
        curW -= items[i - 1].weight;
      }
    }

    snapshots.push({
      matrix: dp.map((row) => [...row]),
      currentCell: { r: n, c: W },
      depCells: [],
      description: `Optimal solution found. Maximum Value: ${dp[n][W]}. Selected Subset: [${chosen.reverse().join(', ')}].`,
      optimalItems: chosen,
    });

    return snapshots;
  }, [items, capacity]);

  // Generate snapshots for LCS
  const lcsSnapshots: DpSnapshot[] = useMemo(() => {
    const m = str1.length;
    const n = str2.length;
    const L: (number | null)[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
    const snapshots: DpSnapshot[] = [];

    for (let i = 0; i <= m; i++) L[i][0] = 0;
    for (let j = 0; j <= n; j++) L[0][j] = 0;

    snapshots.push({
      matrix: L.map((row) => [...row]),
      currentCell: null,
      depCells: [],
      description: 'Initialized boundary row 0 and column 0 with 0 (empty string comparison base case).',
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = str1[i - 1];
        const char2 = str2[j - 1];
        const isMatch = char1 === char2;
        const depCells: { r: number; c: number }[] = [];
        let val = 0;
        let reason = '';

        if (isMatch) {
          depCells.push({ r: i - 1, c: j - 1 });
          val = L[i - 1][j - 1]! + 1;
          reason = `Match detected '${char1}' == '${char2}'. Increment diagonal cell: L[${i - 1}][${j - 1}] + 1 = ${val}.`;
        } else {
          depCells.push({ r: i - 1, c: j });
          depCells.push({ r: i, c: j - 1 });
          const up = L[i - 1][j]!;
          const left = L[i][j - 1]!;
          val = Math.max(up, left);
          reason = `Mismatch '${char1}' != '${char2}'. Max of Top (${up}) and Left (${left}) = ${val}.`;
        }

        L[i][j] = val;

        snapshots.push({
          matrix: L.map((row) => [...row]),
          currentCell: { r: i, c: j },
          depCells,
          description: `L[${i}][${j}] (char1 '${char1}', char2 '${char2}'): ${reason}`,
        });
      }
    }

    // Backtrack string
    let i = m;
    let j = n;
    const lcsChars: string[] = [];
    while (i > 0 && j > 0) {
      if (str1[i - 1] === str2[j - 1]) {
        lcsChars.push(str1[i - 1]);
        i--;
        j--;
      } else if (L[i - 1][j]! > L[i][j - 1]!) {
        i--;
      } else {
        j--;
      }
    }
    const lcsStr = lcsChars.reverse().join('');

    snapshots.push({
      matrix: L.map((row) => [...row]),
      currentCell: { r: m, c: n },
      depCells: [],
      description: `LCS Complete. Length = ${L[m][n]}. Recovered Sequence: "${lcsStr}".`,
      optimalString: lcsStr,
    });

    return snapshots;
  }, [str1, str2]);

  const activeSnapshots = selectedAlgo === 'knapsack' ? knapsackSnapshots : lcsSnapshots;

  const playback = usePlayback({
    totalSteps: activeSnapshots.length,
    initialSpeed: 100,
    enableKeyboardShortcuts: true,
  });

  const snap = activeSnapshots[playback.currentIndex] || activeSnapshots[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              setSelectedAlgo('knapsack');
              playback.reset();
            }}
            className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
              selectedAlgo === 'knapsack'
                ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            0/1 Knapsack Problem
          </button>
          <button
            onClick={() => {
              setSelectedAlgo('lcs');
              playback.reset();
            }}
            className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
              selectedAlgo === 'lcs'
                ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Longest Common Subsequence (LCS)
          </button>
        </div>

        {/* Dynamic Inputs */}
        {selectedAlgo === 'knapsack' ? (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Capacity W:</span>
            <input
              type="number"
              min="3"
              max="12"
              value={capacity}
              onChange={(e) => setCapacity(Math.max(3, Math.min(12, Number(e.target.value))))}
              className="w-12 bg-slate-950 border border-slate-700 text-center text-slate-200 rounded p-1"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">S1:</span>
            <input
              type="text"
              value={str1}
              onChange={(e) => setStr1(e.target.value.toUpperCase())}
              className="w-20 bg-slate-950 border border-slate-700 text-center text-slate-200 rounded p-1"
            />
            <span className="text-slate-400">S2:</span>
            <input
              type="text"
              value={str2}
              onChange={(e) => setStr2(e.target.value.toUpperCase())}
              className="w-20 bg-slate-950 border border-slate-700 text-center text-slate-200 rounded p-1"
            />
          </div>
        )}
      </div>

      {/* Main 2D Tableau Grid */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              2D Memoization Matrix (Bottom-Up DP Tableau)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400"></span> Active Cell
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-sky-400"></span> Subproblem Inputs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-800"></span> Memoized
            </span>
          </div>
        </div>

        {/* Matrix Visualization */}
        <div className="overflow-x-auto bg-slate-950 p-3 rounded-sm border border-slate-800">
          <table className="text-center text-xs font-mono border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-slate-800 bg-slate-900 text-slate-400">
                  {selectedAlgo === 'knapsack' ? 'Item \\ Cap' : 'S1 \\ S2'}
                </th>
                {selectedAlgo === 'knapsack'
                  ? Array.from({ length: capacity + 1 }, (_, w) => (
                      <th key={w} className="p-2 border border-slate-800 bg-slate-900 text-slate-300 w-12">
                        w={w}
                      </th>
                    ))
                  : Array.from({ length: str2.length + 1 }, (_, j) => (
                      <th key={j} className="p-2 border border-slate-800 bg-slate-900 text-slate-300 w-12">
                        {j === 0 ? 'Ø' : str2[j - 1]}
                      </th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {snap.matrix.map((row, r) => (
                <tr key={r}>
                  <td className="p-2 border border-slate-800 bg-slate-900 text-slate-300 font-semibold whitespace-nowrap text-left px-3">
                    {selectedAlgo === 'knapsack'
                      ? r === 0
                        ? '0 (Base)'
                        : `${items[r - 1].name} (w=${items[r - 1].weight}, v=${items[r - 1].value})`
                      : r === 0
                      ? 'Ø (Base)'
                      : `${str1[r - 1]} (idx ${r})`}
                  </td>

                  {row.map((val, c) => {
                    const isActive = snap.currentCell?.r === r && snap.currentCell?.c === c;
                    const isDep = snap.depCells.some((dep) => dep.r === r && dep.c === c);

                    let bgClass = 'bg-slate-950 text-slate-300 border-slate-850';
                    if (val === null) {
                      bgClass = 'bg-slate-950/40 text-slate-600 border-slate-900';
                    } else if (isActive) {
                      bgClass = 'bg-amber-400 text-slate-950 font-bold border-amber-300';
                    } else if (isDep) {
                      bgClass = 'bg-sky-950 border-sky-400 text-sky-200 font-bold';
                    }

                    return (
                      <td
                        key={c}
                        className={`p-2 border border-slate-800 font-mono transition-colors ${bgClass}`}
                      >
                        {val !== null ? val : '·'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Log / Plain English Step Explanation */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm text-xs font-mono text-slate-200">
          <span className="text-slate-400 font-semibold uppercase block text-[10px] mb-1">
            Memoization Step Reason:
          </span>
          <p className="leading-relaxed font-sans text-slate-300">{snap.description}</p>
        </div>

        {/* Playback Controls */}
        <ControlBar
          isPlaying={playback.isPlaying}
          currentIndex={playback.currentIndex}
          totalSteps={activeSnapshots.length}
          speed={playback.speed}
          onPlayToggle={playback.togglePlay}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onReset={playback.reset}
          onSpeedChange={playback.setSpeed}
          onJumpTo={playback.jumpTo}
          onJumpToEnd={playback.jumpToEnd}
        />
      </div>
    </div>
  );
};

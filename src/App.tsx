import { useState } from 'react';
import { Navbar, type ActiveTab } from './components/layout/Navbar';
import { SortingVisualizer } from './modules/sorting/SortingVisualizer';
import { SortingRace } from './modules/sorting/SortingRace';
import { PathfindingVisualizer } from './modules/pathfinding/PathfindingVisualizer';
import { SchedulingVisualizer } from './modules/scheduling/SchedulingVisualizer';
import { GraphVisualizer } from './modules/graph/GraphVisualizer';
import { ComplexityReference } from './modules/reference/ComplexityReference';
import { Terminal } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sorting');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Module Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              {activeTab === 'sorting' && 'Module 1: Sorting Arena and Memory Invariants'}
              {activeTab === 'race' && 'Module 2: Algorithm Race and Comparative Benchmarking'}
              {activeTab === 'pathfinding' && 'Module 3: 2D Grid Pathfinding and Heuristic Search'}
              {activeTab === 'scheduling' && 'Module 4: Operating System CPU Scheduling Simulator'}
              {activeTab === 'graph' && 'Module 5: Node-Link Graph Traversal and Frontier Explorer'}
              {activeTab === 'reference' && 'Module 6: Asymptotic Big-O Complexity and Invariant Reference'}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {activeTab === 'sorting' && 'Deterministic step execution, array operation counters, and pseudocode tracking.'}
              {activeTab === 'race' && 'Synchronous side-by-side execution on identical array seeds to evaluate operation divergence.'}
              {activeTab === 'pathfinding' && 'Interactive maze generation and traversal via FIFO, LIFO, and greedy heuristics.'}
              {activeTab === 'scheduling' && 'Mathematical verification of CT, TAT = CT - AT, and WT = TAT - BT on interactive Gantt timeline.'}
              {activeTab === 'graph' && 'Adjacency list exploration with live inspection of FIFO queue and LIFO stack memory.'}
              {activeTab === 'reference' && 'Comprehensive theoretical bounds matrix across sorting, graph, and operating system algorithms.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-xs">
              REACT + TS + VITE
            </span>
          </div>
        </div>

        {/* Active Module Content */}
        <div className="flex-1">
          {activeTab === 'sorting' && <SortingVisualizer />}
          {activeTab === 'race' && <SortingRace />}
          {activeTab === 'pathfinding' && <PathfindingVisualizer />}
          {activeTab === 'scheduling' && <SchedulingVisualizer />}
          {activeTab === 'graph' && <GraphVisualizer />}
          {activeTab === 'reference' && <ComplexityReference />}
        </div>
      </main>

      {/* Academic Engineering Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">ALGO NEXUS</span>
            <span>|</span>
            <span>Computer Engineering / Data Structures & Algorithms</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Deterministic Event Model</span>
            <span>•</span>
            <span>Asymptotic Verification</span>
            <span>•</span>
            <span>Client-Side Local Storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

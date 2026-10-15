import { useState } from 'react';
import { Navbar, type ActiveTab } from './components/layout/Navbar';
import { SortingVisualizer } from './modules/sorting/SortingVisualizer';
import { SortingRace } from './modules/sorting/SortingRace';
import { BenchmarkLab } from './modules/benchmark/BenchmarkLab';
import { DataStructuresLab } from './modules/datastructures/DataStructuresLab';
import { ChallengeMode } from './modules/challenge/ChallengeMode';
import { DynamicProgrammingWorkbench } from './modules/dp/DynamicProgrammingWorkbench';
import { PathfindingVisualizer } from './modules/pathfinding/PathfindingVisualizer';
import { SchedulingVisualizer } from './modules/scheduling/SchedulingVisualizer';
import { GraphVisualizer } from './modules/graph/GraphVisualizer';
import { PseudocodeSandbox } from './modules/sandbox/PseudocodeSandbox';
import { ComplexityReference } from './modules/reference/ComplexityReference';
import { ExportReportModal } from './components/experiments/ExportReportModal';
import { Terminal, Share2, Check } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('tab');
      const validTabs: ActiveTab[] = [
        'sorting',
        'race',
        'benchmark',
        'datastructures',
        'challenge',
        'dp',
        'pathfinding',
        'scheduling',
        'graph',
        'sandbox',
        'reference',
      ];
      if (param && validTabs.includes(param as ActiveTab)) {
        return param as ActiveTab;
      }
    }
    return 'sorting';
  });

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Module Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              {activeTab === 'sorting' && 'Sorting Arena'}
              {activeTab === 'race' && 'Algorithm Race'}
              {activeTab === 'benchmark' && 'Benchmark Lab'}
              {activeTab === 'datastructures' && 'Data Structures Lab'}
              {activeTab === 'challenge' && 'Challenge Mode'}
              {activeTab === 'dp' && 'Dynamic Programming Workbench'}
              {activeTab === 'pathfinding' && 'Pathfinding Lab'}
              {activeTab === 'scheduling' && 'CPU Scheduler'}
              {activeTab === 'graph' && 'Graph & Network Explorer'}
              {activeTab === 'sandbox' && 'Pseudocode Sandbox (AST VM)'}
              {activeTab === 'reference' && 'Complexity Matrix'}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {activeTab === 'sorting' && 'Deterministic step execution, register variables, and L1 hardware cache locality simulation.'}
              {activeTab === 'race' && 'Synchronous side-by-side execution on identical array seeds to evaluate operation divergence.'}
              {activeTab === 'benchmark' && 'Multi-size empirical scaling curves across random, sorted, and reverse-sorted patterns.'}
              {activeTab === 'datastructures' && 'Interactive visual manipulation of Stack, Queue, BST, AVL Trees, and Binary Min-Heap.'}
              {activeTab === 'challenge' && 'Active learning comprehension challenges with step predictions and immediate verification.'}
              {activeTab === 'dp' && '2D memoization tableaux for 0/1 Knapsack and Longest Common Subsequence with backtracking.'}
              {activeTab === 'pathfinding' && 'Multi-cost terrain traversal (mud=3, water=5, wall=inf) comparing Dijkstra, A*, and BFS.'}
              {activeTab === 'scheduling' && 'Mathematical verification of CT, TAT = CT - AT, and WT = TAT - BT on interactive Gantt timeline.'}
              {activeTab === 'graph' && "Kruskal's MST with DSU, Prim's cut-edge selection, and Bellman-Ford negative cycle detection."}
              {activeTab === 'sandbox' && 'Client-side lexer, recursive-descent parser, and deterministic VM stepping through algorithmic DSL.'}
              {activeTab === 'reference' && 'Comprehensive theoretical bounds matrix across sorting, graph, and operating system algorithms.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xs transition-colors"
              title="Copy shareable URL with current module state"
            >
              {copiedUrl ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Share2 className="w-3 h-3 text-sky-400" />
              )}
              <span>{copiedUrl ? 'Link Copied' : 'Share State'}</span>
            </button>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-xs">
              REACT + TS + VITE
            </span>
          </div>
        </div>

        {/* Active Module Content */}
        <div className="flex-1">
          {activeTab === 'sorting' && <SortingVisualizer />}
          {activeTab === 'race' && <SortingRace />}
          {activeTab === 'benchmark' && <BenchmarkLab />}
          {activeTab === 'datastructures' && <DataStructuresLab />}
          {activeTab === 'challenge' && <ChallengeMode />}
          {activeTab === 'dp' && <DynamicProgrammingWorkbench />}
          {activeTab === 'pathfinding' && <PathfindingVisualizer />}
          {activeTab === 'scheduling' && <SchedulingVisualizer />}
          {activeTab === 'graph' && <GraphVisualizer />}
          {activeTab === 'sandbox' && <PseudocodeSandbox />}
          {activeTab === 'reference' && <ComplexityReference />}
        </div>
      </main>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        activeModule={activeTab}
      />

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
            <span>Hardware Cache Locality</span>
            <span>•</span>
            <span>AST Interpreter VM</span>
            <span>•</span>
            <span>LocalStorage Persistence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

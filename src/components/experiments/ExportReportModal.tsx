import React, { useState } from 'react';
import { Copy, Download, Check, X, BookOpen } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  activeModule,
}) => {
  const [format, setFormat] = useState<'markdown' | 'latex'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const timestamp = new Date().toISOString().slice(0, 10);

  const markdownContent = `# ALGO NEXUS: Empirical Algorithm Analysis Report
**Generated Date:** ${timestamp}  
**Target Module:** ${activeModule.toUpperCase()}  
**Environment:** Deterministic Step Simulation Engine  

---

## 1. Asymptotic Complexity Reference

| Dimension | Worst-Case | Average-Case | Best-Case | Space Complexity |
|:---|:---|:---|:---|:---|
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) |
| **Quick Sort** | O(n^2) | O(n log n) | O(n log n) | O(log n) |
| **Dijkstra** | O((V + E) log V) | O((V + E) log V) | O((V + E) log V) | O(V) |
| **Kruskal MST** | O(E log E) | O(E log E) | O(E log E) | O(V) |
| **Bellman-Ford**| O(V * E) | O(V * E) | O(E) | O(V) |

---

## 2. Formal Recurrence Relation Breakdown

For divide-and-conquer recurrences of the form:
$$T(n) = a T(n/b) + f(n)$$

Applied to Quick Sort and Merge Sort:
- **Case 2 (Balanced Partition):**
  $$T(n) = 2 T(n/2) + \\Theta(n) \\implies \\Theta(n \\log n)$$
- **Worst-Case Partition (Degenerate Quick Sort):**
  $$T(n) = T(n - 1) + \\Theta(n) \\implies \\Theta(n^2)$$

---

## 3. Empirical Hardware & Operational Counters

The platform executes discrete operational tracking rather than wall-clock timers:
- **Comparisons ($C$):** Explicit pairwise value evaluations.
- **Memory Mutex Swaps ($S$):** Array buffer mutations.
- **L1 Hardware Cache:**
  - Associativity: Direct-Mapped and 2-Way Set Associative.
  - Line Size: 4 to 16 elements (32-64 bytes).
  - Empirical Miss Rate: $M / (H + M)$.
- **Graph & Terrain Traversal:**
  - Minimum Spanning Tree verification: Disjoint Set Union with rank heuristics.
  - Multi-Cost Pathfinding: Shortest path routing over weighted terrain costs (Mud = 3, Water = 5).

---
*Report exported from ALGO NEXUS Academic Suite.*
`;

  const latexContent = `% ALGO NEXUS Formal Execution Report
\\documentclass[11pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{booktabs}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{\\textbf{ALGO NEXUS: Empirical Algorithm Analysis Report}}
\\author{ALGO NEXUS Academic Workbench}
\\date{${timestamp}}

\\begin{document}
\\maketitle

\\section{Executive Complexity Summary}
\\begin{table}[h]
\\centering
\\begin{tabular}{lcccc}
\\toprule
\\textbf{Algorithm} & \\textbf{Worst-Case} & \\textbf{Average-Case} & \\textbf{Best-Case} & \\textbf{Space} \\\\
\\midrule
Merge Sort & $\\mathcal{O}(n \\log n)$ & $\\Theta(n \\log n)$ & $\\Omega(n \\log n)$ & $\\mathcal{O}(n)$ \\\\
Quick Sort & $\\mathcal{O}(n^2)$ & $\\Theta(n \\log n)$ & $\\Omega(n \\log n)$ & $\\mathcal{O}(\\log n)$ \\\\
Dijkstra & $\\mathcal{O}((V + E) \\log V)$ & $\\Theta((V + E) \\log V)$ & $\\Omega(V)$ & $\\mathcal{O}(V)$ \\\\
Kruskal MST & $\\mathcal{O}(E \\log E)$ & $\\Theta(E \\log E)$ & $\\Omega(E \\log E)$ & $\\mathcal{O}(V)$ \\\\
Bellman-Ford & $\\mathcal{O}(V \\cdot E)$ & $\\Theta(V \\cdot E)$ & $\\Omega(E)$ & $\\mathcal{O}(V)$ \\\\
\\bottomrule
\\end{tabular}
\\caption{Asymptotic bounds under the Uniform Cost Random Access Machine model.}
\\end{table}

\\section{Recurrence Relation Analysis}
Applying the Master Theorem for divide-and-conquer recurrences:
\\begin{equation}
T(n) = a T(n/b) + f(n)
\\end{equation}
For balanced partition sequences:
\\begin{equation}
T(n) = 2 T(n/2) + \\Theta(n) \\implies T(n) = \\Theta(n \\log n)
\\end{equation}

\\section{Empirical Hardware Validation}
Spatial locality is validated via L1 cache line tracking:
\\begin{equation}
\\text{Miss Rate} = \\frac{M}{H + M}
\\end{equation}
where $H$ denotes spatial/temporal cache hits and $M$ denotes line evictions.

\\end{document}
`;

  const currentText = format === 'markdown' ? markdownContent : latexContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'markdown' ? 'md' : 'tex';
    const mime = format === 'markdown' ? 'text/markdown' : 'text/plain';
    const blob = new Blob([currentText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algo-nexus-report-${activeModule}-${timestamp}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
                Academic Execution Report
              </h2>
              <p className="text-xs text-slate-400">
                Export formal asymptotic & empirical analysis in Markdown or LaTeX
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono">Format:</span>
            <button
              onClick={() => setFormat('markdown')}
              className={`px-3 py-1 rounded-sm font-mono text-xs transition-colors border ${
                format === 'markdown'
                  ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Markdown (.md)
            </button>
            <button
              onClick={() => setFormat('latex')}
              className={`px-3 py-1 rounded-sm font-mono text-xs transition-colors border ${
                format === 'latex'
                  ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              LaTeX (.tex)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-sm font-mono transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-sm font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-950/70 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all border-b border-slate-800">
          {currentText}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Ready for inclusion in publications, lecture notes, or homework submissions.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

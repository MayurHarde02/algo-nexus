import { useState } from 'react';
import { MASTER_COMPLEXITY_TABLE } from '../../lib/complexity';
import { BookOpen, Search, Filter, Info } from 'lucide-react';

export const ComplexityReference: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Sorting', 'Graph', 'Operating Systems'];

  const filtered = MASTER_COMPLEXITY_TABLE.filter((item) => {
    const matchesSearch =
      item.algorithm.toLowerCase().includes(search.toLowerCase()) ||
      item.coreMechanism.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header Context */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-md">
        <div className="flex items-center gap-2 mb-2 text-sky-400">
          <BookOpen className="w-4 h-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Asymptotic Complexity and Invariant Reference
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Theoretical bounds characterize computational growth as input size N tends toward infinity.
          Empirical step counts recorded in the interactive arenas reflect concrete machine transitions
          and must be interpreted alongside formal asymptotic growth rates.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-sm w-72">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search algorithm or mechanism..."
            className="bg-transparent text-xs text-slate-200 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-sm text-xs capitalize font-medium transition-colors border ${
                selectedCategory === cat
                  ? 'bg-sky-500/10 border-sky-400 text-sky-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Formal Complexity Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Algorithm</th>
                <th className="p-3">Category</th>
                <th className="p-3">Best Time</th>
                <th className="p-3">Average Time</th>
                <th className="p-3">Worst Time</th>
                <th className="p-3">Worst Space</th>
                <th className="p-3">Stability</th>
                <th className="p-3">In-Place</th>
                <th className="p-3">Core Operational Invariant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                  <td className="p-3 font-semibold text-slate-200">{row.algorithm}</td>
                  <td className="p-3 text-slate-400">{row.category}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{row.timeBest}</td>
                  <td className="p-3 text-sky-400 font-semibold">{row.timeAverage}</td>
                  <td className="p-3 text-amber-400 font-semibold">{row.timeWorst}</td>
                  <td className="p-3 text-slate-300 font-semibold">{row.spaceWorst}</td>
                  <td className="p-3">
                    {row.stable === true ? (
                      <span className="text-emerald-400">Stable</span>
                    ) : row.stable === false ? (
                      <span className="text-rose-400">Unstable</span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="p-3">
                    {row.inPlace === true ? (
                      <span className="text-emerald-400">Yes</span>
                    ) : row.inPlace === false ? (
                      <span className="text-rose-400">No</span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-400 font-sans text-[11px] max-w-xs">
                    {row.coreMechanism}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Footnote Note */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-slate-200 font-semibold">Engineering Note on In-Browser Timings:</span>
          <p className="leading-relaxed">
            Wall-clock timing benchmarks vary significantly based on host processor microarchitecture,
            JavaScript V8 JIT optimization thresholds, memory bus contention, and background OS scheduling.
            In accordance with project specification section 2.0, ALGO NEXUS evaluates algorithm efficiency
            through deterministic operation counters (comparisons, memory mutations, queue transitions)
            rather than machine-dependent wall-clock timers.
          </p>
        </div>
      </div>
    </div>
  );
};

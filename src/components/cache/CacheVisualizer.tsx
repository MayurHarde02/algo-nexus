import type { CacheLineState } from '../../lib/cacheSimulation';
import { Cpu, Info } from 'lucide-react';

interface CacheVisualizerProps {
  lines: CacheLineState[];
  hits: number;
  misses: number;
  hitRate: number;
  missRate: number;
  associativity: 'direct' | 'two-way';
  lastAccess?: { index: number; isHit: boolean; lineIndex: number };
}

export const CacheVisualizer: React.FC<CacheVisualizerProps> = ({
  lines,
  hits,
  misses,
  hitRate,
  missRate,
  associativity,
  lastAccess,
}) => {
  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-md overflow-hidden text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200 uppercase tracking-wider">
            L1 Data Cache Simulation ({associativity === 'direct' ? 'Direct Mapped' : '2-Way Associative'})
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-bold">Hit: {hitRate.toFixed(1)}%</span>
          <span className="text-rose-400 font-bold">Miss: {missRate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2 p-2.5 bg-slate-950/60 border-b border-slate-800 text-center">
        <div className="p-1.5 bg-slate-900 rounded-xs border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Total Accesses</span>
          <span className="text-xs font-bold text-slate-200">{hits + misses}</span>
        </div>
        <div className="p-1.5 bg-slate-900 rounded-xs border border-slate-800">
          <span className="text-[10px] text-emerald-400 uppercase block">Cache Hits</span>
          <span className="text-xs font-bold text-emerald-400">{hits}</span>
        </div>
        <div className="p-1.5 bg-slate-900 rounded-xs border border-slate-800">
          <span className="text-[10px] text-rose-400 uppercase block">Cache Misses</span>
          <span className="text-xs font-bold text-rose-400">{misses}</span>
        </div>
        <div className="p-1.5 bg-slate-900 rounded-xs border border-slate-800">
          <span className="text-[10px] text-sky-400 uppercase block">Last Access</span>
          <span className="text-xs font-bold text-sky-300">
            {lastAccess ? (
              <span>
                [{lastAccess.index}] {lastAccess.isHit ? 'HIT' : 'MISS'}
              </span>
            ) : (
              '-'
            )}
          </span>
        </div>
      </div>

      {/* Cache Lines Visual Grid */}
      <div className="p-2.5 overflow-x-auto">
        <table className="w-full text-left text-[11px] font-mono">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-1.5">Line</th>
              <th className="p-1.5">Valid</th>
              <th className="p-1.5">Tag</th>
              <th className="p-1.5">Block #</th>
              <th className="p-1.5">Cached Array Indices</th>
              <th className="p-1.5 text-right">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {lines.map((line) => {
              const isTargetLine = lastAccess?.lineIndex === line.lineIndex;
              return (
                <tr
                  key={line.lineIndex}
                  className={`transition-colors ${
                    isTargetLine
                      ? lastAccess?.isHit
                        ? 'bg-emerald-950/40 text-emerald-200'
                        : 'bg-rose-950/40 text-rose-200'
                      : 'hover:bg-slate-950/40'
                  }`}
                >
                  <td className="p-1.5 font-bold text-slate-300">Line {line.lineIndex}</td>
                  <td className="p-1.5">
                    <span
                      className={`px-1 py-0.5 rounded-xs text-[9px] font-bold ${
                        line.valid ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-950 text-slate-600'
                      }`}
                    >
                      {line.valid ? '1 (V)' : '0 (I)'}
                    </span>
                  </td>
                  <td className="p-1.5 text-slate-300">
                    {line.valid ? `0x${line.tag.toString(16).toUpperCase()}` : '-'}
                  </td>
                  <td className="p-1.5 text-slate-300">{line.valid ? line.blockNumber : '-'}</td>
                  <td className="p-1.5 text-slate-400 font-sans text-[11px]">
                    {line.valid ? `[${line.dataIndices.join(', ')}]` : '[ Empty ]'}
                  </td>
                  <td className="p-1.5 text-right">
                    {isTargetLine && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase ${
                          lastAccess.isHit ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {lastAccess.isHit ? 'HIT' : 'MISS'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Educational takeaway footnote */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="text-slate-300 font-semibold">Hardware Engineering Context: </span>
          When an algorithm accesses array index $i$, a whole cache line (4 elements) is fetched into L1 cache.
          Sequential scans (like Insertion Sort and Merge Sort) produce consecutive cache hits due to high spatial locality.
          Heap Sort, by contrast, jumps across powers of 2 ($2i + 1$), generating frequent conflict and capacity misses.
        </p>
      </div>
    </div>
  );
};

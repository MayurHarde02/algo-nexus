import React from 'react';
import { Code2, BookOpen } from 'lucide-react';

interface PseudocodePanelProps {
  title: string;
  lines: string[];
  activeLine: number;
  invariants?: string;
  description?: string;
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({
  title,
  lines,
  activeLine,
  invariants,
  description,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-md overflow-hidden text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200 uppercase tracking-wider">{title}</span>
        </div>
        <span className="text-[11px] text-slate-400">
          Line {activeLine >= 0 && activeLine < lines.length ? activeLine + 1 : '-'}/{lines.length}
        </span>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-y-auto p-2 bg-slate-950/50 space-y-0.5">
        {lines.map((line, idx) => {
          const isActive = idx === activeLine;
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 px-2 py-0.5 rounded-sm transition-colors ${
                isActive
                  ? 'bg-sky-950/70 text-sky-200 border-l-2 border-sky-400 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900/60'
              }`}
            >
              <span className="select-none text-[11px] text-slate-500 w-5 text-right font-mono">
                {idx + 1}
              </span>
              <span className="font-mono whitespace-pre flex-1 leading-relaxed">{line}</span>
            </div>
          );
        })}
      </div>

      {/* Invariants and Specifications */}
      {(invariants || description) && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2 text-slate-300 text-[11px] font-sans">
          {invariants && (
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-0.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Loop Invariant:</span>
              </div>
              <p className="text-slate-400 leading-normal pl-5">{invariants}</p>
            </div>
          )}
          {description && (
            <p className="text-slate-400 leading-normal border-t border-slate-900 pt-1 text-[11px]">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

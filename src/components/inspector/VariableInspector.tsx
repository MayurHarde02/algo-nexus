import { Cpu, HelpCircle } from 'lucide-react';

interface VariableInspectorProps {
  variables?: Record<string, string | number | boolean>;
  changedKeys?: string[];
  reasoning?: string;
  stepIndex: number;
  totalSteps: number;
}

export const VariableInspector: React.FC<VariableInspectorProps> = ({
  variables,
  changedKeys = [],
  reasoning,
  stepIndex,
  totalSteps,
}) => {
  const entries = variables ? Object.entries(variables) : [];

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-md overflow-hidden text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200 uppercase tracking-wider">
            Variable Inspector & Decision Logic
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Step {Math.min(stepIndex + 1, totalSteps)} / {Math.max(1, totalSteps)}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* Active Variables Grid */}
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-sans font-medium">
            Active Registers / Variables:
          </span>
          {entries.length === 0 ? (
            <span className="text-slate-600 text-[11px]">[ No variables tracked for initial state ]</span>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {entries.map(([key, val]) => {
                const isChanged = changedKeys.includes(key);
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-2 py-1 rounded-xs border transition-colors ${
                      isChanged
                        ? 'bg-sky-950/70 border-sky-400 text-sky-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-[11px] text-slate-400 font-semibold">{key}:</span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        isChanged ? 'text-sky-300' : 'text-slate-200'
                      }`}
                    >
                      {String(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Operational Decision Reasoning */}
        {reasoning && (
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-sm flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-sans font-semibold block">
                Decision Reasoning:
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {reasoning}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

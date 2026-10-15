import React, { useState, useMemo, useEffect } from 'react';
import { tokenize } from '../../lib/interpreter/lexer';
import { parseProgram } from '../../lib/interpreter/parser';
import { evaluateProgram } from '../../lib/interpreter/evaluator';
import { SANDBOX_PRESETS } from '../../lib/interpreter/presets';
import type { VmSnapshot } from '../../lib/interpreter/types';
import { usePlayback } from '../../hooks/usePlayback';
import { ControlBar } from '../../components/common/ControlBar';
import {
  Code2,
  Terminal,
  Activity,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const PseudocodeSandbox: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bubbleSort');
  const [sourceCode, setSourceCode] = useState<string>(
    SANDBOX_PRESETS.find((p) => p.id === 'bubbleSort')?.code || ''
  );
  const [compileError, setCompileError] = useState<string | null>(null);

  // Compile and evaluate AST into snapshots
  const snapshots: VmSnapshot[] = useMemo(() => {
    try {
      setCompileError(null);
      const tokens = tokenize(sourceCode);
      const ast = parseProgram(tokens);
      return evaluateProgram(ast, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCompileError(msg);
      return [
        {
          step: 0,
          line: 1,
          description: `Compilation error: ${msg}`,
          variables: {},
          highlightedIndices: [],
          outputLog: [],
        },
      ];
    }
  }, [sourceCode]);

  const playback = usePlayback({
    totalSteps: snapshots.length,
    initialSpeed: 300,
  });

  const { reset: resetPlayback } = playback;

  useEffect(() => {
    resetPlayback();
  }, [sourceCode, resetPlayback]);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const preset = SANDBOX_PRESETS.find((p) => p.id === id);
    if (preset) {
      setSourceCode(preset.code);
    }
  };

  const currentSnapshot = snapshots[playback.currentIndex] || snapshots[0];
  const activeLine = currentSnapshot.line;

  // Split lines for editor gutter
  const codeLines = sourceCode.split('\n');

  // Find array variable for visualizer
  const arrayVarEntry = Object.entries(currentSnapshot.variables).find(([, val]) =>
    Array.isArray(val)
  );
  const arrayName = arrayVarEntry ? arrayVarEntry[0] : null;
  const arrayValues = arrayVarEntry ? (arrayVarEntry[1] as number[]) : [];

  const activeHighlighted = currentSnapshot.highlightedIndices.find(
    (h) => h.arrayName === arrayName
  )?.indices || [];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-mono mr-1">Algorithm DSL:</span>
          {SANDBOX_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedPresetId === preset.id
                  ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs">
          {compileError ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-sm font-mono">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Compile Error</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-sm font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>AST Validated ({snapshots.length} execution steps)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Sandbox Grid: Editor & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Code Editor with Line Highlight */}
        <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono flex items-center gap-1.5 font-semibold text-slate-200">
              <Code2 className="w-4 h-4 text-sky-400" />
              AST Pseudocode Editor
            </span>
            <span className="text-[11px] text-slate-500">Live Deterministic VM</span>
          </div>

          <div className="relative flex flex-1 min-h-[360px] max-h-[460px] overflow-auto font-mono text-xs">
            {/* Line Numbers Gutter with Execution Indicator */}
            <div className="w-12 py-3 bg-slate-900/60 border-r border-slate-800 select-none text-right pr-2 text-slate-500 shrink-0">
              {codeLines.map((_, idx) => {
                const lineNum = idx + 1;
                const isExecuting = lineNum === activeLine;
                return (
                  <div
                    key={lineNum}
                    className={`h-5 leading-5 flex items-center justify-end gap-1 ${
                      isExecuting ? 'text-sky-300 font-bold' : ''
                    }`}
                  >
                    {isExecuting && <span className="text-sky-400 text-[10px]">▶</span>}
                    <span>{lineNum}</span>
                  </div>
                );
              })}
            </div>

            {/* Code Input Area with Executing Line Overlay */}
            <div className="relative flex-1">
              {/* Highlight bar for executing line */}
              <div
                className="absolute left-0 right-0 bg-sky-500/15 border-y border-sky-400/30 pointer-events-none transition-all duration-75"
                style={{
                  top: `${(activeLine - 1) * 20 + 12}px`,
                  height: '20px',
                }}
              />

              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full p-3 bg-transparent text-slate-200 font-mono text-xs leading-5 resize-none focus:outline-none"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>

          {/* Compilation Banner */}
          {compileError && (
            <div className="p-2.5 bg-rose-950/80 border-t border-rose-800 text-rose-300 font-mono text-xs">
              <span className="font-bold">Syntax/Runtime Alert: </span>
              {compileError}
            </div>
          )}
        </div>

        {/* Right: Runtime State & Visualizer */}
        <div className="flex flex-col gap-4">
          {/* Live Array Visualizer (if array variable exists) */}
          <div className="bg-slate-950 border border-slate-800 rounded-md p-4 flex flex-col gap-3 min-h-[190px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Array Mutation Inspector {arrayName && `('${arrayName}')`}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Size: {arrayValues.length} elements
              </span>
            </div>

            {arrayValues.length === 0 ? (
              <div className="m-auto text-xs text-slate-600 font-mono">
                [ No active array in current scope ]
              </div>
            ) : (
              <div className="flex items-end justify-center gap-2 h-32 pt-2">
                {arrayValues.map((val, idx) => {
                  const isHighlighted = activeHighlighted.includes(idx);
                  const maxVal = Math.max(...arrayValues.map(Math.abs), 1);
                  const heightPercent = Math.max(15, Math.min(100, (Math.abs(val) / maxVal) * 100));

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1 max-w-[48px]">
                      <span className={`text-[10px] font-mono ${isHighlighted ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                        {val}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-xs transition-all duration-150 border ${
                          isHighlighted
                            ? 'bg-amber-400 border-amber-300 shadow-sm'
                            : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                        }`}
                      />
                      <span className="text-[9px] font-mono text-slate-600">
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scope Variables Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-3 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Environment Variables (Local Scope)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto">
              {Object.entries(currentSnapshot.variables).map(([name, val]) => {
                const isArr = Array.isArray(val);
                const displayVal = isArr ? `[${val.join(', ')}]` : String(val);

                return (
                  <div
                    key={name}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xs flex flex-col"
                  >
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{name}</span>
                    <span className="text-xs font-mono font-bold text-sky-300 truncate">
                      {displayVal}
                    </span>
                  </div>
                );
              })}
              {Object.keys(currentSnapshot.variables).length === 0 && (
                <div className="col-span-full text-slate-600 text-xs font-mono py-2 text-center">
                  [ Scope uninitialized ]
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Execution Log */}
      <div className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-md text-xs">
        <Activity className="w-4 h-4 text-sky-400 shrink-0" />
        <span className="text-slate-400 font-medium">Step Log (Line {currentSnapshot.line}):</span>
        <span className="text-slate-200 font-mono">{currentSnapshot.description}</span>
      </div>

      {/* Playback Controls */}
      <ControlBar
        isPlaying={playback.isPlaying}
        currentIndex={playback.currentIndex}
        totalSteps={snapshots.length}
        speed={playback.speed}
        onPlayToggle={playback.togglePlay}
        onStepForward={playback.stepForward}
        onStepBackward={playback.stepBackward}
        onReset={playback.reset}
        onSpeedChange={playback.setSpeed}
        onJumpTo={playback.jumpTo}
      />
    </div>
  );
};

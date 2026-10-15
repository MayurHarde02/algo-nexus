import React from 'react';
import { Play, Pause, RotateCcw, StepBack, StepForward, FastForward, Gauge } from 'lucide-react';

interface ControlBarProps {
  isPlaying: boolean;
  currentIndex: number;
  totalSteps: number;
  speed: number;
  onPlayToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onJumpTo?: (index: number) => void;
  onJumpToEnd?: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  currentIndex,
  totalSteps,
  speed,
  onPlayToggle,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onJumpTo,
  onJumpToEnd,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900 border border-slate-800 rounded-md text-xs">
      {/* Primary Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onPlayToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-semibold transition-colors ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
              : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
          }`}
          title="Toggle Play / Pause (Space)"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'EXECUTE'}</span>
          <span className="text-[9px] opacity-70 font-mono">[Space]</span>
        </button>

        <button
          onClick={onStepBackward}
          disabled={currentIndex <= 0 || isPlaying}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 font-medium border border-slate-700 transition-colors"
          title="Step Backward (Left Arrow)"
        >
          <StepBack className="w-3.5 h-3.5" />
          <span>BACK</span>
          <span className="text-[9px] text-slate-500 font-mono">[←]</span>
        </button>

        <button
          onClick={onStepForward}
          disabled={currentIndex >= totalSteps - 1 || isPlaying}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 font-medium border border-slate-700 transition-colors"
          title="Step Forward (Right Arrow)"
        >
          <StepForward className="w-3.5 h-3.5" />
          <span>FWD</span>
          <span className="text-[9px] text-slate-500 font-mono">[→]</span>
        </button>

        {onJumpToEnd && (
          <button
            onClick={onJumpToEnd}
            disabled={currentIndex >= totalSteps - 1 || isPlaying}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 font-medium border border-slate-700 transition-colors"
            title="Instant Finish: Jump to Final State (F)"
          >
            <FastForward className="w-3.5 h-3.5 text-sky-400" />
            <span>FINISH</span>
            <span className="text-[9px] text-slate-500 font-mono">[F]</span>
          </button>
        )}

        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition-colors"
          title="Reset Execution (R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
          <span className="text-[9px] text-slate-500 font-mono">[R]</span>
        </button>
      </div>

      {/* Progress Scrubber */}
      <div className="flex-1 min-w-[180px] flex items-center gap-3">
        <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">
          Step {Math.min(currentIndex + 1, totalSteps)} / {Math.max(1, totalSteps)}
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentIndex}
          onChange={(e) => onJumpTo?.(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
        />
      </div>

      {/* Speed Slider */}
      <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
        <Gauge className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400 font-medium text-[11px]">Interval:</span>
        <input
          type="range"
          min="20"
          max="800"
          step="20"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-24 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
        />
        <span className="text-slate-300 font-mono text-[11px] w-12 text-right">{speed}ms</span>
      </div>
    </div>
  );
};

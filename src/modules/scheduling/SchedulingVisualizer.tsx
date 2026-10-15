import { useState, useMemo } from 'react';
import type {
  CPUProcess,
  SchedulingAlgorithmKey,
} from '../../types/scheduling';
import {
  PRESET_PROCESSES,
  SCHEDULING_METADATA,
  runFCFS,
  runSJF,
  runRoundRobin,
} from './algorithms';
import { Plus, Trash2, Clock } from 'lucide-react';

const PROCESS_COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#2dd4bf', '#fb923c'];

export const SchedulingVisualizer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<SchedulingAlgorithmKey>('fcfs');
  const [processes, setProcesses] = useState<CPUProcess[]>(() => PRESET_PROCESSES.standard.processes);
  const [quantum, setQuantum] = useState<number>(3);

  // New process input states
  const [newPid, setNewPid] = useState('P5');
  const [newArrival, setNewArrival] = useState(4);
  const [newBurst, setNewBurst] = useState(6);

  // Run calculation based on selected algorithm
  const result = useMemo(() => {
    switch (selectedAlgo) {
      case 'fcfs':
        return runFCFS(processes);
      case 'sjf':
        return runSJF(processes);
      case 'rr':
        return runRoundRobin(processes, quantum);
    }
  }, [selectedAlgo, processes, quantum]);

  const metadata = SCHEDULING_METADATA[selectedAlgo];

  const handleAddProcess = () => {
    if (!newPid.trim() || newBurst <= 0 || newArrival < 0) return;
    const color = PROCESS_COLORS[processes.length % PROCESS_COLORS.length];
    const newP: CPUProcess = {
      id: `p-${Date.now()}`,
      name: newPid.trim().toUpperCase(),
      arrivalTime: Number(newArrival),
      burstTime: Number(newBurst),
      color,
    };
    setProcesses((prev) => [...prev, newP]);
    setNewPid(`P${processes.length + 2}`);
  };

  const handleDeleteProcess = (id: string) => {
    if (processes.length <= 1) return;
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLoadPreset = (key: keyof typeof PRESET_PROCESSES) => {
    setProcesses(PRESET_PROCESSES[key].processes);
  };

  // Color lookup for Gantt blocks
  const getProcessColor = (processId: string) => {
    const p = processes.find((proc) => proc.id === processId);
    return p?.color || '#94a3b8';
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Selector & Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        {/* Policy Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ['fcfs', 'FCFS (First-Come, First-Served)'],
              ['sjf', 'SJF (Shortest Job First - Non-Preemptive)'],
              ['rr', 'Round Robin (Preemptive)'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedAlgo(key)}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedAlgo === key
                  ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Presets and Quantum Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedAlgo === 'rr' && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-sm border border-slate-800 text-xs">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400">Time Quantum Q:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={quantum}
                onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
                className="w-12 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-center text-slate-200 font-mono"
              />
            </div>
          )}

          <button
            onClick={() => handleLoadPreset('standard')}
            className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
          >
            Standard Preset
          </button>
          <button
            onClick={() => handleLoadPreset('convoy')}
            className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
          >
            Convoy Effect Preset
          </button>
          <button
            onClick={() => handleLoadPreset('equalArrival')}
            className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-sm text-xs text-slate-300 transition-colors"
          >
            Simultaneous (t=0)
          </button>
        </div>
      </div>

      {/* Primary Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Avg Turnaround Time</span>
          <span className="text-lg font-mono font-bold text-sky-400">
            {result.averageTurnaroundTime} units
          </span>
        </div>
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Avg Waiting Time</span>
          <span className="text-lg font-mono font-bold text-amber-400">
            {result.averageWaitingTime} units
          </span>
        </div>
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">CPU Utilization</span>
          <span className="text-lg font-mono font-bold text-emerald-400">
            {result.cpuUtilization}%
          </span>
        </div>
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-md">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Throughput</span>
          <span className="text-lg font-mono font-bold text-slate-200">
            {result.throughput} proc/unit
          </span>
        </div>
      </div>

      {/* Gantt Chart Timeline */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Execution Timeline (Gantt Chart)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Total Elapsed Schedule: {result.totalTime} units
          </span>
        </div>

        {/* Timeline Bar */}
        <div className="w-full flex h-12 bg-slate-950 border border-slate-800 rounded-sm overflow-hidden relative">
          {result.gantt.map((block, idx) => {
            const duration = block.endTime - block.startTime;
            const widthPercent = (duration / (result.totalTime || 1)) * 100;
            const color = block.isIdle ? '#334155' : getProcessColor(block.processId);

            return (
              <div
                key={idx}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: color,
                }}
                className={`h-full border-r border-slate-950 flex flex-col items-center justify-center font-mono text-xs select-none transition-all ${
                  block.isIdle ? 'text-slate-400 opacity-60' : 'text-slate-950 font-bold'
                }`}
                title={`${block.processName}: [${block.startTime} to ${block.endTime}]`}
              >
                <span>{block.processName}</span>
                <span className="text-[10px] opacity-80">
                  {duration}u
                </span>
              </div>
            );
          })}
        </div>

        {/* Time Ticks */}
        <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
          <span>0</span>
          {result.gantt.map((block, idx) => (
            <span key={idx}>{block.endTime}</span>
          ))}
        </div>
      </div>

      {/* Data Layout: Process Table (left) & Calculated Results (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Process Configuration */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Configured Process Table
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{processes.length} Processes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">PID</th>
                  <th className="p-2">Arrival (AT)</th>
                  <th className="p-2">Burst (BT)</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {processes.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-950/50">
                    <td className="p-2 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-xs"
                        style={{ backgroundColor: p.color || '#38bdf8' }}
                      />
                      <span className="font-semibold text-slate-200">{p.name}</span>
                    </td>
                    <td className="p-2 text-slate-300">{p.arrivalTime}</td>
                    <td className="p-2 text-slate-300">{p.burstTime}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => handleDeleteProcess(p.id)}
                        disabled={processes.length <= 1}
                        className="text-slate-500 hover:text-rose-400 disabled:opacity-30"
                        title="Delete Process"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Process Inputs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={newPid}
              onChange={(e) => setNewPid(e.target.value)}
              placeholder="PID"
              className="w-16 p-1.5 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-slate-200"
            />
            <input
              type="number"
              min="0"
              value={newArrival}
              onChange={(e) => setNewArrival(Number(e.target.value))}
              placeholder="Arrival"
              className="w-20 p-1.5 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-slate-200"
            />
            <input
              type="number"
              min="1"
              value={newBurst}
              onChange={(e) => setNewBurst(Number(e.target.value))}
              placeholder="Burst"
              className="w-20 p-1.5 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-slate-200"
            />
            <button
              onClick={handleAddProcess}
              className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-sm text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Process</span>
            </button>
          </div>
        </div>

        {/* Calculated Results Table */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Mathematical Verification Table
            </span>
            <span className="text-[11px] text-slate-400 font-mono">TAT = CT - AT | WT = TAT - BT</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">PID</th>
                  <th className="p-2">Completion (CT)</th>
                  <th className="p-2">Turnaround (TAT)</th>
                  <th className="p-2">Waiting (WT)</th>
                  <th className="p-2">Response (RT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {result.processMetrics.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-950/50">
                    <td className="p-2 font-semibold text-slate-200">{m.name}</td>
                    <td className="p-2 text-slate-300">{m.completionTime}</td>
                    <td className="p-2 text-sky-400 font-bold">{m.turnaroundTime}</td>
                    <td className="p-2 text-amber-400 font-bold">{m.waitingTime}</td>
                    <td className="p-2 text-slate-300">{m.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Theoretical notes */}
          <div className="mt-auto p-2.5 bg-slate-950 border border-slate-800 rounded-sm text-[11px] text-slate-400 space-y-1">
            <div className="text-slate-300 font-medium">Policy Characteristics:</div>
            <p>{metadata.advantages}</p>
            <p className="text-slate-500">{metadata.disadvantages}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

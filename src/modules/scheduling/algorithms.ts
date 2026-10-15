import type {
  CPUProcess,
  GanttBlock,
  ProcessMetrics,
  SchedulingAlgorithmKey,
  SchedulingMetadata,
  SchedulingResult,
} from '../../types/scheduling';

export const SCHEDULING_METADATA: Record<SchedulingAlgorithmKey, SchedulingMetadata> = {
  fcfs: {
    key: 'fcfs',
    name: 'First-Come, First-Served (FCFS)',
    type: 'Non-Preemptive',
    criteria: 'Arrival Time',
    advantages: 'Simple to understand and implement using a standard FIFO queue. No starvation.',
    disadvantages:
      'Susceptible to the convoy effect: short processes wait behind lengthy CPU-intensive tasks.',
    convoyEffectRisk: true,
  },
  sjf: {
    key: 'sjf',
    name: 'Shortest Job First (SJF)',
    type: 'Non-Preemptive',
    criteria: 'Burst Time',
    advantages:
      'Proven to yield minimum average waiting time among all non-preemptive scheduling algorithms.',
    disadvantages:
      'Can cause indefinite starvation for long processes if short processes continuously arrive. Requires advance knowledge of CPU burst.',
    convoyEffectRisk: false,
  },
  rr: {
    key: 'rr',
    name: 'Round Robin (RR)',
    type: 'Preemptive',
    criteria: 'Time Quantum / Time Slice',
    advantages:
      'Fair CPU sharing designed for time-sharing systems. Excellent response time for interactive jobs.',
    disadvantages:
      'Performance heavily depends on the time quantum. Too small results in excessive context-switch overhead; too large degrades to FCFS.',
    convoyEffectRisk: false,
  },
};

export const PRESET_PROCESSES: Record<string, { label: string; processes: CPUProcess[] }> = {
  standard: {
    label: 'Standard Academic Benchmark',
    processes: [
      { id: 'p1', name: 'P1', arrivalTime: 0, burstTime: 8, color: '#38bdf8' },
      { id: 'p2', name: 'P2', arrivalTime: 1, burstTime: 4, color: '#34d399' },
      { id: 'p3', name: 'P3', arrivalTime: 2, burstTime: 9, color: '#fbbf24' },
      { id: 'p4', name: 'P4', arrivalTime: 3, burstTime: 5, color: '#f87171' },
    ],
  },
  convoy: {
    label: 'Convoy Effect Demonstration (Long Job First)',
    processes: [
      { id: 'p1', name: 'P1 (Long)', arrivalTime: 0, burstTime: 24, color: '#f87171' },
      { id: 'p2', name: 'P2 (Short)', arrivalTime: 1, burstTime: 3, color: '#38bdf8' },
      { id: 'p3', name: 'P3 (Short)', arrivalTime: 2, burstTime: 3, color: '#34d399' },
    ],
  },
  equalArrival: {
    label: 'Simultaneous Arrival (t = 0)',
    processes: [
      { id: 'p1', name: 'P1', arrivalTime: 0, burstTime: 6, color: '#38bdf8' },
      { id: 'p2', name: 'P2', arrivalTime: 0, burstTime: 2, color: '#34d399' },
      { id: 'p3', name: 'P3', arrivalTime: 0, burstTime: 8, color: '#fbbf24' },
      { id: 'p4', name: 'P4', arrivalTime: 0, burstTime: 3, color: '#f87171' },
      { id: 'p5', name: 'P5', arrivalTime: 0, burstTime: 4, color: '#a78bfa' },
    ],
  },
};

// 1. First-Come, First-Served (FCFS)
export function runFCFS(processes: CPUProcess[]): SchedulingResult {
  if (processes.length === 0) return emptyResult();

  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const gantt: GanttBlock[] = [];
  const metrics: ProcessMetrics[] = [];
  let currentTime = 0;
  let totalBusyTime = 0;

  for (const p of sorted) {
    if (currentTime < p.arrivalTime) {
      // CPU Idle interval
      gantt.push({
        processId: 'IDLE',
        processName: 'CPU Idle',
        startTime: currentTime,
        endTime: p.arrivalTime,
        isIdle: true,
      });
      currentTime = p.arrivalTime;
    }

    const start = currentTime;
    const end = currentTime + p.burstTime;
    currentTime = end;
    totalBusyTime += p.burstTime;

    gantt.push({
      processId: p.id,
      processName: p.name,
      startTime: start,
      endTime: end,
    });

    const completionTime = end;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    const responseTime = start - p.arrivalTime;

    metrics.push({
      id: p.id,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });
  }

  const totalTime = currentTime;
  const avgTAT = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) / metrics.length;
  const avgWT = metrics.reduce((acc, m) => acc + m.waitingTime, 0) / metrics.length;
  const cpuUtilization = totalTime > 0 ? (totalBusyTime / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? processes.length / totalTime : 0;

  return {
    gantt,
    processMetrics: metrics,
    averageTurnaroundTime: parseFloat(avgTAT.toFixed(2)),
    averageWaitingTime: parseFloat(avgWT.toFixed(2)),
    cpuUtilization: parseFloat(cpuUtilization.toFixed(1)),
    throughput: parseFloat(throughput.toFixed(4)),
    totalTime,
  };
}

// 2. Shortest Job First (SJF) - Non-Preemptive
export function runSJF(processes: CPUProcess[]): SchedulingResult {
  if (processes.length === 0) return emptyResult();

  const remaining = [...processes];
  const gantt: GanttBlock[] = [];
  const metrics: ProcessMetrics[] = [];
  let currentTime = 0;
  let totalBusyTime = 0;

  while (remaining.length > 0) {
    const ready = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (ready.length === 0) {
      // Find earliest arriving process
      const nextArrival = Math.min(...remaining.map((p) => p.arrivalTime));
      gantt.push({
        processId: 'IDLE',
        processName: 'CPU Idle',
        startTime: currentTime,
        endTime: nextArrival,
        isIdle: true,
      });
      currentTime = nextArrival;
      continue;
    }

    // Select process with shortest burst time (tie-break by arrival time)
    ready.sort((a, b) => {
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      return a.arrivalTime - b.arrivalTime;
    });

    const chosen = ready[0];
    const index = remaining.findIndex((p) => p.id === chosen.id);
    remaining.splice(index, 1);

    const start = currentTime;
    const end = currentTime + chosen.burstTime;
    currentTime = end;
    totalBusyTime += chosen.burstTime;

    gantt.push({
      processId: chosen.id,
      processName: chosen.name,
      startTime: start,
      endTime: end,
    });

    const completionTime = end;
    const turnaroundTime = completionTime - chosen.arrivalTime;
    const waitingTime = turnaroundTime - chosen.burstTime;
    const responseTime = start - chosen.arrivalTime;

    metrics.push({
      id: chosen.id,
      name: chosen.name,
      arrivalTime: chosen.arrivalTime,
      burstTime: chosen.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });
  }

  const totalTime = currentTime;
  const avgTAT = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) / metrics.length;
  const avgWT = metrics.reduce((acc, m) => acc + m.waitingTime, 0) / metrics.length;
  const cpuUtilization = totalTime > 0 ? (totalBusyTime / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? processes.length / totalTime : 0;

  return {
    gantt,
    processMetrics: metrics,
    averageTurnaroundTime: parseFloat(avgTAT.toFixed(2)),
    averageWaitingTime: parseFloat(avgWT.toFixed(2)),
    cpuUtilization: parseFloat(cpuUtilization.toFixed(1)),
    throughput: parseFloat(throughput.toFixed(4)),
    totalTime,
  };
}

// 3. Round Robin (RR) - Preemptive
export function runRoundRobin(processes: CPUProcess[], quantum: number): SchedulingResult {
  if (processes.length === 0 || quantum <= 0) return emptyResult();

  interface RRProcessState {
    process: CPUProcess;
    remainingBurst: number;
    completionTime: number;
    firstStartTime: number | null;
  }

  const states: Map<string, RRProcessState> = new Map(
    processes.map((p) => [
      p.id,
      {
        process: p,
        remainingBurst: p.burstTime,
        completionTime: 0,
        firstStartTime: null,
      },
    ])
  );

  const sortedArrivals = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const readyQueue: string[] = [];
  const inQueueOrCompleted = new Set<string>();
  const gantt: GanttBlock[] = [];

  let currentTime = 0;
  let totalBusyTime = 0;
  let completedCount = 0;

  // Enqueue initial processes arrived at t=0
  for (const p of sortedArrivals) {
    if (p.arrivalTime <= currentTime && !inQueueOrCompleted.has(p.id)) {
      readyQueue.push(p.id);
      inQueueOrCompleted.add(p.id);
    }
  }

  while (completedCount < processes.length) {
    if (readyQueue.length === 0) {
      const remainingUnarrived = sortedArrivals.filter((p) => !inQueueOrCompleted.has(p.id));
      if (remainingUnarrived.length > 0) {
        const nextTime = remainingUnarrived[0].arrivalTime;
        gantt.push({
          processId: 'IDLE',
          processName: 'CPU Idle',
          startTime: currentTime,
          endTime: nextTime,
          isIdle: true,
        });
        currentTime = nextTime;
        for (const p of sortedArrivals) {
          if (p.arrivalTime <= currentTime && !inQueueOrCompleted.has(p.id)) {
            readyQueue.push(p.id);
            inQueueOrCompleted.add(p.id);
          }
        }
        continue;
      } else {
        break;
      }
    }

    const currentPid = readyQueue.shift()!;
    const state = states.get(currentPid)!;

    if (state.firstStartTime === null) {
      state.firstStartTime = currentTime;
    }

    const execTime = Math.min(quantum, state.remainingBurst);
    const start = currentTime;
    const end = currentTime + execTime;

    currentTime = end;
    state.remainingBurst -= execTime;
    totalBusyTime += execTime;

    gantt.push({
      processId: state.process.id,
      processName: state.process.name,
      startTime: start,
      endTime: end,
    });

    // Check newly arrived processes during this time slice
    for (const p of sortedArrivals) {
      if (p.arrivalTime <= currentTime && !inQueueOrCompleted.has(p.id)) {
        readyQueue.push(p.id);
        inQueueOrCompleted.add(p.id);
      }
    }

    if (state.remainingBurst > 0) {
      readyQueue.push(currentPid);
    } else {
      state.completionTime = currentTime;
      completedCount++;
    }
  }

  const metrics: ProcessMetrics[] = processes.map((p) => {
    const s = states.get(p.id)!;
    const completionTime = s.completionTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    const responseTime = (s.firstStartTime ?? p.arrivalTime) - p.arrivalTime;

    return {
      id: p.id,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    };
  });

  const totalTime = currentTime;
  const avgTAT = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) / metrics.length;
  const avgWT = metrics.reduce((acc, m) => acc + m.waitingTime, 0) / metrics.length;
  const cpuUtilization = totalTime > 0 ? (totalBusyTime / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? processes.length / totalTime : 0;

  return {
    gantt,
    processMetrics: metrics,
    averageTurnaroundTime: parseFloat(avgTAT.toFixed(2)),
    averageWaitingTime: parseFloat(avgWT.toFixed(2)),
    cpuUtilization: parseFloat(cpuUtilization.toFixed(1)),
    throughput: parseFloat(throughput.toFixed(4)),
    totalTime,
  };
}

function emptyResult(): SchedulingResult {
  return {
    gantt: [],
    processMetrics: [],
    averageTurnaroundTime: 0,
    averageWaitingTime: 0,
    cpuUtilization: 0,
    throughput: 0,
    totalTime: 0,
  };
}

import { describe, it, expect } from 'vitest';
import { runFCFS, runSJF, runRoundRobin, PRESET_PROCESSES } from './algorithms';

describe('CPU Scheduling Engine Unit Tests', () => {
  const processes = PRESET_PROCESSES.standard.processes;

  it('FCFS verifies TAT = CT - AT and WT = TAT - BT for all processes', () => {
    const result = runFCFS(processes);
    expect(result.processMetrics.length).toBe(processes.length);

    for (const m of result.processMetrics) {
      expect(m.turnaroundTime).toBe(m.completionTime - m.arrivalTime);
      expect(m.waitingTime).toBe(m.turnaroundTime - m.burstTime);
      expect(m.waitingTime).toBeGreaterThanOrEqual(0);
    }
  });

  it('SJF yields lower or equal average waiting time compared to FCFS on standard benchmark', () => {
    const fcfsResult = runFCFS(processes);
    const sjfResult = runSJF(processes);

    expect(sjfResult.averageWaitingTime).toBeLessThanOrEqual(fcfsResult.averageWaitingTime);
  });

  it('Round Robin executes preemptively and verifies metrics identities', () => {
    const quantum = 3;
    const result = runRoundRobin(processes, quantum);

    expect(result.gantt.length).toBeGreaterThan(processes.length); // Multiple context switches
    for (const m of result.processMetrics) {
      expect(m.turnaroundTime).toBe(m.completionTime - m.arrivalTime);
      expect(m.waitingTime).toBe(m.turnaroundTime - m.burstTime);
      expect(m.waitingTime).toBeGreaterThanOrEqual(0);
    }
  });
});

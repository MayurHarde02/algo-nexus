import { describe, it, expect } from 'vitest';
import { runRoundRobin } from './algorithms';

describe('CPU Scheduling Advanced Edge Cases', () => {
  it('Round Robin with Q=1 handles interleaving correctly', () => {
    const processes = [
      { id: 'p1', name: 'P1', arrivalTime: 0, burstTime: 2 },
      { id: 'p2', name: 'P2', arrivalTime: 0, burstTime: 2 },
    ];
    const result = runRoundRobin(processes, 1);

    expect(result.gantt.length).toBe(4);
    expect(result.gantt.map((g) => g.processName)).toEqual(['P1', 'P2', 'P1', 'P2']);
    expect(result.totalTime).toBe(4);
    expect(result.cpuUtilization).toBe(100);
  });

  it('Round Robin handles empty process list gracefully without crashing', () => {
    const result = runRoundRobin([], 2);
    expect(result.gantt).toEqual([]);
    expect(result.processMetrics).toEqual([]);
    expect(result.totalTime).toBe(0);
  });
});

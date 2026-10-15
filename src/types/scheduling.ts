export interface CPUProcess {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  color?: string;
}

export interface ProcessMetrics {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
}

export interface GanttBlock {
  processId: string;
  processName: string;
  startTime: number;
  endTime: number;
  isIdle?: boolean;
}

export type SchedulingAlgorithmKey = 'fcfs' | 'sjf' | 'rr';

export interface SchedulingResult {
  gantt: GanttBlock[];
  processMetrics: ProcessMetrics[];
  averageTurnaroundTime: number;
  averageWaitingTime: number;
  cpuUtilization: number;
  throughput: number;
  totalTime: number;
}

export interface SchedulingMetadata {
  key: SchedulingAlgorithmKey;
  name: string;
  type: 'Preemptive' | 'Non-Preemptive';
  criteria: string;
  advantages: string;
  disadvantages: string;
  convoyEffectRisk: boolean;
}

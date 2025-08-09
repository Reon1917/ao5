export interface Solve {
  id: string;
  time: number; // in milliseconds
  scramble: string;
  penalty: 'none' | '+2' | 'DNF';
  timestamp: number;
  session: string;
}

export interface Statistics {
  ao5: number | null;
  ao12: number | null;
  best: number | null;
  worst: number | null;
  mean: number | null;
  totalSolves: number;
}

export type CubeType = '2x2' | '3x3' | '4x4' | '5x5' | '6x6' | '7x7' | 'OH' | 'BLD' | 'FMC';

export type TimerState = 'idle' | 'ready' | 'running' | 'stopped' | 'inspection';

export interface Session {
  id: string;
  name: string;
  cubeType: CubeType;
  solves: Solve[];
}

export interface TimerSettings {
  isInspectionEnabled: boolean;
  inspectionTime: number; // seconds
  isSoundEnabled: boolean;
  isHapticsEnabled: boolean;
  armDelayMs: number;
  autoNextScramble: boolean;
}

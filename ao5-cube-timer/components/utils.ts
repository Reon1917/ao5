import { Solve, Statistics } from './types';

export const formatTime = (milliseconds: number, penalty: 'none' | '+2' | 'DNF' = 'none'): string => {
  if (penalty === 'DNF') return 'DNF';
  
  const totalMs = penalty === '+2' ? milliseconds + 2000 : milliseconds;
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}${penalty === '+2' ? '+' : ''}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}${penalty === '+2' ? '+' : ''}`;
};

export const calculateStatistics = (solves: Solve[]): Statistics => {
  if (solves.length === 0) {
    return { ao5: null, ao12: null, best: null, worst: null, mean: null, totalSolves: 0 };
  }

  const validSolves = solves.filter(solve => solve.penalty !== 'DNF');
  const times = validSolves.map(solve => solve.penalty === '+2' ? solve.time + 2000 : solve.time);
  
  if (times.length === 0) {
    return { ao5: null, ao12: null, best: null, worst: null, mean: null, totalSolves: solves.length };
  }

  const best = Math.min(...times);
  const worst = Math.max(...times);
  const mean = times.reduce((sum, time) => sum + time, 0) / times.length;

  // Calculate AO5 (average of 5, removing best and worst)
  let ao5 = null;
  if (solves.length >= 5) {
    const last5 = solves.slice(-5);
    const valid5 = last5.filter(solve => solve.penalty !== 'DNF');
    if (valid5.length >= 3) { // Need at least 3 valid solves for AO5
      const times5 = valid5.map(solve => solve.penalty === '+2' ? solve.time + 2000 : solve.time);
      times5.sort((a, b) => a - b);
      if (times5.length === 5) {
        ao5 = (times5[1] + times5[2] + times5[3]) / 3; // Remove best and worst
      } else if (times5.length === 4) {
        ao5 = (times5[1] + times5[2]) / 2; // Remove best and worst
      } else {
        ao5 = times5[1]; // Only middle value
      }
    }
  }

  // Calculate AO12 (average of 12, removing best and worst)
  let ao12 = null;
  if (solves.length >= 12) {
    const last12 = solves.slice(-12);
    const valid12 = last12.filter(solve => solve.penalty !== 'DNF');
    if (valid12.length >= 10) { // Need at least 10 valid solves for AO12
      const times12 = valid12.map(solve => solve.penalty === '+2' ? solve.time + 2000 : solve.time);
      times12.sort((a, b) => a - b);
      const sum = times12.slice(1, -1).reduce((acc, time) => acc + time, 0); // Remove best and worst
      ao12 = sum / (times12.length - 2);
    }
  }

  return { ao5, ao12, best, worst, mean, totalSolves: solves.length };
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const saveToLocalStorage = (key: string, data: unknown): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultValue;
      }
    }
  }
  return defaultValue;
};

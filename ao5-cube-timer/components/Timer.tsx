'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState } from './types';
import { formatTime } from './utils';

interface TimerProps {
  onSolveComplete: (time: number) => void;
  isInspectionEnabled: boolean;
  inspectionTime: number;
  state: TimerState;
  onStateChange: (state: TimerState) => void;
}

export default function Timer({ 
  onSolveComplete, 
  isInspectionEnabled, 
  inspectionTime = 15, 
  state, 
  onStateChange 
}: TimerProps) {
  const [time, setTime] = useState(0);
  const [inspectionTimeLeft, setInspectionTimeLeft] = useState(inspectionTime);
  const startTimeRef = useRef<number>(0);
  const inspectionStartRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inspectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    onStateChange('running');
    
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  }, [onStateChange]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const finalTime = Date.now() - startTimeRef.current;
    setTime(finalTime);
    onStateChange('stopped');
    onSolveComplete(finalTime);
  }, [onSolveComplete, onStateChange]);

  const startInspection = useCallback(() => {
    onStateChange('inspection');
    setInspectionTimeLeft(inspectionTime);
    inspectionStartRef.current = Date.now();
    
    inspectionIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - inspectionStartRef.current) / 1000;
      const remaining = Math.max(0, inspectionTime - elapsed);
      setInspectionTimeLeft(remaining);
      
      if (remaining <= 0) {
        if (inspectionIntervalRef.current) {
          clearInterval(inspectionIntervalRef.current);
        }
        // Auto-start timer after inspection
        startTimer();
      }
    }, 100);
  }, [inspectionTime, onStateChange, startTimer]);

  const handleSpacePress = useCallback((event: KeyboardEvent) => {
    if (event.code !== 'Space') return;
    event.preventDefault();
    
    switch (state) {
      case 'idle':
      case 'stopped':
        if (isInspectionEnabled) {
          startInspection();
        } else {
          onStateChange('ready');
          setTime(0);
        }
        break;
      case 'ready':
        startTimer();
        break;
      case 'running':
        stopTimer();
        break;
      case 'inspection':
        if (inspectionIntervalRef.current) {
          clearInterval(inspectionIntervalRef.current);
        }
        startTimer();
        break;
    }
  }, [state, isInspectionEnabled, startInspection, startTimer, stopTimer, onStateChange]);

  const handleTouchStart = useCallback(() => {
    handleSpacePress({ code: 'Space', preventDefault: () => {} } as KeyboardEvent);
  }, [handleSpacePress]);

  useEffect(() => {
    window.addEventListener('keydown', handleSpacePress);
    return () => {
      window.removeEventListener('keydown', handleSpacePress);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (inspectionIntervalRef.current) clearInterval(inspectionIntervalRef.current);
    };
  }, [handleSpacePress]);

  const getDisplayTime = () => {
    if (state === 'inspection') {
      return Math.ceil(inspectionTimeLeft).toString();
    }
    return formatTime(time);
  };

  const getTimerColor = () => {
    if (state === 'inspection') {
      if (inspectionTimeLeft <= 3) return 'text-red-500';
      if (inspectionTimeLeft <= 8) return 'text-yellow-500';
      return 'text-blue-500';
    }
    if (state === 'ready') return 'text-green-500';
    if (state === 'running') return 'text-blue-500';
    return 'text-gray-900 dark:text-gray-100';
  };

  return (
    <div 
      className="flex flex-col items-center justify-center flex-1 select-none cursor-pointer"
      onTouchStart={handleTouchStart}
      onClick={handleTouchStart}
    >
      {state === 'inspection' && (
        <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
          Inspection
        </div>
      )}
      
      <div className={`text-8xl md:text-9xl font-mono font-bold transition-colors duration-200 ${getTimerColor()}`}>
        {getDisplayTime()}
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center max-w-md">
        {state === 'idle' || state === 'stopped' ? 
          (isInspectionEnabled ? 'Press SPACE or tap to start inspection' : 'Press SPACE or tap to get ready') :
          state === 'ready' ? 'Press SPACE or tap to start' :
          state === 'inspection' ? 'Press SPACE or tap to start early' :
          'Press SPACE or tap to stop'
        }
      </div>
    </div>
  );
}

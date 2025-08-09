'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState } from './types';
import { formatTime, playBeep, vibrate } from './utils';

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
  const armTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isKeyHeldRef = useRef<boolean>(false);
  const ARM_HOLD_MS = 300; // will be made configurable via Settings in state

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    onStateChange('running');
    playBeep(1000, 40);
    
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
    vibrate(30);
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

  const handleSpaceDown = useCallback((event: KeyboardEvent) => {
    if (event.code !== 'Space') return;
    if ((event as KeyboardEvent).repeat) return;
    event.preventDefault();
    isKeyHeldRef.current = true;
    
    switch (state) {
      case 'idle':
      case 'stopped':
        if (isInspectionEnabled) {
          startInspection();
        } else {
          setTime(0);
          if (armTimeoutRef.current) clearTimeout(armTimeoutRef.current);
          armTimeoutRef.current = setTimeout(() => {
            if (isKeyHeldRef.current) {
              onStateChange('ready');
            }
          }, ARM_HOLD_MS);
        }
        break;
      case 'inspection':
        if (inspectionIntervalRef.current) {
          clearInterval(inspectionIntervalRef.current);
        }
        setTime(0);
        if (armTimeoutRef.current) clearTimeout(armTimeoutRef.current);
        armTimeoutRef.current = setTimeout(() => {
          if (isKeyHeldRef.current) {
            onStateChange('ready');
          }
        }, ARM_HOLD_MS);
        break;
      case 'running':
        stopTimer();
        break;
    }
  }, [state, isInspectionEnabled, startInspection, stopTimer, onStateChange]);

  const handleSpaceUp = useCallback((event: KeyboardEvent) => {
    if (event.code !== 'Space') return;
    if ((event as KeyboardEvent).repeat) return;
    event.preventDefault();
    isKeyHeldRef.current = false;
    if (armTimeoutRef.current) {
      clearTimeout(armTimeoutRef.current);
      armTimeoutRef.current = null;
    }
    
    if (state === 'ready') {
      startTimer();
    }
  }, [state, startTimer]);

  const handleTouchStart = useCallback(() => {
    handleSpaceDown({ code: 'Space', preventDefault: () => {} } as KeyboardEvent);
  }, [handleSpaceDown]);

  const handleTouchEnd = useCallback(() => {
    handleSpaceUp({ code: 'Space', preventDefault: () => {} } as KeyboardEvent);
  }, [handleSpaceUp]);

  useEffect(() => {
    window.addEventListener('keydown', handleSpaceDown);
    window.addEventListener('keyup', handleSpaceUp);
    return () => {
      window.removeEventListener('keydown', handleSpaceDown);
      window.removeEventListener('keyup', handleSpaceUp);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (inspectionIntervalRef.current) clearInterval(inspectionIntervalRef.current);
      if (armTimeoutRef.current) clearTimeout(armTimeoutRef.current);
    };
  }, [handleSpaceDown, handleSpaceUp]);

  // Cleanup intervals when component unmounts or state changes
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (inspectionIntervalRef.current) clearInterval(inspectionIntervalRef.current);
      if (armTimeoutRef.current) clearTimeout(armTimeoutRef.current);
    };
  }, []);

  // Reset time when going back to idle
  useEffect(() => {
    if (state === 'idle') {
      setTime(0);
    }
  }, [state]);

  const getDisplayTime = () => {
    if (state === 'inspection') {
      return Math.ceil(inspectionTimeLeft).toString();
    }
    return formatTime(time);
  };

  const getTimerColor = () => {
    if (state === 'inspection') {
      if (inspectionTimeLeft <= 3) return 'text-red-400';
      if (inspectionTimeLeft <= 8) return 'text-amber-400';
      return 'text-blue-400';
    }
    if (state === 'ready') return 'text-emerald-400';
    if (state === 'running') return 'text-blue-400';
    return 'text-gray-900 dark:text-white';
  };

  return (
    <div 
      className="flex flex-col items-center justify-center flex-1 select-none cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      {state === 'inspection' && (
        <div className="text-lg font-medium text-gray-500 dark:text-gray-300 mb-2">
          Inspection
        </div>
      )}
      
      <div className={`text-8xl md:text-9xl font-mono font-bold transition-colors duration-200 ${getTimerColor()}`}>
        {getDisplayTime()}
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-300 mt-4 text-center max-w-md">
        {state === 'idle' || state === 'stopped' ? 
          (isInspectionEnabled ? 'Hold SPACE or tap to start inspection' : 'Hold SPACE or tap to get ready') :
          state === 'ready' ? 'Release SPACE or lift finger to start' :
          state === 'inspection' ? 'Hold SPACE or tap to get ready' :
          'Tap SPACE or tap to stop'
        }
      </div>
    </div>
  );
}

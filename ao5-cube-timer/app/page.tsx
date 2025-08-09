'use client';

import { useState, useEffect, useCallback } from 'react';
import Timer from '@/components/Timer';
import ScrambleDisplay from '@/components/ScrambleDisplay';
import Statistics from '@/components/Statistics';
import ThemeToggle from '@/components/ThemeToggle';
import SolveHistory from '@/components/SolveHistory';
import SessionSelector from '@/components/SessionSelector';
import Settings from '@/components/Settings';
import { Solve, Session, TimerState, CubeType } from '@/components/types';
import { generateId, calculateStatistics, saveToLocalStorage, loadFromLocalStorage, formatTime } from '@/components/utils';

export default function Home() {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentScramble, setCurrentScramble] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isInspectionEnabled, setIsInspectionEnabled] = useState(true);
  const [inspectionTime, setInspectionTime] = useState(15);
  const [isZenMode, setIsZenMode] = useState(false);
  const [scrambleRefreshKey, setScrambleRefreshKey] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(true);
  const [armDelayMs, setArmDelayMs] = useState(300);

  // Initialize sessions
  useEffect(() => {
    const savedSessions = loadFromLocalStorage<Session[]>('cubing-sessions', []);
    
    if (savedSessions.length === 0) {
      const defaultSession: Session = {
        id: generateId(),
        name: 'Default 3x3',
        cubeType: '3x3',
        solves: []
      };
      setSessions([defaultSession]);
      setCurrentSessionId(defaultSession.id);
      saveToLocalStorage('cubing-sessions', [defaultSession]);
    } else {
      setSessions(savedSessions);
      setCurrentSessionId(savedSessions[0].id);
    }
  }, []);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const statistics = currentSession ? calculateStatistics(currentSession.solves) : {
    ao5: null, ao12: null, best: null, worst: null, mean: null, totalSolves: 0
  };

  const handleSolveComplete = useCallback((time: number) => {
    if (!currentSession || !currentScramble) return;

    const newSolve: Solve = {
      id: generateId(),
      time,
      scramble: currentScramble,
      penalty: 'none',
      timestamp: Date.now(),
      session: currentSession.id
    };

    const updatedSessions = sessions.map(session => {
      if (session.id === currentSession.id) {
        return {
          ...session,
          solves: [...session.solves, newSolve]
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    saveToLocalStorage('cubing-sessions', updatedSessions);
    
    // Generate new scramble after solve
    setTimeout(() => {
      setScrambleRefreshKey((k) => k + 1);
    }, 50);
  }, [currentSession, currentScramble, sessions]);

  const handleDeleteSolve = useCallback((solveId: string) => {
    if (!currentSession) return;

    const updatedSessions = sessions.map(session => {
      if (session.id === currentSession.id) {
        return {
          ...session,
          solves: session.solves.filter(solve => solve.id !== solveId)
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    saveToLocalStorage('cubing-sessions', updatedSessions);
  }, [currentSession, sessions]);

  const handleTogglePenalty = useCallback((solveId: string) => {
    if (!currentSession) return;

    const updatedSessions = sessions.map(session => {
      if (session.id === currentSession.id) {
        return {
          ...session,
          solves: session.solves.map(solve => {
            if (solve.id === solveId) {
              const penalties: ('none' | '+2' | 'DNF')[] = ['none', '+2', 'DNF'];
              const currentIndex = penalties.indexOf(solve.penalty);
              const nextPenalty = penalties[(currentIndex + 1) % penalties.length];
              return { ...solve, penalty: nextPenalty };
            }
            return solve;
          })
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    saveToLocalStorage('cubing-sessions', updatedSessions);
  }, [currentSession, sessions]);

  const handleSessionChange = useCallback((session: Session) => {
    setCurrentSessionId(session.id);
  }, []);

  const handleCreateSession = useCallback((name: string, cubeType: CubeType) => {
    const newSession: Session = {
      id: generateId(),
      name,
      cubeType,
      solves: []
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    setCurrentSessionId(newSession.id);
    saveToLocalStorage('cubing-sessions', updatedSessions);
  }, [sessions]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Backspace' && timerState === 'idle') {
        event.preventDefault();
        if (currentSession && currentSession.solves.length > 0) {
          const lastSolve = currentSession.solves[currentSession.solves.length - 1];
          handleDeleteSolve(lastSolve.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timerState, currentSession, handleDeleteSolve]);

  if (!currentSession) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      {/* Minimal Layout */}
      <div className="relative min-h-screen flex flex-col">
        
        {/* Top Controls - Minimal */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="flex items-center gap-3">
            <SessionSelector
              sessions={sessions}
              currentSession={currentSession}
              onSessionChange={handleSessionChange}
              onCreateSession={handleCreateSession}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Settings
              isInspectionEnabled={isInspectionEnabled}
              onInspectionToggle={setIsInspectionEnabled}
              inspectionTime={inspectionTime}
              onInspectionTimeChange={setInspectionTime}
              cubeType={currentSession.cubeType}
              onCubeTypeChange={(type) => {
                const updatedSessions = sessions.map(session => {
                  if (session.id === currentSession.id) {
                    return { ...session, cubeType: type };
                  }
                  return session;
                });
                setSessions(updatedSessions);
                saveToLocalStorage('cubing-sessions', updatedSessions);
              }}
              isZenMode={isZenMode}
              onZenModeToggle={setIsZenMode}
              isSoundEnabled={isSoundEnabled}
              onSoundToggle={setIsSoundEnabled}
              isHapticsEnabled={isHapticsEnabled}
              onHapticsToggle={setIsHapticsEnabled}
              armDelayMs={armDelayMs}
              onArmDelayChange={setArmDelayMs}
            />
            <ThemeToggle />
          </div>
        </div>

        {/* Scramble - Top Center */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="text-center">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {currentSession.cubeType}
            </div>
            <div className="text-base font-mono text-gray-800 dark:text-gray-200 leading-relaxed">
              {currentScramble || 'Loading scramble...'}
            </div>
          </div>
        </div>

        {/* Timer - Center Stage */}
        <div className="flex-1 flex items-center justify-center px-4">
          <Timer
            onSolveComplete={handleSolveComplete}
            isInspectionEnabled={isInspectionEnabled}
            inspectionTime={inspectionTime}
            state={timerState}
            onStateChange={setTimerState}
          />
        </div>

        {/* Side Stats - Minimal */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div className="font-medium text-gray-600 dark:text-gray-300">AO5</div>
            <div className="font-mono">{statistics.ao5 ? formatTime(statistics.ao5) : '-'}</div>
            <div className="font-medium text-gray-600 dark:text-gray-300 mt-3">AO12</div>
            <div className="font-mono">{statistics.ao12 ? formatTime(statistics.ao12) : '-'}</div>
            <div className="font-medium text-gray-600 dark:text-gray-300 mt-3">Best</div>
            <div className="font-mono">{statistics.best ? formatTime(statistics.best) : '-'}</div>
          </div>
        </div>

        {/* Right Side - Session Info */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right space-y-1">
            <div className="font-medium text-gray-600 dark:text-gray-300">Solves</div>
            <div className="font-mono">{statistics.totalSolves}</div>
            <div className="font-medium text-gray-600 dark:text-gray-300 mt-3">Mean</div>
            <div className="font-mono">{statistics.mean ? formatTime(statistics.mean) : '-'}</div>
            <div className="font-medium text-gray-600 dark:text-gray-300 mt-3">Worst</div>
            <div className="font-mono">{statistics.worst ? formatTime(statistics.worst) : '-'}</div>
          </div>
        </div>

        {/* Bottom - Recent Solves (Minimal) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-4">
            {currentSession.solves.slice(-5).reverse().map((solve, index) => (
              <div key={solve.id} className="font-mono">
                {formatTime(solve.time, solve.penalty)}
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Scramble Generator */}
        <div className="hidden">
          <ScrambleDisplay
            cubeType={currentSession.cubeType}
            onScrambleChange={setCurrentScramble}
            refreshKey={scrambleRefreshKey}
          />
        </div>
      </div>
    </div>
  );
}

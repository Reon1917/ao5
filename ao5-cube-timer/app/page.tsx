'use client';

import { useState, useEffect, useCallback } from 'react';
import Timer from '@/components/Timer';
import ScrambleDisplay from '@/components/ScrambleDisplay';
import Statistics from '@/components/Statistics';
import ThemeToggle from '@/components/ThemeToggle';
import SolveHistory from '@/components/SolveHistory';
import SessionSelector from '@/components/SessionSelector';
import { Solve, Session, TimerState, CubeType } from '@/components/types';
import { generateId, calculateStatistics, saveToLocalStorage, loadFromLocalStorage } from '@/components/utils';

export default function Home() {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentScramble, setCurrentScramble] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isInspectionEnabled, setIsInspectionEnabled] = useState(true);

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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <SessionSelector
            sessions={sessions}
            currentSession={currentSession}
            onSessionChange={handleSessionChange}
            onCreateSession={handleCreateSession}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={isInspectionEnabled}
              onChange={(e) => setIsInspectionEnabled(e.target.checked)}
              className="rounded"
            />
            15s Inspection
          </label>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {/* Scramble */}
        <div className="mb-8">
          <ScrambleDisplay
            cubeType={currentSession.cubeType}
            onScrambleChange={setCurrentScramble}
          />
        </div>

        {/* Timer */}
        <div className="mb-8">
          <Timer
            onSolveComplete={handleSolveComplete}
            isInspectionEnabled={isInspectionEnabled}
            inspectionTime={15}
            state={timerState}
            onStateChange={setTimerState}
          />
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <Statistics statistics={statistics} />
        </div>

        {/* Solve History */}
        <div>
          <SolveHistory
            solves={currentSession.solves}
            onDeleteSolve={handleDeleteSolve}
            onTogglePenalty={handleTogglePenalty}
          />
        </div>
      </main>
    </div>
  );
}

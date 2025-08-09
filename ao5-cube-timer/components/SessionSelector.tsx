'use client';

import { ChevronDown } from 'lucide-react';
import { CubeType, Session } from './types';

interface SessionSelectorProps {
  sessions: Session[];
  currentSession: Session;
  onSessionChange: (session: Session) => void;
  onCreateSession: (name: string, cubeType: CubeType) => void;
}

const cubeTypes: CubeType[] = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7', 'OH', 'BLD', 'FMC'];

export default function SessionSelector({ 
  sessions, 
  currentSession, 
  onSessionChange, 
  onCreateSession 
}: SessionSelectorProps) {
  const handleSessionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sessionId = event.target.value;
    
    if (sessionId === 'new') {
      const name = prompt('Enter session name:');
      const cubeType = prompt(`Enter cube type (${cubeTypes.join(', ')}):`) as CubeType;
      
      if (name && cubeTypes.includes(cubeType)) {
        onCreateSession(name, cubeType);
      }
      return;
    }
    
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      onSessionChange(session);
    }
  };

  return (
    <div className="relative">
      <select
        value={currentSession.id}
        onChange={handleSessionChange}
        className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sessions.map(session => (
          <option key={session.id} value={session.id}>
            {session.name} ({session.cubeType}) - {session.solves.length} solves
          </option>
        ))}
        <option value="new">+ Create New Session</option>
      </select>
      
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400 pointer-events-none" />
    </div>
  );
}

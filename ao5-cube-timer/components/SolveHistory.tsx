'use client';

import { useState } from 'react';
import { Trash2, RotateCcw, Plus, AlertTriangle } from 'lucide-react';
import { Solve } from './types';
import { formatTime } from './utils';

interface SolveHistoryProps {
  solves: Solve[];
  onDeleteSolve: (id: string) => void;
  onTogglePenalty: (id: string) => void;
}

export default function SolveHistory({ solves, onDeleteSolve, onTogglePenalty }: SolveHistoryProps) {
  const [expandedSolve, setExpandedSolve] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPenaltyIcon = (penalty: 'none' | '+2' | 'DNF') => {
    switch (penalty) {
      case '+2':
        return <Plus className="w-3 h-3 text-yellow-500" />;
      case 'DNF':
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };



  if (solves.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Solve History
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            No solves yet. Start timing to see your history!
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Solve History ({solves.length})
      </h2>
      
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="max-h-96 overflow-y-auto">
          {solves.slice().reverse().map((solve, index) => (
            <div
              key={solve.id}
              className="border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors"
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedSolve(expandedSolve === solve.id ? null : solve.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 w-8">
                    #{solves.length - index}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-lg font-semibold">
                      {formatTime(solve.time, solve.penalty)}
                    </div>
                    {getPenaltyIcon(solve.penalty)}
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(solve.timestamp)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePenalty(solve.id);
                    }}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Toggle penalty"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSolve(solve.id);
                    }}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Delete solve"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              
              {expandedSolve === solve.id && (
                <div className="px-4 pb-4 bg-gray-100 dark:bg-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Scramble:</strong>
                  </div>
                  <div className="font-mono text-sm mt-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded">
                    {solve.scramble}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

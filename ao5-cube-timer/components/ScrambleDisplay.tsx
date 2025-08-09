'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { CubeType } from './types';

interface ScrambleDisplayProps {
  cubeType: CubeType;
  onScrambleChange: (scramble: string) => void;
}

// WCA scramble patterns - simplified for demo
const scramblePatterns = {
  '2x2': ['R', 'U', 'R\'', 'U\'', 'R2', 'U2', 'F', 'F\'', 'F2'],
  '3x3': ['R', 'U', 'L', 'D', 'F', 'B', 'R\'', 'U\'', 'L\'', 'D\'', 'F\'', 'B\'', 'R2', 'U2', 'L2', 'D2', 'F2', 'B2'],
  '4x4': ['R', 'U', 'L', 'D', 'F', 'B', 'Rw', 'Uw', 'Lw', 'Dw', 'Fw', 'Bw', 'R\'', 'U\'', 'L\'', 'D\'', 'F\'', 'B\'', 'Rw\'', 'Uw\'', 'Lw\'', 'Dw\'', 'Fw\'', 'Bw\'', 'R2', 'U2', 'L2', 'D2', 'F2', 'B2', 'Rw2', 'Uw2', 'Lw2', 'Dw2', 'Fw2', 'Bw2'],
  '5x5': ['R', 'U', 'L', 'D', 'F', 'B', 'Rw', 'Uw', 'Lw', 'Dw', 'Fw', 'Bw', 'R\'', 'U\'', 'L\'', 'D\'', 'F\'', 'B\'', 'Rw\'', 'Uw\'', 'Lw\'', 'Dw\'', 'Fw\'', 'Bw\'', 'R2', 'U2', 'L2', 'D2', 'F2', 'B2', 'Rw2', 'Uw2', 'Lw2', 'Dw2', 'Fw2', 'Bw2'],
  '6x6': ['R', 'U', 'L', 'D', 'F', 'B', 'Rw', 'Uw', 'Lw', 'Dw', 'Fw', 'Bw', '3Rw', '3Uw', '3Lw', '3Dw', '3Fw', '3Bw'],
  '7x7': ['R', 'U', 'L', 'D', 'F', 'B', 'Rw', 'Uw', 'Lw', 'Dw', 'Fw', 'Bw', '3Rw', '3Uw', '3Lw', '3Dw', '3Fw', '3Bw'],
  'OH': ['R', 'U', 'L', 'D', 'F', 'B', 'R\'', 'U\'', 'L\'', 'D\'', 'F\'', 'B\'', 'R2', 'U2', 'L2', 'D2', 'F2', 'B2'],
  'BLD': ['R', 'U', 'L', 'D', 'F', 'B', 'R\'', 'U\'', 'L\'', 'D\'', 'F\'', 'B\'', 'R2', 'U2', 'L2', 'D2', 'F2', 'B2'],
  'FMC': ['R', 'U', 'L', 'D', 'F', 'B', 'R\'', 'U\'', 'L\'', 'D\'', 'F\'', 'B\'', 'R2', 'U2', 'L2', 'D2', 'F2', 'B2']
};

const scrambleLengths = {
  '2x2': 9,
  '3x3': 20,
  '4x4': 40,
  '5x5': 60,
  '6x6': 80,
  '7x7': 100,
  'OH': 20,
  'BLD': 20,
  'FMC': 20
};

export default function ScrambleDisplay({ cubeType, onScrambleChange }: ScrambleDisplayProps) {
  const [scramble, setScramble] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateScramble = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Try to import and use WCA service
      const { generateScramble: wcaGenerateScramble } = await import('./wcaService');
      const scrambleString = await wcaGenerateScramble(cubeType);
      setScramble(scrambleString);
      onScrambleChange(scrambleString);
    } catch (error) {
      console.warn('Failed to generate scramble:', error);
      
      // Fallback to local generation
      const moves = scramblePatterns[cubeType];
      const length = scrambleLengths[cubeType];
      const newScramble = [];
      
      let lastMove = '';
      let lastAxis = '';
      
      for (let i = 0; i < length; i++) {
        let move;
        let attempts = 0;
        
        do {
          move = moves[Math.floor(Math.random() * moves.length)];
          attempts++;
        } while (
          attempts < 10 && 
          (move === lastMove || 
           (move.charAt(0) === lastMove.charAt(0) && move.charAt(0) === lastAxis))
        );
        
        newScramble.push(move);
        lastMove = move;
        lastAxis = move.charAt(0);
      }
      
      const scrambleString = newScramble.join(' ');
      setScramble(scrambleString);
      onScrambleChange(scrambleString);
    }
    
    setTimeout(() => setIsGenerating(false), 200);
  }, [cubeType, onScrambleChange]);

  useEffect(() => {
    generateScramble();
  }, [cubeType, generateScramble]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {cubeType}
          </span>
        </div>
        
        <button
          onClick={generateScramble}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          New Scramble
        </button>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="text-lg md:text-xl font-mono text-center leading-relaxed text-gray-900 dark:text-gray-100">
          {scramble || 'Generating scramble...'}
        </div>
      </div>
    </div>
  );
}

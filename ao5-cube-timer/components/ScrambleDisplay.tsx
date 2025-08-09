'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { CubeType } from './types';

interface ScrambleDisplayProps {
  cubeType: CubeType;
  onScrambleChange: (scramble: string) => void;
  refreshKey?: number; // changes force regeneration
}

// Using cubing.js for true random-state scrambles

export default function ScrambleDisplay({ cubeType, onScrambleChange, refreshKey = 0 }: ScrambleDisplayProps) {
  const [scramble, setScramble] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateScramble = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const { generateScramble: cubingGenerateScramble } = await import('./scrambleService');
      const scrambleString = await cubingGenerateScramble(cubeType);
      setScramble(scrambleString);
      onScrambleChange(scrambleString);
    } catch (error) {
      console.warn('Failed to generate scramble:', error);
      // Fallback to a simple scramble
      const fallbackScramble = `R U R' U' F R F' U R U' R'`;
      setScramble(fallbackScramble);
      onScrambleChange(fallbackScramble);
    }
    
    setTimeout(() => setIsGenerating(false), 100);
  }, [cubeType, onScrambleChange]);

  useEffect(() => {
    generateScramble();
  }, [cubeType, refreshKey, generateScramble]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {cubeType}
          </span>
        </div>
        
        <button
          onClick={generateScramble}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          New Scramble
        </button>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
        <div className="text-lg md:text-xl font-mono text-center leading-relaxed text-gray-900 dark:text-white tracking-wide">
          {scramble || 'Generating scramble...'}
        </div>
      </div>
    </div>
  );
}

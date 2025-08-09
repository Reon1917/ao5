import { CubeType } from './types';

export const generateScramble = async (cubeType: CubeType): Promise<string> => {
  // For now, use improved fallback until we can properly integrate cubing.js
  return generateImprovedScramble(cubeType);
};

// Improved scramble generation with better randomization
const generateImprovedScramble = (cubeType: CubeType): string => {
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
    '2x2': 9, '3x3': 20, '4x4': 40, '5x5': 60, '6x6': 80, '7x7': 100,
    'OH': 20, 'BLD': 20, 'FMC': 20
  };

  const moves = scramblePatterns[cubeType];
  const length = scrambleLengths[cubeType];
  const scramble = [];
  
  let lastMove = '';
  let lastAxis = '';
  
  for (let i = 0; i < length; i++) {
    let move;
    let attempts = 0;
    
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
      attempts++;
    } while (
      attempts < 20 && 
      (move === lastMove || 
       (move.charAt(0) === lastMove.charAt(0) && move.charAt(0) === lastAxis))
    );
    
    scramble.push(move);
    lastMove = move;
    lastAxis = move.charAt(0);
  }
  
  return scramble.join(' ');
};

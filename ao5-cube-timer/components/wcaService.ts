import { CubeType } from './types';

// WCA event mapping
const WCA_EVENT_MAP: Record<CubeType, string> = {
  '2x2': '222',
  '3x3': '333',
  '4x4': '444',
  '5x5': '555',
  '6x6': '666',
  '7x7': '777',
  'OH': '333oh',
  'BLD': '333bf',
  'FMC': '333fm'
};

interface WCAScrambleResponse {
  scrambles: string[];
}

export class WCAScrambleService {
  private apiKey: string;
  private baseUrl = 'https://www.worldcubeassociation.org/api/v0';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getScramble(cubeType: CubeType, count = 1): Promise<string[]> {
    try {
      const eventId = WCA_EVENT_MAP[cubeType];
      if (!eventId) {
        throw new Error(`Unsupported cube type: ${cubeType}`);
      }

      const response = await fetch(`${this.baseUrl}/scrambles/${eventId}?count=${count}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`WCA API error: ${response.status} ${response.statusText}`);
      }

      const data: WCAScrambleResponse = await response.json();
      return data.scrambles;
    } catch (error) {
      console.warn('WCA API failed, falling back to local scrambles:', error);
      return [this.generateFallbackScramble(cubeType)];
    }
  }

  generateFallbackScramble(cubeType: CubeType): string {
    // Fallback scramble generation (same as in ScrambleDisplay component)
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
        attempts < 10 && 
        (move === lastMove || 
         (move.charAt(0) === lastMove.charAt(0) && move.charAt(0) === lastAxis))
      );
      
      scramble.push(move);
      lastMove = move;
      lastAxis = move.charAt(0);
    }
    
    return scramble.join(' ');
  }
}

// Singleton instance - will be initialized with API key from environment
let wcaService: WCAScrambleService | null = null;

export const getWCAService = (): WCAScrambleService | null => {
  if (!wcaService && typeof window !== 'undefined') {
    // In a real app, you'd get this from environment variables
    // For now, we'll use a placeholder or check process.env
    const apiKey = process.env.NEXT_PUBLIC_WCA_API_KEY;
    if (apiKey) {
      wcaService = new WCAScrambleService(apiKey);
    }
  }
  return wcaService;
};

export const generateScramble = async (cubeType: CubeType): Promise<string> => {
  const service = getWCAService();
  if (service) {
    try {
      const scrambles = await service.getScramble(cubeType, 1);
      return scrambles[0];
    } catch {
      console.warn('Failed to get WCA scramble, using fallback');
    }
  }
  
  // Fallback to local generation
  const fallbackService = new WCAScrambleService('');
  return fallbackService.generateFallbackScramble(cubeType);
};

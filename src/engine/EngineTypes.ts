export type GameMode = 'HvH' | 'HvC' | 'CvC' | 'Analysis';
export type EngineColor = 'w' | 'b' | 'random';

export interface EngineSettings {
  skillLevel: number;
  depth: number;
  moveTime: number;
  threads: number;
  hashSize: number;
}

export interface EngineEvaluation {
  type: 'cp' | 'mate';
  value: number; // centipawns or mate in N
}

export interface EngineMetrics {
  depth: number;
  seldepth: number;
  nodes: number;
  nps: number;
  time: number;
  pv: string[]; // principal variation (best line)
  eval: EngineEvaluation;
  bestMove: string | null;
}

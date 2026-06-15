import type { EngineSettings } from './EngineTypes';

export const CasualDifficulties: Record<string, EngineSettings> = {
  Beginner: { skillLevel: 0, depth: 1, moveTime: 50, threads: 1, hashSize: 16 },
  Casual: { skillLevel: 4, depth: 3, moveTime: 200, threads: 1, hashSize: 16 },
  Intermediate: { skillLevel: 8, depth: 6, moveTime: 500, threads: 1, hashSize: 32 },
  Advanced: { skillLevel: 12, depth: 10, moveTime: 1000, threads: 1, hashSize: 64 },
  Expert: { skillLevel: 16, depth: 14, moveTime: 2000, threads: 2, hashSize: 128 },
  Master: { skillLevel: 20, depth: 18, moveTime: 3000, threads: 2, hashSize: 256 },
  Maximum: { skillLevel: 20, depth: 24, moveTime: 5000, threads: 4, hashSize: 512 },
};

export const DefaultAdvancedSettings: EngineSettings = {
  skillLevel: 20,
  depth: 20,
  moveTime: 3000,
  threads: 2,
  hashSize: 128,
};

// Autodetect lower threads/hash for mobile to prevent freezing
export function getOptimizedSettings(preset: EngineSettings): EngineSettings {
  const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    return {
      ...preset,
      threads: 1,
      hashSize: Math.min(preset.hashSize, 64)
    };
  }
  
  // Also cap by logical processors if available
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
    const maxThreads = Math.max(1, navigator.hardwareConcurrency - 1);
    return {
      ...preset,
      threads: Math.min(preset.threads, maxThreads)
    };
  }
  
  return preset;
}

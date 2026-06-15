import { useState, useEffect, useCallback } from 'react';
import { engineService } from '../engine/EngineService';
import type { EngineSettings } from '../engine/EngineTypes';
import { CasualDifficulties } from '../engine/DifficultyPresets';
import type { AppSettings } from './useSettings';

export function useEngine(settingsConfig: AppSettings) {
  const [isReady, setIsReady] = useState(engineService.isReady);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    engineService.init(
      () => setIsReady(true),
      (err) => setError(err)
    );

    return () => {
      // Don't terminate on unmount unless we completely leave the game
      // engineService.terminate(); 
    };
  }, []);

  const triggerEngineMove = useCallback((currentFen: string, onMoveFound: (move: string) => void) => {
    if (!isReady) return;
    
    let activeSettings: EngineSettings;
    if (settingsConfig.useAdvancedSettings) {
      activeSettings = settingsConfig.advanced;
    } else {
      activeSettings = CasualDifficulties[settingsConfig.difficulty] || CasualDifficulties['Casual'];
    }

    engineService.configure(activeSettings);
    
    engineService.setCallbacks(
      (bestMove) => {
        onMoveFound(bestMove);
      }
    );
    
    engineService.findBestMove(currentFen, activeSettings);
  }, [isReady, settingsConfig]);

  const startAnalysis = useCallback((currentFen: string) => {
    if (!isReady) return;
    engineService.setCallbacks(() => {});
    engineService.analyze(currentFen);
  }, [isReady]);

  const stopEngine = useCallback(() => {
    engineService.stop();
  }, []);

  return {
    isReady,
    isThinking: engineService.isThinking,
    error,
    triggerEngineMove,
    startAnalysis,
    stopEngine,
  };
}

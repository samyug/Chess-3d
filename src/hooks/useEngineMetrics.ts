import { useState, useEffect } from 'react';
import { engineService } from '../engine/EngineService';
import type { EngineMetrics } from '../engine/EngineTypes';

export function useEngineMetrics() {
  const [metrics, setMetrics] = useState<EngineMetrics | null>(null);

  useEffect(() => {
    const unsubscribe = engineService.addMetricsListener(setMetrics);
    return () => {
      unsubscribe();
    };
  }, []);

  return metrics;
}

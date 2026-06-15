import type { EngineMetrics } from '../engine/EngineTypes';
import { Loader2 } from 'lucide-react';
import './EngineStatus.css';

interface EngineStatusProps {
  metrics: EngineMetrics | null;
  isThinking: boolean;
  isReady: boolean;
  difficulty?: string;
}

export function EngineStatus({ metrics, isThinking, isReady, difficulty }: EngineStatusProps) {
  if (!isReady) {
    return (
      <div className="engine-status glass">
        <div className="flex items-center">
          <Loader2 className="animate-spin mr-2" size={16} />
          <span>Loading Engine...</span>
        </div>
      </div>
    );
  }

  if (!metrics || (!isThinking && metrics.depth === 0)) {
    return (
      <div className="engine-status glass">
        <div className="status-header">
          <div className="flex items-center text-green-400 font-medium">
            <span className="status-dot ready"></span>
            Ready
          </div>
          {difficulty && <div className="text-secondary text-xs">Difficulty: {difficulty}</div>}
        </div>
      </div>
    );
  }

  let evalText = '0.0';
  if (metrics.eval.type === 'mate') {
    evalText = `M${Math.abs(metrics.eval.value)}`;
  } else {
    evalText = (metrics.eval.value / 100).toFixed(2);
    if (metrics.eval.value > 0) evalText = '+' + evalText;
  }

  return (
    <div className="engine-status glass">
      <div className="status-header">
        <div className="flex items-center font-medium">
          {isThinking ? (
            <>
              <Loader2 className="animate-spin mr-2 text-blue-400" size={14} />
              <span className="text-blue-400">Thinking...</span>
            </>
          ) : (
            <>
              <span className="status-dot ready"></span>
              <span className="text-green-400">Ready</span>
            </>
          )}
        </div>
        {difficulty && <div className="text-secondary text-xs">Difficulty: {difficulty}</div>}
      </div>
      
      <div className="metrics-grid mt-2">
        <div className="metric-box">
          <span className="metric-label">Evaluation</span>
          <span className={`metric-value font-mono ${metrics.eval.type === 'mate' ? 'text-yellow-400' : 'text-white'}`}>
            {metrics.eval.type === 'mate' ? `Mate in ${Math.abs(metrics.eval.value)}` : evalText}
          </span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Depth</span>
          <span className="metric-value font-mono">{metrics.depth}/{metrics.seldepth}</span>
        </div>
      </div>
      
      {metrics.pv.length > 0 && (
        <div className="pv-line mt-2 text-xs text-gray-400 truncate">
          <span className="font-semibold text-gray-300">PV:</span> {metrics.pv.slice(0, 6).join(' ')}
        </div>
      )}
    </div>
  );
}

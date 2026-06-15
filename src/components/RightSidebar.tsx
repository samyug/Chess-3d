import type { EngineMetrics } from '../engine/EngineTypes';
import { useEngineMetrics } from '../hooks/useEngineMetrics';
import type { CapturedPieces } from '../hooks/useChessGame';
import { ChevronDown } from 'lucide-react';

interface RightSidebarProps {
  isReady: boolean;
  isThinking: boolean;
  difficulty: string;
  turn: 'w' | 'b';
  lastMove: string | null;
  capturedPieces: CapturedPieces;
}

export function RightSidebar({
  isReady,
  isThinking,
  difficulty,
  turn,
  lastMove,
  capturedPieces
}: RightSidebarProps) {
  const metrics = useEngineMetrics();
  
  // Format evaluation to 2 decimal places with + or -
  const getEvalText = (metrics: EngineMetrics | null) => {
    if (!metrics || !metrics.eval) return '0.00';
    if (metrics.eval.type === 'mate') {
      return `M${Math.abs(metrics.eval.value)}`;
    }
    const val = metrics.eval.value / 100;
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}`;
  };

  return (
    <aside className="right-sidebar">
      
      {/* Engine Status Card */}
      <div className="glass-panel info-card" style={{ gap: '8px' }}>
        <div className="card-header">
          <div className={`status-dot ${isReady ? 'ready' : ''}`}></div>
          <span>{isReady ? 'Engine Ready' : 'Loading Engine...'}</span>
        </div>
        <div className="info-row">
          <span className="info-subtext">Difficulty: {difficulty}</span>
          <ChevronDown size={16} className="text-secondary" />
        </div>
      </div>

      {/* Evaluation Card */}
      <div className="glass-panel info-card" style={{ gap: '16px' }}>
        <div className="info-row">
          <div>
            <div className="info-label">EVALUATION</div>
            <div className="info-value">
              {getEvalText(metrics)}
            </div>
          </div>
          <div>
            <div className="info-label">DEPTH</div>
            <div className="info-value">{metrics?.depth || 0}/2</div>
          </div>
        </div>
        <div className="info-subtext">
          PV: {metrics?.pv?.[0] || '--'}
        </div>
      </div>

      {/* Engine Thinking Card */}
      <div className="glass-panel info-card" style={{ gap: '12px' }}>
        <div className="card-header">
          {isThinking ? <div className="status-spinner"></div> : <div className="status-dot"></div>}
          <span>{isThinking ? 'Engine Thinking...' : 'Idle'}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="info-subtext">Depth: {metrics?.depth || 0}</span>
          <span className="info-subtext">Time: {metrics?.time ? (metrics.time / 1000).toFixed(1) : '0.0'}s</span>
          <span className="info-subtext">Nodes: {metrics?.nodes?.toLocaleString() || 0}</span>
        </div>
      </div>

      {/* Game Info Card */}
      <div className="glass-panel info-card" style={{ gap: '8px' }}>
        <div className="info-label">GAME INFO</div>
        <div className="card-header">
          <div className="status-dot" style={{ backgroundColor: turn === 'w' ? '#fff' : '#444' }}></div>
          <span>{turn === 'w' ? 'White to move' : 'Black to move'}</span>
        </div>
      </div>

      {/* Last Move Card */}
      <div className="glass-panel info-card" style={{ gap: '8px' }}>
        <div className="info-label">LAST MOVE</div>
        <div className="info-subtext" style={{ fontSize: '15px', color: '#fff' }}>
          {lastMove || '--'}
        </div>
      </div>

      {/* Captured Pieces Card */}
      <div className="glass-panel info-card" style={{ gap: '8px' }}>
        <div className="info-label">CAPTURED PIECES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* White's captures (Black pieces) */}
          <div className="captured-pieces" style={{ minHeight: '22px' }}>
            {Object.entries(capturedPieces.w).flatMap(([p, count]) =>
              Array(count).fill(0).map((_, i) => (
                <span key={`w-${p}-${i}`} style={{ fontSize: '20px', color: '#666', lineHeight: 1 }}>
                  {p === 'p' && '♟'}
                  {p === 'n' && '♞'}
                  {p === 'b' && '♝'}
                  {p === 'r' && '♜'}
                  {p === 'q' && '♛'}
                </span>
              ))
            )}
          </div>

          {/* Black's captures (White pieces) */}
          <div className="captured-pieces" style={{ minHeight: '22px' }}>
            {Object.entries(capturedPieces.b).flatMap(([p, count]) =>
              Array(count).fill(0).map((_, i) => (
                <span key={`b-${p}-${i}`} style={{ fontSize: '20px', color: '#fff', lineHeight: 1 }}>
                  {p === 'p' && '♙'}
                  {p === 'n' && '♘'}
                  {p === 'b' && '♗'}
                  {p === 'r' && '♖'}
                  {p === 'q' && '♕'}
                </span>
              ))
            )}
          </div>

        </div>
      </div>

    </aside>
  );
}

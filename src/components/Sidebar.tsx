import type { Move, PieceSymbol, Color } from 'chess.js';
import { RotateCcw } from 'lucide-react';
import { Piece } from './Piece';
import type { CapturedPieces } from '../hooks/useChessGame';
import './Sidebar.css';

interface SidebarProps {
  turn: Color;
  history: Move[];
  capturedPieces: CapturedPieces;
  isCheckmate: boolean;
  isDraw: boolean;
  onReset: () => void;
}

export function Sidebar({ turn, history, capturedPieces, isCheckmate, isDraw, onReset }: SidebarProps) {
  const movePairs = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      w: history[i],
      b: history[i + 1] || null
    });
  }

  const renderCaptured = (captured: Record<PieceSymbol, number>, color: Color) => {
    const order: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p'];
    const elements = [];

    for (const type of order) {
      const count = captured[type];
      for (let i = 0; i < count; i++) {
        elements.push(
          <div key={`${type}-${i}`} className="captured-piece">
            <Piece type={type} color={color} />
          </div>
        );
      }
    }

    return elements;
  };

  return (
    <div className="sidebar glass">
      <div className="status-section">
        {isCheckmate ? (
          <h2 className="game-over">Checkmate! {turn === 'w' ? 'Black' : 'White'} wins.</h2>
        ) : isDraw ? (
          <h2 className="game-over">Game Drawn!</h2>
        ) : (
          <h2>{turn === 'w' ? 'White' : 'Black'} to move</h2>
        )}
      </div>

      <div className="captured-section">
        <div className="captured-row">
          <span className="captured-label">White</span>
          <div className="captured-pieces-list">
            {renderCaptured(capturedPieces.w, 'b')}
          </div>
        </div>
        <div className="captured-row">
          <span className="captured-label">Black</span>
          <div className="captured-pieces-list">
            {renderCaptured(capturedPieces.b, 'w')}
          </div>
        </div>
      </div>

      <div className="history-section">
        <h3>Move History</h3>
        <div className="history-list">
          {movePairs.map((pair, index) => (
            <div key={index} className="history-row">
              <span className="history-number">{index + 1}.</span>
              <span className="history-move">{pair.w.san}</span>
              <span className="history-move">{pair.b ? pair.b.san : ''}</span>
            </div>
          ))}
          {movePairs.length === 0 && (
            <div className="history-empty">No moves yet</div>
          )}
        </div>
      </div>

      <div className="controls-section">
        <button className="btn-primary" onClick={onReset}>
          <RotateCcw size={18} />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
}

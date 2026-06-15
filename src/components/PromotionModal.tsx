import type { PieceSymbol, Color } from 'chess.js';
import { Piece } from './Piece';
import './PromotionModal.css';

interface PromotionModalProps {
  color: Color;
  onSelect: (piece: string) => void;
  onCancel: () => void;
}

export function PromotionModal({ color, onSelect, onCancel }: PromotionModalProps) {
  const pieces: PieceSymbol[] = ['q', 'r', 'b', 'n'];

  return (
    <div className="promotion-overlay" onClick={onCancel}>
      <div className="promotion-modal glass" onClick={e => e.stopPropagation()}>
        <h3 className="promotion-title">Promote to</h3>
        <div className="promotion-options">
          {pieces.map(p => (
            <button 
              key={p} 
              className="promotion-option"
              onClick={() => onSelect(p)}
            >
              <Piece type={p} color={color} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

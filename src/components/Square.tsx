import type { Square as ChessSquare, PieceSymbol, Color } from 'chess.js';
import { Piece } from './Piece';
import clsx from 'clsx';
import './Square.css';

interface SquareProps {
  square: ChessSquare;
  isDark: boolean;
  piece: { type: PieceSymbol; color: Color } | null;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  inCheck: boolean;
  onClick: (square: ChessSquare) => void;
}

export function Square({
  square,
  isDark,
  piece,
  isSelected,
  isLegalMove,
  isLastMove,
  inCheck,
  onClick
}: SquareProps) {
  return (
    <div
      className={clsx(
        'square',
        isDark ? 'dark' : 'light',
        {
          'selected': isSelected,
          'last-move': isLastMove,
          'in-check': inCheck,
          'legal-move-target': isLegalMove && piece,
        }
      )}
      onClick={() => onClick(square)}
    >
      {isLegalMove && !piece && (
        <div className="legal-move-dot" />
      )}
      
      {piece && (
        <Piece type={piece.type} color={piece.color} />
      )}
    </div>
  );
}

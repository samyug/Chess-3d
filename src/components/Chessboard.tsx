import { useState } from 'react';
import type { Square as ChessSquare, PieceSymbol, Color, Move } from 'chess.js';
import { Square } from './Square';
import { PromotionModal } from './PromotionModal';
import './Chessboard.css';

interface ChessboardProps {
  board: ({ square: ChessSquare; type: PieceSymbol; color: Color } | null)[][];
  history: Move[];
  turn: Color;
  isCheck: boolean;
  onMove: (move: string | { from: string; to: string; promotion?: string }) => void;
  getLegalMoves: (square: ChessSquare) => Move[];
}

export function Chessboard({ board, history, turn, isCheck, onMove, getLegalMoves }: ChessboardProps) {
  const [selectedSquare, setSelectedSquare] = useState<ChessSquare | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [promotionMove, setPromotionMove] = useState<{ from: string; to: string } | null>(null);

  const lastMove = history.length > 0 ? history[history.length - 1] : null;

  const handleSquareClick = (square: ChessSquare) => {
    if (promotionMove) return;

    const isLegalTarget = legalMoves.find(m => m.to === square);
    
    if (selectedSquare && isLegalTarget) {
      const isPromotion = isLegalTarget.promotion || (
        isLegalTarget.piece === 'p' && 
        (square[1] === '8' || square[1] === '1')
      );

      if (isPromotion) {
        setPromotionMove({ from: selectedSquare, to: square });
      } else {
        onMove({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        setLegalMoves([]);
      }
      return;
    }

    const fileIndex = square.charCodeAt(0) - 97;
    const rankIndex = 8 - parseInt(square[1]);
    const clickedPiece = board[rankIndex][fileIndex];

    if (clickedPiece && clickedPiece.color === turn) {
      setSelectedSquare(square);
      setLegalMoves(getLegalMoves(square));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handlePromotionSelect = (promotion: string) => {
    if (promotionMove) {
      onMove({ ...promotionMove, promotion });
      setPromotionMove(null);
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const cancelPromotion = () => {
    setPromotionMove(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const squares = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      const file = String.fromCharCode(97 + c);
      const rank = 8 - r;
      const squareId = `${file}${rank}` as ChessSquare;
      const isDark = (r + c) % 2 === 1;

      const isSelected = selectedSquare === squareId;
      const isLegalMove = legalMoves.some(m => m.to === squareId);
      const isLastMove = lastMove !== null && (lastMove.from === squareId || lastMove.to === squareId);
      const isKingInCheck = piece && piece.type === 'k' && piece.color === turn && isCheck;

      squares.push(
        <Square
          key={squareId}
          square={squareId}
          isDark={isDark}
          piece={piece}
          isSelected={isSelected}
          isLegalMove={isLegalMove}
          isLastMove={isLastMove}
          inCheck={isKingInCheck || false}
          onClick={handleSquareClick}
        />
      );
    }
  }

  return (
    <div className="chessboard-container">
      <div className="board-frame">
        <div className="coords-left">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(n => <span key={n}>{n}</span>)}
        </div>
        <div className="coords-bottom">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(l => <span key={l}>{l}</span>)}
        </div>
        
        <div className="chessboard">
          {squares}
          
          {promotionMove && (
            <PromotionModal 
              color={turn} 
              onSelect={handlePromotionSelect} 
              onCancel={cancelPromotion} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

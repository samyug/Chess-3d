import React, { useState } from 'react';
import { Html, Text, useTexture } from '@react-three/drei';
import { BoardSquare } from './BoardSquare';
import type { Square, Move, PieceSymbol, Color } from 'chess.js';
import { ChessPiece3D } from './ChessPiece3D';
import { usePieceManager } from './PieceManager';
import { PromotionModal } from '../components/PromotionModal';

interface ChessBoard3DProps {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  history: Move[];
  inCheck: boolean;
  turn: Color;
  isEngineTurn: boolean;
  onMove: (move: string | { from: string; to: string; promotion?: string }) => void;
  getLegalMoves: (square: Square) => Move[];
}

export const ChessBoard3D = React.memo(function ChessBoard3D({
  board,
  history,
  inCheck,
  turn,
  isEngineTurn,
  onMove,
  getLegalMoves
}: ChessBoard3DProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [promotionMove, setPromotionMove] = useState<{ from: string; to: string } | null>(null);

  const lastMove = history.length > 0 ? history[history.length - 1] : null;

  const handleSquareClick = (square: Square) => {
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

  // Load our single high-quality wood texture
  const woodTexture = useTexture('/textures/wood.jpg');

  const squares = [];
  const managedPieces = usePieceManager(board, history, !isEngineTurn); // If it's NOT the engine's turn right now, the previous turn WAS the engine's move.
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      const file = String.fromCharCode(97 + c);
      const rank = 8 - r;
      const squareId = `${file}${rank}` as Square;
      const isDark = (r + c) % 2 === 1;

      const isSelected = selectedSquare === squareId;
      const isLegalMove = legalMoves.some(m => m.to === squareId);
      const isLastMove = lastMove !== null && (lastMove.from === squareId || lastMove.to === squareId);
      const isKingInCheck = piece && piece.type === 'k' && piece.color === turn && inCheck;

      // Centered coordinates: 0,0 is center of board
      // x: c from -3.5 to 3.5
      // z: r from -3.5 to 3.5
      const x = c - 3.5;
      const z = r - 3.5;

      squares.push(
        <BoardSquare
          key={squareId}
          square={squareId}
          position={[x, 0, z]}
          isDark={isDark}
          isSelected={isSelected}
          isLegalMove={isLegalMove}
          isLastMove={isLastMove}
          inCheck={isKingInCheck || false}
          hasPiece={piece !== null}
          onClick={() => handleSquareClick(squareId)}
        />
      );
    }
  }

  const pieceElements = managedPieces.map(p => (
    <ChessPiece3D
      key={p.id}
      id={p.id}
      type={p.type}
      color={p.color}
      position={p.position}
      isCaptured={p.isCaptured}
      isEngineMove={p.isEngineMove}
    />
  ));

  // Coordinates A-H (Files) and 1-8 (Ranks)
  const coords = [];
  const coordColor = '#ffffff';
  
  for (let i = 0; i < 8; i++) {
    // Files A-H (bottom row, z = 4.2)
    coords.push(
      <Text 
        key={`file-${i}`} 
        position={[i - 3.5, 0.05, 4.25]} 
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color={coordColor}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {String.fromCharCode(65 + i)}
      </Text>
    );
    // Ranks 1-8 (left column, x = -4.2)
    coords.push(
      <Text 
        key={`rank-left-${i}`} 
        position={[-4.25, 0.05, 3.5 - i]} 
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color={coordColor}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {i + 1}
      </Text>
    );
    // Ranks 1-8 (right column, x = 4.2)
    coords.push(
      <Text 
        key={`rank-right-${i}`} 
        position={[4.25, 0.05, 3.5 - i]} 
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color={coordColor}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {i + 1}
      </Text>
    );
  }

  return (
    <group>
      {/* Board Base / Frame */}
      <mesh position={[0, -0.25, 0]}>
        {/* Frame is slightly larger than 8x8 (e.g. 9x9) */}
        <boxGeometry args={[9, 0.5, 9]} />
        <meshPhysicalMaterial 
          map={woodTexture}
          color="#3d2314" // Tint dark
          roughness={0.8}
        />
      </mesh>
      
      {/* Coordinates */}
      <group position={[0, -0.01, 0]}>
        {coords}
      </group>
      
      {/* Squares and Pieces */}
      <group position={[0, 0.01, 0]}>
        {squares}
        {pieceElements}
      </group>

      {promotionMove && (
        <Html center position={[0, 2, 0]}>
          <PromotionModal 
            color={turn} 
            onSelect={handlePromotionSelect} 
            onCancel={cancelPromotion} 
          />
        </Html>
      )}
    </group>
  );
});

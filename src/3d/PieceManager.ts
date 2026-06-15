import { useEffect, useState, useRef } from 'react';
import type { Square, PieceSymbol, Color, Move } from 'chess.js';

export interface PieceData {
  id: string; // Unique stable ID (e.g., 'w_p_a2')
  type: PieceSymbol;
  color: Color;
  square: Square | null; // null if captured
  position: [number, number, number]; // [x, y, z]
  isCaptured: boolean;
  isEngineMove: boolean;
}

function getCoords(square: Square): [number, number, number] {
  const file = square.charCodeAt(0) - 97; // a=0
  const rank = 8 - parseInt(square[1]); // 8=0
  return [file - 3.5, 0, rank - 3.5];
}

export function usePieceManager(
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][],
  history: Move[],
  isEngineTurn: boolean // If it was the engine's turn that just completed
) {
  const [pieces, setPieces] = useState<PieceData[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && board.length > 0 && board[0].length > 0) {
      // First pass: create stable IDs based on starting positions
      const initialPieces: PieceData[] = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p) {
            initialPieces.push({
              id: `${p.color}_${p.type}_${p.square}`,
              type: p.type,
              color: p.color,
              square: p.square,
              position: getCoords(p.square),
              isCaptured: false,
              isEngineMove: false,
            });
          }
        }
      }
      setPieces(initialPieces);
      initialized.current = true;
    } else if (initialized.current) {
      // Subsequent updates: reconcile with the board state
      setPieces(prev => {
        const next = [...prev];
        
        // Track which pieces are on the board
        const onBoard = new Set<string>();
        
        // Find which square holds which piece
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) {
              // Find the piece in `next` that is closest or already on this square
              // Since chess pieces don't change type (except promotion), we find the piece 
              // that matches color and type, and prioritize the one already at this square
              
              let match = next.find(x => !x.isCaptured && x.square === p.square && x.type === p.type && x.color === p.color);
              
              if (!match) {
                // Fallback: just find ANY uncaptured piece of the same type/color
                // We'll pick the one closest to this square to handle multiple rooks/knights gracefully
                let bestMatch: PieceData | undefined;
                let minDist = Infinity;
                const targetCoords = getCoords(p.square);
                
                const lastMove = history[history.length - 1];
                const searchType = (lastMove && lastMove.to === p.square && lastMove.promotion === p.type) ? 'p' : p.type;
                
                next.forEach(x => {
                  if (!x.isCaptured && x.type === searchType && x.color === p.color && !onBoard.has(x.id)) {
                    const dist = Math.pow(x.position[0] - targetCoords[0], 2) + Math.pow(x.position[2] - targetCoords[2], 2);
                    if (dist < minDist) {
                      minDist = dist;
                      bestMatch = x;
                    }
                  }
                });
                match = bestMatch;
              }
              
              if (match) {
                match.square = p.square;
                match.position = getCoords(p.square);
                match.isEngineMove = isEngineTurn; // If the opponent just moved, they are the engine
                onBoard.add(match.id);
              }
            }
          }
        }

        // Handle promotion morphing (fallback logic above won't catch type change if promotion happens)
        const lastMove = history[history.length - 1];
        if (lastMove && lastMove.promotion) {
           const promotedPiece = next.find(x => x.square === lastMove.to && !x.isCaptured);
           if (promotedPiece) {
             promotedPiece.type = lastMove.promotion;
           }
        }

        // Any piece not on the board is captured
        next.forEach(p => {
          if (!onBoard.has(p.id)) {
            p.isCaptured = true;
            p.square = null;
          }
        });

        return next;
      });
    }
  }, [board, history]); // Only recalculate when board/history changes

  return pieces;
}

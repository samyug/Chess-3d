import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { Move, Square as ChessSquare, PieceSymbol, Color } from 'chess.js';

export interface CapturedPieces {
  w: Record<PieceSymbol, number>;
  b: Record<PieceSymbol, number>;
}

export interface GameState {
  fen: string;
  board: ({ square: ChessSquare; type: PieceSymbol; color: Color } | null)[][];
  turn: Color;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isStalemate: boolean;
  history: Move[];
  capturedPieces: CapturedPieces;
}

export function useChessGame() {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());

  const updateState = useCallback(() => {
    setFen(chess.fen());
  }, [chess]);

  const makeMove = useCallback((move: string | { from: string; to: string; promotion?: string }) => {
    try {
      const result = chess.move(move);
      if (result) {
        updateState();
        return result;
      }
    } catch (e) {
      // Invalid move
      return null;
    }
    return null;
  }, [chess, updateState]);

  const undoMove = useCallback(() => {
    const result = chess.undo();
    if (result) {
      updateState();
    }
    return result;
  }, [chess, updateState]);

  const resetGame = useCallback(() => {
    chess.reset();
    updateState();
  }, [chess, updateState]);

  const loadFen = useCallback((newFen: string) => {
    try {
      chess.load(newFen);
      updateState();
      return true;
    } catch (e) {
      return false;
    }
  }, [chess, updateState]);

  const getLegalMoves = useCallback((square: ChessSquare) => {
    return chess.moves({ square, verbose: true });
  }, [chess]);

  // Calculate captured pieces
  // Pieces captured by white are black pieces missing from board
  // Pieces captured by black are white pieces missing from board
  const capturedPieces = useMemo(() => {
    const initialCounts: Record<PieceSymbol, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
    const currentCounts = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
    };

    const board = chess.board();
    for (const row of board) {
      for (const piece of row) {
        if (piece) {
          currentCounts[piece.color][piece.type]++;
        }
      }
    }

    const captured = {
      w: { ...initialCounts },
      b: { ...initialCounts }
    };

    for (const type of Object.keys(initialCounts) as PieceSymbol[]) {
      captured.w[type] -= currentCounts.b[type];
      captured.b[type] -= currentCounts.w[type];
    }

    return captured;
  }, [fen, chess]);

  const state: GameState = useMemo(() => ({
    fen,
    board: chess.board(),
    turn: chess.turn(),
    isCheck: chess.inCheck(),
    isCheckmate: chess.isCheckmate(),
    isDraw: chess.isDraw(),
    isStalemate: chess.isStalemate(),
    history: chess.history({ verbose: true }) as Move[],
    capturedPieces
  }), [fen, chess, capturedPieces]);

  return {
    state,
    makeMove,
    undoMove,
    resetGame,
    loadFen,
    getLegalMoves
  };
}

import type { PieceSymbol, Color } from 'chess.js';

interface PieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

const pieceMap: Record<string, string> = {
  wk: 'Chess_klt45.svg',
  wq: 'Chess_qlt45.svg',
  wr: 'Chess_rlt45.svg',
  wb: 'Chess_blt45.svg',
  wn: 'Chess_nlt45.svg',
  wp: 'Chess_plt45.svg',
  bk: 'Chess_kdt45.svg',
  bq: 'Chess_qdt45.svg',
  br: 'Chess_rdt45.svg',
  bb: 'Chess_bdt45.svg',
  bn: 'Chess_ndt45.svg',
  bp: 'Chess_pdt45.svg',
};

export function Piece({ type, color, className = '' }: PieceProps) {
  const pieceKey = `${color}${type}`;
  const filename = pieceMap[pieceKey];

  if (!filename) return null;

  return (
    <img 
      src={`/pieces/${filename}`} 
      alt={`${color} ${type}`}
      className={`piece ${className}`}
      draggable={false}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
        transition: 'transform 0.2s ease',
        pointerEvents: 'none'
      }}
    />
  );
}

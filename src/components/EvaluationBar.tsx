import type { EngineEvaluation } from '../engine/EngineTypes';
import './EvaluationBar.css';

interface EvaluationBarProps {
  evaluation: EngineEvaluation | null;
  isBlackTurn: boolean;
}

export function EvaluationBar({ evaluation, isBlackTurn }: EvaluationBarProps) {
  let fillPercentage = 50;
  let text = '0.0';

  if (evaluation) {
    let cp = evaluation.type === 'cp' ? evaluation.value : 0;
    
    // Stockfish score is from current player's perspective. Normalize to White's perspective.
    if (isBlackTurn) {
      cp = -cp;
    }

    if (evaluation.type === 'mate') {
      let mateIn = evaluation.value;
      if (isBlackTurn) mateIn = -mateIn;
      
      // If mate in 0, the game is over. If > 0, white has mate.
      text = `M${Math.abs(mateIn)}`;
      fillPercentage = mateIn > 0 ? 100 : 0;
    } else {
      const displayVal = cp / 100;
      text = (displayVal > 0 ? '+' : '') + displayVal.toFixed(1);
      
      // Map cp to a percentage for the bar. 
      // A common formula for win probability: 50 + 50 * (2 / (1 + e^(-0.00368 * cp)) - 1)
      const winProbability = 2 / (1 + Math.exp(-0.00368208 * cp)) - 1;
      fillPercentage = 50 + (winProbability * 50);
    }
  }

  fillPercentage = Math.max(0, Math.min(100, fillPercentage));
  const isWhiteAdvantage = fillPercentage >= 50;

  return (
    <div className="eval-bar-container">
      <div 
        className="eval-bar-fill-black" 
        style={{ height: `${100 - fillPercentage}%` }}
      />
      <div 
        className="eval-bar-fill-white" 
        style={{ height: `${fillPercentage}%` }}
      />
      <div className={`eval-bar-text ${isWhiteAdvantage ? 'text-black' : 'text-white'}`} style={{
        top: isWhiteAdvantage ? '10px' : 'auto',
        bottom: !isWhiteAdvantage ? '10px' : 'auto'
      }}>
        {text}
      </div>
    </div>
  );
}

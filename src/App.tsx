import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useMemo, useEffect } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { useEngine } from './hooks/useEngine';
import { useSettings } from './hooks/useSettings';
import { SettingsPanel } from './components/SettingsPanel';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { ChessBoard3D } from './3d/ChessBoard3D';
import { SceneLighting } from './3d/SceneLighting';
import { CameraController } from './3d/CameraController';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  const { settings, setSettings } = useSettings();
  const { state, makeMove, getLegalMoves, resetGame } = useChessGame();
  const [flipBoard, setFlipBoard] = useState(false);
  const [resetCameraPulse, setResetCameraPulse] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Handle random color selection for HvC
  const [randomEngineColor, setRandomEngineColor] = useState<'w'|'b'>('b');

  const handleNewGame = () => {
    if (settings.playerColor === 'random') {
      setRandomEngineColor(Math.random() > 0.5 ? 'w' : 'b');
    }
    resetGame();
  };

  const engineColors = useMemo(() => {
    if (settings.gameMode === 'HvH') return [];
    if (settings.gameMode === 'CvC') return ['w', 'b'];
    if (settings.gameMode === 'Analysis') return [];
    // HvC
    if (settings.playerColor === 'random') return [randomEngineColor];
    return settings.playerColor === 'w' ? ['b'] : ['w'];
  }, [settings.gameMode, settings.playerColor, randomEngineColor]);

  const isEngineTurn = engineColors.includes(state.turn) && !state.isCheckmate && !state.isDraw && !state.isStalemate;

  const { isReady, isThinking, triggerEngineMove, startAnalysis, stopEngine } = useEngine(settings);

  // Game Loop
  useEffect(() => {
    if (isEngineTurn && isReady) {
      // Small timeout to allow UI to render the human's move before engine starts freezing thread
      const timer = setTimeout(() => {
        triggerEngineMove(state.fen, (move) => {
          makeMove(move);
        });
      }, 50);
      return () => clearTimeout(timer);
    } else if (settings.gameMode === 'Analysis' && isReady) {
      const timer = setTimeout(() => {
        startAnalysis(state.fen);
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isEngineTurn && settings.gameMode !== 'Analysis') {
      stopEngine();
    }
  }, [state.fen, isEngineTurn, settings.gameMode, isReady, triggerEngineMove, startAnalysis, stopEngine, makeMove]);

  // Derive last move string
  const lastMoveString = state.history.length > 0 
    ? `${Math.ceil(state.history.length / 2)}. ${state.history[state.history.length - 1].san}` 
    : null;

  return (
    <div className="app-container">
      {isSettingsOpen && (
        <SettingsPanel 
          settings={settings} 
          onSettingsChange={setSettings} 
          onNewGame={handleNewGame} 
        />
      )}

      <LeftSidebar 
        onNewGame={handleNewGame}
        onFlipBoard={() => setFlipBoard(!flipBoard)}
        onResetCamera={() => setResetCameraPulse(prev => prev + 1)}
        onSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        onTakeBack={() => {
          // Placeholder for undo functionality
          console.log('Undo clicked');
        }}
      />

      <RightSidebar 
        isReady={isReady}
        isThinking={isThinking}
        difficulty={settings.useAdvancedSettings ? 'Custom' : settings.difficulty}
        turn={state.turn}
        lastMove={lastMoveString}
        capturedPieces={state.capturedPieces}
      />

      <main className="main-content" style={{ width: '100%', height: '100%' }}>
        {/* 3D Board Container */}
        <div className="board-3d-wrapper" style={{ 
          pointerEvents: isEngineTurn && settings.gameMode !== 'Analysis' ? 'none' : 'auto',
          opacity: isEngineTurn && settings.gameMode !== 'Analysis' ? 0.95 : 1,
          transition: 'opacity 0.3s ease',
          filter: isEngineTurn && settings.gameMode !== 'Analysis' ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' : 'none',
        }}>
          <ErrorBoundary>
            <Canvas dpr={[1, 2]}>
              <Suspense fallback={null}>
                <SceneLighting />
                <CameraController flipBoard={flipBoard} resetPulse={resetCameraPulse} />
                <ChessBoard3D 
                  board={state.board}
                  history={state.history}
                  inCheck={state.isCheck}
                  turn={state.turn}
                  isEngineTurn={isEngineTurn}
                  onMove={makeMove}
                  getLegalMoves={getLegalMoves}
                />
              </Suspense>
            </Canvas>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default App;

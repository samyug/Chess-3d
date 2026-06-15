# Stockfish Engine Integration

This project integrates Stockfish 16.1 via WebAssembly (WASM) to provide a world-class chess AI directly in the browser, without requiring a backend server.

## WebWorker Architecture
Chess engines calculate millions of positions per second. If run on the main thread, the engine would instantly lock up the browser, preventing the user from interacting with the UI or seeing the 3D scene render. 
To solve this, Stockfish is loaded as a WebWorker (`stockfish.js`). The `EngineService` singleton acts as the main thread's bridge to the worker.

## Universal Chess Interface (UCI) Protocol
Communication between our React application and Stockfish happens via the standardized UCI protocol, utilizing a simple string-based messaging system.

### Key Commands Sent:
- `uci`: Initializes the engine.
- `position fen [FEN_STRING]`: Syncs the engine's internal board state with our React `chess.js` state.
- `go depth 15`: Instructs the engine to begin calculating the best move up to a depth of 15 half-moves.
- `stop`: Halts calculation immediately.

### Key Responses Handled (`UciParser.ts`):
As the engine thinks, it blasts `info` strings back to the main thread. Our custom UCI parser extracts:
- **Depth:** How far ahead the engine has calculated.
- **Score (cp):** The evaluation of the position in centipawns (e.g., +1.5 means White is ahead by 1.5 pawns).
- **Nodes/NPS:** The total number of board states evaluated and the speed of calculation.
- **PV (Principal Variation):** The sequence of moves the engine believes is best.

## Difficulty Scaling
Stockfish at maximum strength is unbeatable by humans. We scale difficulty dynamically:
1. **Depth Limits:** Capping calculation depth to artificially limit foresight.
2. **Move Time Limits:** Forcing the engine to make a decision within a fraction of a second.
3. **Skill Level (0-20):** Utilizing Stockfish's internal `Skill Level` parameter to introduce human-like inaccuracies at lower difficulties.

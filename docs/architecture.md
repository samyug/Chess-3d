# System Architecture

The 3D Chess application follows a strictly decoupled, unidirectional data flow architecture designed for high performance and clean separation of concerns.

## High-Level Flow

```text
[ User Input (Mouse/Touch) ]
          │
          ▼
[ Game State Manager (chess.js) ] ──────┐
          │                             │
          ▼                             ▼
[ React Component Tree ]        [ Stockfish WebWorker ]
          │                             │
          ▼                             │
[ 3D Render Engine (Three.js) ] ◄───────┘
          │ (Metrics & Best Move Events)
          ▼
[ GPU Output ]
```

## Core Modules

### 1. Game State (`src/hooks/useChessGame.ts`)
The absolute source of truth. Built around the robust `chess.js` library, it handles move validation, FEN parsing, check/mate detection, and move history. It exposes a clean React hook interface to the UI.

### 2. Engine Service (`src/engine/EngineService.ts`)
A dedicated singleton that manages the Stockfish WebWorker. 
- Communicates asynchronously via the Universal Chess Interface (UCI) protocol.
- Calculates evaluations, Principal Variations (PV), and node depths entirely off the main thread.
- Dispatches event updates to UI listeners without triggering global React state cascades.

### 3. Rendering Engine (`src/3d/`)
Built with `@react-three/fiber` and `@react-three/drei`.
- Translates the logical board state into a physical 3D scene.
- Handles piece animation, dynamic lighting, physics-based materials, and camera controls.
- Optimized heavily to avoid continuous rendering (see `performance.md`).

### 4. User Interface (`src/components/`)
A responsive HTML/CSS overlay layer built with React.
- Provides game settings, move history logs, captured piece tracking, and live engine analysis metrics.
- Overlays cleanly on top of the 3D Canvas, ensuring DOM updates do not block the WebGL render loop.

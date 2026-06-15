# Changelog

All notable changes to this project will be documented in this file.

## [v1.0.0] - Initial Release

The official stable release of the 3D Chess Engine.

### Added
- **Core Chess Mechanics:** Full integration with `chess.js` supporting standard movement, castling, en passant, promotion, and check/mate detection.
- **3D Rendering Pipeline:** Fully interactive 3D chessboard built with `three.js` and `@react-three/fiber`.
- **Physical Materials:** High-fidelity matte wood and ultra-premium ivory/obsidian materials for chess pieces.
- **Dynamic Camera:** `react-spring` driven camera that automatically flips to the correct orientation.
- **Piece Animations:** Smooth parabolic interpolation curves for piece movement and captures.
- **Stockfish AI:** Native WebAssembly (WASM) implementation of Stockfish 16.1 running off-thread in a WebWorker.
- **Difficulty Scaling:** Variable depth and skill limit implementations for casual to grandmaster level play.
- **Engine Analytics:** Live evaluation bar, depth tracking, and Principal Variation (PV) readout panel.
- **Performance Architecture:** 
  - Heavily optimized React rendering loop (`React.memo`).
  - Zero-cost idle GPU state via on-demand rendering.
  - Centralized GLTF geometry and material caching (sub-100 draw calls).

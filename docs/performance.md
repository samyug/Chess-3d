# Performance Optimizations

Rendering 32 animated 3D meshes alongside a chess engine calculating 500,000 nodes per second requires aggressive optimization to maintain a smooth 60fps experience without draining battery life.

## 1. On-Demand Rendering (`frameloop="demand"`)
By default, game engines run a continuous render loop (60+ times a second). Since chess is a fundamentally static game punctuated by short bursts of movement, we use React Three Fiber's `demand` mode.
- The GPU rests at **0% usage** while idle.
- We hook directly into the `react-spring` animation controllers to selectively `invalidate()` the frame buffer only when pieces are actively moving or the camera is orbiting.

## 2. Global Asset Caching & Shared Memory
Loading 32 individual GLTF models and instantiating 32 separate physics-based materials causes severe VRAM bloating and draw-call overhead.
- **Geometries:** We load the 6 fundamental piece shapes once and extract their `BufferGeometry`.
- **Materials:** We maintain a single `PieceMaterials` cache containing one ultra-premium white material and one black material.
- **Result:** We render the scene using less than 100 draw calls with almost zero duplicated memory.

## 3. React Render Isolation
A common pitfall in React state management is the "rerender cascade." If the Stockfish engine updates its depth metric 15 times a second, placing that metric in `App.tsx` forces the entire 3D scene to rerender.
- We decoupled the engine metrics. The WebWorker communicates via a pub/sub event emitter directly to a localized `useEngineMetrics()` hook inside the `RightSidebar`.
- The `ChessBoard3D` component is wrapped in `React.memo()`, guaranteeing it is entirely shielded from engine update cycles.

## 4. Stable Piece Identity
We use a `PieceManager` to track pieces across moves, assigning them stable UUIDs (e.g., `white-pawn-a2`). This ensures React preserves the actual mesh instance in the DOM across moves, rather than unmounting and remounting objects every time the FEN string changes. This allows `react-spring` to smoothly interpolate positions without stutter.

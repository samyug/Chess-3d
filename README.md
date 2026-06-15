<div align="center">
  <img src="docs/screenshots/hero.png" alt="3D Chess Engine Hero Image" width="100%" />

  <h1>3D Chess Engine</h1>
  
  <p>A high-performance, web-based 3D chess application featuring an off-thread Stockfish 16.1 AI integration, built with React Three Fiber.</p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/Stockfish-111111?style=flat-square&logo=linux&logoColor=white" alt="Stockfish" />
    <img src="https://img.shields.io/github/license/samyug/3d-chess-engine?style=flat-square" alt="License" />
  </p>
</div>

---

## 🌟 Features

- **Full Chess Ruleset:** En passant, castling, pawn promotion, and 50-move draw rules all natively supported via `chess.js`.
- **Grandmaster AI Integration:** Play against Stockfish 16.1 running entirely client-side via WebAssembly (WASM).
- **Difficulty Scaling:** Dynamic calculation depth and skill limits allow for casual or competitive play.
- **Engine Analytics:** Live evaluation bar, node depth tracking, and Principal Variation (PV) visualizations.
- **Premium 3D Aesthetics:** Physically-based materials (PBR), dynamic lighting, and soft contact shadows.
- **Parabolic Animation Physics:** Smooth, lifelike piece movement driven by `@react-spring/three`.
- **High-Performance Architecture:** 60fps rendering with a decoupled engine worker to guarantee a stutter-free UI.

---


## 🏗 System Architecture

The application is built on a strictly decoupled, unidirectional data flow architecture designed to prevent the intense calculations of the chess engine from interrupting the 60fps WebGL render loop.

```text
[ User Input ]  ──►  [ chess.js State Manager ]  ──►  [ Stockfish WebWorker ]
                             │                                  │
                             ▼                                  ▼
                     [ React Component Tree ]           [ Async Evaluation ]
                             │                                  │
                             ▼                                  ▼
                 [ 3D Render Engine (Three.js) ] ◄──  [ UI Evaluation Panel ]
```

> **Read more in the detailed documentation:**
> - [Architecture Overview](docs/architecture.md)
> - [Performance Optimizations](docs/performance.md)
> - [Engine Integration](docs/engine.md)
> - [3D Rendering Pipeline](docs/rendering.md)

---

## 🚀 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/3d-chess-engine.git
   cd 3d-chess-engine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`.*

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🗺 Future Roadmap

- [ ] **Multiplayer Architecture:** WebRTC or WebSocket integration for peer-to-peer play.
- [ ] **Opening Explorer:** Integration with a master games database.
- [ ] **Endgame Tablebases:** Syzygy tablebase support for perfect endgame evaluation.
- [ ] **Cloud Analysis:** Offloading deep engine calculations to a dedicated cloud server.
- [ ] **Thematic Environments:** Additional 3D environments (e.g., Park, Library, Tournament Hall).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

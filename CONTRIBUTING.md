# Contributing to 3D Chess Engine

Thank you for your interest in contributing! Whether it's a bug report, a new feature, or a typo fix, all contributions are welcome.

## Local Development Setup

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
   The app will be available at `http://localhost:5173`.

## Architecture Overview
Before contributing to core systems, please read the documentation in the `/docs` folder:
- [System Architecture](docs/architecture.md)
- [Performance Optimizations](docs/performance.md)
- [Engine Integration](docs/engine.md)
- [3D Rendering Pipeline](docs/rendering.md)

## Submitting Pull Requests
1. Fork the repository and create your branch from `main`.
2. Ensure your code compiles with zero TypeScript errors (`npm run build`).
3. If you've added new features or altered existing 3D rendering pipelines, please describe the performance implications (e.g., changes to draw calls, React render loops) in your PR description.
4. Issue a Pull Request and await review!

## Code Style
This project utilizes ESLint and TypeScript strict mode. Please ensure all code passes `npm run lint` before submitting a PR.

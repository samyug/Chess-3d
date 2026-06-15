# 3D Rendering Pipeline

The visual presentation is powered by **Three.js** mapped to React components via **React Three Fiber (R3F)**. The goal is to provide a premium, physically accurate aesthetic reminiscent of a physical wooden chess set.

## Lighting & Environment (`SceneLighting.tsx`)
Lighting is crucial for achieving photorealism.
- **HDRI Environment:** We use an environment map (`city` preset via `@react-three/drei`) to provide highly accurate, global ambient lighting and crisp reflections on the glossy pieces.
- **Directional Lighting:** A soft, angled directional light provides subtle shadowing to ground the pieces on the board without washing out the textures.
- **Contact Shadows:** We utilize soft contact shadows beneath the board to give it a sense of weight and physical presence on the screen.

## Materials (`PieceMaterials.ts`)
The chess pieces use `MeshPhysicalMaterial`, the most advanced material in Three.js, to simulate real-world surface properties:
- **Roughness/Metalness:** Tweaked to achieve a high-quality matte wood finish.
- **Colors:** The white pieces use a warm ivory (`#ebdcb5`), while the black pieces use a deep obsidian (`#161616`).

## Animation (`react-spring`)
Piece movements are not instant teleportations. We use `@react-spring/three` to drive physically-based spring physics.
- When a move is registered, the piece interpolates its position across the board.
- The animation utilizes a two-part easing curve (parabolic arc) to simulate a hand lifting the piece and placing it firmly on the target square.
- Captured pieces scale down to zero before unmounting for a smooth exit.

## Camera System (`CameraController.tsx`)
The camera uses a fixed perspective optimized for gameplay.
- **Fixed Angle:** Placed at a 40-degree downward angle to ensure the entire board is visible with perfect clarity, prioritizing competitive playability over cinematic exploration.
- **Smooth Flips:** When playing as Black, or when triggering the "Flip Board" action, the camera smoothly orbits 180 degrees via spring physics to perfectly orient the board to the player's perspective.

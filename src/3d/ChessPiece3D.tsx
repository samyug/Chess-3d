import { useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import React, { useEffect, useMemo, useRef } from 'react';
import type { PieceSymbol, Color } from 'chess.js';
import * as THREE from 'three';
import { PieceMaterials } from './PieceMaterials';
import { useThree } from '@react-three/fiber';

interface ChessPiece3DProps {
  id: string;
  type: PieceSymbol;
  color: Color;
  position: [number, number, number];
  isCaptured?: boolean;
  isEngineMove?: boolean;
}

const MODEL_MAP: Record<PieceSymbol, string> = {
  k: '/models/king.gltf',
  q: '/models/queen.gltf',
  r: '/models/rook.gltf',
  b: '/models/bishop.gltf',
  n: '/models/knight.gltf',
  p: '/models/pawn.gltf'
};

export const ChessPiece3D = React.memo(function ChessPiece3D({ type, color, position, isCaptured, isEngineMove }: ChessPiece3DProps) {
  const { scene } = useGLTF(MODEL_MAP[type]);
  const { invalidate } = useThree();
  
  // Clone scene so multiple pieces of same type don't share identical material instances
  // We use useMemo so it only happens once per piece instance
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Center and ground the piece dynamically
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Shift children to center them exactly and put base at y=0
    // We apply this to the clone itself so primitive object renders it correctly
    clone.position.set(-center.x, -box.min.y, -center.z);
    
    // Apply ultra-premium shared materials
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = color === 'w' ? PieceMaterials.white : PieceMaterials.black;
      }
    });
    
    return clone;
  }, [scene, color]);

  // If piece belongs to Black, flip 180 degrees so knights face forward
  const baseRotation = color === 'b' ? Math.PI : 0;

  // Faster, snappier glide animation
  const durationSlide = isEngineMove ? 250 : 150;

  // A base scale factor. Tuned up slightly from 0.12 to 0.18.
  const GLOBAL_SCALE = 0.18;

  // Spring animation
  const [{ springPos, springScale }, api] = useSpring(() => ({
    springPos: position,
    springScale: [GLOBAL_SCALE, GLOBAL_SCALE, GLOBAL_SCALE],
    config: { tension: 220, friction: 24 },
    onChange: () => invalidate() // Invalidate frame when spring is animating
  }));

  const prevPos = useRef(position);

  // Trigger animation on position or capture change
  useEffect(() => {
    if (isCaptured) {
      api.start({
        to: async (next) => {
          await next({ springScale: [0, 0, 0], springPos: [position[0], -1, position[2]], config: { duration: 200 } });
        }
      });
      return;
    }

    // Only animate if it actually moved
    if (prevPos.current[0] === position[0] && prevPos.current[2] === position[2]) return;
    
    const startPos = prevPos.current;
    
    // Parabolic arc animation for a professional, realistic lift-and-place feel
    api.start({
      to: async (next) => {
        // 1. Arc up and over (Ease Out)
        await next({ 
          springPos: [(position[0] + startPos[0])/2, 1.2, (position[2] + startPos[2])/2], 
          config: { duration: durationSlide * 0.45, easing: t => Math.sin((t * Math.PI) / 2) } 
        });
        // 2. Arc down and place (Ease In)
        await next({ 
          springPos: [position[0], 0, position[2]], 
          config: { duration: durationSlide * 0.55, easing: t => 1 - Math.cos((t * Math.PI) / 2) } 
        });
      }
    });

    prevPos.current = position;
  }, [position[0], position[2], isCaptured, api, durationSlide]);

  if (!clonedScene) return null;

  return (
    <a.group 
      position={springPos as any} 
      scale={springScale as any}
      rotation={[0, baseRotation, 0]}
    >
      {/* We wrap the primitive in another group to avoid overriding its offset position */}
      <group>
        <primitive object={clonedScene} />
      </group>
    </a.group>
  );
}, (prev, next) => {
  // Only rerender if strictly necessary
  return (
    prev.position[0] === next.position[0] &&
    prev.position[2] === next.position[2] &&
    prev.isCaptured === next.isCaptured
  );
});

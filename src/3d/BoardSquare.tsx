import React, { useState } from 'react';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

interface BoardSquareProps {
  square: string;
  position: [number, number, number];
  isDark: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  inCheck: boolean;
  hasPiece: boolean;
  onClick: () => void;
}

export const BoardSquare = React.memo(function BoardSquare({
  position,
  isDark,
  isSelected,
  isLegalMove,
  isLastMove,
  inCheck,
  hasPiece,
  onClick
}: BoardSquareProps) {
  const [hovered, setHovered] = useState(false);
  const { invalidate } = useThree();
  const woodTexture = useTexture('/textures/wood.jpg');

  // Standard competitive colors
  const baseColor = isDark ? '#b58863' : '#f0d9b5';
  
  // Determine glow/highlight color
  let emissive = '#000000';
  let emissiveIntensity = 0;
  let finalColor = baseColor;

  if (inCheck) {
    emissive = '#ff0000';
    emissiveIntensity = 0.5;
  } else if (isSelected) {
    // Chess.com style selected highlight (often a yellow-green)
    finalColor = isDark ? '#baca44' : '#f6f669';
  } else if (isLastMove) {
    // Last move is typically subtle yellow
    finalColor = isDark ? '#aba23a' : '#ced26b';
  } else if (hovered && isLegalMove) {
    // Hovering over a legal move
    finalColor = isDark ? '#baca44' : '#f6f669';
  } else if (hovered) {
    // Slight brightening on generic hover
    emissive = '#ffffff';
    emissiveIntensity = 0.05;
  }

  return (
    <group position={position}>
      <mesh 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          invalidate();
        }}
        onPointerOut={() => {
          setHovered(false);
          invalidate();
        }}
      >
        <boxGeometry args={[1, 0.1, 1]} />
        <meshPhysicalMaterial 
          map={woodTexture}
          color={finalColor}
          roughness={0.8}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Legal Move Indicator */}
      {isLegalMove && (
        <mesh position={[0, 0.06, 0]}>
          {hasPiece ? (
            // Hollow ring for captures
            <torusGeometry args={[0.35, 0.05, 8, 32]} />
          ) : (
            // Solid dot for empty squares
            <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          )}
          <meshBasicMaterial color="#000000" transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
});

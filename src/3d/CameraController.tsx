import { useSpring, a } from '@react-spring/three';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export function CameraController({ flipBoard }: { flipBoard: boolean; resetPulse: number }) {
  const { invalidate } = useThree();

  // Spring animation for flipping the board
  // We'll rotate the entire camera around the Y axis
  const { rotationY } = useSpring({
    rotationY: flipBoard ? Math.PI : 0,
    config: { tension: 80, friction: 20 },
    onChange: () => invalidate()
  });

  return (
    <a.group rotation-y={rotationY}>
      {/* We need to make sure the camera looks at the center of the board. 
          By default PerspectiveCamera looks down the negative Z axis.
          Since position is [0, 7.5, 9], looking at [0,0,0] requires rotation. */}
      <PerspectiveCamera 
        makeDefault 
        position={[0, 7.5, 9]} 
        rotation={[-Math.atan2(7.5, 9), 0, 0]}
        fov={40} 
      />
    </a.group>
  );
}

import { Environment, ContactShadows } from '@react-three/drei';

export function SceneLighting() {
  return (
    <>
      {/* Soft overall ambient light for visibility */}
      <ambientLight intensity={0.6} />
      
      {/* Subtle directional light for rim highlights, no harsh shadows */}
      <directionalLight 
        position={[5, 8, 2]} 
        intensity={0.8} 
        color="#fff5e6"
      />
      
      {/* Fill light to ensure dark side of pieces is still highly readable */}
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.4} 
        color="#e6f2ff" 
      />
      
      {/* Competitive soft contact shadows under pieces instead of hard raytraced shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={10}
        blur={1.5}
        far={1}
      />
      
      {/* Apartment or City preset provides natural, non-theatrical reflections */}
      <Environment preset="apartment" />
    </>
  );
}

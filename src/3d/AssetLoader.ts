import { useGLTF, useTexture } from '@react-three/drei';

const MODELS = [
  '/models/king.gltf',
  '/models/queen.gltf',
  '/models/rook.gltf',
  '/models/bishop.gltf',
  '/models/knight.gltf',
  '/models/pawn.gltf'
];

const TEXTURES = {
  light: {
    map: '/textures/wood_light/Wood062_1K-JPG_Color.jpg',
    roughnessMap: '/textures/wood_light/Wood062_1K-JPG_Roughness.jpg',
    normalMap: '/textures/wood_light/Wood062_1K-JPG_NormalGL.jpg',
  },
  dark: {
    map: '/textures/wood_dark/Wood027_1K-JPG_Color.jpg',
    roughnessMap: '/textures/wood_dark/Wood027_1K-JPG_Roughness.jpg',
    normalMap: '/textures/wood_dark/Wood027_1K-JPG_NormalGL.jpg',
  }
};

export function preloadAssets() {
  // Preload Models
  MODELS.forEach((path) => {
    useGLTF.preload(path);
  });

  // Preload Textures (Optional, usually handled by useTexture but good for caching)
  const allTextures = [
    ...Object.values(TEXTURES.light),
    ...Object.values(TEXTURES.dark)
  ];
  
  allTextures.forEach(path => {
    useTexture.preload(path);
  });
}

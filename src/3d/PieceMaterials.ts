import * as THREE from 'three';

export const PieceMaterials = {
  white: new THREE.MeshPhysicalMaterial({
    color: '#ebdcb5', // Ivory
    roughness: 0.8, // Matte finish
    metalness: 0.05, 
    clearcoat: 0.0, 
    envMapIntensity: 1.0, 
    transparent: true,
  }),
  black: new THREE.MeshPhysicalMaterial({
    color: '#161616', // Black
    roughness: 0.8, // Matte finish
    metalness: 0.05,
    clearcoat: 0.0,
    envMapIntensity: 1.0,
    transparent: true,
  })
};

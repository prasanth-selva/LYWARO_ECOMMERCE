import React from 'react';

export default function Environment() {
  return (
    <>
      {/* Ambient fill — subtle */}
      <ambientLight intensity={0.12} color="#e8e0d8" />

      {/* Key light — warm white from upper front-left */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={0.9}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* Crimson rim light — dramatic from behind-right */}
      <spotLight
        position={[-4, 3, -5]}
        intensity={3}
        color="#D50000"
        angle={0.5}
        penumbra={0.8}
        distance={20}
        decay={2}
      />

      {/* Secondary warm rim — from behind-left */}
      <pointLight
        position={[3, 1, -4]}
        intensity={0.8}
        color="#ff4444"
        distance={12}
        decay={2}
      />

      {/* Soft fill from below — subtle */}
      <pointLight
        position={[0, -2, 3]}
        intensity={0.25}
        color="#ffffff"
        distance={10}
        decay={2}
      />

      {/* Top accent — subtle glow */}
      <pointLight
        position={[0, 6, 1]}
        intensity={0.15}
        color="#ffffff"
        distance={12}
        decay={2}
      />

      {/* Ground shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.25} />
      </mesh>

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#050505', 6, 22]} />
    </>
  );
}

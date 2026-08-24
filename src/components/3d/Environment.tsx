import React from 'react';

export default function Environment() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.15} color="#ffffff" />

      {/* Key light - warm white from upper left */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Crimson rim light from behind-right */}
      <pointLight
        position={[-3, 2, -4]}
        intensity={1.5}
        color="#D50000"
        distance={15}
        decay={2}
      />

      {/* Soft fill from below */}
      <pointLight
        position={[0, -3, 3]}
        intensity={0.3}
        color="#ffffff"
        distance={10}
        decay={2}
      />

      {/* Subtle top light */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.2}
        color="#ffffff"
        distance={10}
        decay={2}
      />

      {/* Ground shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      {/* Subtle fog */}
      <fog attach="fog" args={['#050505', 8, 25]} />
    </>
  );
}

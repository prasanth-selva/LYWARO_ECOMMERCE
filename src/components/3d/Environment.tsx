import React from 'react';

export default function Environment() {
  return (
    <>
      {/* Ambient — very dim warm fill */}
      <ambientLight intensity={0.08} color="#ffe8d0" />

      {/* Key light — crisp white from front-top-left */}
      <directionalLight
        position={[3, 8, 5]}
        intensity={1.1}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />

      {/* Crimson rim light — the signature volcanic glow from behind */}
      <spotLight
        position={[-5, 2, -6]}
        intensity={5}
        color="#CC0000"
        angle={0.45}
        penumbra={0.9}
        distance={22}
        decay={1.8}
      />

      {/* Secondary crimson accent from below-right */}
      <pointLight
        position={[4, -1, -5]}
        intensity={2.2}
        color="#FF2222"
        distance={14}
        decay={2}
      />

      {/* Subtle warm fill from front-right */}
      <pointLight
        position={[5, 2, 4]}
        intensity={0.4}
        color="#fff0e8"
        distance={12}
        decay={2}
      />

      {/* Thin top highlight */}
      <pointLight
        position={[0, 7, 2]}
        intensity={0.2}
        color="#ffffff"
        distance={14}
        decay={2}
      />

      {/* Ground shadow receiver */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      {/* Atmospheric fog — very slight */}
      <fog attach="fog" args={['#060606', 8, 25]} />
    </>
  );
}

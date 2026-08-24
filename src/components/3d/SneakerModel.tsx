import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SneakerModelProps {
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  dragOffset: number;
  onInteractionStart?: () => void;
}

export default function SneakerModel({
  mousePosition,
  isDragging,
  dragOffset,
  onInteractionStart,
}: SneakerModelProps) {
  const { scene } = useGLTF('/models/lywaro-apex.glb');
  const modelRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const rotationTarget = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // Mark interaction
  useEffect(() => {
    if (isDragging && !hasInteracted) {
      setHasInteracted(true);
      onInteractionStart?.();
    }
  }, [isDragging, hasInteracted, onInteractionStart]);

  useFrame((state) => {
    if (!modelRef.current) return;

    const time = state.clock.getElapsedTime();

    // Mouse-driven rotation targets
    if (!isDragging) {
      rotationTarget.current.y = mousePosition.x * 0.3;
      rotationTarget.current.x = mousePosition.y * 0.15;
    } else {
      rotationTarget.current.y = dragOffset;
    }

    // Smooth interpolation
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      rotationTarget.current.x,
      reducedMotion ? 0.1 : 0.05
    );
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      rotationTarget.current.y,
      reducedMotion ? 0.1 : 0.05
    );

    // Idle animation (subtle float + slow rotation)
    const idleRotY = reducedMotion ? 0 : Math.sin(time * 0.2) * 0.05;
    const idleFloatY = reducedMotion ? 0 : Math.sin(time * 0.8) * 0.02;

    modelRef.current.rotation.x = currentRotation.current.x;
    modelRef.current.rotation.y = currentRotation.current.y + idleRotY;
    modelRef.current.position.y = idleFloatY;
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/lywaro-apex.glb');

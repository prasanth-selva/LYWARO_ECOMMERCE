import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SneakerModelProps {
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  dragOffset: number;
  velocity: number;
  zoom: number;
  reducedMotion: boolean;
  onInteractionStart?: () => void;
}

export default function SneakerModel({
  mousePosition,
  isDragging,
  dragOffset,
  velocity,
  zoom,
  reducedMotion,
  onInteractionStart,
}: SneakerModelProps) {
  const { scene } = useGLTF('/models/lywaro-apex.glb');
  const modelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Rotation state refs (avoid re-renders)
  const rotY = useRef(0);
  const rotX = useRef(0);
  const inertiaVel = useRef(0);
  const currentZoom = useRef(4);

  // Mark first interaction
  useEffect(() => {
    if (isDragging && !hasInteracted) {
      setHasInteracted(true);
      onInteractionStart?.();
    }
  }, [isDragging, hasInteracted, onInteractionStart]);

  // When drag ends with velocity, store inertia
  useEffect(() => {
    if (!isDragging && Math.abs(velocity) > 0.01) {
      inertiaVel.current = velocity * 1.5;
    }
  }, [isDragging, velocity]);

  // Reset when dragOffset goes to 0 (double-click reset)
  useEffect(() => {
    if (!isDragging && Math.abs(dragOffset) < 0.001) {
      rotY.current = THREE.MathUtils.lerp(rotY.current, 0, 0.05);
      rotX.current = THREE.MathUtils.lerp(rotX.current, 0, 0.05);
      inertiaVel.current = 0;
    }
  }, [dragOffset, isDragging]);

  useFrame((state, delta) => {
    if (!modelRef.current) return;
    const time = state.clock.getElapsedTime();
    const clampedDelta = Math.min(delta, 0.05);

    // Calculate base rotation targets based on mode
    let targetY = 0;
    let targetX = 0;

    if (isDragging) {
      // Direct drag control + mouse tilt
      targetY = dragOffset;
      targetX = mousePosition.y * 0.2;
      inertiaVel.current = 0;
    } else if (Math.abs(inertiaVel.current) > 0.001) {
      // Inertia decay after drag release
      rotY.current += inertiaVel.current * clampedDelta;
      inertiaVel.current *= 0.92;
      targetY = rotY.current;
      targetX = mousePosition.y * 0.15;
    } else {
      // Idle & Mouse Interaction
      // 1. Subtle mouse interaction (horizontal -> Y rot, vertical -> X tilt)
      const mouseRotY = mousePosition.x * 0.35;
      const mouseTiltX = mousePosition.y * 0.18;

      // 2. Subtle idle breathing/oscillation (NOT continuous 360 spinning)
      const idleOscillationY = reducedMotion ? 0 : Math.sin(time * 0.7) * 0.08;
      const idleOscillationX = reducedMotion ? 0 : Math.cos(time * 0.9) * 0.03;

      targetY = dragOffset + mouseRotY + idleOscillationY;
      targetX = mouseTiltX + idleOscillationX;
    }

    // Clamp X rotation to prevent full flip (±60°)
    targetX = THREE.MathUtils.clamp(targetX, -Math.PI / 3, Math.PI / 3);

    // Apply rotation smoothly with damping
    rotY.current = THREE.MathUtils.lerp(rotY.current, targetY, isDragging ? 0.2 : 0.06);
    rotX.current = THREE.MathUtils.lerp(rotX.current, targetX, isDragging ? 0.2 : 0.06);

    modelRef.current.rotation.y = rotY.current;
    modelRef.current.rotation.x = rotX.current;

    // --- SUBTLE IDLE FLOAT & BREATHING ---
    if (!reducedMotion) {
      const floatY = Math.sin(time * 1.2) * 0.03;
      const floatX = Math.sin(time * 0.8) * 0.008;
      modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, floatY, 0.05);
      modelRef.current.position.x = THREE.MathUtils.lerp(modelRef.current.position.x, floatX, 0.05);
    }

    // --- CAMERA ZOOM ---
    currentZoom.current = THREE.MathUtils.lerp(currentZoom.current, zoom, 0.08);
    camera.position.z = currentZoom.current;

    // --- SCALE INTERACTION FEEDBACK ---
    const targetScale = isDragging ? 1.02 : 1;
    const currentScale = modelRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
    modelRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/lywaro-apex.glb');


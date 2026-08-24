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
  const autoRotate = useRef(true);
  const currentZoom = useRef(4);

  // Mark first interaction
  useEffect(() => {
    if (isDragging && !hasInteracted) {
      setHasInteracted(true);
      autoRotate.current = false;
      onInteractionStart?.();
    }
  }, [isDragging, hasInteracted, onInteractionStart]);

  // When drag starts, capture velocity
  useEffect(() => {
    if (!isDragging && Math.abs(velocity) > 0.01) {
      inertiaVel.current = velocity * 2;
    }
  }, [isDragging, velocity]);

  // Reset when dragOffset goes to 0 (double-click reset)
  useEffect(() => {
    if (!isDragging && Math.abs(dragOffset) < 0.001) {
      rotY.current = THREE.MathUtils.lerp(rotY.current, 0, 0.02);
      rotX.current = THREE.MathUtils.lerp(rotX.current, 0, 0.02);
      autoRotate.current = true;
      inertiaVel.current = 0;
    }
  }, [dragOffset, isDragging]);

  useFrame((state, delta) => {
    if (!modelRef.current) return;
    const time = state.clock.getElapsedTime();
    const clampedDelta = Math.min(delta, 0.05); // Prevent big jumps

    // --- ROTATION ---
    if (isDragging) {
      // Direct drag control
      const targetY = dragOffset;
      const targetX = mousePosition.y * 0.12;
      rotY.current = THREE.MathUtils.lerp(rotY.current, targetY, 0.15);
      rotX.current = THREE.MathUtils.lerp(rotX.current, targetX, 0.15);
      inertiaVel.current = 0;
    } else if (Math.abs(inertiaVel.current) > 0.001) {
      // Inertia after release
      rotY.current += inertiaVel.current * clampedDelta;
      inertiaVel.current *= 0.95; // friction
    } else if (autoRotate.current && !reducedMotion) {
      // Auto-rotate slowly when idle
      const autoSpeed = 0.08;
      rotY.current += autoSpeed * clampedDelta;
      // Subtle mouse follow
      rotY.current = THREE.MathUtils.lerp(rotY.current, mousePosition.x * 0.3, 0.01);
      rotX.current = THREE.MathUtils.lerp(rotX.current, mousePosition.y * 0.12, 0.01);
    } else {
      // Mouse follow (not dragging, no inertia)
      const targetY = mousePosition.x * 0.3;
      const targetX = mousePosition.y * 0.12;
      rotY.current = THREE.MathUtils.lerp(rotY.current, targetY, 0.04);
      rotX.current = THREE.MathUtils.lerp(rotX.current, targetX, 0.04);
    }

    // Clamp rotation to prevent flipping (±90° X, full Y)
    rotX.current = THREE.MathUtils.clamp(rotX.current, -Math.PI / 3, Math.PI / 3);

    // Apply rotation with smooth damping
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x, rotX.current, 0.08
    );
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y, rotY.current, 0.08
    );

    // --- IDLE FLOAT ---
    if (!reducedMotion) {
      const floatY = Math.sin(time * 0.8) * 0.03;
      const floatX = Math.sin(time * 0.5) * 0.005;
      modelRef.current.position.y = THREE.MathUtils.lerp(
        modelRef.current.position.y, floatY, 0.03
      );
      modelRef.current.position.x = THREE.MathUtils.lerp(
        modelRef.current.position.x, floatX, 0.03
      );
    }

    // --- ZOOM ---
    currentZoom.current = THREE.MathUtils.lerp(currentZoom.current, zoom, 0.05);
    camera.position.z = currentZoom.current;

    // --- SCALE on interaction ---
    const targetScale = isDragging ? 1.02 : 1;
    const currentScale = modelRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
    modelRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/lywaro-apex.glb');

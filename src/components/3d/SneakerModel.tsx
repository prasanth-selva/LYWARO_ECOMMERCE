import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SneakerModelProps {
  mouseXY:     { x: number; y: number };
  isDragging:  boolean;
  dragOffset:  number;
  velocity:    number;
  zoom:        number;
  reducedMotion: boolean;
}

export default function SneakerModel({
  mouseXY, isDragging, dragOffset, velocity, zoom, reducedMotion,
}: SneakerModelProps) {
  const { scene } = useGLTF('/models/lywaro-apex.glb');
  const groupRef  = useRef<THREE.Group>(null);
  const { camera } = useThree();

  /* ── smooth internal state stored in refs (no re-renders) ── */
  const rY     = useRef(0);   // current Y rotation
  const rX     = useRef(0);   // current X rotation
  const inertia = useRef(0);  // spin inertia after drag release
  const camZ   = useRef(4.2); // current camera Z

  /* Store inertia when drag ends */
  useEffect(() => {
    if (!isDragging && Math.abs(velocity) > 0.005) {
      inertia.current = velocity * 1.2;
    }
  }, [isDragging, velocity]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt  = Math.min(delta, 0.05);
    const t   = state.clock.getElapsedTime();

    /* ---------- target rotation ---------- */
    let tY = 0;
    let tX = 0;

    if (isDragging) {
      /* Direct drag — tight follow */
      tY = dragOffset;
      tX = mouseXY.y * 0.18;
      inertia.current = 0;
    } else if (Math.abs(inertia.current) > 0.0005) {
      /* Inertia coast after release */
      rY.current += inertia.current * dt;
      inertia.current *= 0.88;          // friction / decay
      tY = rY.current;
      tX = mouseXY.y * 0.12;
    } else {
      /* Idle — gentle mouse-parallax + breathing oscillation */
      const idleY = reducedMotion ? 0 : Math.sin(t * 0.55) * 0.055;
      const idleX = reducedMotion ? 0 : Math.cos(t * 0.75) * 0.022;
      tY = dragOffset + mouseXY.x * 0.32 + idleY;
      tX = mouseXY.y * 0.15 + idleX;
    }

    /* Clamp vertical tilt */
    tX = THREE.MathUtils.clamp(tX, -Math.PI / 3.5, Math.PI / 3.5);

    /* Smooth damp — crispy during drag, softer during idle */
    const lerpY = isDragging ? 0.22 : 0.055;
    const lerpX = isDragging ? 0.18 : 0.055;
    rY.current = THREE.MathUtils.lerp(rY.current, tY, lerpY);
    rX.current = THREE.MathUtils.lerp(rX.current, tX, lerpX);

    groupRef.current.rotation.y = rY.current;
    groupRef.current.rotation.x = rX.current;

    /* Idle float */
    if (!reducedMotion) {
      const floatY = Math.sin(t * 1.1) * 0.028;
      const floatX = Math.sin(t * 0.7) * 0.007;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.04);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, floatX, 0.04);
    }

    /* Camera zoom smooth */
    camZ.current = THREE.MathUtils.lerp(camZ.current, zoom, 0.07);
    (camera as THREE.PerspectiveCamera).position.z = camZ.current;

    /* Slight scale pulse when dragging */
    const targetScale = isDragging ? 1.025 : 1.0;
    const cs = groupRef.current.scale.x;
    const ns = THREE.MathUtils.lerp(cs, targetScale, 0.08);
    groupRef.current.scale.setScalar(ns);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/lywaro-apex.glb');

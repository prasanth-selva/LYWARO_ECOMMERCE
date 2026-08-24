import React, { useRef, useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SneakerModel from './SneakerModel';
import Environment from './Environment';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SneakerSceneProps {
  className?: string;
  onInteractionStart?: () => void;
}

export default function SneakerScene({ className = '', onInteractionStart }: SneakerSceneProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef({ x: 0, offset: 0 });
  const reducedMotion = useReducedMotion();

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      const dx = (e.clientX - dragStart.current.x) / window.innerWidth;
      setDragOffset(dragStart.current.offset + dx * Math.PI);
    } else {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    }
  }, [isDragging]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, offset: dragOffset };
    onInteractionStart?.();
  }, [dragOffset, onInteractionStart]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`w-full h-full ${className}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 1, 4], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Environment />
          <SneakerModel
            mousePosition={mousePosition}
            isDragging={isDragging}
            dragOffset={dragOffset}
            onInteractionStart={onInteractionStart}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

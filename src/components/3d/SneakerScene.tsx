import React, { useRef, useCallback, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SneakerModel from './SneakerModel';
import Environment from './Environment';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SneakerSceneProps {
  className?: string;
  onInteractionStart?: () => void;
}

export default function SneakerScene({ className = '', onInteractionStart }: SneakerSceneProps) {
  const reducedMotion = useReducedMotion();

  /* ── drag state ── */
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [zoom, setZoom] = useState(4.2);

  const dragStart  = useRef({ x: 0, offset: 0 });
  const lastPtr    = useRef({ x: 0, t: 0 });
  const touchPinch = useRef({ dist: 0, zoom: 4.2 });

  /* ── mouse position for idle look-at ── */
  const [mouseXY, setMouseXY] = useState({ x: 0, y: 0 });
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const now = Date.now();
    const dt  = Math.max(now - lastPtr.current.t, 1);
    const dx  = e.clientX - lastPtr.current.x;
    lastPtr.current = { x: e.clientX, t: now };

    if (isDragging) {
      const totalDx = (e.clientX - dragStart.current.x) / window.innerWidth;
      setDragOffset(dragStart.current.offset + totalDx * Math.PI * 2.4);
      setVelocity((dx / dt) * 18);
    } else {
      const nx = (e.clientX / window.innerWidth)  * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouseXY({ x: nx, y: ny });
    }
  }, [isDragging]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setVelocity(0);
    dragStart.current = { x: e.clientX, offset: dragOffset };
    lastPtr.current   = { x: e.clientX, t: Date.now() };
    onInteractionStart?.();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [dragOffset, onInteractionStart]);

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  const handleDoubleClick = useCallback(() => {
    setDragOffset(0);
    setVelocity(0);
    setZoom(4.2);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(2.8, Math.min(6.5, z + e.deltaY * 0.005)));
  }, []);

  /* touch pinch-zoom */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchPinch.current = { dist: Math.hypot(dx, dy), zoom };
    }
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx   = e.touches[0].clientX - e.touches[1].clientX;
      const dy   = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const s    = touchPinch.current.dist / dist;
      setZoom(Math.max(2.8, Math.min(6.5, touchPinch.current.zoom * s)));
    }
  }, []);

  return (
    <div
      className={`w-full h-full select-none ${className}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{ touchAction: 'pan-y', cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.6, 4.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Environment />
          <SneakerModel
            mouseXY={mouseXY}
            isDragging={isDragging}
            dragOffset={dragOffset}
            velocity={velocity}
            zoom={zoom}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

import React, { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
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
  const [velocity, setVelocity] = useState(0);
  const [zoom, setZoom] = useState(4);
  const dragStart = useRef({ x: 0, offset: 0, time: 0 });
  const lastPointer = useRef({ x: 0, time: 0 });
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move → camera-look (when not dragging)
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const now = Date.now();
    const dt = Math.max(now - lastPointer.current.time, 1);
    const dx = e.clientX - lastPointer.current.x;
    lastPointer.current = { x: e.clientX, time: now };

    if (isDragging) {
      const totalDx = (e.clientX - dragStart.current.x) / window.innerWidth;
      const newOffset = dragStart.current.offset + totalDx * Math.PI * 2;
      setDragOffset(newOffset);
      // Track velocity for inertia
      setVelocity(dx / dt * 16);
    } else {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    }
  }, [isDragging]);

  // Pointer down
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Ignore right-click
    if (e.button !== 0) return;
    setIsDragging(true);
    setVelocity(0);
    dragStart.current = { x: e.clientX, offset: dragOffset, time: Date.now() };
    lastPointer.current = { x: e.clientX, time: Date.now() };
    onInteractionStart?.();
  }, [dragOffset, onInteractionStart]);

  // Pointer up
  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, [dragOffset]);

  // Double-click to reset
  const handleDoubleClick = useCallback(() => {
    setDragOffset(0);
    setVelocity(0);
    setZoom(4);
  }, []);

  // Scroll to zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(2.5, Math.min(6, prev + e.deltaY * 0.005)));
  }, []);

  // Touch: pinch to zoom
  const touchState = useRef({ dist: 0, zoom: 4 });
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchState.current = { dist: Math.hypot(dx, dy), zoom };
    }
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = touchState.current.dist / dist;
      const newZoom = Math.max(2.5, Math.min(6, touchState.current.zoom * scale));
      setZoom(newZoom);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full select-none ${className}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
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
            velocity={velocity}
            zoom={zoom}
            reducedMotion={reducedMotion}
            onInteractionStart={onInteractionStart}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

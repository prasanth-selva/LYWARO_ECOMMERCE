// Blacktop Editorial: the model is treated like a gallery object—damped, tactile, and never over-animated.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

const MODEL_URL = "/manus-storage/lywaro-apex_057990b2.glb";

type ModelViewerProps = {
  compact?: boolean;
  className?: string;
};

export default function ModelViewer({ compact = false, className = "" }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    let disposed = false;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0x111211, 8, 18);

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.1, 5.4);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      rendererRef.current = renderer;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
    } catch {
      setStatus("error");
      return;
    }

    scene.add(new THREE.HemisphereLight(0xf4f1e8, 0x1a1c1a, 2.2));
    const key = new THREE.DirectionalLight(0xf8f3dc, 4.2);
    key.position.set(-3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd7f54a, 2.3);
    rim.position.set(4, 1.2, -3);
    scene.add(rim);
    const soft = new THREE.PointLight(0x8e9b72, 1.2, 8);
    soft.position.set(0, -1.5, 2);
    scene.add(soft);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.5, 64),
      new THREE.MeshBasicMaterial({ color: 0x171917, transparent: true, opacity: 0.7 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.3;
    scene.add(floor);

    let targetRotationY = -0.5;
    let currentRotationY = -0.5;
    let targetRotationX = 0.02;
    let currentRotationX = 0.02;
    let pointerX = 0;
    let pointerY = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startRotationY = 0;
    let startRotationX = 0;

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        model.scale.setScalar(2.25 / maxDimension);
        model.position.sub(center.multiplyScalar(2.25 / maxDimension));
        model.position.y -= 0.14;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.roughness = Math.min(child.material.roughness + 0.06, 1);
              child.material.envMapIntensity = 1.2;
            }
          }
        });
        scene.add(model);
        modelRef.current = model;
        setProgress(100);
        setStatus("ready");
      },
      (event) => {
        if (event.total > 0) setProgress(Math.round((event.loaded / event.total) * 100));
      },
      () => {
        if (!disposed) setStatus("error");
      },
    );

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startRotationY = targetRotationY;
      startRotationX = targetRotationX;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!dragging) return;
      targetRotationY = startRotationY + (event.clientX - startX) * 0.012;
      targetRotationX = THREE.MathUtils.clamp(startRotationX + (event.clientY - startY) * 0.004, -0.35, 0.3);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setZoom((current) => THREE.MathUtils.clamp(current + (event.deltaY > 0 ? -0.08 : 0.08), 0.82, 1.28));
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const animate = () => {
      if (disposed) return;
      frameRef.current = requestAnimationFrame(animate);
      const model = modelRef.current;
      if (model) {
        const hoverY = dragging ? 0 : pointerX * 0.06;
        const hoverX = dragging ? 0 : -pointerY * 0.025;
        currentRotationY += (targetRotationY + hoverY - currentRotationY) * 0.075;
        currentRotationX += (targetRotationX + hoverX - currentRotationX) * 0.075;
        model.rotation.y = currentRotationY;
        model.rotation.x = currentRotationX;
        model.position.y = -0.14 + Math.sin(performance.now() * 0.0007) * 0.018;
      }
      camera.position.z += (5.4 / zoomRef.current - camera.position.z) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
    };
  }, []);

  const resetView = () => { zoomRef.current = 1; setZoom(1); };
  const changeZoom = (amount: number) => setZoom((current) => {
    const next = THREE.MathUtils.clamp(current + amount, 0.82, 1.28);
    zoomRef.current = next;
    return next;
  });
  const toggleFullscreen = () => {
    if (mountRef.current && !document.fullscreenElement) mountRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div ref={mountRef} className={`relative h-full min-h-[360px] w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full touch-pan-y cursor-grab active:cursor-grabbing" aria-label="Interactive 3D view of the LYWARO APEX sneaker" />
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-[#111211] text-[#EAE8E1]">
          <div className="w-48 space-y-3 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em]">Loading Apex...</p>
            <div className="h-px bg-white/15"><div className="h-full bg-[#D7F54A] transition-all duration-300" style={{ width: `${Math.max(progress, 8)}%` }} /></div>
            <p className="font-mono text-[9px] text-white/40">{progress}% / GLB ASSET</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-[#111211] p-8 text-center text-[#EAE8E1]">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D7F54A]">APEX / STATIC VIEW</p><p className="mt-3 max-w-xs text-sm text-white/55">The interactive model is unavailable in this browser. Continue below to explore the product.</p></div>
        </div>
      )}
      <div className={`absolute bottom-5 left-5 flex items-center gap-1 ${compact ? "scale-90 origin-bottom-left" : ""}`}>
        <button onClick={() => changeZoom(0.08)} className="grid h-9 w-9 place-items-center border border-white/15 bg-[#111211]/70 text-white/70 transition hover:border-[#D7F54A]/60 hover:text-[#D7F54A]" aria-label="Zoom in"><ZoomIn size={14} /></button>
        <button onClick={() => changeZoom(-0.08)} className="grid h-9 w-9 place-items-center border border-white/15 bg-[#111211]/70 text-white/70 transition hover:border-[#D7F54A]/60 hover:text-[#D7F54A]" aria-label="Zoom out"><ZoomOut size={14} /></button>
        <button onClick={resetView} className="grid h-9 w-9 place-items-center border border-white/15 bg-[#111211]/70 text-white/70 transition hover:border-[#D7F54A]/60 hover:text-[#D7F54A]" aria-label="Reset view"><RotateCcw size={14} /></button>
        <button onClick={toggleFullscreen} className="grid h-9 w-9 place-items-center border border-white/15 bg-[#111211]/70 text-white/70 transition hover:border-[#D7F54A]/60 hover:text-[#D7F54A]" aria-label="Fullscreen viewer"><Maximize2 size={14} /></button>
      </div>
      <div className="pointer-events-none absolute bottom-6 right-5 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-white/35 sm:block">Drag to rotate · scroll to zoom</div>
    </div>
  );
}

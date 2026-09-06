"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

const SIGNAL = "#e04a3a";
const AMBER = "#f2a93b";
const BONE = "#f2efe9";

/** Tracks how far the section has scrolled through the viewport, smoothed with damping. */
function useScrollProgress(sectionRef: React.RefObject<HTMLElement | null>) {
  const progressRef = useRef(0);
  const targetRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const raw = scrollable > 0 ? -rect.top / scrollable : 0;
      targetRef.current = Math.min(Math.max(raw, 0), 1);
      if (reduceMotion) progressRef.current = targetRef.current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionRef]);

  return { progressRef, targetRef };
}

// Scattered start position, assembled end position (clustered just behind the logo),
// color and size for each block — built from parts, not decoration.
const BLOCKS = [
  { start: [-3.2, 1.4, -1.2], end: [-0.22, 0.16, -0.32], color: SIGNAL, size: 0.34 },
  { start: [3.0, -1.6, -0.8], end: [0.2, -0.14, -0.28], color: AMBER, size: 0.3 },
  { start: [-2.4, -1.8, 0.6], end: [-0.14, -0.2, -0.36], color: BONE, size: 0.26 },
  { start: [2.6, 1.9, -1.6], end: [0.16, 0.22, -0.3], color: SIGNAL, size: 0.28 },
  { start: [-3.4, -0.6, 1.2], end: [-0.24, -0.02, -0.4], color: AMBER, size: 0.22 },
  { start: [3.2, 0.4, 1.4], end: [0.24, 0.02, -0.34], color: BONE, size: 0.24 },
  { start: [0, 2.6, -2], end: [0, 0.3, -0.38], color: SIGNAL, size: 0.2 },
] as const;

function Block({
  progressRef,
  start,
  end,
  color,
  size,
  seed,
}: {
  progressRef: React.RefObject<number>;
  start: readonly [number, number, number];
  end: readonly [number, number, number];
  color: string;
  size: number;
  seed: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    const p = progressRef.current;
    const eased = p * p * (3 - 2 * p);
    mesh.current.position.set(
      THREE.MathUtils.lerp(start[0], end[0], eased),
      THREE.MathUtils.lerp(start[1], end[1], eased),
      THREE.MathUtils.lerp(start[2], end[2], eased),
    );
    // Chaotic spin while scattered, settles to nearly still once assembled.
    const spin = THREE.MathUtils.lerp(1, 0.04, eased);
    mesh.current.rotation.x += delta * (0.5 + seed * 0.3) * spin;
    mesh.current.rotation.y += delta * (0.35 + seed * 0.4) * spin;
  });
  return (
    <mesh ref={mesh} position={start}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
    </mesh>
  );
}

function BuildingBlocks({ progressRef }: { progressRef: React.RefObject<number> }) {
  return (
    <>
      {BLOCKS.map((b, i) => (
        <Block
          key={i}
          progressRef={progressRef}
          start={b.start}
          end={b.end}
          color={b.color}
          size={b.size}
          seed={i / BLOCKS.length}
        />
      ))}
    </>
  );
}

function LogoPlane({ progressRef }: { progressRef: React.RefObject<number> }) {
  const texture = useTexture("/brand/monogram.png");
  const group = useRef<THREE.Group>(null);
  const aspect = 334 / 520;
  const height = 1.9;

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = progressRef.current;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.y += (p - 0.5) * delta * 0.4;
    group.current.position.z = THREE.MathUtils.lerp(-0.4, 0.6, p);
  });

  return (
    <group ref={group} position={[0, 0, 0.2]}>
      <mesh>
        <planeGeometry args={[height * aspect, height]} />
        <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 3, 4]} intensity={38} color={SIGNAL} />
      <pointLight position={[-4, -2, 3]} intensity={30} color={AMBER} />
      <directionalLight position={[0, 4, 5]} intensity={0.6} color={BONE} />
    </>
  );
}

export function BrandScene({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const { progressRef, targetRef } = useScrollProgress(sectionRef);

  useFrame(() => {
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetRef.current, 0.08);
  });

  return (
    <>
      <Lights />
      <Suspense fallback={null}>
        <BuildingBlocks progressRef={progressRef} />
        <LogoPlane progressRef={progressRef} />
      </Suspense>
    </>
  );
}

export function BrandCanvas({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <BrandScene sectionRef={sectionRef} />
    </Canvas>
  );
}

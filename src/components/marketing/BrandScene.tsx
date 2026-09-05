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

function Icosahedron({ progressRef }: { progressRef: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    const p = progressRef.current;
    mesh.current.rotation.y += delta * 0.18;
    mesh.current.rotation.x = 0.3 + p * Math.PI * 0.6;
    mesh.current.position.x = -1.75 + p * 0.4;
    mesh.current.position.y = THREE.MathUtils.lerp(0.6, -0.6, p);
  });
  return (
    <mesh ref={mesh} position={[-1.75, 0.6, 0]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={SIGNAL} wireframe roughness={0.4} />
    </mesh>
  );
}

function TorusKnot({ progressRef }: { progressRef: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    const p = progressRef.current;
    mesh.current.rotation.x += delta * 0.22;
    mesh.current.rotation.y = p * Math.PI * 1.2;
    mesh.current.position.y = THREE.MathUtils.lerp(-0.4, 0.8, p);
  });
  return (
    <mesh ref={mesh} position={[1.75, -0.4, -0.6]} scale={0.62}>
      <torusKnotGeometry args={[1, 0.32, 140, 20]} />
      <meshStandardMaterial color={AMBER} metalness={0.55} roughness={0.28} />
    </mesh>
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
        <Icosahedron progressRef={progressRef} />
        <TorusKnot progressRef={progressRef} />
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

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Purple to cyan gradient
      const t = Math.random();
      colors[i * 3] = 0.4 + t * 0.1;     // R
      colors[i * 3 + 1] = 0.2 + t * 0.6; // G
      colors[i * 3 + 2] = 0.9;            // B
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.2;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingOrb() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <Particles />
        <FloatingOrb />
      </Canvas>
    </div>
  );
}

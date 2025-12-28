'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

// Create circular particle texture
function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

// Particle-based tree with conical shape
function Tree({ position, scale = 1, seed = 0, variant = 0, delay = 0 }: { position: [number, number, number]; scale?: number; seed?: number; variant?: number; delay?: number }) {
  const group = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Points>(null);
  const basePositions = useRef<Float32Array | null>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const count = 120 + variant * 40;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const treeHeight = 2.0 + variant * 0.6;
    const baseRadius = 0.8 + variant * 0.2;
    const trunkHeight = 0.8;
    
    for (let i = 0; i < count; i++) {
      // Distribute particles along tree height (conical shape)
      const t = Math.random(); // 0 = bottom of foliage, 1 = top
      const y = trunkHeight + t * treeHeight;
      
      // Radius decreases as we go up (cone shape)
      const radiusAtHeight = baseRadius * (1 - t * 0.85);
      const angle = Math.random() * Math.PI * 2;
      const r = radiusAtHeight * Math.sqrt(Math.random()); // sqrt for even distribution
      
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * r;
      
      // Darker at bottom, lighter at top
      const hue = 100 + Math.random() * 40;
      const sat = 0.4 + Math.random() * 0.3;
      const light = 0.08 + t * 0.12 + Math.random() * 0.08;
      const color = new THREE.Color().setHSL(hue / 360, sat, light);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    basePositions.current = new Float32Array(positions);
    
    return geo;
  }, [count, variant]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Gentle tree sway
    if (group.current) {
      const windStrength = Math.sin(time * 0.4 + seed) * 0.5 + Math.sin(time * 0.7 + seed * 2) * 0.3;
      group.current.rotation.z = windStrength * 0.025;
    }
    
    // Leaf particles rustle from breeze
    if (leavesRef.current && basePositions.current) {
      const positions = leavesRef.current.geometry.attributes.position.array as Float32Array;
      const base = basePositions.current;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const windOffset = Math.sin(time * 1.5 + seed + i * 0.3) * 0.03 + 
                          Math.sin(time * 2.3 + seed * 1.5 + i * 0.5) * 0.02;
        positions[i3] = base[i3] + windOffset;
        positions[i3 + 1] = base[i3 + 1] + Math.sin(time * 1.8 + i * 0.4) * 0.015;
        positions[i3 + 2] = base[i3 + 2] + windOffset * 0.5;
      }
      leavesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!visible) return null;

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.08, 0.8, 6]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.95} />
      </mesh>
      {/* Particle foliage */}
      <points ref={leavesRef} geometry={geometry}>
        <pointsMaterial size={0.06 + variant * 0.015} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>
    </group>
  );
}

// Particle-based bush with wind
function Bush({ position, scale = 1, seed = 0 }: { position: [number, number, number]; scale?: number; seed?: number }) {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useRef<Float32Array | null>(null);
  const count = 35;
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.4;
      const height = Math.random() * 0.35;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const shade = 0.08 + Math.random() * 0.12;
      colors[i * 3] = shade * 0.5;
      colors[i * 3 + 1] = shade + 0.08;
      colors[i * 3 + 2] = shade * 0.35;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    basePositions.current = new Float32Array(positions);
    
    return geo;
  }, []);

  useFrame((state) => {
    if (ref.current && basePositions.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const wind = Math.sin(time * 1.2 + seed + i * 0.2) * 0.02;
        positions[i3] = basePositions.current[i3] + wind;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} position={position} scale={scale} geometry={geometry}>
      <pointsMaterial size={0.12} map={circleTexture} vertexColors transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Fireflies
function Fireflies({ count = 50 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const phases = useRef<Float32Array>(new Float32Array(count));
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = 0.5 + Math.random() * 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      phases.current[i] = Math.random() * Math.PI * 2;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] += Math.sin(time + phases.current[i]) * 0.002;
      positions[i3 + 1] += Math.sin(time * 0.7 + phases.current[i]) * 0.001;
      positions[i3 + 2] += Math.cos(time * 0.5 + phases.current[i]) * 0.001;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.4 + Math.sin(time * 1.5) * 0.25;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.15} map={circleTexture} color="#c5e063" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Falling leaves
function FallingLeaves({ count = 25 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array>(new Float32Array(count));
  const phases = useRef<Float32Array>(new Float32Array(count));
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
      velocities.current[i] = 0.006 + Math.random() * 0.01;
      phases.current[i] = Math.random() * Math.PI * 2;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= velocities.current[i];
      positions[i3] += Math.sin(time * 0.8 + phases.current[i]) * 0.008;
      
      if (positions[i3 + 1] < 0) {
        positions[i3 + 1] = 5 + Math.random() * 2;
        positions[i3] = (Math.random() - 0.5) * 14;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.05} color="#6b4423" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

// Fog layer
function Fog() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0.8, -2]} scale={[22, 4, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
          }
          void main() {
            vec2 uv = vUv;
            uv.x += uTime * 0.02;
            float n = noise(uv * 3.0 + uTime * 0.05) + noise(uv * 6.0 - uTime * 0.03) * 0.5;
            float fog = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y) * n * 0.35;
            gl_FragColor = vec4(0.1, 0.14, 0.1, fog * 0.45);
          }
        `}
      />
    </mesh>
  );
}

// Moon
function Moon() {
  return (
    <group position={[5, 4.5, -10]}>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#fef9c3" transparent opacity={0.06} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#fefce8" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

// Ground
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[35, 22]} />
      <meshStandardMaterial color="#060906" roughness={1} />
    </mesh>
  );
}

// Grass particles with wind
function Grass() {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useRef<Float32Array | null>(null);
  const count = 150;
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 0.25;
      positions[i * 3 + 2] = 1.5 + Math.random() * 3;
      
      const shade = 0.06 + Math.random() * 0.1;
      colors[i * 3] = shade * 0.6;
      colors[i * 3 + 1] = shade + 0.04;
      colors[i * 3 + 2] = shade * 0.4;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    basePositions.current = new Float32Array(positions);
    
    return geo;
  }, []);

  useFrame((state) => {
    if (ref.current && basePositions.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const wind = Math.sin(time * 1.5 + basePositions.current[i3] * 0.5) * 0.015;
        positions[i3] = basePositions.current[i3] + wind;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.1} map={circleTexture} vertexColors transparent opacity={0.65} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function ForestScene() {
  const trees = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; seed: number; variant: number }[] = [];
    
    // Back layer - tall distant trees
    for (let i = 0; i < 22; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 26, 0, -7 - Math.random() * 5],
        scale: 1.0 + Math.random() * 0.5,
        seed: Math.random() * 100,
        variant: 2,
      });
    }
    
    // Middle layer
    for (let i = 0; i < 24; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 22, 0, -3 - Math.random() * 4],
        scale: 0.7 + Math.random() * 0.4,
        seed: Math.random() * 100,
        variant: 1,
      });
    }
    
    // Front layer - smaller trees
    for (let i = 0; i < 18; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 18, 0, -0.5 - Math.random() * 2.5],
        scale: 0.4 + Math.random() * 0.35,
        seed: Math.random() * 100,
        variant: 0,
      });
    }
    
    // Foreground trees - closer, larger at bottom of screen
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 20;
      // Avoid center area where text is
      if (Math.abs(x) < 3) continue;
      arr.push({
        pos: [x, 0, 3 + Math.random() * 2],
        scale: 0.6 + Math.random() * 0.4,
        seed: Math.random() * 100,
        variant: 0,
      });
    }
    
    return arr;
  }, []);

  const bushes = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; seed: number }[] = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 18, 0.15, -0.5 - Math.random() * 5],
        scale: 0.4 + Math.random() * 0.7,
        seed: Math.random() * 100,
      });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 1.6, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#040704']} />
        <fog attach="fog" args={['#040704', 4, 14]} />
        
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 6, -6]} intensity={0.2} color="#d4c5a9" />
        <pointLight position={[5, 4.5, -10]} intensity={0.3} color="#fef9c3" distance={18} />
        
        <Ground />
        <Moon />
        <Grass />
        
        {bushes.map((b, i) => (
          <Bush key={`bush-${i}`} position={b.pos} scale={b.scale} seed={b.seed} />
        ))}
        
        {trees.map((t, i) => (
          <Tree key={i} position={t.pos} scale={t.scale} seed={t.seed} variant={t.variant} delay={0.5 + i * 0.08} />
        ))}
        
        <Fireflies count={50} />
        <FallingLeaves count={25} />
        <Fog />
      </Canvas>
    </div>
  );
}

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Tree with wind-reactive foliage
function Tree({ position, scale = 1, seed = 0, variant = 0 }: { position: [number, number, number]; scale?: number; seed?: number; variant?: number }) {
  const group = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Points>(null);
  const basePositions = useRef<Float32Array | null>(null);
  
  const leafParticles = useMemo(() => {
    const count = 50 + variant * 15;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (0.5 + variant * 0.15);
      const height = 1.0 + Math.random() * (1.2 + variant * 0.4);
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const hue = 95 + Math.random() * 45;
      const sat = 0.35 + Math.random() * 0.35;
      const light = 0.12 + Math.random() * 0.2;
      const color = new THREE.Color().setHSL(hue / 360, sat, light);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors, count };
  }, [variant]);

  // Store base positions for wind animation
  useMemo(() => {
    basePositions.current = new Float32Array(leafParticles.positions);
  }, [leafParticles.positions]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Gentle tree sway
    if (group.current) {
      const windStrength = Math.sin(time * 0.4 + seed) * 0.5 + Math.sin(time * 0.7 + seed * 2) * 0.3;
      group.current.rotation.z = windStrength * 0.025;
    }
    
    // Leaf rustle from breeze
    if (leavesRef.current && basePositions.current) {
      const positions = leavesRef.current.geometry.attributes.position.array as Float32Array;
      const base = basePositions.current;
      
      for (let i = 0; i < leafParticles.count; i++) {
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

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.07, 1.0, 6]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.95} />
      </mesh>
      <points ref={leavesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={leafParticles.count} array={leafParticles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={leafParticles.count} array={leafParticles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1 + variant * 0.02} vertexColors transparent opacity={0.85} sizeAttenuation />
      </points>
    </group>
  );
}

// Bush with wind
function Bush({ position, scale = 1, seed = 0 }: { position: [number, number, number]; scale?: number; seed?: number }) {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useRef<Float32Array | null>(null);
  
  const particles = useMemo(() => {
    const count = 35;
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
    basePositions.current = new Float32Array(positions);
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (ref.current && basePositions.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < 35; i++) {
        const i3 = i * 3;
        const wind = Math.sin(time * 1.2 + seed + i * 0.2) * 0.02;
        positions[i3] = basePositions.current[i3] + wind;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} position={position} scale={scale}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={35} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={35} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

// Fireflies with more organic movement
function Fireflies({ count = 45 }) {
  const mesh = useRef<THREE.Points>(null);
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count * 3); // x, y, z phases
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = 0.5 + Math.random() * 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      phases[i * 3] = Math.random() * Math.PI * 2;
      phases[i * 3 + 1] = Math.random() * Math.PI * 2;
      phases[i * 3 + 2] = Math.random() * Math.PI * 2;
      speeds[i] = 0.5 + Math.random() * 1;
    }
    return { positions, phases, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const material = mesh.current.material as THREE.PointsMaterial;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = data.speeds[i];
      positions[i3] += Math.sin(time * speed + data.phases[i3]) * 0.003;
      positions[i3 + 1] += Math.sin(time * speed * 0.7 + data.phases[i3 + 1]) * 0.002;
      positions[i3 + 2] += Math.cos(time * speed * 0.5 + data.phases[i3 + 2]) * 0.002;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    
    // Gentle pulsing
    material.opacity = 0.4 + Math.sin(time * 1.5) * 0.25;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.09} color="#c5e063" transparent sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Flying insects (gnats/moths) - small swarm behavior
function Insects({ count = 30 }) {
  const mesh = useRef<THREE.Points>(null);
  const center = useRef(new THREE.Vector3(0, 2, 0));
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = 1.5 + Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    // Move swarm center slowly
    center.current.x = Math.sin(time * 0.2) * 3;
    center.current.z = Math.cos(time * 0.15) * 2;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Erratic movement
      positions[i3] += data.velocities[i3] + Math.sin(time * 5 + i) * 0.008;
      positions[i3 + 1] += data.velocities[i3 + 1] + Math.sin(time * 4 + i * 1.3) * 0.005;
      positions[i3 + 2] += data.velocities[i3 + 2] + Math.cos(time * 4.5 + i * 0.7) * 0.006;
      
      // Pull toward swarm center
      const dx = center.current.x - positions[i3];
      const dy = center.current.y - positions[i3 + 1];
      const dz = center.current.z - positions[i3 + 2];
      positions[i3] += dx * 0.01;
      positions[i3 + 1] += dy * 0.01;
      positions[i3 + 2] += dz * 0.01;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#333333" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Falling leaves with wind influence
function FallingLeaves({ count = 25 }) {
  const mesh = useRef<THREE.Points>(null);
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
      velocities[i] = 0.006 + Math.random() * 0.01;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, velocities, phases };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    // Global wind
    const windX = Math.sin(time * 0.3) * 0.015;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= data.velocities[i];
      positions[i3] += Math.sin(time * 0.8 + data.phases[i]) * 0.012 + windX;
      positions[i3 + 2] += Math.cos(time * 0.6 + data.phases[i]) * 0.005;
      
      if (positions[i3 + 1] < 0) {
        positions[i3 + 1] = 5 + Math.random() * 2;
        positions[i3] = (Math.random() - 0.5) * 14;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#6b4423" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

// Animated fog with wind
function Fog() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0.8, -2]} scale={[22, 4, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
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
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
          }
          
          void main() {
            vec2 uv = vUv;
            uv.x += uTime * 0.02; // Wind drift
            float n = noise(uv * 3.0 + uTime * 0.05);
            n += noise(uv * 6.0 - uTime * 0.03) * 0.5;
            float fog = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
            fog *= n * 0.35;
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

// Grass with wind
function Grass() {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useRef<Float32Array | null>(null);
  
  const particles = useMemo(() => {
    const count = 150;
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
    basePositions.current = new Float32Array(positions);
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (ref.current && basePositions.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < 150; i++) {
        const i3 = i * 3;
        const wind = Math.sin(time * 1.5 + basePositions.current[i3] * 0.5) * 0.015;
        positions[i3] = basePositions.current[i3] + wind;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={150} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={150} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

export default function ForestScene() {
  const trees = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; seed: number; variant: number }[] = [];
    
    // Back layer - tall distant trees
    for (let i = 0; i < 18; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 24, 0, -7 - Math.random() * 5],
        scale: 1.0 + Math.random() * 0.5,
        seed: Math.random() * 100,
        variant: 2,
      });
    }
    
    // Middle layer
    for (let i = 0; i < 20; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 20, 0, -3 - Math.random() * 4],
        scale: 0.7 + Math.random() * 0.4,
        seed: Math.random() * 100,
        variant: 1,
      });
    }
    
    // Front layer - smaller trees
    for (let i = 0; i < 14; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 16, 0, -0.5 - Math.random() * 2.5],
        scale: 0.4 + Math.random() * 0.35,
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
        pos: [(Math.random() - 0.5) * 18, 0, -0.5 - Math.random() * 5],
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
        
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 6, -6]} intensity={0.15} color="#d4c5a9" />
        <pointLight position={[5, 4.5, -10]} intensity={0.25} color="#fef9c3" distance={18} />
        
        <Ground />
        <Moon />
        <Grass />
        
        {bushes.map((b, i) => (
          <Bush key={`bush-${i}`} position={b.pos} scale={b.scale} seed={b.seed} />
        ))}
        
        {trees.map((t, i) => (
          <Tree key={i} position={t.pos} scale={t.scale} seed={t.seed} variant={t.variant} />
        ))}
        
        <Fireflies count={50} />
        <Insects count={25} />
        <FallingLeaves count={20} />
        <Fog />
      </Canvas>
    </div>
  );
}

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Organic growing vine/root structure
function GrowingVines() {
  const linesRef = useRef<THREE.Group>(null);
  
  const curves = useMemo(() => {
    const arr: THREE.CatmullRomCurve3[] = [];
    for (let i = 0; i < 8; i++) {
      const points: THREE.Vector3[] = [];
      const startX = (Math.random() - 0.5) * 4;
      const startZ = (Math.random() - 0.5) * 2;
      
      for (let j = 0; j < 8; j++) {
        points.push(new THREE.Vector3(
          startX + Math.sin(j * 0.5 + i) * 0.5,
          j * 0.4 - 1,
          startZ + Math.cos(j * 0.3 + i) * 0.3
        ));
      }
      arr.push(new THREE.CatmullRomCurve3(points));
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.15;
      });
    }
  });

  return (
    <group ref={linesRef}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 32, 0.02, 8, false]} />
          <meshBasicMaterial color={`hsl(${130 + i * 5}, 50%, ${25 + i * 3}%)`} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Floating spores/seeds
function Spores({ count = 60 }) {
  const mesh = useRef<THREE.Points>(null);
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 5 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sizes[i] = Math.random() * 0.04 + 0.02;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }
    return { positions, sizes, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += data.speeds[i] * 0.005;
      positions[i * 3] += Math.sin(state.clock.elapsedTime * data.speeds[i] + i) * 0.002;
      
      if (positions[i * 3 + 1] > 4) {
        positions[i * 3 + 1] = -1;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a7f3d0" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Central organic form - like a seed or cocoon
function OrganicCore() {
  const mesh = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <mesh ref={mesh} scale={1.8}>
      <icosahedronGeometry args={[1, 48]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vNoise;
          
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          
          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }
          
          void main() {
            vNormal = normal;
            vPosition = position;
            
            float noise1 = snoise(position * 2.0 + uTime * 0.15);
            float noise2 = snoise(position * 4.0 - uTime * 0.1) * 0.5;
            float noise = noise1 + noise2;
            
            vec3 newPosition = position + normal * noise * 0.25;
            vNoise = noise;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vNoise;
          
          void main() {
            vec3 darkGreen = vec3(0.05, 0.15, 0.08);
            vec3 midGreen = vec3(0.1, 0.35, 0.15);
            vec3 lightGreen = vec3(0.2, 0.5, 0.25);
            vec3 glow = vec3(0.4, 0.9, 0.5);
            
            float t = vNoise * 0.5 + 0.5;
            vec3 color = mix(darkGreen, midGreen, t);
            color = mix(color, lightGreen, pow(t, 2.0));
            
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
            color = mix(color, glow, fresnel * 0.4);
            
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function OrganicScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#040804']} />
        <fog attach="fog" args={['#040804', 4, 12]} />
        
        <ambientLight intensity={0.1} />
        <pointLight position={[3, 3, 3]} intensity={0.4} color="#4ade80" />
        <pointLight position={[-3, -2, 2]} intensity={0.2} color="#22d3ee" />
        
        <OrganicCore />
        <GrowingVines />
        <Spores />
      </Canvas>
    </div>
  );
}

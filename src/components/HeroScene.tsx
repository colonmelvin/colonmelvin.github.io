'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particles({ count = 3000 }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const t = Math.random();
      colors[i * 3] = 0.1 + t * 0.2;
      colors[i * 3 + 1] = 0.6 + t * 0.3;
      colors[i * 3 + 2] = 0.4 + t * 0.3;
      
      sizes[i] = Math.random() * 0.1 + 0.02;
    }
    
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function GlowingSphere() {
  const mesh = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={mesh} scale={2.5}>
      <icosahedronGeometry args={[1, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vDisplacement;
          
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
            float noise = snoise(position * 1.5 + uTime * 0.4);
            vec3 newPosition = position + normal * noise * 0.4;
            vDisplacement = noise;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vDisplacement;
          
          void main() {
            vec3 green = vec3(0.2, 0.9, 0.5);
            vec3 cyan = vec3(0.2, 0.8, 0.8);
            vec3 color = mix(green, cyan, vDisplacement * 0.5 + 0.5);
            
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            color += fresnel * 0.5;
            
            gl_FragColor = vec4(color, 0.95);
          }
        `}
        transparent
      />
    </mesh>
  );
}

function Rings() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = state.clock.elapsedTime * 0.1;
      group.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      {[3.5, 4.2, 5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, i * 0.3, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshBasicMaterial color={`hsl(${160 + i * 20}, 70%, ${50 + i * 10}%)`} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#050a05']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4ade80" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />
        <GlowingSphere />
        <Particles />
        <Rings />
      </Canvas>
    </div>
  );
}

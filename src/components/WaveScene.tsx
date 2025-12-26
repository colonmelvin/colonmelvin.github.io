'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

function WaveGrid() {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#6366f1') },
    uColor2: { value: new THREE.Color('#22d3ee') },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[viewport.width * 2, 15, 100, 100]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.5 + uTime) * 0.3 + 
                             sin(pos.y * 0.3 + uTime * 0.8) * 0.2;
            pos.z = elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixStrength = (vElevation + 0.5) * 0.5;
            vec3 color = mix(uColor1, uColor2, mixStrength);
            float alpha = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
            gl_FragColor = vec4(color, alpha * 0.4);
          }
        `}
        transparent
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
}

export default function WaveScene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <WaveGrid />
      </Canvas>
    </div>
  );
}

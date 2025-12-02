import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- Error Boundary for WebGL ---
class ErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// --- 3D Components ---

const NetworkLines = () => {
    // Generate random connections
    const count = 40;
    const lines = useMemo(() => {
        const temp = [];
        for(let i=0; i<count; i++) {
            const start = [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            ] as [number, number, number];
            const end = [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            ] as [number, number, number];
            temp.push({ start, end });
        }
        return temp;
    }, []);

    return (
        <group>
            {lines.map((l, i) => (
                <Line 
                    key={i} 
                    points={[l.start, l.end]} 
                    color={i % 2 === 0 ? "#4F46E5" : "#10B981"} 
                    transparent 
                    opacity={0.1} 
                    lineWidth={1} 
                />
            ))}
        </group>
    )
}

const DigitalDust = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 1500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 5; // Radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group rotation={[0,0,Math.PI/6]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#888888"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
};

const SceneContent = () => {
    return (
        <>
            <fog attach="fog" args={['#050505', 5, 20]} />
            <ambientLight intensity={0.5} />
            <DigitalDust />
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <NetworkLines />
            </Float>
            <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        </>
    );
};

const ThreeScene: React.FC = () => {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Robust check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      // Try WebGL 1 first if 2 is restricted, or just check existence
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
          throw new Error("WebGL context creation failed");
      }
      setIsWebGLAvailable(true);
    } catch (e) {
      console.warn("WebGL check failed or restricted:", e);
      setIsWebGLAvailable(false);
    }
  }, []);

  // Render static background immediately if WebGL is unavailable
  if (isWebGLAvailable === false) {
    return <div className="absolute inset-0 -z-10 bg-void" />;
  }

  // Render static background while checking
  if (isWebGLAvailable === null) {
      return <div className="absolute inset-0 -z-10 bg-void" />;
  }

  return (
    <div className="absolute inset-0 -z-10 bg-void overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/50 to-void z-10" />
        <ErrorBoundary fallback={<div className="bg-void w-full h-full" />}>
            <Canvas 
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false }}
                dpr={[1, 1.5]}
            >
                <SceneContent />
            </Canvas>
        </ErrorBoundary>
    </div>
  );
};

export default ThreeScene;
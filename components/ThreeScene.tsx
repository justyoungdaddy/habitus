import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line, Float, Stars, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { VisualTheme } from '../types';

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

const MemphisBlobs = () => {
    return (
        <group>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Sphere args={[1, 32, 32]} position={[-2, 1, -5]}>
                    <meshStandardMaterial color="#A855F7" roughness={0.4} />
                </Sphere>
            </Float>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
                <Sphere args={[1.5, 32, 32]} position={[3, -1, -8]}>
                    <meshStandardMaterial color="#3B82F6" roughness={0.4} />
                </Sphere>
            </Float>
            <Float speed={1} rotationIntensity={2} floatIntensity={1}>
                <Box args={[1, 1, 1]} position={[0, 2, -4]} rotation={[0.5, 0.5, 0]}>
                    <meshStandardMaterial color="#EC4899" roughness={0.4} />
                </Box>
            </Float>
             <ambientLight intensity={0.8} />
             <directionalLight position={[10, 10, 5]} intensity={1} />
        </group>
    )
}

const BrutalistGrid = () => {
    return (
        <group>
             <gridHelper args={[20, 20, 0xffffff, 0x333333]} position={[0, -2, 0]} />
             <Float speed={5} rotationIntensity={0} floatIntensity={0}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <Box key={i} args={[0.1, Math.random() * 4, 0.1]} position={[(Math.random() - 0.5) * 10, 0, (Math.random() - 0.5) * 10]}>
                        <meshBasicMaterial color="white" wireframe />
                    </Box>
                ))}
             </Float>
        </group>
    )
}

const FounderMode = () => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if(ref.current) {
            ref.current.rotation.y += 0.01;
        }
    })
    return (
        <group ref={ref}>
            <Stars radius={30} depth={50} count={2000} factor={6} saturation={1} fade speed={3} />
            <ambientLight intensity={2} />
             <PointMaterial
                transparent
                color="#F59E0B"
                size={0.1}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
            />
        </group>
    )
}

const SceneContent = () => {
    const theme = useAppStore(s => s.theme);

    return (
        <>
            <fog attach="fog" args={['#050505', 5, 20]} />

            {theme === 'default' && (
                <>
                    <ambientLight intensity={0.5} />
                    <DigitalDust />
                    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                        <NetworkLines />
                    </Float>
                    <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
                </>
            )}

            {theme === 'memphis' && <MemphisBlobs />}

            {theme === 'brutalist' && <BrutalistGrid />}

            {theme === 'founder' && <FounderMode />}

            {theme === 'bento' && (
                 <>
                    <ambientLight intensity={0.8} />
                    <gridHelper args={[30, 30, 0x222222, 0x111111]} rotation={[Math.PI/2, 0, 0]} position={[0,0,-5]} />
                    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
                         <NetworkLines />
                    </Float>
                 </>
            )}
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
    return (
      <div className="absolute inset-0 -z-10 bg-void overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/50 to-void z-10" />
         {/* Simple static visual as fallback */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-blue/5 via-void to-void" />
      </div>
    );
  }

  // Render static background while checking
  if (isWebGLAvailable === null) {
      return <div className="absolute inset-0 -z-10 bg-void" />;
  }

  return (
    <div className="absolute inset-0 -z-10 bg-void overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/50 to-void z-10" />
        <ErrorBoundary fallback={<div className="bg-void w-full h-full"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-blue/5 via-void to-void" /></div>}>
            <Canvas 
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false }}
                dpr={[1, 1.5]}
                onCreated={({ gl }) => {
                   gl.domElement.addEventListener('webglcontextlost', (event) => {
                      event.preventDefault();
                      console.warn('WebGL Context Lost');
                   }, false);
                   gl.domElement.addEventListener('webglcontextrestored', () => {
                      console.log('WebGL Context Restored');
                   }, false);
                }}
            >
                <SceneContent />
            </Canvas>
        </ErrorBoundary>
    </div>
  );
};

export default ThreeScene;
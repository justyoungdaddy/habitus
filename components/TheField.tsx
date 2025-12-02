import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, InstancedMeshProps, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise, Vignette, Glitch } from '@react-three/postprocessing';
import { HabitusShaderMaterial } from './HabitusShader';

// Register the custom shader material with R3F
extend({ HabitusShaderMaterial });

// Add type definition for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      habitusShaderMaterial: any;
    }
  }
}

// --- DATA & TYPES ---
const LURKER_COUNT = 2000;
const FACTORY_COUNT = 50;
const STUDIO_COUNT = 30;

// --- COMPONENTS ---

// 1. THE VOID (Low Y): Instanced Particles with Gravity
const TheVoid = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate initial random positions
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < LURKER_COUNT; i++) {
            const x = (Math.random() - 0.5) * 400;
            const z = (Math.random() - 0.5) * 400;
            const y = Math.random() * -200; // Below ground
            temp.push({ x, y, z, speed: Math.random() * 0.2 });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        particles.forEach((p, i) => {
            // Swirling motion
            const time = state.clock.getElapsedTime();
            p.y += Math.sin(time * p.speed + p.x) * 0.1;
            p.x += Math.cos(time * 0.1) * 0.1;

            dummy.position.set(p.x, p.y, p.z);
            const scale = Math.max(0.1, 1 + p.y / 200); // Smaller as they go deeper
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, LURKER_COUNT]}>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshBasicMaterial color="#444" wireframe transparent opacity={0.3} />
        </instancedMesh>
    );
};

// 2. THE FACTORY (High X, Mid Y): Corporate Memphis Blobs
const TheFactory = () => {
    return (
        <group position={[100, 50, 0]}>
            <Text position={[0, 40, 0]} fontSize={10} color="#F43F5E">
                THE FACTORY
            </Text>
            {Array.from({ length: FACTORY_COUNT }).map((_, i) => (
                <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
                    <mesh position={[
                        (Math.random() - 0.5) * 100,
                        (Math.random() - 0.5) * 50,
                        (Math.random() - 0.5) * 100
                    ]}>
                        <sphereGeometry args={[Math.random() * 3 + 1, 32, 32]} />
                        {/* Use custom shader in "Factory" mode (authenticity = 0) */}
                        <habitusShaderMaterial
                            uColor={new THREE.Color("#3B82F6")}
                            uAuthenticity={0.0}
                            transparent
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

// 3. THE STUDIO (Low X, Mid Y): Neobrutalist Wireframes
const TheStudio = () => {
    return (
        <group position={[-100, 50, 0]}>
             <Text position={[0, 40, 0]} fontSize={10} color="#10B981">
                THE STUDIO
            </Text>
            {Array.from({ length: STUDIO_COUNT }).map((_, i) => (
                <Float key={i} speed={1} rotationIntensity={2} floatIntensity={1}>
                    <mesh position={[
                        (Math.random() - 0.5) * 100,
                        (Math.random() - 0.5) * 50,
                        (Math.random() - 0.5) * 100
                    ]}>
                        <boxGeometry args={[Math.random() * 5 + 1, Math.random() * 5 + 1, Math.random() * 5 + 1]} />
                         {/* Use custom shader in "Craft" mode (authenticity = 1) */}
                         <habitusShaderMaterial
                            uColor={new THREE.Color("#10B981")}
                            uAuthenticity={1.0}
                            wireframe
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

// 4. THE ZENITH (High Y): Bento Grid Islands
const TheZenith = () => {
    return (
        <group position={[0, 200, 0]}>
             <Text position={[0, 60, 0]} fontSize={15} color="#A855F7">
                THE ZENITH
            </Text>
            <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.5}>
                {/* Main Platform */}
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[100, 100, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#A855F7"
                        transmission={0.6}
                        roughness={0.1}
                        metalness={0.8}
                        thickness={2}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
                {/* Floating "Apps" */}
                <mesh position={[-20, 10, -20]}>
                    <boxGeometry args={[20, 10, 20]} />
                    <meshStandardMaterial color="#fff" emissive="#A855F7" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[20, 15, 10]}>
                    <boxGeometry args={[15, 20, 15]} />
                    <meshStandardMaterial color="#fff" emissive="#A855F7" emissiveIntensity={0.5} />
                </mesh>
            </Float>
        </group>
    );
};

// --- CAMERA CONTROLLER ---
const CameraRig = ({ targetPosition }: { targetPosition: { x: number, y: number } }) => {
    const { camera } = useThree();
    const vec = new THREE.Vector3();

    useFrame((state) => {
        // Smoothly interpolate camera position based on target (from entrance exam)
        // We map the 2D exam coordinates to 3D world space
        // x -> x * 2, y -> y * 4 (verticality is exaggerated)

        const targetX = targetPosition.x * 2;
        const targetY = targetPosition.y * 4 + 50; // Offset to start above ground

        state.camera.position.lerp(vec.set(targetX, targetY, 150), 0.02);
        state.camera.lookAt(0, targetY * 0.5, 0);
    });
    return null;
}


// --- MAIN SCENE ---
interface TheFieldProps {
    startCoordinates: { x: number, y: number };
}

const TheField: React.FC<TheFieldProps> = ({ startCoordinates }) => {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 200], fov: 60 }} gl={{ antialias: false }}> {/* Antialias false for performance with postprocessing */}
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#050505', 100, 500]} />

                <CameraRig targetPosition={startCoordinates} />
                <OrbitControls enablePan={false} maxDistance={400} minDistance={50} />

                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <directionalLight position={[100, 100, 50]} intensity={1} color="#A855F7" />
                <pointLight position={[-100, 50, 0]} intensity={2} color="#10B981" />
                <pointLight position={[100, 50, 0]} intensity={2} color="#3B82F6" />

                {/* Zones */}
                <TheVoid />
                <TheFactory />
                <TheStudio />
                <TheZenith />

                <Stars radius={300} depth={100} count={5000} factor={4} saturation={0} fade speed={0.5} />
                <Cloud position={[0, -100, 0]} opacity={0.5} speed={0.2} width={100} depth={5} segments={20} />

                {/* Post Processing */}
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.5} />
                    <Noise opacity={0.1} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    {/* Trigger glitch if low Y (in the void) - simplified for demo */}
                     {/* <Glitch delay={[1.5, 3.5]} duration={[0.6, 1.0]} strength={[0.3, 1.0]} active={startCoordinates.y < 0} /> */}
                </EffectComposer>
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute bottom-10 left-10 pointer-events-none text-white font-mono text-xs opacity-50">
                <p>COORDINATES: {startCoordinates.x.toFixed(0)}, {startCoordinates.y.toFixed(0)}</p>
                <p>ZONE: {
                    startCoordinates.y > 100 ? "ZENITH" :
                    startCoordinates.y < 0 ? "VOID" :
                    startCoordinates.x < 0 ? "STUDIO" : "FACTORY"
                }</p>
            </div>
        </div>
    );
};

export default TheField;

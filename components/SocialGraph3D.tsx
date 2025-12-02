import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// Data from the text
const DATA_POINTS = [
    { label: "Neovim", x: -80, y: 30, z: -10, color: "#10B981" }, // High Cultural, Low-Med Vol
    { label: "Obsidian", x: -70, y: 10, z: 0, color: "#10B981" },
    { label: "Linear", x: -40, y: 70, z: 20, color: "#4F46E5" }, // High Cultural, High Vol
    { label: "Figma", x: -20, y: 80, z: 40, color: "#4F46E5" },
    { label: "Jira", x: 70, y: 60, z: 50, color: "#F43F5E" }, // Low Cultural, High Vol
    { label: "Canva", x: 50, y: 40, z: 60, color: "#F43F5E" },
    { label: "Chrome", x: 20, y: -40, z: 80, color: "#9CA3AF" }, // Low Cultural, Low Vol
    { label: "Office", x: 60, y: -50, z: 90, color: "#9CA3AF" },
    { label: "Arc", x: -60, y: 40, z: -20, color: "#10B981" },
    { label: "Substack", x: -30, y: 60, z: 10, color: "#4F46E5" },
    { label: "LinkedIn", x: 80, y: 50, z: 70, color: "#F43F5E" },
    { label: "Instagram", x: 40, y: -70, z: 90, color: "#9CA3AF" },
];

const Node = ({ position, label, color }: { position: [number, number, number], label: string, color: string }) => {
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={position}>
                <Text
                    color={color}
                    fontSize={2}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.05}
                    outlineColor="#000000"
                >
                    {label}
                </Text>
                <mesh position={[0, -1.5, 0]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>
                <line>
                    <bufferGeometry />
                    <lineBasicMaterial color={color} transparent opacity={0.2} />
                </line>
            </group>
        </Float>
    );
};

const SocialGraph3D: React.FC = () => {
    return (
        <div className="w-full h-full bg-void rounded-xl overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-xs font-mono text-gray-400 pointer-events-none">
                <p>WASD / Mouse to Navigate</p>
                <p>X: Cultural Capital</p>
                <p>Y: Economic Volume</p>
            </div>
            <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#050505', 50, 200]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <group scale={[0.5, 0.5, 0.5]}>
                    {/* Axes */}
                    <gridHelper args={[200, 20, 0x333333, 0x111111]} rotation={[Math.PI/2, 0, 0]} />
                    <line>
                        <bufferGeometry />
                        <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
                    </line>

                    {DATA_POINTS.map((point, i) => (
                        <Node
                            key={i}
                            position={[point.x, point.y, point.z / 2]} // Flatten Z slightly
                            label={point.label}
                            color={point.color}
                        />
                    ))}
                </group>

                <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={true} minDistance={20} maxDistance={150} />
            </Canvas>
        </div>
    );
};

export default SocialGraph3D;

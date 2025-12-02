import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line, Trail } from '@react-three/drei';
import * as THREE from 'three';

const STAGES = [
    { label: "Avant-Garde", color: "#10B981", radius: 5, height: 10 },
    { label: "Adoption", color: "#3B82F6", radius: 10, height: 5 },
    { label: "Expansion", color: "#F59E0B", radius: 15, height: 0 },
    { label: "Exodus", color: "#EF4444", radius: 25, height: -10 },
];

const TOOLS = [
    { name: "React", offset: 0, speed: 0.2 },
    { name: "Notion", offset: 2, speed: 0.15 },
    { name: "Figma", offset: 4, speed: 0.18 },
    { name: "Linear", offset: 1, speed: 0.25 },
    { name: "Arc", offset: 0.5, speed: 0.3 },
    { name: "Corporate Memphis", offset: 3, speed: 0.1 },
];

const CycleNode = ({ name, offset, speed }: { name: string, offset: number, speed: number }) => {
    const ref = useRef<THREE.Group>(null);
    const trailRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime() * speed + offset;

        // Spiral Equation
        // Radius increases with time (moving outward)
        // Height decreases (moving downward/mainstream)
        const progress = (Math.sin(t * 0.1) + 1) / 2; // Oscillate 0 to 1 over long period for demo loop

        const angle = t;
        const radius = 5 + (progress * 20); // 5 to 25
        const y = 10 - (progress * 20); // 10 to -10

        ref.current.position.x = Math.cos(angle) * radius;
        ref.current.position.z = Math.sin(angle) * radius;
        ref.current.position.y = y;

        ref.current.lookAt(0, y, 0);
    });

    return (
        <group ref={ref}>
             <Trail width={1} length={8} color={new THREE.Color(0.2, 0.5, 1)} attenuation={(t) => t * t}>
                <mesh>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
                </mesh>
             </Trail>
            <Text
                position={[0, 1, 0]}
                fontSize={0.8}
                color="white"
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.05}
                outlineColor="black"
            >
                {name}
            </Text>
        </group>
    );
};

const GentrificationCycle: React.FC = () => {
    return (
        <group rotation={[0.2, 0, 0]}>
            {/* Central Axis */}
            <mesh position={[0,0,0]}>
                <cylinderGeometry args={[0.1, 0.1, 40, 8]} />
                <meshBasicMaterial color="#333" transparent opacity={0.5} />
            </mesh>

            {/* Stage Rings */}
            {STAGES.map((stage, i) => (
                <group key={i} position={[0, stage.height, 0]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[stage.radius - 0.2, stage.radius, 64]} />
                        <meshBasicMaterial color={stage.color} side={THREE.DoubleSide} transparent opacity={0.3} />
                    </mesh>
                    <Text
                        position={[stage.radius + 2, 0, 0]}
                        fontSize={1.2}
                        color={stage.color}
                        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnF8RD8yKxTOlOV.woff"
                    >
                        {stage.label}
                    </Text>
                </group>
            ))}

            {/* Connecting Spiral Guide (Visual Only) */}
             <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[15, 0.05, 16, 100]} />
                <meshBasicMaterial color="#333" transparent opacity={0.1} />
            </mesh>

            {/* Moving Nodes */}
            {TOOLS.map((tool, i) => (
                <CycleNode key={i} {...tool} />
            ))}

        </group>
    );
};

export default GentrificationCycle;

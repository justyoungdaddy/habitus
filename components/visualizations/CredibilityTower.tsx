import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Box, Edges } from '@react-three/drei';
import * as THREE from 'three';

const TIERS = [
    { label: "The Academic Aristocracy", color: "#10B981", y: 12, width: 6, items: ["Stanford d.school", "CMU HCI", "RCA"] },
    { label: "The Boutique Agencies", color: "#3B82F6", y: 6, width: 10, items: ["IDEO", "Frog", "Pentagram"] },
    { label: "The Bootcamp Proletariat", color: "#F59E0B", y: 0, width: 14, items: ["General Assembly", "Google Certs", "CareerFoundry"] },
    { label: "The Shilling Economy", color: "#EF4444", y: -6, width: 18, items: ["YouTube Gurus", "Dropshippers", "Faceless Channels"] },
];

const Block = ({ position, args, color, label }: { position: [number, number, number], args: [number, number, number], color: string, label: string }) => {
    return (
        <group position={position}>
            <Box args={args}>
                <meshStandardMaterial color={color} transparent opacity={0.8} roughness={0.2} metalness={0.8} />
                <Edges color="white" threshold={15} />
            </Box>
            <Text
                position={[0, 0, args[2] / 2 + 0.1]}
                fontSize={0.8}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    )
}

const CredibilityTower: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {TIERS.map((tier, i) => (
                <group key={i}>
                    {/* Tier Label */}
                    <Text
                        position={[-15, tier.y, 0]}
                        fontSize={1.5}
                        color={tier.color}
                        anchorX="right"
                        anchorY="middle"
                    >
                        {tier.label}
                    </Text>

                    {/* Tier Blocks */}
                    {tier.items.map((item, j) => {
                        const offset = (j - (tier.items.length - 1) / 2) * 4;
                        return (
                            <Float key={item} speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                                <Block
                                    position={[offset, tier.y, 0]}
                                    args={[3.5, 3, 3]}
                                    color={tier.color}
                                    label={item}
                                />
                            </Float>
                        )
                    })}

                    {/* Connecting Plate */}
                    <Box position={[0, tier.y - 2.5, 0]} args={[tier.width + 4, 0.2, 4]}>
                         <meshStandardMaterial color="#333" transparent opacity={0.5} />
                         <Edges color={tier.color} />
                    </Box>
                </group>
            ))}

            {/* The Wildcard (Orbiting Indie Hacker) */}
             <Float speed={5} rotationIntensity={2} floatIntensity={2}>
                <group position={[15, 5, 10]}>
                    <mesh>
                        <octahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial color="white" emissive="#A855F7" emissiveIntensity={2} />
                    </mesh>
                    <Text position={[0, 1.5, 0]} fontSize={1} color="#A855F7">The Indie Hacker</Text>
                </group>
             </Float>
        </group>
    );
};

export default CredibilityTower;

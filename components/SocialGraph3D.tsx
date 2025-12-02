import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Float, Html, Sphere, Box, Octahedron, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type NodeType = 'tool' | 'platform' | 'archetype' | 'aesthetic';

interface DataPoint {
    id: string;
    label: string;
    type: NodeType;
    x: number; // Cultural (-100 to 100)
    y: number; // Economic (-100 to 100)
    z: number; // Volume/Depth (-100 to 100)
    color: string;
    roast: string;
}

// --- Expanded Data ---
const DATA_POINTS: DataPoint[] = [
    // Q1: Aristocracy (High Cult, Low/Med Econ)
    { id: 'neovim', label: "Neovim", type: 'tool', x: -85, y: 30, z: -10, color: "#10B981", roast: "You don't edit text, you manipulate buffers with modal precision." },
    { id: 'godot', label: "Godot", type: 'tool', x: -80, y: 20, z: -5, color: "#10B981", roast: "Waiting for Unity to die." },
    { id: 'linux', label: "Arch Linux", type: 'tool', x: -95, y: 10, z: -15, color: "#10B981", roast: "I use Arch btw." },
    { id: 'obsidian', label: "Obsidian", type: 'tool', x: -75, y: 15, z: 0, color: "#10B981", roast: "Your second brain is larger than your first." },
    { id: 'arc', label: "Arc", type: 'tool', x: -65, y: 35, z: -20, color: "#10B981", roast: "The browser for people who tweet about browsers." },
    { id: 'mastodon', label: "Mastodon", type: 'platform', x: -90, y: -20, z: -30, color: "#10B981", roast: "Where you go to agree with people who agree with you." },
    { id: 'maintainer', label: "The Maintainer", type: 'archetype', x: -80, y: 50, z: 10, color: "#10B981", roast: "Fixes critical infrastructure for free. Hates you." },
    { id: 'rss', label: "RSS", type: 'tool', x: -95, y: 0, z: -40, color: "#10B981", roast: "The last bastion of the free web." },

    // Q2: Technocrats (High Cult, High Econ)
    { id: 'linear', label: "Linear", type: 'tool', x: -45, y: 75, z: 20, color: "#4F46E5", roast: "You prioritize issues faster than you solve them." },
    { id: 'raycast', label: "Raycast", type: 'tool', x: -40, y: 60, z: 15, color: "#4F46E5", roast: "Your launcher has more extensions than your browser." },
    { id: 'figma', label: "Figma", type: 'tool', x: -25, y: 85, z: 40, color: "#4F46E5", roast: "Multiplayer cursor combat simulator." },
    { id: 'vercel', label: "Vercel", type: 'platform', x: -20, y: 80, z: 50, color: "#4F46E5", roast: "Ship happens." },
    { id: 'founder', label: "Founder Mode", type: 'archetype', x: -35, y: 90, z: 60, color: "#4F46E5", roast: "Gaslight, Gatekeep, Girlboss (Tech Edition)." },
    { id: 'substack', label: "Substack", type: 'platform', x: -30, y: 65, z: 30, color: "#4F46E5", roast: "For when a tweet thread isn't insufferable enough." },
    { id: 'notion', label: "Notion", type: 'tool', x: -10, y: 70, z: 25, color: "#4F46E5", roast: "Lego for project managers." },

    // Q3: Merchants (Low Cult, High Econ)
    { id: 'jira', label: "Jira", type: 'tool', x: 75, y: 65, z: 50, color: "#F43F5E", roast: "Where dreams go to die in a backlog." },
    { id: 'linkedin', label: "LinkedIn", type: 'platform', x: 85, y: 55, z: 70, color: "#F43F5E", roast: "Agree? 👇" },
    { id: 'canva', label: "Canva", type: 'tool', x: 55, y: 45, z: 60, color: "#F43F5E", roast: "Design for people who hate designers." },
    { id: 'clickfunnels', label: "ClickFunnels", type: 'tool', x: 90, y: 80, z: 80, color: "#F43F5E", roast: "BUY MY COURSE TO LEARN HOW TO SELL COURSES." },
    { id: 'growthhacker', label: "Growth Hacker", type: 'archetype', x: 65, y: 75, z: 65, color: "#F43F5E", roast: "A/B testing the human soul." },

    // Q4: Proletariat (Low Cult, Low Econ)
    { id: 'chrome', label: "Chrome", type: 'tool', x: 25, y: -35, z: 80, color: "#9CA3AF", roast: "Ram eater. Data harvester. Default." },
    { id: 'office', label: "Office 365", type: 'tool', x: 65, y: -45, z: 90, color: "#9CA3AF", roast: "The beige paint of software." },
    { id: 'instagram', label: "Instagram", type: 'platform', x: 45, y: -65, z: 85, color: "#9CA3AF", roast: "Doomscroll simulator 2025." },
    { id: 'lurker', label: "The Lurker", type: 'archetype', x: 10, y: -80, z: 95, color: "#9CA3AF", roast: "Consumes everything, creates nothing." },
    { id: 'tiktok', label: "TikTok", type: 'platform', x: 35, y: -55, z: 90, color: "#9CA3AF", roast: "Dopamine on tap." },

    // Aesthetics (Floating Zones)
    { id: 'memphis', label: "Corp Memphis", type: 'aesthetic', x: 60, y: 20, z: 40, color: "#A855F7", roast: "Big limbs, small heads, zero soul." },
    { id: 'brutalist', label: "Neobrutalism", type: 'aesthetic', x: -60, y: 20, z: 10, color: "#000000", roast: "Ugly on purpose. So hot right now." },
    { id: 'bento', label: "Bento Grids", type: 'aesthetic', x: -15, y: 60, z: 35, color: "#3B82F6", roast: "Everything in a box." },
];

const NodeGeometry = ({ type, color, isHovered }: { type: NodeType, color: string, isHovered: boolean }) => {
    const scale = isHovered ? 1.5 : 1;

    if (type === 'platform') {
        return <Box args={[0.5, 0.5, 0.5]} scale={scale}><meshStandardMaterial color={color} wireframe={!isHovered} /></Box>;
    }
    if (type === 'archetype') {
        return <Octahedron args={[0.4, 0]} scale={scale}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHovered ? 1 : 0.2} /></Octahedron>;
    }
    if (type === 'aesthetic') {
        return <Sphere args={[0.6, 16, 16]} scale={scale}><meshStandardMaterial color={color} transparent opacity={0.4} roughness={0} /></Sphere>;
    }
    return <Sphere args={[0.25, 16, 16]} scale={scale}><meshStandardMaterial color={color} /></Sphere>;
};

const InteractiveNode = ({ point, onSelect, selectedId }: { point: DataPoint, onSelect: (p: DataPoint) => void, selectedId: string | null }) => {
    const [hovered, setHovered] = useState(false);
    const isSelected = selectedId === point.id;

    useFrame((state) => {
        // Subtle float
        const t = state.clock.getElapsedTime();
        // Add random phase based on x coordinate
        const yOffset = Math.sin(t + point.x) * 0.1;
    });

    return (
        <group position={[point.x, point.y, point.z / 2]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <group
                    onClick={(e) => { e.stopPropagation(); onSelect(point); }}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    scale={isSelected ? 1.2 : 1}
                >
                    <NodeGeometry type={point.type} color={point.color} isHovered={hovered || isSelected} />

                    {(hovered || isSelected) && (
                        <Html distanceFactor={15}>
                            <div className="bg-black/80 backdrop-blur-md p-2 rounded border border-white/20 whitespace-nowrap pointer-events-none transform -translate-y-8">
                                <span className="text-white text-xs font-bold">{point.label}</span>
                                <div className="text-[8px] uppercase tracking-widest text-gray-400">{point.type}</div>
                            </div>
                        </Html>
                    )}

                    {!hovered && !isSelected && (
                         <Text
                            position={[0, -0.8, 0]}
                            color={point.color}
                            fontSize={1.5}
                            anchorX="center"
                            anchorY="top"
                            fillOpacity={0.7}
                        >
                            {point.label}
                        </Text>
                    )}
                </group>
            </Float>
            {/* Connection line to ground/plane for depth perception */}
            <Line points={[[0,0,0], [0, -point.y - 100, 0]]} color={point.color} transparent opacity={0.05} />
        </group>
    );
};

const ConnectingLines = () => {
    // Generate lines between points in same quadrant
    const lines = useMemo(() => {
        const l = [];
        for(let i=0; i<DATA_POINTS.length; i++) {
            for(let j=i+1; j<DATA_POINTS.length; j++) {
                const p1 = DATA_POINTS[i];
                const p2 = DATA_POINTS[j];
                const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                // Connect if close and same color group
                if (dist < 30 && p1.color === p2.color) {
                    l.push({ start: [p1.x, p1.y, p1.z/2], end: [p2.x, p2.y, p2.z/2], color: p1.color });
                }
            }
        }
        return l;
    }, []);

    return (
        <group>
            {lines.map((l, i) => (
                <Line key={i} points={[l.start as any, l.end as any]} color={l.color} transparent opacity={0.1} lineWidth={0.5} />
            ))}
        </group>
    )
}

const ForceField = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
    return (
        <group position={position}>
             <mesh>
                <sphereGeometry args={[30, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.05} wireframe />
             </mesh>
             <Text position={[0, 0, 0]} fontSize={4} color={color} fillOpacity={0.2}>
                {label}
             </Text>
        </group>
    )
}

const SocialGraph3D: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<DataPoint | null>(null);

    return (
        <div className="w-full h-full bg-void rounded-xl overflow-hidden relative group">

            {/* HUD / Instructions */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-mono text-gray-400">
                    <p className="text-white font-bold mb-1">NAVIGATE THE FIELD</p>
                    <p>• Drag to Rotate</p>
                    <p>• Scroll to Zoom</p>
                    <p>• Click Nodes for Intel</p>
                    <div className="mt-2 flex gap-2">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Aristocracy</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-blue"></span>Technocrats</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                         <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Merchants</span>
                         <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span>Proletariat</span>
                    </div>
                </div>
            </div>

            {/* Selected Node Details Overlay */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-panel/90 backdrop-blur-xl border border-white/20 rounded-xl p-6 z-20 shadow-2xl"
                    >
                        <button
                            onClick={() => setSelectedNode(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${
                                selectedNode.color === '#10B981' ? 'text-emerald-500 border-emerald-500/30' :
                                selectedNode.color === '#4F46E5' ? 'text-neon-blue border-neon-blue/30' :
                                selectedNode.color === '#F43F5E' ? 'text-rose-500 border-rose-500/30' : 'text-gray-400 border-gray-400/30'
                            }`}>
                                {selectedNode.type}
                            </span>
                            <span className="text-xs font-mono text-gray-500">
                                X:{selectedNode.x} Y:{selectedNode.y}
                            </span>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-2">{selectedNode.label}</h3>
                        <p className="text-sm text-gray-300 italic border-l-2 border-white/20 pl-3 mb-4">
                            "{selectedNode.roast}"
                        </p>

                        <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden flex">
                            <div className="h-full bg-white/20" style={{ width: '50%' }} />
                            <div className="h-full bg-current" style={{ width: '10%', color: selectedNode.color }} />
                        </div>
                         <div className="flex justify-between text-[8px] font-mono text-gray-500 mt-1 uppercase">
                            <span>Craft</span>
                            <span>Commerce</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Canvas camera={{ position: [0, 0, 140], fov: 50 }}>
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#050505', 80, 250]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[50, 50, 50]} intensity={1} />
                <pointLight position={[-50, -50, -50]} intensity={0.5} color="#4F46E5" />

                <group scale={[0.5, 0.5, 0.5]}>
                    {/* Axes Grid */}
                    <gridHelper args={[200, 20, 0x333333, 0x111111]} rotation={[Math.PI/2, 0, 0]} position={[0,0,-20]} />

                    {/* Central Pillar */}
                    <mesh position={[0,0,0]}>
                         <cylinderGeometry args={[0.5, 0.5, 200, 8]} />
                         <meshBasicMaterial color="#333" transparent opacity={0.2} />
                    </mesh>

                    {/* Force Fields */}
                    <ForceField position={[-60, 60, 0]} color="#4F46E5" label="TECHNO-CAPITAL" />
                    <ForceField position={[60, 60, 0]} color="#F43F5E" label="MERCHANT-CAPITAL" />
                    <ForceField position={[-80, 0, 0]} color="#10B981" label="CULTURAL-PURITY" />

                    <ConnectingLines />

                    {DATA_POINTS.map((point) => (
                        <InteractiveNode
                            key={point.id}
                            point={point}
                            onSelect={setSelectedNode}
                            selectedId={selectedNode?.id || null}
                        />
                    ))}
                </group>

                <OrbitControls
                    autoRotate={!selectedNode}
                    autoRotateSpeed={0.5}
                    enableZoom={true}
                    minDistance={50}
                    maxDistance={200}
                    makeDefault
                />
            </Canvas>
        </div>
    );
};

export default SocialGraph3D;

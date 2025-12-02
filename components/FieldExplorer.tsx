import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Clock, Activity, Box, Maximize2 } from 'lucide-react';
import SocialGraph3D from './SocialGraph3D';
import GentrificationCycle from './visualizations/GentrificationCycle';
import CredibilityTower from './visualizations/CredibilityTower';

type VisualizationMode = 'graph' | 'cycle' | 'tower';

const FieldExplorer: React.FC = () => {
    const [mode, setMode] = useState<VisualizationMode>('graph');

    return (
        <div className="w-full h-[85vh] relative bg-void border border-white/10 rounded-xl overflow-hidden shadow-2xl group">

            {/* --- HUD HEADER --- */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
                <div>
                    <h2 className="text-2xl font-serif text-white tracking-tight flex items-center gap-2">
                        <Maximize2 className="w-5 h-5 text-neon-blue" />
                        The Field <span className="text-gray-600 text-sm font-mono tracking-widest uppercase mt-1">/ Explorer</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                        {mode === 'graph' && "COORDINATES: X(CULTURAL) / Y(ECONOMIC)"}
                        {mode === 'cycle' && "TEMPORAL FLOW: AVANT-GARDE -> EXODUS"}
                        {mode === 'tower' && "STRATIFICATION: CREDIBILITY HIERARCHY"}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2 pointer-events-auto">
                    <button
                        onClick={() => setMode('graph')}
                        className={`flex items-center gap-3 px-4 py-2 rounded border transition-all duration-300 w-48 justify-end ${
                            mode === 'graph'
                            ? 'bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                            : 'bg-black/50 border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                        }`}
                    >
                        <span className="font-mono text-xs uppercase tracking-widest">Social Graph</span>
                        <Activity className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setMode('cycle')}
                        className={`flex items-center gap-3 px-4 py-2 rounded border transition-all duration-300 w-48 justify-end ${
                            mode === 'cycle'
                            ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-black/50 border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                        }`}
                    >
                        <span className="font-mono text-xs uppercase tracking-widest">Lifecycle</span>
                        <Clock className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setMode('tower')}
                        className={`flex items-center gap-3 px-4 py-2 rounded border transition-all duration-300 w-48 justify-end ${
                            mode === 'tower'
                            ? 'bg-rose-500/10 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                            : 'bg-black/50 border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                        }`}
                    >
                        <span className="font-mono text-xs uppercase tracking-widest">Hierarchy</span>
                        <Layers className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* --- 3D VIEWPORT --- */}
            <div className="absolute inset-0 z-10">
                 {mode === 'graph' && <SocialGraph3D />}

                 {mode === 'cycle' && (
                     <Canvas camera={{ position: [0, 20, 30], fov: 45 }}>
                         <color attach="background" args={['#050505']} />
                         <fog attach="fog" args={['#050505', 20, 100]} />
                         <ambientLight intensity={0.5} />
                         <pointLight position={[10, 10, 10]} />
                         <GentrificationCycle />
                         <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={true} />
                         <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                     </Canvas>
                 )}

                 {mode === 'tower' && (
                     <Canvas camera={{ position: [20, 10, 20], fov: 40 }}>
                         <color attach="background" args={['#050505']} />
                         <fog attach="fog" args={['#050505', 20, 80]} />
                         <ambientLight intensity={0.5} />
                         <spotLight position={[50, 50, 0]} angle={0.5} penumbra={1} intensity={2} castShadow />
                         <CredibilityTower />
                         <OrbitControls autoRotate autoRotateSpeed={0.2} enableZoom={true} />
                         <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                     </Canvas>
                 )}
            </div>

            {/* --- FOOTER DECORATION --- */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none flex items-end px-6 pb-4">
                <div className="flex gap-4 text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                    <span>SYS.VER.2.0.4</span>
                    <span>RENDER.MODE.WEBGL</span>
                    <span>MEMORY.ALLOC.88%</span>
                </div>
            </div>

        </div>
    );
};

export default FieldExplorer;

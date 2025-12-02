import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quadrant, QuadrantData } from '../types';
import { Info, Users, TrendingUp, Gem, X, Target, Crosshair } from 'lucide-react';

// --- DATA ---
const QUADRANTS: QuadrantData[] = [
  {
    id: 'aristocracy',
    title: 'The Aristocracy',
    xLabel: 'High Cultural',
    yLabel: 'High Volume',
    description: 'The Purists. Open Source maintainers, Indie Web advocates. They value craft above all.',
    tools: ['Neovim', 'Obsidian', 'Arc', 'Personal Site'],
    archetypes: ['The Maintainer', 'The Researcher'],
    color: 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10'
  },
  {
    id: 'technocrats',
    title: 'The Technocrats',
    xLabel: 'High Cultural',
    yLabel: 'High Economic',
    description: 'The New Establishment. Founder Mode CEOs, VC Thought Leaders. Scale meets Taste.',
    tools: ['Linear', 'Figma', 'Substack', 'Vercel'],
    archetypes: ['Founder Mode', 'Staff Designer'],
    color: 'text-neon-blue border-neon-blue/50 bg-neon-blue/10'
  },
  {
    id: 'proletariat',
    title: 'The Proletariat',
    xLabel: 'Low Cultural',
    yLabel: 'Low Economic',
    description: 'The Consumers. Passive users trapped in default apps. No reach, no distinct taste.',
    tools: ['Chrome', 'Office 365', 'Instagram'],
    archetypes: ['The Lurker', 'Junior Corp Employee'],
    color: 'text-gray-400 border-gray-500/50 bg-gray-500/10'
  },
  {
    id: 'merchants',
    title: 'The Merchants',
    xLabel: 'Low Cultural',
    yLabel: 'High Economic',
    description: 'The Growth Hackers. Optimizing for conversion at the expense of soul.',
    tools: ['Jira', 'Canva', 'ClickFunnels', 'LinkedIn'],
    archetypes: ['Course Seller', 'Middle Manager'],
    color: 'text-rose-500 border-rose-500/50 bg-rose-500/10'
  }
];

// Nodes plotted on X (Composition: -100 Craft <-> 100 Commerce) and Y (Volume: -100 Low <-> 100 High)
const NODES = [
    { id: 'neovim', x: -85, y: 30, label: 'Neovim', q: 'aristocracy' },
    { id: 'obsidian', x: -70, y: 10, label: 'Obsidian', q: 'aristocracy' },
    { id: 'arc', x: -60, y: 40, label: 'Arc', q: 'aristocracy' },
    
    { id: 'linear', x: -40, y: 70, label: 'Linear', q: 'technocrats' },
    { id: 'figma', x: -20, y: 80, label: 'Figma', q: 'technocrats' },
    { id: 'substack', x: -30, y: 60, label: 'Substack', q: 'technocrats' },

    { id: 'jira', x: 70, y: 60, label: 'Jira', q: 'merchants' },
    { id: 'linkedin', x: 80, y: 50, label: 'LinkedIn', q: 'merchants' },
    { id: 'canva', x: 50, y: 40, label: 'Canva', q: 'merchants' },

    { id: 'chrome', x: 20, y: -40, label: 'Chrome', q: 'proletariat' },
    { id: 'office', x: 60, y: -50, label: 'Office 365', q: 'proletariat' },
    { id: 'insta', x: 40, y: -70, label: 'Instagram', q: 'proletariat' },
];

const QuadrantMap: React.FC = () => {
  const [selectedQuad, setSelectedQuad] = useState<Quadrant | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getQuadData = (id: Quadrant) => QUADRANTS.find(q => q.id === id)!;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 h-[80vh] flex flex-col md:flex-row gap-6 relative">
      
      {/* --- MAP VISUALIZATION --- */}
      <div className="relative flex-1 bg-void/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm group select-none">
        
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <div 
                className={`border-r border-b border-white/5 transition-colors duration-500 cursor-pointer ${selectedQuad === 'aristocracy' ? 'bg-emerald-500/5' : 'hover:bg-white/5'}`}
                onClick={() => setSelectedQuad('aristocracy')}
            />
            <div 
                className={`border-b border-white/5 transition-colors duration-500 cursor-pointer ${selectedQuad === 'technocrats' ? 'bg-neon-blue/5' : 'hover:bg-white/5'}`}
                onClick={() => setSelectedQuad('technocrats')}
            />
            <div 
                className={`border-r border-white/5 transition-colors duration-500 cursor-pointer ${selectedQuad === 'proletariat' ? 'bg-gray-500/5' : 'hover:bg-white/5'}`}
                onClick={() => setSelectedQuad('proletariat')}
            />
            <div 
                className={`transition-colors duration-500 cursor-pointer ${selectedQuad === 'merchants' ? 'bg-rose-500/5' : 'hover:bg-white/5'}`}
                onClick={() => setSelectedQuad('merchants')}
            />
        </div>

        {/* Axes Labels */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase text-gray-500 tracking-widest bg-void px-2">High Volume</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase text-gray-500 tracking-widest bg-void px-2">Low Volume</div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono uppercase text-gray-500 tracking-widest bg-void px-2">High Cultural</div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-mono uppercase text-gray-500 tracking-widest bg-void px-2">High Economic</div>

        {/* Center Origin */}
        <div className="absolute top-1/2 left-1/2 w-full h-px bg-white/10 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-px h-full bg-white/10 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] z-10" />

        {/* Nodes */}
        <div className="absolute inset-0 overflow-hidden">
            {NODES.map((node) => {
                // Convert coordinates (-100 to 100) to percentage (0 to 100)
                const left = 50 + (node.x / 2); // e.g. -50 becomes 25%
                const top = 50 - (node.y / 2); // e.g. 50 becomes 25%
                
                const isHovered = hoveredNode === node.id;
                const isDimmed = hoveredNode !== null && !isHovered;
                const isQuadActive = selectedQuad === node.q;

                return (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: isDimmed ? 0.3 : 1 }}
                        className="absolute w-0 h-0 flex items-center justify-center cursor-pointer z-20"
                        style={{ left: `${left}%`, top: `${top}%` }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={(e) => { e.stopPropagation(); setSelectedQuad(node.q as Quadrant); }}
                    >
                        <div className={`relative flex items-center justify-center group`}>
                            {/* Pulse Effect */}
                            {isQuadActive && (
                                <div className={`absolute w-12 h-12 rounded-full border opacity-20 animate-ping ${
                                    node.q === 'aristocracy' ? 'border-emerald-500' :
                                    node.q === 'technocrats' ? 'border-neon-blue' :
                                    node.q === 'merchants' ? 'border-rose-500' : 'border-gray-500'
                                }`} />
                            )}
                            
                            {/* Dot */}
                            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                                isHovered || isQuadActive ? 'scale-150 bg-white border-transparent' : 
                                node.q === 'aristocracy' ? 'bg-void border-emerald-500' :
                                node.q === 'technocrats' ? 'bg-void border-neon-blue' :
                                node.q === 'merchants' ? 'bg-void border-rose-500' : 'bg-void border-gray-500'
                            }`} />

                            {/* Label */}
                            <div className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 bg-panel border border-white/10 rounded text-xs font-mono transition-all duration-300 ${
                                isHovered || isQuadActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                            }`}>
                                {node.label}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>

        {/* Scan Line Animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10%] w-full animate-[scan_4s_linear_infinite] pointer-events-none" />

      </div>

      {/* --- INFO PANEL --- */}
      <AnimatePresence mode='wait'>
        {selectedQuad ? (
            <motion.div 
                key={selectedQuad}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                className={`w-full md:w-80 shrink-0 bg-panel border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col`}
            >
                {/* Colored Header Stripe */}
                <div className={`absolute top-0 left-0 w-full h-1 ${getQuadData(selectedQuad).color.split(' ')[0].replace('text-', 'bg-')}`} />
                
                <button 
                    onClick={() => setSelectedQuad(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6 mt-2">
                    <div className="flex items-center gap-2 mb-1">
                        {selectedQuad === 'aristocracy' && <Gem className="w-4 h-4 text-emerald-500" />}
                        {selectedQuad === 'technocrats' && <TrendingUp className="w-4 h-4 text-neon-blue" />}
                        {selectedQuad === 'merchants' && <Users className="w-4 h-4 text-rose-500" />}
                        {selectedQuad === 'proletariat' && <Info className="w-4 h-4 text-gray-500" />}
                        <span className="font-mono text-xs uppercase text-gray-500 tracking-widest">Selected Quadrant</span>
                    </div>
                    <h2 className="text-2xl font-serif text-white leading-none">{getQuadData(selectedQuad).title}</h2>
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                        <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-white/10 pl-3">
                            {getQuadData(selectedQuad).description}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-mono text-[10px] uppercase text-gray-500 mb-3 flex items-center gap-2">
                            <Crosshair className="w-3 h-3" /> Tooling Signals
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {getQuadData(selectedQuad).tools.map(t => (
                                <span key={t} className={`text-xs px-2 py-1 rounded border ${getQuadData(selectedQuad).color}`}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                     <div>
                        <h4 className="font-mono text-[10px] uppercase text-gray-500 mb-3 flex items-center gap-2">
                            <Target className="w-3 h-3" /> Archetypes
                        </h4>
                        <ul className="space-y-2">
                            {getQuadData(selectedQuad).archetypes.map(a => (
                                <li key={a} className="text-sm text-gray-300 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-current rounded-full" />
                                    {a}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Decorative Footer */}
                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase">
                    <span>Fig 1.1</span>
                    <span>Status: Verified</span>
                </div>

            </motion.div>
        ) : (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex w-80 shrink-0 bg-void/20 border border-white/5 rounded-xl p-6 items-center justify-center text-center"
            >
                <div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4 text-gray-600 animate-pulse">
                        <Crosshair className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
                        Select a sector<br/>to analyze
                    </p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan {
            0% { top: -10%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default QuadrantMap;

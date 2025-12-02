import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import ManifestoReader from './components/ManifestoReader';
import QuadrantMap from './components/QuadrantMap';
import StackAnalyzer from './components/StackAnalyzer';
import { MousePointer2, Box, Layers } from 'lucide-react';

enum View {
  MANIFESTO,
  MAP,
  SCANNER
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.MANIFESTO);

  return (
    <div className="min-h-screen relative text-gray-200 selection:bg-neon-blue/30 selection:text-white overflow-x-hidden">
      {/* 3D Background */}
      <ThreeScene />
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-void/50">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setView(View.MANIFESTO)}>
            <Layers className="w-5 h-5 text-white group-hover:text-neon-blue transition-colors" />
            <span className="font-mono font-bold tracking-tighter text-white hidden sm:inline group-hover:tracking-widest transition-all">DIGITAL HABITUS</span>
        </div>
        
        <nav className="flex gap-1 p-1 bg-white/5 rounded-full border border-white/10">
            <NavBtn active={view === View.MANIFESTO} onClick={() => setView(View.MANIFESTO)}>Manifesto</NavBtn>
            <NavBtn active={view === View.MAP} onClick={() => setView(View.MAP)}>The Field</NavBtn>
            <NavBtn active={view === View.SCANNER} onClick={() => setView(View.SCANNER)}>Scanner</NavBtn>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-20 w-full">
        {view === View.MANIFESTO && <ManifestoReader />}
        
        {view === View.MAP && (
            <div className="animate-in fade-in zoom-in-95 duration-700 w-full">
                <div className="text-center mb-6 px-4">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">The Social Graph</h2>
                    <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em]">Live Coordinates of Distinction</p>
                </div>
                <QuadrantMap />
            </div>
        )}

        {view === View.SCANNER && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 px-4 md:px-0 flex flex-col items-center justify-center min-h-[70vh]">
                 <StackAnalyzer />
            </div>
        )}
      </main>

      {/* Footer / Floating CTA */}
      <footer className="fixed bottom-6 right-6 z-40 hidden md:block">
        <div className="bg-panel border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-acid-green rounded-full animate-pulse shadow-[0_0_10px_#10B981]"></div>
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">System Online</span>
        </div>
      </footer>
    </div>
  );
};

const NavBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide transition-all duration-300
        ${active 
            ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
    >
        {children}
    </button>
);

export default App;

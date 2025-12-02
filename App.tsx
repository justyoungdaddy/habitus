import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import ManifestoReader from './components/ManifestoReader';
import FieldExplorer from './components/FieldExplorer';
import StackAnalyzer from './components/StackAnalyzer';
import EntranceExam from './components/EntranceExam';
import TheField from './components/TheField';
import { MousePointer2, Box, Layers, LogOut } from 'lucide-react';

enum View {
  EXAM,
  FIELD,
  MANIFESTO,
  EXPLORER,
  SCANNER
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.EXAM);
  const [userCoords, setUserCoords] = useState({ x: 0, y: 0 });

  const handleExamComplete = (coords: { x: number, y: number }) => {
      setUserCoords(coords);
      setView(View.FIELD);
  };

  // If in immersive field mode, render it full screen without standard layout
  if (view === View.FIELD) {
      return (
          <div className="relative w-full h-screen">
              <TheField startCoordinates={userCoords} />
              <button
                onClick={() => setView(View.MANIFESTO)}
                className="absolute top-6 left-6 z-50 px-4 py-2 bg-black/50 border border-white/10 rounded hover:bg-white/10 text-white font-mono text-xs flex items-center gap-2"
              >
                  <LogOut className="w-3 h-3" /> EXIT SIMULATION
              </button>
          </div>
      )
  }

  // Standard Layout
  return (
    <div className="min-h-screen relative text-gray-200 selection:bg-neon-blue/30 selection:text-white overflow-x-hidden">

      {/* Overlay Exam */}
      {view === View.EXAM && <EntranceExam onComplete={handleExamComplete} />}

      {/* 3D Background (only if not in EXAM to prevent conflict, though EXAM covers it) */}
      <ThreeScene />
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-void/50">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setView(View.MANIFESTO)}>
            <Layers className="w-5 h-5 text-white group-hover:text-neon-blue transition-colors" />
            <span className="font-mono font-bold tracking-tighter text-white hidden sm:inline group-hover:tracking-widest transition-all">DIGITAL HABITUS</span>
        </div>
        
        <nav className="flex gap-1 p-1 bg-white/5 rounded-full border border-white/10">
            <NavBtn active={view === View.MANIFESTO} onClick={() => setView(View.MANIFESTO)}>Manifesto</NavBtn>
            <NavBtn active={view === View.EXPLORER} onClick={() => setView(View.EXPLORER)}>The Map</NavBtn>
            <NavBtn active={view === View.SCANNER} onClick={() => setView(View.SCANNER)}>Scanner</NavBtn>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-20 w-full">
        {view === View.MANIFESTO && <ManifestoReader />}
        
        {view === View.EXPLORER && (
            <div className="animate-in fade-in zoom-in-95 duration-700 w-full px-4 md:px-8">
                 <FieldExplorer />
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

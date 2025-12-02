import React, { useState } from 'react';
import { UserStack, TOOLS_OPTIONS, AnalysisResult } from '../types';
import { analyzeDigitalHabitus } from '../services/geminiService';
import { Loader2, Terminal, CheckCircle } from 'lucide-react';

const StackAnalyzer: React.FC = () => {
  const [stack, setStack] = useState<UserStack>({
    designTool: '',
    browser: '',
    projectManagement: '',
    knowledgeBase: '',
    communication: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSelect = (category: keyof UserStack, value: string) => {
    setStack(prev => ({ ...prev, [category]: value }));
  };

  const isComplete = Object.values(stack).every(v => v !== '');

  const handleAnalyze = async () => {
    if (!isComplete) return;
    setIsAnalyzing(true);
    const data = await analyzeDigitalHabitus(stack);
    setResult(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-panel border border-white/5 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 blur-[100px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <Terminal className="text-acid-green w-6 h-6" />
        <h2 className="text-2xl font-serif text-white">Habitus Scanner</h2>
      </div>

      {!result ? (
        <div className="space-y-6">
          <p className="text-gray-400 text-sm font-sans">
            Select your daily drivers to reveal your position in the digital class hierarchy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(TOOLS_OPTIONS) as Array<keyof typeof TOOLS_OPTIONS>).map((category) => (
              <div key={category} className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-500 block">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <select
                  className="w-full bg-void border border-white/10 text-gray-300 text-sm rounded-lg p-2.5 focus:border-neon-blue focus:outline-none transition-colors appearance-none"
                  value={stack[category]}
                  onChange={(e) => handleSelect(category, e.target.value)}
                >
                  <option value="" disabled>Select Tool</option>
                  {TOOLS_OPTIONS[category].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!isComplete || isAnalyzing}
            className={`w-full py-4 mt-4 font-mono text-sm uppercase tracking-widest rounded-lg border transition-all duration-300
              ${isComplete && !isAnalyzing
                ? 'bg-white/10 border-white/20 text-white hover:bg-neon-blue hover:border-neon-blue'
                : 'bg-void border-white/5 text-gray-600 cursor-not-allowed'
              } flex items-center justify-center gap-2`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Habitus...
              </>
            ) : (
              'Analyze Digital Soul'
            )}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
               <div>
                   <span className={`font-mono text-xs px-2 py-1 rounded uppercase border ${
                       result.quadrant === 'aristocracy' ? 'text-emerald-500 border-emerald-500/30' :
                       result.quadrant === 'technocrats' ? 'text-neon-blue border-neon-blue/30' :
                       result.quadrant === 'merchants' ? 'text-rose-500 border-rose-500/30' : 'text-gray-500 border-gray-500/30'
                   }`}>
                       {result.quadrant}
                   </span>
                   <h3 className="text-3xl font-serif text-white mt-3">{result.title}</h3>
               </div>

               {/* Radar Chart Visualization (CSS/SVG Hybrid) */}
               <div className="relative w-32 h-32 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Background Circles */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="1" />
                        <circle cx="50" cy="50" r="22.5" fill="none" stroke="#333" strokeWidth="1" />

                        {/* Axes */}
                        <line x1="50" y1="5" x2="50" y2="95" stroke="#333" strokeWidth="1" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="#333" strokeWidth="1" />

                        {/* Data Polygon */}
                        <polygon
                            points={`50,${50 - (result.score.cultural/100)*45} ${50 + (result.score.economic/100)*45},50 50,${50 + (result.score.cultural/100)*45} ${50 - (result.score.economic/100)*45},50`}
                            fill="rgba(79, 70, 229, 0.2)"
                            stroke="#4F46E5"
                            strokeWidth="2"
                        />
                         {/* Points */}
                         <circle cx="50" cy={50 - (result.score.cultural/100)*45} r="2" fill="#10B981" />
                         <circle cx={50 + (result.score.economic/100)*45} cy="50" r="2" fill="#F43F5E" />
                    </svg>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[9px] font-mono text-gray-500">CULT</div>
                    <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 text-[9px] font-mono text-gray-500">ECON</div>
               </div>
           </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-void/30 p-3 rounded border border-white/5">
                    <div className="text-[10px] font-mono text-gray-500 uppercase">Cultural Capital</div>
                    <div className="text-xl font-bold text-white">{result.score.cultural}<span className="text-sm text-gray-600">/100</span></div>
                    <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${result.score.cultural}%` }} />
                    </div>
                </div>
                <div className="bg-void/30 p-3 rounded border border-white/5">
                    <div className="text-[10px] font-mono text-gray-500 uppercase">Economic Volume</div>
                    <div className="text-xl font-bold text-white">{result.score.economic}<span className="text-sm text-gray-600">/100</span></div>
                     <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full" style={{ width: `${result.score.economic}%` }} />
                    </div>
                </div>
            </div>
           
           <div className="bg-void/50 p-4 border-l-2 border-warning my-6">
               <p className="font-sans text-gray-300 italic leading-relaxed">"{result.roast}"</p>
           </div>

           <button 
             onClick={() => { setResult(null); setStack({designTool:'', browser:'', projectManagement:'', knowledgeBase:'', communication:''}) }}
             className="text-xs font-mono text-gray-500 hover:text-white underline decoration-dotted"
           >
             RESET SIMULATION
           </button>
        </div>
      )}
    </div>
  );
};

export default StackAnalyzer;
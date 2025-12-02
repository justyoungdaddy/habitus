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
           <div className="flex justify-between items-start mb-4">
               <div>
                   <span className="font-mono text-xs text-acid-green border border-acid-green/30 px-2 py-1 rounded uppercase">
                       {result.quadrant}
                   </span>
                   <h3 className="text-3xl font-serif text-white mt-3">{result.title}</h3>
               </div>
               <div className="text-right">
                   <div className="text-xs font-mono text-gray-500 uppercase">Cultural</div>
                   <div className="text-xl font-bold text-white">{result.score.cultural}/100</div>
                   <div className="text-xs font-mono text-gray-500 uppercase mt-2">Economic</div>
                   <div className="text-xl font-bold text-white">{result.score.economic}/100</div>
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
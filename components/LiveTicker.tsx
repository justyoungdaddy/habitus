import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

const EVENTS = [
    { text: "User #492 migrated from Jira to Linear", change: "+5 Cult", type: "pos" },
    { text: "Startup X launched on Product Hunt", change: "+10 Vol", type: "neutral" },
    { text: "Designer switched from Figma to Canva", change: "-20 Cult", type: "neg" },
    { text: "New Substack article trending on HN", change: "+15 Cult", type: "pos" },
    { text: "Corporate rebrand uses Memphis style", change: "-50 Cult", type: "neg" },
    { text: "Junior Dev discovered Neovim", change: "+30 Cult", type: "pos" },
    { text: "Influence farm detected on LinkedIn", change: "+100 Vol", type: "neg" },
    { text: "VC tweeted about 'Founder Mode'", change: "Cringe", type: "neg" },
    { text: "Portfolio site deployed to Vercel", change: "+5 Econ", type: "pos" },
    { text: "User installed Arc Browser", change: "+10 Cult", type: "pos" },
];

const LiveTicker: React.FC = () => {
    const [currentEvent, setCurrentEvent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEvent(prev => (prev + 1) % EVENTS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const evt = EVENTS[currentEvent];

    return (
        <div className="absolute bottom-4 left-4 md:left-auto md:right-4 z-20 flex flex-col items-end pointer-events-none">
            <div className="flex items-center gap-2 mb-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-emerald-500 uppercase tracking-widest border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Social Graph Feed
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentEvent}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-panel border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md max-w-xs"
                >
                    <div className="flex justify-between items-start gap-4">
                        <p className="text-xs font-mono text-gray-300 leading-tight">
                            {evt.text}
                        </p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            evt.type === 'pos' ? 'bg-emerald-500/10 text-emerald-500' :
                            evt.type === 'neg' ? 'bg-rose-500/10 text-rose-500' :
                            'bg-blue-500/10 text-blue-500'
                        }`}>
                            {evt.change}
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default LiveTicker;

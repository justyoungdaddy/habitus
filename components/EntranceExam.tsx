import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, Check } from 'lucide-react';

interface EntranceExamProps {
    onComplete: (coordinates: { x: number, y: number }) => void;
}

const QUESTIONS = [
    {
        id: 'design',
        question: "Choose your weapon:",
        options: [
            { label: "Figma", value: "craft", score: { x: -50, y: 50 } },
            { label: "Canva", value: "commerce", score: { x: 50, y: 0 } }
        ]
    },
    {
        id: 'management',
        question: "How do you track progress?",
        options: [
            { label: "Linear", value: "craft", score: { x: -30, y: 50 } },
            { label: "Jira", value: "commerce", score: { x: 50, y: 20 } }
        ]
    },
    {
        id: 'browser',
        question: "Your window to the web:",
        options: [
            { label: "Arc", value: "craft", score: { x: -50, y: 20 } },
            { label: "Chrome", value: "commerce", score: { x: 20, y: -20 } }
        ]
    }
];

const EntranceExam: React.FC<EntranceExamProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [totalScore, setTotalScore] = useState({ x: 0, y: 0 });

    const handleSelect = (option: any) => {
        setHistory([...history, `> ${option.label}`]);
        setTotalScore(prev => ({ x: prev.x + option.score.x, y: prev.y + option.score.y }));

        if (step < QUESTIONS.length - 1) {
            setTimeout(() => setStep(step + 1), 500);
        } else {
            setTimeout(() => onComplete(totalScore), 1000);
        }
    };

    const currentQ = QUESTIONS[step];

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center font-mono p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-gray-500 text-xs uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>System Initialization</span>
                </div>

                <div className="space-y-2 mb-8 h-32 overflow-hidden text-sm text-gray-400">
                    {history.map((line, i) => (
                        <div key={i} className="opacity-50">{line}</div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white"
                    >
                        {step < QUESTIONS.length ? `> ${currentQ.question}` : "> Calculating Social Coordinates..."}
                    </motion.div>
                </div>

                <AnimatePresence mode='wait'>
                    {step < QUESTIONS.length && (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {currentQ.options.map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => handleSelect(opt)}
                                    className="border border-white/20 p-4 hover:bg-white hover:text-black transition-colors text-left group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{opt.label}</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((step) / QUESTIONS.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default EntranceExam;

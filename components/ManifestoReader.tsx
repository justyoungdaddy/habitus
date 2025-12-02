import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { VisualTheme } from '../types';

const SectionHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-baseline gap-4 mb-8 mt-24 border-b border-white/10 pb-4">
    <span className="font-mono text-neon-blue text-sm">{number}</span>
    <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-white">{title}</h2>
  </div>
);

const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-sans text-lg leading-relaxed text-gray-400 mb-6 max-w-2xl text-justify">
    {children}
  </p>
);

const InsightBox: React.FC<{ title: string; children: React.ReactNode; type?: 'high' | 'low' }> = ({ title, children, type = 'high' }) => (
  <div className={`my-12 p-6 border-l-2 rounded-r-lg ${type === 'high' ? 'border-acid-green bg-acid-green/5' : 'border-neon-blue bg-neon-blue/5'}`}>
    <h4 className={`font-mono text-xs uppercase tracking-widest mb-2 ${type === 'high' ? 'text-acid-green' : 'text-neon-blue'}`}>{title}</h4>
    <p className="text-gray-300 font-sans italic">{children}</p>
  </div>
);

const ThemeTrigger: React.FC<{ theme: VisualTheme; children: React.ReactNode }> = ({ theme, children }) => {
    const setTheme = useAppStore(s => s.setTheme);

    return (
        <motion.div
            onViewportEnter={() => setTheme(theme)}
            viewport={{ amount: 0.5, margin: "0px 0px -20% 0px" }}
        >
            {children}
        </motion.div>
    )
}

const ManifestoReader: React.FC = () => {
  return (
    <article className="px-6 md:px-20 py-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <ThemeTrigger theme="default">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tighter">
            The Digital <span className="italic text-gray-500">Habitus</span>
            </h1>
            <p className="font-mono text-sm text-gray-500 mb-20 uppercase tracking-widest">A Sociological Mapping of Status in the Algorithmic Age</p>

            <SectionHeader number="01" title="The Restructuring of the Social Field" />
            <Paragraph>
            The sociology of the internet has long transcended the early, utopian visions of a flat, democratized hierarchy. As digital networks have matured, they have not dissolved class structures but rather calcified them into new, rigid formations that mirror the stratification of the physical world while operating through distinct, often opaque mechanisms of capital accumulation and conversion.
            </Paragraph>
            <Paragraph>
            To understand the current moment in User Experience (UX) design, the creator economy, and the complex machinery of technological distribution, one must revisit and vigorously adapt the framework established by Pierre Bourdieu in Distinction: A Social Critique of the Judgement of Taste (1979).
            </Paragraph>
        </ThemeTrigger>

        <ThemeTrigger theme="default">
            <SectionHeader number="01.1" title="The New Axes of Power" />
            <Paragraph>
                The "field"—Bourdieu’s term for the social arena where struggles for resources and status occur—is no longer defined solely by university degrees or inherited agrarian wealth, though these remain potent, but by a new tension between <strong>"Craft"</strong> (Digital Cultural Capital) and <strong>"Scale"</strong> (Digital Economic Capital).
            </Paragraph>
            <Paragraph>
                We are witnessing the formation of a digital aristocracy that defines itself against a digital proletariat not merely through wealth, but through the "purity" of their interaction with the machine.
            </Paragraph>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="p-6 border border-white/10 rounded bg-void/50">
                    <h4 className="font-mono text-acid-green mb-2">Y-Axis: Volume</h4>
                    <p className="text-sm text-gray-400">Economic Capital. Reach, Revenue, Raw Power. From "Lurkers" to "Tech Giants".</p>
                </div>
                <div className="p-6 border border-white/10 rounded bg-void/50">
                    <h4 className="font-mono text-neon-blue mb-2">X-Axis: Composition</h4>
                    <p className="text-sm text-gray-400">Cultural Capital. Craft vs. Commerce. From "Engineering Purity" to "Growth Hacking".</p>
                </div>
            </div>
        </ThemeTrigger>

        <ThemeTrigger theme="bento">
            <SectionHeader number="02" title="Tooling as Tribalism" />
            <Paragraph>
                In the digital age, software tools are not merely functional utilities; they are fashion statements, political declarations, and tribal badges. The software stack a company or individual chooses signals their values, their budget, and their place on the "Cool vs. Corporate" spectrum.
            </Paragraph>

            <InsightBox title="The Figma vs. Canva Divide">
                "Figma is the craft sanctuary. To use Figma is to declare oneself a Designer with a capital D. It implies a respect for systems. Canva represents the industrialization of design... it is high economic capital but zero cultural capital. Using Canva for a 'serious' project is a faux pas."
            </InsightBox>

            <Paragraph>
                 This "material culture" of software is a primary way digital natives read each other’s status.
            </Paragraph>
        </ThemeTrigger>

        <ThemeTrigger theme="founder">
            <SectionHeader number="03" title="Founder Mode & The New Elites" />
            <Paragraph>
                The apex of the Y-axis (High Volume of Capital) is occupied by the "Tech Founder." However, a schism has formed within this class, defined by the concept of "Founder Mode" versus "Manager Mode".
            </Paragraph>
            <Paragraph>
                "Founder Mode" celebrates the hands-on, idiosyncratic, often abrasive interventionism of the founder. It explicitly rejects "professional management" (HR, delegation, bureaucracy) as a virus that kills companies. By claiming to be "in the details," the Founder claims the "Craft" status of the artisan, despite having the "Scale" of the industrialist.
            </Paragraph>
            <InsightBox title="Shitposting as Strategy" type="low">
                "High-status founders often engage in 'shitposting'. This signals immunity from social norms. Only those with immense capital can afford to be offensive without consequence. It functions as a 'costly signal' of power."
            </InsightBox>
        </ThemeTrigger>

        <ThemeTrigger theme="memphis">
            <SectionHeader number="04" title="Aesthetics of Power: The Fall of Corporate Memphis" />
            <Paragraph>
                Visual trends are the most visible indicators of the shifting cultural tides. "Corporate Memphis"—the flat, colorful illustrations of people with purple skin, disproportionate limbs, and tiny heads—was originally adopted by Big Tech to appear friendly and inclusive.
            </Paragraph>
            <Paragraph>
                Because it became the uniform of Big Tech (High Economic Capital), it lost all Cultural Capital. It became associated with "soullessness," "censorship," and "HR training videos." To use this style in 2025 is to signal that a brand is out of touch.
            </Paragraph>
        </ThemeTrigger>

        <ThemeTrigger theme="brutalist">
            <SectionHeader number="05" title="The Rise of Neobrutalism" />
            <Paragraph>
                In reaction to the polished "sameness" of Corporate Memphis, the avant-garde embraced Neobrutalism. This style features high-contrast colors, unstyled HTML borders, overlapping elements, and raw typography.
            </Paragraph>
            <Paragraph>
                Neobrutalism signals "authenticity." It says, "We are focusing on the raw content; we don't need to hide behind polish." However, as this style gets adopted by brands like Gumroad and Figma, it begins its migration rightward toward the mainstream, destined to become the next corporate standard.
            </Paragraph>
        </ThemeTrigger>

        <div className="h-64 flex flex-col items-center justify-center mt-32 border-t border-white/10">
            <p className="font-mono text-xs text-gray-600 mb-4">END OF TRANSMISSION</p>
            <div className="w-1 h-12 bg-gradient-to-b from-gray-600 to-transparent"></div>
        </div>

      </motion.div>
    </article>
  );
};

export default ManifestoReader;
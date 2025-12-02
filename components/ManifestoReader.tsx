import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-baseline gap-4 mb-8 mt-16 border-b border-white/10 pb-4">
    <span className="font-mono text-neon-blue text-sm">{number}</span>
    <h2 className="text-3xl font-serif tracking-tight text-white">{title}</h2>
  </div>
);

const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-sans text-lg leading-relaxed text-gray-400 mb-6 max-w-2xl text-justify">
    {children}
  </p>
);

const InsightBox: React.FC<{ title: string; children: React.ReactNode; type?: 'high' | 'low' }> = ({ title, children, type = 'high' }) => (
  <div className={`my-8 p-6 border-l-2 ${type === 'high' ? 'border-acid-green bg-acid-green/5' : 'border-neon-blue bg-neon-blue/5'}`}>
    <h4 className={`font-mono text-xs uppercase tracking-widest mb-2 ${type === 'high' ? 'text-acid-green' : 'text-neon-blue'}`}>{title}</h4>
    <p className="text-gray-300 font-sans italic">{children}</p>
  </div>
);

const ManifestoReader: React.FC = () => {
  return (
    <article className="px-6 md:px-20 py-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tighter">
          The Digital <span className="italic text-gray-500">Habitus</span>
        </h1>
        <p className="font-mono text-sm text-gray-500 mb-20">A Sociological Mapping of Status in the Algorithmic Age</p>

        <SectionHeader number="01" title="The Restructuring of the Social Field" />
        <Paragraph>
          The sociology of the internet has long transcended the early, utopian visions of a flat, democratized hierarchy. As digital networks have matured, they have not dissolved class structures but rather calcified them into new, rigid formations.
        </Paragraph>
        <Paragraph>
          The "field" is no longer defined solely by university degrees, but by a new tension between <strong>"Craft"</strong> (Digital Cultural Capital) and <strong>"Scale"</strong> (Digital Economic Capital). We are witnessing the formation of a digital aristocracy that defines itself against a digital proletariat through the purity of their interaction with the machine.
        </Paragraph>

        <SectionHeader number="01.1" title="Adapting Bourdieu" />
        <Paragraph>
            The Vertical Y-Axis represents the <strong>Volume of Capital</strong>. At the zenith, the Tech Giants and Unicorn Founders. At the nadir, the Lurkers.
        </Paragraph>
        <Paragraph>
            The Horizontal X-Axis represents the <strong>Composition of Capital</strong>. On the left: Engineering Purity, Organic Reach, Linear. On the right: Growth, Paid Acquisition, Jira.
        </Paragraph>

        <SectionHeader number="02" title="Tooling as Tribalism" />
        <Paragraph>
            In the digital age, software tools are not merely functional utilities; they are fashion statements.
        </Paragraph>

        <InsightBox title="The Figma vs. Canva Divide">
            "Figma is the craft sanctuary. To use Figma is to declare oneself a Designer. Canva represents the industrialization of design... it is high economic capital but zero cultural capital."
        </InsightBox>

        <SectionHeader number="03" title="The Linear Aesthetic" />
        <Paragraph>
            "Linear-style" is now a shorthand for High-End SaaS. Dark mode, glowing gradients, subtle borders. It signals speed, craft, and autonomy. Conversely, the "Jira Ticket" is a metonym for the commodification of creative work.
        </Paragraph>

        <SectionHeader number="04" title="Founder Mode" />
        <Paragraph>
            Founder Mode celebrates the hands-on interventionism. It is a rejection of the managerial class (Jira users). By claiming to be "in the details," the Founder claims the "Craft" status of the artisan, despite having the "Scale" of the industrialist.
        </Paragraph>

        <div className="h-32 flex items-center justify-center mt-20">
            <p className="font-mono text-xs text-gray-600">END OF MANIFESTO PART 1</p>
        </div>

      </motion.div>
    </article>
  );
};

export default ManifestoReader;
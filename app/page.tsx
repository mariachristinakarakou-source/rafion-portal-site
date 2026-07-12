'use client';
import { motion, useReducedMotion } from 'framer-motion';

const engagementSteps = [
  {
    title: 'Strategic Audit',
    description: 'Analyze datasets and surface the highest-conviction opportunities.',
  },
  {
    title: 'Bespoke Agent Development',
    description: 'Build custom autonomous agents tailored to your firm’s operating rhythm.',
  },
  {
    title: 'Continuous Optimization',
    description: 'Refine performance as market conditions evolve and your strategy matures.',
  },
];

const ragBenefits = [
  {
    title: 'Proprietary Insight',
    description: 'Turn internal knowledge into structured, decision-ready intelligence.',
  },
  {
    title: 'Absolute Data Sovereignty',
    description: 'Keep sensitive firm data protected with governance-first infrastructure.',
  },
  {
    title: 'Precision at Scale',
    description: 'Deliver fast, relevant outputs across the organization without compromising quality.',
  },
];

const trustLogos = ['NEXUS', 'AURORA', 'MARC', 'LUMEN', 'QUANT'];

const teamImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <rect width="900" height="900" rx="48" fill="#050505"/>
    <rect x="70" y="70" width="760" height="760" rx="36" fill="#111111" stroke="#2a2a2a" stroke-width="2"/>
    <circle cx="450" cy="360" r="180" fill="url(#g)"/>
    <circle cx="390" cy="330" r="20" fill="#f5f5f5"/>
    <circle cx="510" cy="330" r="20" fill="#f5f5f5"/>
    <path d="M340 470c30 55 190 55 220 0" stroke="#f5f5f5" stroke-width="18" stroke-linecap="round"/>
    <defs>
      <linearGradient id="g" x1="220" y1="180" x2="700" y2="660" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ffffff" stop-opacity="0.95"/>
        <stop offset="1" stop-color="#6b7280" stop-opacity="0.6"/>
      </linearGradient>
    </defs>
  </svg>
`)}`;

type RevealBlockProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

function RevealBlock({ children, className, delay = 0 }: RevealBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-gray-400">{copy}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-300">Rafion AI</span>
          <a
            href="#hero"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
          >
            Request a Demo
          </a>
        </div>
      </nav>

      <section id="hero" className="relative mx-auto flex max-w-7xl flex-col px-6 pb-20 pt-24 md:pt-32 lg:pt-36">
        <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-6xl rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(99,102,241,0.25),_transparent_28%),linear-gradient(120deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] blur-3xl" />
        <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-[24rem] max-w-5xl rounded-full bg-gradient-to-br from-white/10 via-fuchsia-500/10 to-cyan-500/10 blur-[120px]" />

        <div className="max-w-4xl">
          <RevealBlock delay={0.02}>
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-gray-500">Institutional Deal Intelligence</p>
          </RevealBlock>
          <RevealBlock delay={0.06}>
            <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl lg:text-7xl">
              Institutional-Grade Deal Sourcing: We Architect Your Autonomous Growth.
            </h1>
          </RevealBlock>
          <RevealBlock delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400 sm:text-xl">
              We deploy custom-built autonomous agents to qualify leads and secure meetings, aligning technology with your firm’s DNA.
            </p>
          </RevealBlock>
          <RevealBlock delay={0.14}>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#engagement"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition duration-300 hover:bg-gray-200"
              >
                Request a Demo
              </a>
              <a
                href="#rag-advantage"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-gray-200 transition duration-300 hover:border-white/35 hover:text-white"
              >
                Explore the Architecture
              </a>
            </div>
          </RevealBlock>
        </div>

        <RevealBlock delay={0.18} className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            ['Autonomous workflows', 'Convert pipeline activity into high-signal execution with disciplined automation.'],
            ['Proprietary context', 'Ground every decision in your firm’s private data and proven playbooks.'],
            ['Secure operations', 'Deploy with governance-first controls for sensitive deal environments.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-400">{copy}</p>
            </div>
          ))}
        </RevealBlock>
      </section>

      <section id="engagement" className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealBlock>
            <SectionHeading
              eyebrow="Engagement Model"
              title="Our Engagement Model"
              copy="A disciplined approach to turning proprietary context into reliable autonomous execution."
            />
          </RevealBlock>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {engagementSteps.map((step, index) => (
              <RevealBlock key={step.title} delay={0.05 * index}>
                <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">0{index + 1}</p>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-400">{step.description}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <section id="rag-advantage" className="border-t border-white/10 bg-zinc-950/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealBlock>
            <SectionHeading
              eyebrow="RAG Advantage"
              title="Your Data, Secured and Augmented."
              copy="Deliver context-rich, compliant outputs that preserve the integrity of your proprietary information."
            />
          </RevealBlock>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ragBenefits.map((benefit, index) => (
              <RevealBlock key={benefit.title} delay={0.05 * index}>
                <div className="rounded-3xl border border-white/10 bg-black p-8">
                  <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-400">{benefit.description}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealBlock>
            <SectionHeading
              eyebrow="Trusted Infrastructure"
              title="Trusted Infrastructure"
              copy="Operationally resilient systems and strategic partnerships that support institutional-grade execution."
            />
          </RevealBlock>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {trustLogos.map((logo, index) => (
              <RevealBlock key={logo} delay={0.04 * index}>
                <div className="rounded-2xl border border-white/10 bg-zinc-950/70 px-6 py-5 text-center text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">
                  {logo}
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealBlock>
            <SectionHeading
              eyebrow="The Architects"
              title="The Architects"
              copy="A team of operators and technologists with deep experience driving high-stakes institutional workflows."
            />
          </RevealBlock>

          <div className="mt-12 grid gap-8 rounded-[2rem] border border-white/10 bg-zinc-950/70 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <RevealBlock delay={0.04}>
              <img src={teamImage} alt="Portrait placeholder of the Rafion AI team" className="h-full min-h-[300px] w-full rounded-[1.5rem] object-cover" />
            </RevealBlock>
            <RevealBlock delay={0.08}>
              <div className="flex h-full flex-col justify-center">
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Institutional Expertise</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">Built for firms that demand precision, control, and speed.</h3>
                <p className="mt-5 text-lg leading-8 text-gray-400">
                  Our architects combine automation, domain fluency, and secure systems design to help growth-minded firms move faster without sacrificing rigor.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">Private Market Fluency</span>
                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">Secure Infrastructure</span>
                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">Autonomous Workflow Design</span>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>
    </main>
  );
}

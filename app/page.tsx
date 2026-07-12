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

const teamMembers = [
  {
    name: 'Maria Christina Karakou',
    title: 'Founder & Head of Growth',
    bio: 'Driving high-growth strategies and market expansion through autonomous AI systems.',
    linkedIn: 'https://www.linkedin.com/in/maria-christina-karakou-354b2038b/?skipRedirect=true',
  },
  {
    name: 'Konstantinos Lambiris',
    title: 'Co-Founder & Lead Engineer',
    bio: 'Engineering robust AI infrastructure and specialized RAG architectures.',
    linkedIn: 'https://www.linkedin.com/in/konstantinos-lambiris-6b62ab3ba/',
  },
];

const placeholderAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <rect width="240" height="240" rx="120" fill="#111111"/>
    <circle cx="120" cy="92" r="42" fill="#7a7f87"/>
    <path d="M72 208c10-38 34-56 48-56s38 18 48 56" fill="#7a7f87"/>
    <path d="M90 100c0-16 11-30 30-30s30 14 30 30c0 18-12 28-30 28s-30-10-30-28Z" fill="#8d959f"/>
  </svg>
`)}`;

const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

type RevealBlockProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,214,102,0.18),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(88,28,135,0.2),_transparent_28%),linear-gradient(120deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.02))]" />
      <div className="ambient-orb -left-10 top-24 h-72 w-72 bg-[radial-gradient(circle,_rgba(255,214,102,0.35),_transparent_72%)]" />
      <div className="ambient-orb ambient-orb--slow right-[5%] top-[8%] h-96 w-96 bg-[radial-gradient(circle,_rgba(124,58,237,0.24),_transparent_72%)]" />
      <div className="ambient-orb ambient-orb--reverse bottom-[8%] left-[10%] h-80 w-80 bg-[radial-gradient(circle,_rgba(34,211,238,0.22),_transparent_70%)]" />
      <div className="ambient-orb bottom-[2%] right-[8%] h-80 w-80 bg-[radial-gradient(circle,_rgba(255,255,255,0.16),_transparent_70%)]" />
    </div>
  );
}

function RevealBlock({ children, className, delay = 0 }: RevealBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
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
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      <AmbientBackground />
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

      <section id="hero" className="relative mx-auto flex max-w-7xl flex-col px-6 pb-28 pt-28 md:pt-36 lg:pt-40 lg:pb-32">
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

        <RevealBlock delay={0.16} className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {trustLogos.map((logo, index) => (
            <div key={logo} className="rounded-2xl border border-white/10 bg-zinc-950/70 px-5 py-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gray-500 backdrop-blur-sm">
              {logo}
            </div>
          ))}
        </RevealBlock>

        <RevealBlock delay={0.2} className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ['Autonomous workflows', 'Convert pipeline activity into high-signal execution with disciplined automation.'],
            ['Proprietary context', 'Ground every decision in your firm’s private data and proven playbooks.'],
            ['Secure operations', 'Deploy with governance-first controls for sensitive deal environments.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-zinc-950/75 p-6 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-zinc-900/80">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-400">{copy}</p>
            </div>
          ))}
        </RevealBlock>
      </section>

      <section id="engagement" className="border-t border-white/10 py-28 md:py-32">
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

      <section className="border-t border-white/10 py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <RevealBlock>
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-zinc-950/70 p-10 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:p-14">
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Our Story</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">The Vision Behind Rafion AI</h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300 sm:text-xl">
                The inception of Rafion AI was sparked by a pivotal moment of realization. What began as a quest to build a platform defined by unwavering reliability and excellence, driven by a personal journey of profound commitment, transformed into something far more powerful: a testament to autonomy.
              </p>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300 sm:text-xl">
                As the founder, Maria Christina Karakou recognized that true, lasting success cannot be outsourced or placed in the hands of others; it must be engineered from within. This realization became the bedrock of Rafion AI. Today, we don't just build software; we architect autonomous growth for firms that demand the same level of integrity and performance. We have turned that pursuit of excellence into an institutional-grade solution, ensuring our partners never have to compromise on reliability. At Rafion AI, we believe that the only promise that never breaks is the one you fulfill yourself.
              </p>
            </div>
          </RevealBlock>
        </div>
      </section>

      <section id="rag-advantage" className="border-t border-white/10 bg-zinc-950/60 py-28 md:py-32">
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

      <section className="border-t border-white/10 py-28 md:py-32">
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

      <section className="border-t border-white/10 py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <RevealBlock>
            <SectionHeading
              eyebrow="The Architects"
              title="The people behind Rafion Auto-SDR, dedicated to revolutionizing sales automation."
              copy="A focused team of builders and operators creating premium workflow intelligence for modern firms."
            />
          </RevealBlock>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {teamMembers.map((member, index) => (
              <RevealBlock key={member.name} delay={0.05 * index}>
                <div className="flex h-full flex-col items-center rounded-[2rem] border border-white/10 bg-zinc-950/70 p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-zinc-900/80">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900">
                    <img src={placeholderAvatar} alt={`${member.name} placeholder avatar`} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{member.name}</h3>
                  <p className="mt-3 text-sm uppercase tracking-[0.3em] text-gray-500">{member.title}</p>
                  <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">{member.bio}</p>
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black text-gray-200 transition hover:border-white/30 hover:text-white"
                    aria-label={`Visit ${member.name} on LinkedIn`}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.5h2.88V18H5.5zM10.6 9.5h2.76v1.16h.04c.38-.72 1.32-1.48 2.71-1.48 2.9 0 3.43 1.91 3.43 4.39V18H16.6v-7.7c0-1.83-.03-4.19-2.55-4.19-2.56 0-2.95 2-2.95 4.06V18H10.6z" />
                    </svg>
                  </a>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-zinc-950/70 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Rafion AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 transition hover:border-white/30 hover:text-white" aria-label="Rafion AI on LinkedIn">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.5h2.88V18H5.5zM10.6 9.5h2.76v1.16h.04c.38-.72 1.32-1.48 2.71-1.48 2.9 0 3.43 1.91 3.43 4.39V18H16.6v-7.7c0-1.83-.03-4.19-2.55-4.19-2.56 0-2.95 2-2.95 4.06V18H10.6z" />
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 transition hover:border-white/30 hover:text-white" aria-label="Rafion AI on X">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18.9 4H22l-6.4 7.3L23 20h-5.6l-4.4-5.7L8.2 20H5.1l6.8-7.8L1 4h5.7l4 5.2L18.9 4Zm-1 14.4h1.1L6.3 5.5H5.1L17.9 18.4Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

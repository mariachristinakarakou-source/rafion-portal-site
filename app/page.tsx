'use client';
import { motion, useReducedMotion } from 'framer-motion';

const engagementSteps = [
  {
    title: 'Strategic Audit',
    description:
      'We map your sourcing workflow, diligence standards, and governance controls so the operating model is aligned from day one.',
  },
  {
    title: 'Bespoke Agent Development',
    description:
      'We build secure agents around your proprietary playbooks, approvals, and data sources for reliable, low-friction execution.',
  },
  {
    title: 'Continuous Optimization',
    description:
      'We refine signal quality, coverage, and decision support over time so your team keeps compounding advantage.',
  },
];

const safeguards = [
  'Private, tenant-isolated retrieval layers',
  'Role-aware access controls and auditability',
  'Sovereign deployment options for sensitive data',
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-300">Rafion AI</span>
          <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
            <a href="#engagement" className="transition hover:text-white">
              Engagement
            </a>
            <a href="#rag-advantage" className="transition hover:text-white">
              RAG Advantage
            </a>
            <a
              href="#hero"
              className="rounded-full border border-white/20 px-4 py-2 text-white transition hover:bg-white hover:text-black"
            >
              Request a Demo
            </a>
          </div>
        </div>
      </nav>

      <section id="hero" className="relative mx-auto flex max-w-7xl flex-col px-6 pb-20 pt-24 md:pt-32 lg:pt-36">
        <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-6xl rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(99,102,241,0.24),_transparent_28%),linear-gradient(120deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] blur-3xl" />
        <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-[24rem] max-w-5xl rounded-full bg-gradient-to-br from-white/10 via-fuchsia-500/10 to-cyan-500/10 blur-[120px]" />

        <div className="max-w-4xl">
          <motion.p
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.25 }}
            variants={reveal}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mb-6 text-xs uppercase tracking-[0.35em] text-gray-500"
          >
            Institutional Deal Intelligence
          </motion.p>
          <motion.h1
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.25 }}
            variants={reveal}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
            className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl lg:text-7xl"
          >
            Institutional-Grade Deal Sourcing: We Architect Your Autonomous Growth.
          </motion.h1>
          <motion.p
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.25 }}
            variants={reveal}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            className="mt-8 max-w-2xl text-lg leading-8 text-gray-400 sm:text-xl"
          >
            We combine disciplined sourcing workflows, proprietary data context, and autonomous execution to help modern firms move faster without compromising control.
          </motion.p>
          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.25 }}
            variants={reveal}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            className="mt-10 flex flex-wrap gap-4"
          >
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
              See the RAG Advantage
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="mt-16 grid gap-4 md:grid-cols-3"
        >
          {[
            ['Autonomous workflows', 'From market mapping to prioritization, the pipeline runs with institutional discipline.'],
            ['Proprietary context', 'Every signal is grounded in your own documents, playbooks, and historical decisions.'],
            ['Secure operations', 'Built for confidential data with governance-first architecture.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-400">{copy}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="engagement" className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Engagement Model</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
              A deliberate three-step approach to autonomous growth.
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-400">
              Each phase is designed to turn strategy into reliable action without overextending your team.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {engagementSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={prefersReducedMotion ? false : 'hidden'}
                whileInView={prefersReducedMotion ? undefined : 'visible'}
                viewport={{ once: true, amount: 0.2 }}
                variants={reveal}
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
                className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-gray-500">0{index + 1}</p>
                <h3 className="mt-5 text-2xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="rag-advantage" className="border-t border-white/10 bg-zinc-950/60 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">RAG Advantage</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
              Secure, proprietary retrieval architecture with full data sovereignty.
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-400">
              Our retrieval layer is purpose-built for sensitive deal environments, ensuring your private data stays protected while the system delivers highly relevant outputs.
            </p>
            <ul className="mt-8 space-y-4 text-sm leading-7 text-gray-300">
              {safeguards.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
            className="rounded-3xl border border-white/10 bg-black p-8"
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-500">Operating principle</p>
            <p className="mt-5 text-2xl font-semibold text-white">
              The model sees context, but never at the cost of ownership.
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              We protect the underlying corpus, enforce access boundaries, and keep your institutional knowledge under your control.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Data sovereignty</p>
              <p className="mt-3 text-lg font-medium text-white">Confidentiality, auditability, and governance remain first-class design principles.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

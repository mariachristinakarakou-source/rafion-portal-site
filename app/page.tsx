'use client';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl tracking-tighter">RAFION AI</span>
          <div className="flex gap-8 text-xs font-semibold text-gray-400">
            <a href="#technology" className="hover:text-white transition">TECHNOLOGY</a>
            <a href="#partnership" className="hover:text-white transition">PARTNERSHIP</a>
            <a href="#access" className="border border-white/20 px-4 py-1.5 rounded-full text-white hover:bg-white hover:text-black transition">REQUEST ACCESS</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-[100px] md:text-[160px] leading-[0.9] tracking-tighter font-medium mb-10">
          Sovereign <br/>Intelligence.
        </motion.h1>
        <p className="text-2xl text-gray-500 max-w-2xl mb-12">
          The autonomous layer for private equity. Automating the complex, securing the proprietary. 10x faster sourcing, zero-hallucination.
        </p>
      </section>

      {/* Institutional Core - RAG Architecture */}
      <section id="technology" className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-5xl tracking-tighter font-medium mb-8">Institutional Rigor.</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Unlike generic models, Rafion AI operates on a sovereign instance architecture. Your proprietary data is processed through an isolated, zero-trust RAG (Retrieval-Augmented Generation) engine that never leaks into public models.
            </p>
            <ul className="text-sm space-y-4 text-gray-500 font-mono">
              <li>01 / ZERO-TRUST DATA ISOLATION</li>
              <li>02 / SOVEREIGN MODEL INSTANCES</li>
              <li>03 / FULL IP PROTECTION</li>
            </ul>
          </div>
          <div className="border border-white/10 rounded-3xl p-10 bg-[#0a0a0a]">
            <h3 className="text-xl font-bold mb-4">Why Rafion AI?</h3>
            <p className="text-gray-400 text-sm">"The ChatGPT/Claude landscape is for generalists. Rafion AI is an autonomous, sovereign instance designed specifically to handle the high-stakes compliance and data-security standards required by top-tier investment firms."</p>
          </div>
        </div>
      </section>

      {/* Partnership Model */}
      <section id="partnership" className="py-24 border-t border-white/10 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl tracking-tighter font-medium mb-16 text-center">Performance-Based Partnership.</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-12 border border-white/10 rounded-3xl">
              <h3 className="text-3xl font-medium mb-6">Commission & Equity</h3>
              <p className="text-gray-400 mb-8">We don't just sell software; we participate in the upside. Our partnership model is strictly performance-based, ensuring our incentives are perfectly aligned with your firm’s deal-making success.</p>
              <div className="flex justify-between items-center border-t border-white/10 pt-6">
                <span className="text-sm font-mono">SUCCESS-BASED</span>
                <span className="text-3xl font-medium">Equity Participation</span>
              </div>
            </div>
            <div className="p-12 border border-white/10 rounded-3xl">
              <h3 className="text-3xl font-medium mb-6">Operational Impact</h3>
              <p className="text-gray-400 mb-8">Eliminating the manual bottleneck. We reduce sourcing R&D costs by 10x and reclaim 60% of analyst time previously lost to repetitive qualification.</p>
              <div className="flex justify-between items-center border-t border-white/10 pt-6">
                <span className="text-sm font-mono">ROI-DRIVEN</span>
                <span className="text-3xl font-medium">60% Efficiency Gain</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

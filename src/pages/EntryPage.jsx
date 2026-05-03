import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const fragments = [
  'structural clarity', 'tonal depth', 'cognitive resonance',
  'idea velocity', 'narrative tension', 'intellectual honesty',
  'semantic precision', 'reflective practice',
]

export default function EntryPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #e4e2e0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Crosshair lines */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#2A2A2A] to-transparent" />

      {/* Floating text fragments */}
      {fragments.map((frag, i) => (
        <motion.div
          key={frag}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 + (i % 3) * 0.01 }}
          transition={{ delay: i * 0.3, duration: 1 }}
          className="absolute text-[10px] uppercase tracking-[0.3em] text-[#e4e2e0] font-semibold pointer-events-none select-none"
          style={{
            top: `${10 + (i * 11) % 75}%`,
            left: `${5 + (i * 17) % 80}%`,
          }}
        >
          {frag}
        </motion.div>
      ))}

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0F0F0F] to-transparent pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-semibold mb-1">
            Start With A Thought
          </div>
          <div className="h-px w-12 bg-[#8DA399] mx-auto" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
          style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em' }}
        >
          <span className="text-[#e4e2e0]">Start with a </span>
          <span className="text-[#8DA399] italic font-light">thought.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-zinc-500 text-base md:text-lg leading-relaxed mb-10 max-w-md"
        >
          Reflect, develop, and turn your ideas into writing that actually sounds like you.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/login')}
          className="bg-[#8DA399] text-[#0F0F0F] px-8 h-12 flex items-center gap-2 font-bold text-sm uppercase tracking-wider rounded-lg"
        >
          Begin
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-8"
      >
        <span className="text-[10px] uppercase tracking-widest text-zinc-700">v0.1.0 MVP</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8DA399] animate-ai-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-700">Engine Ready</span>
        </div>
      </motion.div>
    </div>
  )
}

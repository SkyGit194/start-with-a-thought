import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useApp()
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const isReturning = !!user.name

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    updateUser({ name: name.trim(), email: email.trim() })
    if (user.onboardingComplete) {
      navigate('/dashboard')
    } else {
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#8DA399]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-[#a9cdcd]/5 blur-[100px] pointer-events-none" />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-[#2A2A2A] bg-[#131413]">
        <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-zinc-400">Start With A Thought</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8DA399] animate-ai-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-600">System Status: Optimal</span>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px]"
        >
          <div className="mb-8">
            <h1 className="text-[40px] font-bold tracking-tight text-[#e4e2e0] leading-tight mb-2">
              {isReturning ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Welcome.'}
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">
              Your private space for thought.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="How should I address you?"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg px-4 h-12 text-[#e4e2e0] text-sm outline-none placeholder:text-zinc-700 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg px-4 h-12 text-[#e4e2e0] text-sm outline-none placeholder:text-zinc-700 transition-colors"
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={!name.trim() || !email.trim()}
              className="mt-2 w-full h-12 bg-[#8DA399] text-[#0F0F0F] font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Continue
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </motion.button>
          </form>
        </motion.div>
      </div>

      <footer className="text-center py-4 text-[10px] uppercase tracking-widest text-zinc-700">
        Architectural Minimalism / Thinking Studio © 2025
      </footer>
    </div>
  )
}

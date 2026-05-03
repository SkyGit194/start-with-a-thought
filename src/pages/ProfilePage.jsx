import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'

const platforms = ['LinkedIn', 'Twitter/X', 'Newsletter', 'Instagram', 'Blog', 'Other']
const toneOptions = ['Architectural & Precise', 'Fluid & Creative', 'Brief & Direct', 'Deeply Philosophical']

export default function ProfilePage() {
  const { user, updateUser } = useApp()
  const [form, setForm] = useState({ ...user })
  const [saved, setSaved] = useState(false)

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const togglePlatform = (p) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(v => v !== p) : [...f.platforms, p]
    }))
  }

  const handleSave = () => {
    updateUser(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto pb-24 md:pb-10">
      <h1 className="text-2xl font-bold text-[#e4e2e0] tracking-tight mb-8">Profile & Settings</h1>

      <div className="flex flex-col gap-8">
        {/* Account Info */}
        <section>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-4">Account</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#2d4f4f] flex items-center justify-center text-[#8DA399] text-xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e4e2e0]">{user.name}</div>
              <div className="text-xs text-zinc-500">{user.email}</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">{user.role}</div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg px-4 h-11 text-[#e4e2e0] text-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg px-4 h-11 text-[#e4e2e0] text-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Industry</label>
              <input type="text" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg px-4 h-11 text-[#e4e2e0] text-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Who do you write for?</label>
              <input type="text" value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg px-4 h-11 text-[#e4e2e0] text-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Known for</label>
              <textarea value={form.knownFor} onChange={e => setForm(f => ({ ...f, knownFor: e.target.value }))}
                rows={2}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg px-4 py-3 text-[#e4e2e0] text-sm outline-none resize-none transition-colors" />
            </div>
          </div>
        </section>

        <div className="border-t border-[#2A2A2A]" />

        {/* Platforms */}
        <section>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-4">Platforms</div>
          <div className="flex flex-wrap gap-2">
            {platforms.map(p => (
              <button key={p} onClick={() => togglePlatform(p)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  form.platforms.includes(p)
                    ? 'bg-[#8DA399] text-[#0F0F0F] border-[#8DA399]'
                    : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-500 hover:border-zinc-600'
                }`}>{p}</button>
            ))}
          </div>
        </section>

        <div className="border-t border-[#2A2A2A]" />

        {/* Content Pillars */}
        <section>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-4">Content Pillars</div>
          {form.contentPillars.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.contentPillars.map(p => (
                <span key={p} className="flex items-center gap-1 px-3 py-1.5 bg-[#2A2A2A] text-zinc-300 text-xs font-semibold uppercase tracking-wider rounded-full">
                  {p}
                  <button onClick={() => setForm(f => ({ ...f, contentPillars: f.contentPillars.filter(v => v !== p) }))}
                    className="text-zinc-500 hover:text-red-400 ml-1">
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </span>
              ))}
            </div>
          ) : <p className="text-sm text-zinc-600 mb-3">No pillars set.</p>}
        </section>

        <div className="border-t border-[#2A2A2A]" />

        {/* Preferences */}
        <section>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-4">Preferences</div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Tone of Voice</label>
            <select
              value={form.tonePreference}
              onChange={e => setForm(f => ({ ...f, tonePreference: e.target.value }))}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg px-4 h-11 text-[#e4e2e0] text-sm outline-none transition-colors"
            >
              <option value="">Select tone...</option>
              {toneOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setForm({ ...user })}
            className="flex-1 h-11 border border-[#2A2A2A] hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 rounded-lg font-semibold text-sm transition-colors">
            Discard Changes
          </motion.button>
          <motion.button whileTap={{ scale: 0.98 }} onClick={handleSave}
            className="flex-1 h-11 bg-[#8DA399] text-[#0F0F0F] rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">{saved ? 'check' : 'save'}</span>
            {saved ? 'Saved.' : 'Save Profile'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

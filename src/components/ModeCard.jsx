import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function ModeCard({ icon, title, description, buttonLabel, to, accentColor = '#8DA399' }) {
  const navigate = useNavigate()

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8DA399] rounded-xl p-6 flex flex-col gap-4 overflow-hidden cursor-pointer group transition-colors"
      onClick={() => navigate(to)}
    >
      <span
        className="material-symbols-outlined absolute top-4 right-4 text-6xl opacity-[0.07] select-none"
        style={{ color: accentColor }}
      >
        {icon}
      </span>

      <div className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center">
        <span className="material-symbols-outlined text-xl" style={{ color: accentColor }}>{icon}</span>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-[#e4e2e0] mb-1.5">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
      </div>

      <button
        className="flex items-center gap-2 text-sm font-semibold text-[#8DA399] group-hover:gap-3 transition-all"
        onClick={e => { e.stopPropagation(); navigate(to) }}
      >
        {buttonLabel}
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </button>
    </motion.div>
  )
}

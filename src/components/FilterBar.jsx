import React from 'react'
import { motion } from 'framer-motion'

export default function FilterBar({ filters, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <motion.button
          key={filter.value}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(filter.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
            active === filter.value
              ? 'bg-[#8DA399] text-[#0F0F0F]'
              : 'bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-500 hover:text-zinc-200 hover:border-zinc-600'
          }`}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  )
}

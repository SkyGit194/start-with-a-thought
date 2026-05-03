import React from 'react'
import { motion } from 'framer-motion'

const inputTypes = [
  {
    id: 'write',
    icon: 'edit_note',
    title: 'Write it out',
    description: 'Type your idea, notes, or raw thoughts',
  },
  {
    id: 'paste',
    icon: 'content_paste',
    title: 'Paste content',
    description: 'Paste existing notes, transcript, or draft',
  },
  {
    id: 'conversation',
    icon: 'chat',
    title: 'From a conversation',
    description: 'Talk through your idea with the AI',
  },
  {
    id: 'library',
    icon: 'psychology',
    title: 'From Reflect / Develop',
    description: 'Use a saved reflection or developed idea',
  },
]

export default function InputTypeSelector({ onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {inputTypes.map((type, i) => (
        <motion.button
          key={type.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(type.id)}
          className="flex flex-col items-start gap-3 p-5 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8DA399] rounded-xl text-left group transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl text-[#8DA399]">{type.icon}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#e4e2e0] mb-0.5">{type.title}</div>
            <div className="text-xs text-zinc-500 leading-relaxed">{type.description}</div>
          </div>
          <span className="material-symbols-outlined text-base text-zinc-700 group-hover:text-zinc-400 transition-colors self-end">
            arrow_forward
          </span>
        </motion.button>
      ))}
    </div>
  )
}

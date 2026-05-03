import React from 'react'
import { motion } from 'framer-motion'
import { HOOK_TYPES } from '../utils/linkedinRules.js'

export default function HookSelector({ hooks, selectedIndex, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      {hooks.map((hook, i) => {
        const typeInfo = HOOK_TYPES.find(t => t.id === hook.type)
        const isSelected = i === selectedIndex

        return (
          <motion.button
            key={i}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(i)}
            className={`w-full text-left p-5 rounded-xl border transition-all ${
              isSelected
                ? 'border-[#8DA399] bg-[#1A1A1A]'
                : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-zinc-600'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-[#2A2A2A] text-[10px] uppercase tracking-widest font-bold text-zinc-400 rounded">
                  {typeInfo?.name || hook.type}
                </span>
                {hook.recommended && (
                  <span className="px-2 py-0.5 bg-[#8DA399]/20 text-[10px] uppercase tracking-widest font-bold text-[#8DA399] rounded">
                    Recommended
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[11px] text-[#8DA399] font-semibold tabular-nums">{hook.performanceLift}</span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#8DA399] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#0F0F0F] text-xs">check</span>
                  </span>
                )}
              </div>
            </div>

            <p className={`text-sm leading-relaxed font-medium ${isSelected ? 'text-[#e4e2e0]' : 'text-zinc-400'}`}>
              {hook.text}
            </p>

            <div className="flex items-center gap-4 mt-3">
              <span className={`text-[10px] tabular-nums font-semibold ${hook.charCount <= 200 ? 'text-[#8DA399]' : 'text-amber-400'}`}>
                {hook.charCount} / 200 chars
              </span>
              {typeInfo && (
                <span className="text-[10px] text-zinc-600 truncate">{typeInfo.bestFor}</span>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

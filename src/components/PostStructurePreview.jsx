import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function parseStructure(draft) {
  if (!draft) return []

  const paragraphs = draft.split('\n\n').filter(p => p.trim())
  const structure = []

  paragraphs.forEach((para, i) => {
    const text = para.trim()

    if (i === 0) {
      structure.push({ type: 'HOOK', role: 'Hook', content: text, charCount: text.length })
      return
    }

    if (text.startsWith('PS:') || text.startsWith('P.S.') || text.startsWith('PS ')) {
      structure.push({ type: 'PS', role: 'PS Line', content: text })
      return
    }

    if (text.startsWith('#')) {
      structure.push({ type: 'HASHTAGS', role: 'Hashtags', content: text })
      return
    }

    const wordCount = text.split(/\s+/).length
    if (wordCount <= 6) {
      structure.push({ type: 'BRIDGE', role: 'Bridge / Transition', content: text })
      return
    }

    if (i === 1 || i === 2) {
      structure.push({ type: 'CONTEXT', role: 'Context / Stakes', content: text })
      return
    }

    if (i === paragraphs.length - 2 && !text.startsWith('#') && !text.startsWith('PS')) {
      structure.push({ type: 'CLOSE', role: 'Takeaway / Close', content: text })
      return
    }

    structure.push({ type: 'BODY', role: `Body paragraph ${structure.filter(s => s.type === 'BODY').length + 1}`, content: text })
  })

  return structure
}

const typeStyles = {
  HOOK: { color: 'text-[#8DA399]', dot: 'bg-[#8DA399]', badge: 'bg-[#8DA399]/20 text-[#8DA399]' },
  CONTEXT: { color: 'text-[#a9cdcd]', dot: 'bg-[#a9cdcd]', badge: 'bg-[#a9cdcd]/10 text-[#a9cdcd]' },
  BRIDGE: { color: 'text-zinc-600', dot: 'bg-zinc-700', badge: 'bg-zinc-800 text-zinc-500' },
  BODY: { color: 'text-zinc-400', dot: 'bg-zinc-600', badge: 'bg-zinc-800 text-zinc-500' },
  CLOSE: { color: 'text-[#b5ccc1]', dot: 'bg-[#b5ccc1]', badge: 'bg-[#b5ccc1]/10 text-[#b5ccc1]' },
  PS: { color: 'text-[#e4beba]', dot: 'bg-[#e4beba]', badge: 'bg-[#e4beba]/10 text-[#e4beba]' },
  HASHTAGS: { color: 'text-zinc-600', dot: 'bg-zinc-700', badge: 'bg-zinc-800 text-zinc-600' },
}

export default function PostStructurePreview({ draft }) {
  const [expandedIndex, setExpandedIndex] = useState(null)
  const structure = parseStructure(draft)

  if (!structure.length) return null

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2A2A2A] flex items-center gap-2">
        <span className="material-symbols-outlined text-base text-[#8DA399]">account_tree</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Post Structure</span>
        <span className="ml-auto text-[10px] text-zinc-600">{structure.length} sections</span>
      </div>

      <div className="p-5 relative">
        {/* Vertical line */}
        <div className="absolute left-[28px] top-6 bottom-6 w-px bg-[#2A2A2A]" />

        <div className="flex flex-col gap-3">
          {structure.map((section, i) => {
            const styles = typeStyles[section.type] || typeStyles.BODY
            const isExpanded = expandedIndex === i

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-4 relative pl-1"
              >
                {/* Dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 z-10 border-2 border-[#1A1A1A] ${styles.dot}`} />

                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    className="w-full flex items-center justify-between gap-2 text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded flex-shrink-0 ${styles.badge}`}>
                        {section.type}
                      </span>
                      <span className="text-xs text-zinc-600 truncate">{section.role}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {section.charCount && (
                        <span className="text-[10px] text-zinc-700 tabular-nums">{section.charCount}c</span>
                      )}
                      <span className={`material-symbols-outlined text-sm text-zinc-700 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className={`text-xs leading-relaxed mt-2 ${styles.color}`}>{section.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

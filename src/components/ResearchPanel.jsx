import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ResearchPanel({ research, loading }) {
  const [expanded, setExpanded] = useState({
    commonTakes: true,
    recentData: true,
    underrepresented: false,
    gap: true,
  })

  const toggle = key => setExpanded(e => ({ ...e, [key]: !e[key] }))

  if (loading) {
    return (
      <div className="bg-[#131413] border border-[#2A2A2A] rounded-xl p-6 flex flex-col items-center gap-4 py-12">
        <div className="flex items-center gap-1.5">
          <span className="dot-1 w-1.5 h-1.5 rounded-full bg-[#8DA399]" />
          <span className="dot-2 w-1.5 h-1.5 rounded-full bg-[#8DA399]" />
          <span className="dot-3 w-1.5 h-1.5 rounded-full bg-[#8DA399]" />
        </div>
        <p className="text-xs text-zinc-500">Researching topic angles...</p>
      </div>
    )
  }

  if (!research) return null

  const sections = [
    {
      key: 'commonTakes',
      label: 'Common Takes',
      icon: 'forum',
      subtitle: 'What most people are already saying',
      items: research.commonTakes,
      itemColor: 'text-zinc-400',
    },
    {
      key: 'recentData',
      label: 'Recent Data',
      icon: 'bar_chart',
      subtitle: 'Fresh stats and developments',
      items: research.recentData,
      itemColor: 'text-[#a9cdcd]',
    },
    {
      key: 'underrepresented',
      label: 'Underrepresented Angles',
      icon: 'explore',
      subtitle: 'What the conversation is missing',
      items: research.underrepresentedAngles,
      itemColor: 'text-[#8DA399]',
    },
    {
      key: 'gap',
      label: 'Gap in Conversation',
      icon: 'lightbulb',
      subtitle: 'The thing nobody is talking about',
      items: [research.gapInConversation],
      itemColor: 'text-[#e4beba]',
    },
  ]

  return (
    <div className="bg-[#131413] border border-[#2A2A2A] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2A2A2A] flex items-center gap-2">
        <span className="material-symbols-outlined text-base text-[#8DA399]">travel_explore</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Topic Research</span>
      </div>

      <div className="flex flex-col divide-y divide-[#2A2A2A]">
        {sections.map(section => (
          <div key={section.key}>
            <button
              onClick={() => toggle(section.key)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-zinc-600">{section.icon}</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{section.label}</span>
              </div>
              <span className={`material-symbols-outlined text-sm text-zinc-600 transition-transform ${expanded[section.key] ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            <AnimatePresence>
              {expanded[section.key] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 flex flex-col gap-2">
                    <p className="text-[10px] text-zinc-600 italic mb-1">{section.subtitle}</p>
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#2A2A2A] mt-1.5 flex-shrink-0" />
                        <p className={`text-xs leading-relaxed ${section.itemColor}`}>{item}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

import React from 'react'

export default function AIPresence({ icon = 'psychology', label = 'AI Thinking', size = 'md' }) {
  const sizes = {
    sm: { outer: 'w-10 h-10', inner: 'w-8 h-8', icon: 'text-base' },
    md: { outer: 'w-16 h-16', inner: 'w-12 h-12', icon: 'text-2xl' },
    lg: { outer: 'w-24 h-24', inner: 'w-18 h-18', icon: 'text-4xl' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${s.outer} flex items-center justify-center`}>
        <div className={`absolute inset-0 rounded-full bg-[#8DA399]/10 animate-ai-pulse`} />
        <div className={`${s.inner} rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${s.icon} text-[#8DA399]`}>{icon}</span>
        </div>
      </div>
      {label && (
        <div className="flex items-center gap-1.5">
          <span className="dot-1 w-1 h-1 rounded-full bg-[#8DA399]" />
          <span className="dot-2 w-1 h-1 rounded-full bg-[#8DA399]" />
          <span className="dot-3 w-1 h-1 rounded-full bg-[#8DA399]" />
        </div>
      )}
    </div>
  )
}

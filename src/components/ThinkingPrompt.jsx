import React from 'react'

export default function ThinkingPrompt({ prompt }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-semibold mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm text-[#8DA399]">wb_twilight</span>
        Today's Thinking Prompt
      </div>
      <p className="text-lg font-medium text-[#e4e2e0] leading-snug italic">"{prompt}"</p>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'

const insightConfig = {
  keyInsight: { icon: 'lightbulb', label: 'Key Insight', color: 'text-[#8DA399]' },
  keyEmotion: { icon: 'mood', label: 'Emotion', color: 'text-[#e4beba]' },
  lessonLearned: { icon: 'school', label: 'Lesson Learned', color: 'text-[#a9cdcd]' },
  patternNoticed: { icon: 'pattern', label: 'Pattern Noticed', color: 'text-[#b5ccc1]' },
  actionStep: { icon: 'directions_run', label: 'Action Step', color: 'text-[#8DA399]' },
  writingAngle: { icon: 'edit_note', label: 'Writing Angle', color: 'text-zinc-400' },
}

export default function InsightCard({ type, value, delay = 0 }) {
  const config = insightConfig[type] || { icon: 'star', label: type, color: 'text-zinc-400' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#8DA399]/40 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`material-symbols-outlined text-lg ${config.color}`}>{config.icon}</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">{config.label}</span>
      </div>
      <p className="text-sm text-[#e4e2e0] leading-relaxed">{value}</p>
    </motion.div>
  )
}

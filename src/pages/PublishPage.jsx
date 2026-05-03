import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AIPresence from '../components/AIPresence.jsx'

const formats = [
  { id: 'linkedin', icon: 'work', title: 'LinkedIn Post', desc: 'Professional insights for engagement and authority', to: '/publish/linkedin', span: 'col-span-1' },
  { id: 'twitter', icon: 'alternate_email', title: 'Twitter/X Thread', desc: 'Concise sequences for viral fragments', to: '/publish/twitter', span: 'col-span-1' },
  { id: 'newsletter', icon: 'mail', title: 'Newsletter Draft', desc: 'Long-form editorial with structure and depth', to: '/publish/write', span: 'col-span-1 row-span-2', tall: true },
  { id: 'essay', icon: 'history_edu', title: 'Short Essay', desc: 'Structured argument on a singular theme', to: '/publish/write', span: 'col-span-1' },
  { id: 'video', icon: 'videocam', title: 'Video Talking Points', desc: 'Scripts for camera or teleprompter', to: '/publish/write', span: 'col-span-1' },
  { id: 'journal', icon: 'menu_book', title: 'Journal Entry', desc: 'Raw reflective documentation', to: '/publish/write', span: 'col-span-2' },
  { id: 'instagram', icon: 'photo_camera', title: 'Instagram Caption', desc: 'Visual-first micro-copy', to: '/publish/write', span: 'col-span-1' },
  { id: 'carousel', icon: 'view_carousel', title: 'Carousel Script', desc: 'Slide-by-slide structured scripts', to: '/publish/write', span: 'col-span-1' },
  { id: 'write', icon: 'edit_note', title: 'General Writing', desc: 'Essays, notes, articles, drafts', to: '/publish/write', span: 'col-span-1' },
]

export default function PublishPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-24 md:pb-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <AIPresence icon="auto_stories" size="sm" label="" />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#e4e2e0] tracking-tight leading-tight">
              Choose your <span className="text-[#8DA399] italic font-light">format.</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Choose your format. We'll shape the thinking to fit.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[160px]">
        {formats.map((fmt, i) => (
          <motion.button
            key={fmt.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(fmt.to)}
            className={`${fmt.span} bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8DA399] rounded-xl p-5 flex flex-col justify-between text-left group transition-colors`}
          >
            <div className="flex items-start justify-between">
              <span className="material-symbols-outlined text-2xl text-[#8DA399]">{fmt.icon}</span>
              <span className="material-symbols-outlined text-base text-zinc-700 group-hover:text-zinc-400 transition-colors">arrow_forward</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e4e2e0] mb-1">{fmt.title}</div>
              <div className="text-xs text-zinc-500 leading-relaxed">{fmt.desc}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

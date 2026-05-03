import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'
import ModeCard from '../components/ModeCard.jsx'
import ThinkingPrompt from '../components/ThinkingPrompt.jsx'
import LibraryCard from '../components/LibraryCard.jsx'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const container = { animate: { transition: { staggerChildren: 0.08 } } }
const item = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, library, dailyPrompt } = useApp()
  const firstName = user.name?.split(' ')[0] || 'there'
  const recentDrafts = library.slice(0, 3)

  const dateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  }).format(new Date())

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-24 md:pb-10">
      <motion.div variants={container} initial="initial" animate="animate" className="flex flex-col gap-8">

        {/* Greeting */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-semibold mb-2">{dateStr}</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em' }}
              className="text-[#e4e2e0]">
            {getGreeting()}, {firstName}.
          </h1>
        </motion.div>

        {/* Daily prompt */}
        <motion.div variants={item}>
          <ThinkingPrompt prompt={dailyPrompt} />
        </motion.div>

        {/* Mode cards */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-4">How do you want to think today?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ModeCard
              icon="psychology"
              title="Reflect"
              description="Process what happened. Find the lesson in the chaos of the day."
              buttonLabel="Begin session"
              to="/reflect"
            />
            <ModeCard
              icon="auto_awesome"
              title="Develop"
              description="Sharpen a rough thought into a clear, resilient idea."
              buttonLabel="Start crafting"
              to="/develop"
            />
            <ModeCard
              icon="auto_stories"
              title="Publish"
              description="Turn developed thinking into structured writing for the world."
              buttonLabel="Format draft"
              to="/publish"
            />
          </div>
        </motion.div>

        {/* Recent drafts */}
        {recentDrafts.length > 0 && (
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">Continue where you left off</p>
              <button
                onClick={() => navigate('/library')}
                className="text-[10px] uppercase tracking-widest text-[#8DA399] font-semibold hover:opacity-70 transition-opacity"
              >
                View all →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentDrafts.map(item => (
                <LibraryCard key={item.id} item={item} />
              ))}
            </div>
          </motion.div>
        )}

        {recentDrafts.length === 0 && (
          <motion.div variants={item} className="border border-dashed border-[#2A2A2A] rounded-xl p-8 text-center">
            <p className="text-zinc-600 text-sm">Nothing saved yet. Start with a reflection.</p>
          </motion.div>
        )}
      </motion.div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/reflect')}
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 bg-[#8DA399] text-[#0F0F0F] rounded-full flex items-center justify-center shadow-lg"
      >
        <span className="material-symbols-outlined text-xl">add</span>
      </motion.button>
    </div>
  )
}

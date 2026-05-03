import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'
import { mockDevelopQuestions } from '../utils/mockAI.js'
import AIPresence from '../components/AIPresence.jsx'
import CopyButton from '../components/CopyButton.jsx'

export default function DevelopPage() {
  const navigate = useNavigate()
  const { saveToLibrary, updateSession } = useApp()
  const [ideaTitle, setIdeaTitle] = useState('')
  const [ideaBody, setIdeaBody] = useState('')
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [criticalAnswer, setCriticalAnswer] = useState('')
  const [exchanges, setExchanges] = useState([])
  const [frameworkNodes, setFrameworkNodes] = useState([])
  const [savedId, setSavedId] = useState(null)

  const currentQuestion = mockDevelopQuestions[currentQ % mockDevelopQuestions.length]

  const handleStart = () => {
    if (!ideaTitle.trim()) return
    setStarted(true)
  }

  const handleCriticalSubmit = () => {
    if (!criticalAnswer.trim()) return
    const newExchanges = [...exchanges, { question: currentQuestion, answer: criticalAnswer.trim() }]
    setExchanges(newExchanges)
    setFrameworkNodes(prev => [...prev, {
      label: criticalAnswer.trim().split(' ').slice(0, 5).join(' ') + '...',
      type: currentQuestion.type,
    }])
    setCriticalAnswer('')
    setCurrentQ(q => q + 1)
  }

  const handleSave = () => {
    const id = saveToLibrary({
      type: 'idea',
      mode: 'develop',
      format: 'essay',
      title: ideaTitle,
      content: `${ideaTitle}\n\n${ideaBody}\n\n---\n${exchanges.map(e => `Q: ${e.question.text}\nA: ${e.answer}`).join('\n\n')}`,
      insights: frameworkNodes.map(n => ({ type: n.type, value: n.label })),
      tags: ['idea', 'develop'],
    })
    setSavedId(id)
    updateSession({ mode: 'develop', questions: exchanges })
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Thought canvas */}
      <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto border-r border-[#2A2A2A]">
        <div className="max-w-2xl w-full mx-auto flex flex-col gap-6 pb-10">
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">Workspace Canvas</div>

          {!started ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-[#e4e2e0] tracking-tight">What idea are you trying to sharpen?</h2>
              <input
                type="text"
                value={ideaTitle}
                onChange={e => setIdeaTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
                placeholder="State your rough idea or thesis..."
                autoFocus
                className="bg-transparent border-b border-[#2A2A2A] focus:border-[#8DA399] py-3 text-[#e4e2e0] text-xl font-semibold outline-none placeholder:text-zinc-700 transition-colors"
              />
              <textarea
                rows={4}
                value={ideaBody}
                onChange={e => setIdeaBody(e.target.value)}
                placeholder="Expand on it. Write however much or little you have..."
                className="bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399]/50 rounded-xl p-4 text-[#e4e2e0] text-base resize-none outline-none placeholder:text-zinc-700 transition-colors leading-relaxed"
              />
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  disabled={!ideaTitle.trim()}
                  className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-40"
                >
                  Start developing
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="border-l-2 border-[#8DA399] pl-4">
                <h2 className="text-xl font-bold text-[#e4e2e0] mb-2">{ideaTitle}</h2>
                {ideaBody && <p className="text-sm text-zinc-400 leading-relaxed">{ideaBody}</p>}
              </div>

              {exchanges.map((ex, i) => (
                <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-[#8DA399] font-semibold mb-1">{ex.question.type}</div>
                  <div className="text-xs text-zinc-500 mb-2">{ex.question.text}</div>
                  <p className="text-sm text-[#e4e2e0] leading-relaxed">{ex.answer}</p>
                </div>
              ))}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#2A2A2A]">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!!savedId}
                  className="flex items-center gap-2 border border-[#2A2A2A] text-zinc-300 hover:border-zinc-600 px-5 h-10 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-base">{savedId ? 'check' : 'save'}</span>
                  {savedId ? 'Thought archived.' : 'Save Idea'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/publish')}
                  className="flex items-center gap-2 bg-[#8DA399] text-[#0F0F0F] px-5 h-10 rounded-lg font-semibold text-sm"
                >
                  Publish from this idea
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: AI Critical Partner */}
      {started && (
        <aside className="hidden md:flex w-[420px] flex-shrink-0 flex-col bg-[#131413] border-l border-[#2A2A2A] overflow-y-auto">
          <div className="p-6 border-b border-[#2A2A2A]">
            <AIPresence icon="psychology" size="sm" label="" />
            <div className="mt-3">
              <div className="text-xs uppercase tracking-widest text-zinc-600 font-semibold">AI Critical Partner</div>
              <div className="text-xs text-zinc-500 mt-0.5">Sharpening your thinking</div>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
            {/* Current inquiry */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">Current Inquiry</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4"
                >
                  <div className="text-[10px] uppercase tracking-widest text-[#8DA399] font-semibold mb-2">
                    {currentQuestion.type}
                  </div>
                  <p className="text-sm text-[#e4e2e0] leading-relaxed font-medium">{currentQuestion.text}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-3">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 focus-within:border-[#8DA399] transition-colors">
                  <textarea
                    rows={3}
                    value={criticalAnswer}
                    onChange={e => setCriticalAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && handleCriticalSubmit()}
                    placeholder="Respond to this question..."
                    className="w-full bg-transparent text-[#e4e2e0] text-sm resize-none outline-none placeholder:text-zinc-700 leading-relaxed"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCriticalSubmit}
                    disabled={!criticalAnswer.trim()}
                    className="bg-[#8DA399] text-[#0F0F0F] px-4 h-9 rounded-lg font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40"
                  >
                    Respond
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Emerging framework */}
            {frameworkNodes.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">Emerging Framework</div>
                <div className="relative pl-4">
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-[#2A2A2A]" />
                  {frameworkNodes.map((node, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-start gap-3 mb-4 relative"
                    >
                      <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#8DA399] border-2 border-[#131413]" />
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#8DA399] font-semibold">{node.type}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{node.label}</div>
                      </div>
                    </motion.div>
                  ))}
                  <div className="flex items-start gap-3 mb-4 relative opacity-30">
                    <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full border-2 border-zinc-700" />
                    <div className="text-[10px] text-zinc-600">Next inquiry...</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}

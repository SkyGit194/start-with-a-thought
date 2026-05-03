import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'
import { mockReflectionQuestions, generateReflectionInsights } from '../utils/mockAI.js'
import AIPresence from '../components/AIPresence.jsx'
import InsightCard from '../components/InsightCard.jsx'
import CopyButton from '../components/CopyButton.jsx'

export default function ReflectPage() {
  const navigate = useNavigate()
  const { saveToLibrary, updateSession } = useApp()
  const [phase, setPhase] = useState('questioning') // 'questioning' | 'analyzing' | 'insights'
  const [currentQ, setCurrentQ] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [answers, setAnswers] = useState([])
  const [questionReady, setQuestionReady] = useState(false)
  const [insights, setInsights] = useState(null)
  const [savedId, setSavedId] = useState(null)

  const question = mockReflectionQuestions[currentQ]
  const isLast = currentQ >= 5

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return
    const newAnswers = [...answers, { question, answer: currentAnswer.trim(), timestamp: new Date().toISOString() }]
    setAnswers(newAnswers)
    setCurrentAnswer('')
    setQuestionReady(false)

    if (isLast) {
      setPhase('analyzing')
      const result = await generateReflectionInsights(newAnswers)
      setInsights(result)
      setPhase('insights')
      updateSession({ mode: 'reflect', questions: newAnswers, insights: Object.entries(result).map(([k, v]) => ({ type: k, value: v })) })
    } else {
      setCurrentQ(q => q + 1)
    }
  }

  const handleSave = () => {
    const id = saveToLibrary({
      type: 'reflection',
      mode: 'reflect',
      format: 'journal',
      title: `Reflection — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      content: answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n'),
      insights: insights ? Object.entries(insights).map(([k, v]) => ({ type: k, value: v })) : [],
      tags: ['reflection', 'journal'],
    })
    setSavedId(id)
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto pb-24 md:pb-10">
      <AnimatePresence mode="wait">

        {phase === 'questioning' && (
          <motion.div
            key="questioning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <AIPresence icon="psychology" size="md" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full text-center"
              >
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-4">
                  {currentQ + 1} / 6
                </div>
                <TypedQuestion
                  text={question}
                  onComplete={() => setQuestionReady(true)}
                  className="text-3xl md:text-4xl font-bold text-[#e4e2e0] leading-tight tracking-tight mb-8 text-center"
                />

                <AnimatePresence>
                  {questionReady && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                    >
                      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 focus-within:border-[#8DA399] transition-colors">
                        <textarea
                          autoFocus
                          rows={4}
                          value={currentAnswer}
                          onChange={e => setCurrentAnswer(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && handleSubmit()}
                          placeholder="Write freely. This is private."
                          className="w-full bg-transparent text-[#e4e2e0] text-base resize-none outline-none placeholder:text-zinc-700 leading-relaxed"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[11px] text-zinc-700">⌘ + Enter to continue</span>
                        <motion.button
                          onClick={handleSubmit}
                          disabled={!currentAnswer.trim()}
                          whileTap={{ scale: 0.98 }}
                          className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-40"
                        >
                          Reflect
                          <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {answers.length > 0 && (
              <div className="w-full border-t border-[#2A2A2A] pt-6">
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">Your reflection so far</div>
                <div className="flex flex-col gap-3">
                  {answers.map((a, i) => (
                    <div key={i} className="text-sm">
                      <div className="text-[#8DA399] text-xs mb-0.5 font-medium">{a.question}</div>
                      <div className="text-zinc-400">{a.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {phase === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 py-20"
          >
            <AIPresence icon="psychology" size="lg" label="Processing your reflection" />
            <p className="text-zinc-500 text-sm">Extracting patterns and insights...</p>
          </motion.div>
        )}

        {phase === 'insights' && insights && (
          <motion.div
            key="insights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <AIPresence icon="psychology" size="sm" label="" />
              <div>
                <h2 className="text-xl font-bold text-[#e4e2e0]">Reflection complete.</h2>
                <p className="text-xs text-zinc-500">Here's what emerged from your thinking.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(insights).map(([key, value], i) => (
                <InsightCard key={key} type={key} value={value} delay={i * 0.1} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#2A2A2A]">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!!savedId}
                className="flex items-center gap-2 border border-[#2A2A2A] text-zinc-300 hover:border-zinc-600 px-5 h-10 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-base">
                  {savedId ? 'check' : 'archive'}
                </span>
                {savedId ? 'Thought archived.' : 'Save Reflection'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/publish')}
                className="flex items-center gap-2 bg-[#8DA399] text-[#0F0F0F] px-5 h-10 rounded-lg font-semibold text-sm"
              >
                Turn into Writing
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </motion.button>

              <CopyButton
                text={answers.map(a => `${a.question}\n${a.answer}`).join('\n\n')}
                label="Copy Reflection"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TypedQuestion({ text, onComplete, className }) {
  const [displayed, setDisplayed] = React.useState('')
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    setDisplayed('')
    setDone(false)
    const words = text.split(' ')
    let i = 0
    const timer = setInterval(() => {
      if (i < words.length) {
        setDisplayed(words.slice(0, i + 1).join(' '))
        i++
      } else {
        clearInterval(timer)
        setDone(true)
        onComplete?.()
      }
    }, 55)
    return () => clearInterval(timer)
  }, [text])

  return (
    <h2 className={className}>
      {displayed}
      {!done && <span className="opacity-60 animate-pulse">|</span>}
    </h2>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'
import { generateTwitterThread } from '../utils/mockAI.js'
import AIPresence from '../components/AIPresence.jsx'
import CopyButton from '../components/CopyButton.jsx'

const threadStyles = ['Educational', 'Argumentative', 'Personal', 'Tactical']

const tweetTypeColors = {
  HOOK: 'bg-[#8DA399]/20 text-[#8DA399]',
  CONTEXT: 'bg-[#a9cdcd]/20 text-[#a9cdcd]',
  'POINT 1': 'bg-[#b5ccc1]/20 text-[#b5ccc1]',
  'POINT 2': 'bg-[#b5ccc1]/20 text-[#b5ccc1]',
  'POINT 3': 'bg-[#b5ccc1]/20 text-[#b5ccc1]',
  'NARRATIVE PIVOT': 'bg-[#e4beba]/20 text-[#e4beba]',
  EVIDENCE: 'bg-zinc-700/50 text-zinc-400',
  LESSON: 'bg-[#2d4f4f]/50 text-[#8DA399]',
  CTA: 'bg-[#8DA399]/30 text-[#8DA399]',
}

export default function TwitterFlowPage() {
  const navigate = useNavigate()
  const { saveToLibrary } = useApp()
  const [phase, setPhase] = useState('questions')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ mainClaim: '', keyPoints: '', threadStyle: '', finalCTA: '' })
  const [thread, setThread] = useState(null)
  const [savedId, setSavedId] = useState(null)

  const questions = [
    { key: 'mainClaim', label: 'What is the main claim of this thread?', type: 'text', placeholder: 'One bold, clear statement...' },
    { key: 'keyPoints', label: 'What are the 3-5 key points to support it?', type: 'textarea', placeholder: 'List them, one per line...' },
    { key: 'threadStyle', label: 'Should the thread be:', type: 'pills', options: threadStyles },
    { key: 'finalCTA', label: 'What should the final tweet make people do or think?', type: 'text', placeholder: 'e.g. Question their assumptions, share, reflect...' },
  ]

  const currentQ = questions[step]
  const canProceed = () => !!answers[currentQ.key]

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(s => s + 1)
    } else {
      setPhase('generating')
      const result = await generateTwitterThread(answers)
      setThread(result)
      setPhase('output')
    }
  }

  const handleSave = () => {
    const content = thread.tweets.map((t, i) => `${i + 1}/ ${t.content}`).join('\n\n')
    const id = saveToLibrary({
      type: 'post',
      mode: 'publish',
      format: 'twitter',
      title: answers.mainClaim,
      content,
      insights: [],
      tags: ['twitter', 'thread', answers.threadStyle?.toLowerCase()].filter(Boolean),
    })
    setSavedId(id)
  }

  return (
    <div className="h-full flex overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 p-6 md:p-10 overflow-y-auto max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-8">
              <AIPresence icon="alternate_email" size="sm" label="" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
                  Step {String(step + 1).padStart(2, '0')} / Twitter Thread
                </div>
                <h2 className="text-xl font-bold text-[#e4e2e0]">Build your thread.</h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
                <h3 className="text-2xl font-bold text-[#e4e2e0] tracking-tight mb-6">{currentQ.label}</h3>

                {(currentQ.type === 'text' || currentQ.type === 'textarea') && (
                  <div className="bg-[#1A1A1A] border border-[#2A2A2A] focus-within:border-[#8DA399] rounded-xl p-4 transition-colors">
                    <textarea
                      autoFocus
                      rows={currentQ.type === 'textarea' ? 5 : 3}
                      value={answers[currentQ.key]}
                      onChange={e => setAnswers(a => ({ ...a, [currentQ.key]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canProceed() && handleNext()}
                      placeholder={currentQ.placeholder}
                      className="w-full bg-transparent text-[#e4e2e0] text-base resize-none outline-none placeholder:text-zinc-700 leading-relaxed"
                    />
                  </div>
                )}

                {currentQ.type === 'pills' && (
                  <div className="flex flex-wrap gap-2">
                    {currentQ.options.map(opt => (
                      <button key={opt} onClick={() => setAnswers(a => ({ ...a, [currentQ.key]: opt }))}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                          answers[currentQ.key] === opt
                            ? 'bg-[#8DA399] text-[#0F0F0F] border-[#8DA399]'
                            : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-500 hover:border-zinc-600'
                        }`}
                      >{opt}</button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors">
                <span className="material-symbols-outlined text-base">arrow_back</span>Back
              </button>
              <motion.button whileTap={{ scale: 0.98 }} onClick={handleNext} disabled={!canProceed()}
                className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-40">
                {step === questions.length - 1 ? 'Generate thread' : 'Continue'}
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-6">
            <AIPresence icon="alternate_email" size="lg" />
            <p className="text-zinc-500 text-sm">Structuring your thread...</p>
          </motion.div>
        )}

        {phase === 'output' && thread && (
          <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex overflow-hidden">
            {/* Thread visualization */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">Your Thread</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{thread.meta.threadLength} tweets · {thread.meta.estimatedReadTime} read</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CopyButton text={thread.tweets.map((t, i) => `${i + 1}/ ${t.content}`).join('\n\n')} label="Copy All" />
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={!!savedId}
                      className="flex items-center gap-2 border border-[#2A2A2A] hover:border-zinc-600 text-zinc-300 px-4 h-10 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60">
                      <span className="material-symbols-outlined text-base">{savedId ? 'check' : 'archive'}</span>
                      {savedId ? 'Archived.' : 'Save'}
                    </motion.button>
                  </div>
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-2.5 top-3 bottom-3 w-px bg-[#2A2A2A]" />
                  {thread.tweets.map((tweet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="relative mb-4"
                    >
                      <div className="absolute -left-[17px] top-4 w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border-2 border-[#8DA399]" />
                      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${tweetTypeColors[tweet.type] || 'bg-zinc-800 text-zinc-400'}`}>
                            {tweet.type}
                          </span>
                          <span className="text-[10px] text-zinc-600">{tweet.charCount} chars</span>
                        </div>
                        <p className="text-sm text-[#e4e2e0] leading-relaxed whitespace-pre-wrap">{tweet.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

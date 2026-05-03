import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'
import { generateEssayDraft, transformDraft } from '../utils/mockAI.js'
import AIPresence from '../components/AIPresence.jsx'
import CopyButton from '../components/CopyButton.jsx'

const writingTypes = ['Essay', 'Note', 'Reflection', 'Article', 'Draft']
const intentions = ['Structure', 'Clarity', 'Editing', 'Expansion']

export default function WriteFlowPage() {
  const navigate = useNavigate()
  const { saveToLibrary } = useApp()
  const [phase, setPhase] = useState('questions')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ visibility: '', type: '', topic: '', intention: '' })
  const [draft, setDraft] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [savedId, setSavedId] = useState(null)
  const [transforming, setTransforming] = useState(false)

  const questions = [
    { key: 'visibility', label: 'Is this private or public?', type: 'pills', options: ['Private', 'Public'] },
    { key: 'type', label: 'What type of writing is this?', type: 'pills', options: writingTypes },
    { key: 'topic', label: 'What are you trying to understand or explain?', type: 'text', placeholder: 'Describe the idea, question, or topic...' },
    { key: 'intention', label: 'What do you want help with?', type: 'pills', options: intentions },
  ]

  const currentQ = questions[step]
  const canProceed = () => !!answers[currentQ.key]

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(s => s + 1)
    } else {
      setPhase('generating')
      const result = await generateEssayDraft(answers)
      setDraft(result)
      setEditedContent(result.body)
      setPhase('output')
    }
  }

  const handleTransform = async (type) => {
    setTransforming(true)
    const result = await transformDraft(editedContent, type)
    setEditedContent(result)
    setTransforming(false)
  }

  const handleSave = () => {
    const id = saveToLibrary({
      type: answers.type?.toLowerCase() === 'reflection' ? 'reflection' : 'draft',
      mode: 'publish',
      format: answers.visibility === 'Private' ? 'journal' : 'essay',
      title: draft.title,
      content: editedContent,
      insights: [],
      tags: [answers.type?.toLowerCase(), answers.intention?.toLowerCase()].filter(Boolean),
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
              <AIPresence icon="edit_note" size="sm" label="" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
                  Step {String(step + 1).padStart(2, '0')} / Writing
                </div>
                <h2 className="text-xl font-bold text-[#e4e2e0]">Let's shape your writing.</h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
                <h3 className="text-2xl font-bold text-[#e4e2e0] tracking-tight mb-6">{currentQ.label}</h3>

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

                {currentQ.type === 'text' && (
                  <div className="bg-[#1A1A1A] border border-[#2A2A2A] focus-within:border-[#8DA399] rounded-xl p-4 transition-colors">
                    <textarea
                      autoFocus rows={4}
                      value={answers[currentQ.key]}
                      onChange={e => setAnswers(a => ({ ...a, [currentQ.key]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canProceed() && handleNext()}
                      placeholder={currentQ.placeholder}
                      className="w-full bg-transparent text-[#e4e2e0] text-base resize-none outline-none placeholder:text-zinc-700 leading-relaxed"
                    />
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
                {step === questions.length - 1 ? 'Generate draft' : 'Continue'}
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-6">
            <AIPresence icon="edit_note" size="lg" />
            <p className="text-zinc-500 text-sm">Writing your draft...</p>
          </motion.div>
        )}

        {phase === 'output' && draft && (
          <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto">
              <div className="max-w-[720px] mx-auto">
                {/* Actions bar */}
                <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-[#2A2A2A]">
                  <CopyButton text={editedContent} label="Copy" />
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => setEditMode(!editMode)}
                    className={`flex items-center gap-2 border px-4 h-10 rounded-lg font-semibold text-sm transition-colors ${
                      editMode ? 'border-[#8DA399] text-[#8DA399]' : 'border-[#2A2A2A] text-zinc-300 hover:border-zinc-600'
                    }`}>
                    <span className="material-symbols-outlined text-base">edit</span>
                    {editMode ? 'Done editing' : 'Edit'}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={!!savedId}
                    className="flex items-center gap-2 border border-[#2A2A2A] hover:border-zinc-600 text-zinc-300 px-4 h-10 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60">
                    <span className="material-symbols-outlined text-base">{savedId ? 'check' : 'archive'}</span>
                    {savedId ? 'Archived.' : 'Save'}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate('/publish')}
                    className="flex items-center gap-2 border border-[#2A2A2A] hover:border-zinc-600 text-zinc-300 px-4 h-10 rounded-lg font-semibold text-sm transition-colors">
                    <span className="material-symbols-outlined text-base">swap_horiz</span>
                    Reformat
                  </motion.button>
                </div>

                {/* Article */}
                <div className="mb-3">
                  <span className="px-2 py-1 bg-[#2A2A2A] text-zinc-400 text-[10px] uppercase font-bold tracking-widest rounded">
                    {answers.type || 'Writing'}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-[#e4e2e0] tracking-tight leading-tight mb-3">{draft.title}</h1>
                <p className="text-lg text-zinc-400 italic mb-8 border-l-2 border-[#8DA399] pl-4">{draft.subtitle}</p>

                {editMode ? (
                  <textarea
                    value={editedContent}
                    onChange={e => setEditedContent(e.target.value)}
                    className="w-full min-h-[400px] bg-transparent text-[#e4e2e0] text-lg leading-relaxed outline-none resize-none border border-[#2A2A2A] rounded-xl p-4 focus:border-[#8DA399] transition-colors"
                  />
                ) : (
                  <div className="text-[#e4e2e0] text-lg leading-relaxed whitespace-pre-wrap">{editedContent}</div>
                )}

                {/* Refine transforms */}
                <div className="mt-10 pt-6 border-t border-[#2A2A2A]">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">Refine</div>
                  <div className="flex flex-wrap gap-2">
                    {['shorter', 'deeper', 'personal', 'professional', 'storytelling'].map(t => (
                      <button key={t} onClick={() => handleTransform(t)} disabled={transforming}
                        className="px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-zinc-600 text-zinc-400 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors disabled:opacity-40 capitalize">
                        {t === 'personal' ? 'More personal' : t === 'professional' ? 'More professional' : t === 'storytelling' ? 'Add storytelling' : `Make ${t}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

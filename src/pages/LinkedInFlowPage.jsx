import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'
import {
  analyzeInput,
  runTopicResearch,
  generateHooks,
  generateLinkedInPost,
  transformLinkedInDraft,
  runAntiAiCheck,
  calculateQualityScore,
} from '../utils/linkedinAI.js'
import AIPresence from '../components/AIPresence.jsx'
import CopyButton from '../components/CopyButton.jsx'
import InputTypeSelector from '../components/InputTypeSelector.jsx'
import ResearchPanel from '../components/ResearchPanel.jsx'
import HookSelector from '../components/HookSelector.jsx'
import PostStructurePreview from '../components/PostStructurePreview.jsx'
import LinkedInScorePanel from '../components/LinkedInScorePanel.jsx'

const postTypes = ['Personal Experience', 'Business Lesson', 'An Opinion', 'Book Insight', 'Observation']
const toneOptions = ['Reflective', 'Direct', 'Educational', 'Personal', 'Strategic']
const structureOptions = ['Story-based', 'Lesson-based', 'Contrarian', 'Framework-based']

// ─────────────────────────────────────
// Step labels
// ─────────────────────────────────────
const STEPS = [
  'Input Type',
  'Your Content',
  'Research',
  'Context',
  'Hook',
  'Structure',
  'Draft',
]

export default function LinkedInFlowPage() {
  const navigate = useNavigate()
  const { saveToLibrary, library, updateSession } = useApp()

  const [step, setStep] = useState(0)

  // Step 0 — input type
  const [inputType, setInputType] = useState(null)

  // Step 1 — content input
  const [rawInput, setRawInput] = useState('')
  const [selectedLibraryId, setSelectedLibraryId] = useState(null)

  // Step 2 — research
  const [researchLoading, setResearchLoading] = useState(false)
  const [research, setResearch] = useState(null)
  const [researchSkipped, setResearchSkipped] = useState(false)

  // Step 3 — context questions
  const [answers, setAnswers] = useState({
    postType: '', audience: '', mainIdea: '', specifics: '', readerTakeaway: '', tone: '', structure: '',
  })
  const [contextStep, setContextStep] = useState(0)

  // Step 4 — hooks
  const [hooks, setHooks] = useState([])
  const [hooksLoading, setHooksLoading] = useState(false)
  const [selectedHookIndex, setSelectedHookIndex] = useState(0)

  // Step 5 — structure preview (no extra state needed)

  // Step 6 — draft output
  const [generating, setGenerating] = useState(false)
  const [draftResult, setDraftResult] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedDraft, setEditedDraft] = useState('')
  const [savedId, setSavedId] = useState(null)
  const [transformNote, setTransformNote] = useState(null)
  const [transforming, setTransforming] = useState(false)
  const [showVariants, setShowVariants] = useState(false)

  // ─── Navigation helpers ───────────────────
  const goTo = (s) => setStep(s)

  // ─── Step 0: Input type selected ─────────
  const handleInputType = (type) => {
    setInputType(type)
    goTo(1)
  }

  // ─── Step 1: Content input ────────────────
  const getContentForStep1 = () => {
    if (inputType === 'library') {
      const item = library.find(i => i.id === selectedLibraryId)
      return item?.content || ''
    }
    return rawInput
  }

  const handleContentNext = () => {
    const content = getContentForStep1()
    if (!content.trim()) return
    goTo(2)
  }

  // ─── Step 2: Research ────────────────────
  const handleRunResearch = async () => {
    const topic = answers.mainIdea || rawInput.split(' ').slice(0, 4).join(' ')
    setResearchLoading(true)
    const result = await runTopicResearch(topic)
    setResearch(result)
    setResearchLoading(false)
  }

  const handleResearchNext = () => {
    setResearchSkipped(false)
    goTo(3)
  }

  const handleSkipResearch = () => {
    setResearchSkipped(true)
    goTo(3)
  }

  // ─── Step 3: Context questions ───────────
  const contextQuestions = [
    { key: 'postType', label: 'Is this post based on:', type: 'cards', options: postTypes },
    { key: 'audience', label: 'Who is the target audience?', type: 'text', placeholder: 'e.g. Senior product managers, early founders...' },
    { key: 'mainIdea', label: 'What is the main idea you want to communicate?', type: 'text', placeholder: 'One clear idea.' },
    { key: 'specifics', label: 'What specific number, result, or example makes this idea yours?', type: 'text', placeholder: 'e.g. "We tested this with 40 customers" or "$400K decision"' },
    { key: 'readerTakeaway', label: 'What should the reader understand by the end?', type: 'text', placeholder: 'The key insight or shift...' },
    { key: 'tone', label: 'Should the tone be:', type: 'pills', options: toneOptions },
    { key: 'structure', label: 'Should the post be:', type: 'pills', options: structureOptions },
  ]

  const currentContextQ = contextQuestions[contextStep]
  const contextCanProceed = () => !!answers[currentContextQ?.key]

  const handleContextNext = async () => {
    if (contextStep < contextQuestions.length - 1) {
      setContextStep(s => s + 1)
    } else {
      // Generate hooks
      goTo(4)
      setHooksLoading(true)
      const result = await generateHooks(answers.mainIdea, { specifics: answers.specifics })
      setHooks(result)
      setHooksLoading(false)
    }
  }

  // ─── Step 5 → Step 6: Generate full draft ─
  const handleGenerateDraft = async () => {
    goTo(6)
    setGenerating(true)
    const result = await generateLinkedInPost({
      coreIdea: answers.mainIdea,
      hookChoice: hooks[selectedHookIndex],
      template: answers.structure,
      audience: answers.audience,
      tone: answers.tone,
      specifics: answers.specifics,
      readerTakeaway: answers.readerTakeaway,
      userInput: getContentForStep1(),
      researchData: research,
    })
    setDraftResult(result)
    setEditedDraft(result.draft)
    setGenerating(false)
    updateSession({
      mode: 'publish',
      format: 'linkedin',
      questions: Object.entries(answers).map(([k, v]) => ({ question: k, answer: v })),
      draft: result.draft,
    })
  }

  // ─── Draft transforms ─────────────────────
  const handleTransform = async (type) => {
    if (!editedDraft) return
    setTransforming(true)
    setTransformNote(null)
    const result = await transformLinkedInDraft(editedDraft, type)
    setEditedDraft(result.draft)
    setTransformNote(result.note)
    setDraftResult(prev => ({
      ...prev,
      draft: result.draft,
      charCount: result.charCount,
      qualityScore: calculateQualityScore(result.draft),
      antiAiCheck: runAntiAiCheck(result.draft),
    }))
    setTransforming(false)
  }

  const handleSave = () => {
    const id = saveToLibrary({
      type: 'post',
      mode: 'publish',
      format: 'linkedin',
      title: answers.mainIdea || 'LinkedIn Post',
      content: editedDraft,
      insights: [],
      tags: ['linkedin', answers.tone?.toLowerCase(), answers.structure?.toLowerCase()].filter(Boolean),
    })
    setSavedId(id)
  }

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 md:p-10 max-w-4xl mx-auto pb-24 md:pb-12">

        {/* Step indicator */}
        {step < 6 && (
          <div className="flex items-center gap-2 mb-8">
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
              Step {String(step + 1).padStart(2, '0')} / {STEPS[step]}
            </div>
            <div className="flex-1 h-px bg-[#2A2A2A]" />
            <div className="flex items-center gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i < step ? 'bg-[#8DA399]' : i === step ? 'bg-[#8DA399]' : 'bg-[#2A2A2A]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── Step 0: Input Type ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center gap-3 mb-8">
                <AIPresence icon="work" size="sm" label="" />
                <div>
                  <h2 className="text-2xl font-bold text-[#e4e2e0] tracking-tight">How do you want to start?</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Choose how you'll bring your idea in.</p>
                </div>
              </div>
              <InputTypeSelector onSelect={handleInputType} />
            </motion.div>
          )}

          {/* ── Step 1: Content Input ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center gap-3 mb-8">
                <AIPresence icon="work" size="sm" label="" />
                <div>
                  <h2 className="text-2xl font-bold text-[#e4e2e0] tracking-tight">
                    {inputType === 'write' ? 'Write your idea out.' :
                     inputType === 'paste' ? 'Paste your content.' :
                     inputType === 'conversation' ? 'Tell me what\'s on your mind.' :
                     'Choose a saved item.'}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Raw is fine. Don't edit yourself yet.</p>
                </div>
              </div>

              {inputType === 'library' ? (
                <div className="flex flex-col gap-3 mb-6">
                  {library.length === 0 ? (
                    <div className="border border-dashed border-[#2A2A2A] rounded-xl p-8 text-center">
                      <p className="text-zinc-600 text-sm">Nothing saved yet. Start with a reflection first.</p>
                    </div>
                  ) : (
                    library.slice(0, 8).map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedLibraryId(item.id)}
                        className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                          selectedLibraryId === item.id
                            ? 'border-[#8DA399] bg-[#8DA399]/5'
                            : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-zinc-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg text-[#8DA399] flex-shrink-0 mt-0.5">
                          {item.mode === 'reflect' ? 'psychology' : 'auto_awesome'}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#e4e2e0] mb-0.5">{item.title}</div>
                          <div className="text-xs text-zinc-500 truncate">{item.content?.slice(0, 80)}...</div>
                        </div>
                        {selectedLibraryId === item.id && (
                          <span className="material-symbols-outlined text-[#8DA399] ml-auto flex-shrink-0">check_circle</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] focus-within:border-[#8DA399] rounded-xl p-4 transition-colors mb-6">
                  <textarea
                    autoFocus
                    rows={7}
                    value={rawInput}
                    onChange={e => setRawInput(e.target.value)}
                    placeholder={
                      inputType === 'paste'
                        ? 'Paste your notes, transcript, or existing draft here...'
                        : 'Write freely. What are you thinking about? What happened? What did you notice?'
                    }
                    className="w-full bg-transparent text-[#e4e2e0] text-base resize-none outline-none placeholder:text-zinc-700 leading-relaxed"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <button onClick={() => goTo(0)} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                  <span className="material-symbols-outlined text-base">arrow_back</span>Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContentNext}
                  disabled={!getContentForStep1().trim()}
                  className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-40"
                >
                  Continue
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Research ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center gap-3 mb-8">
                <AIPresence icon="travel_explore" size="sm" label="" />
                <div>
                  <h2 className="text-2xl font-bold text-[#e4e2e0] tracking-tight">Research your topic.</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Find the angle nobody else is taking.</p>
                </div>
              </div>

              {!research && !researchLoading && (
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 mb-6">
                  <div className="text-sm text-[#e4e2e0] font-medium mb-2">Want to research this topic first?</div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                    This surfaces what everyone else is saying, recent data points, and the angles nobody has taken yet.
                    Useful when you want your post to stand out or challenge a default view.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunResearch}
                    className="flex items-center gap-2 bg-[#8DA399] text-[#0F0F0F] px-5 h-10 rounded-lg font-semibold text-sm"
                  >
                    <span className="material-symbols-outlined text-base">travel_explore</span>
                    Research this topic
                  </motion.button>
                </div>
              )}

              {(researchLoading || research) && (
                <div className="mb-6">
                  <ResearchPanel research={research} loading={researchLoading} />
                </div>
              )}

              <div className="flex items-center justify-between">
                <button onClick={() => goTo(1)} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                  <span className="material-symbols-outlined text-base">arrow_back</span>Back
                </button>
                <div className="flex items-center gap-3">
                  {!research && !researchLoading && (
                    <button
                      onClick={handleSkipResearch}
                      className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      Skip research
                    </button>
                  )}
                  {(research || researchSkipped) && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleResearchNext}
                      className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2"
                    >
                      Continue
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </motion.button>
                  )}
                  {researchLoading && (
                    <button disabled className="bg-[#8DA399]/40 text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 cursor-wait">
                      Researching...
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Context questions ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center gap-3 mb-8">
                <AIPresence icon="work" size="sm" label="" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
                    Question {contextStep + 1} of {contextQuestions.length}
                  </div>
                  <h2 className="text-xl font-bold text-[#e4e2e0]">Add context.</h2>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={contextStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6"
                >
                  <h3 className="text-2xl font-bold text-[#e4e2e0] tracking-tight mb-6">
                    {currentContextQ.label}
                  </h3>

                  {currentContextQ.type === 'cards' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentContextQ.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setAnswers(a => ({ ...a, [currentContextQ.key]: opt }))}
                          className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                            answers[currentContextQ.key] === opt
                              ? 'border-[#8DA399] bg-[#8DA399]/10 text-[#e4e2e0]'
                              : 'border-[#2A2A2A] bg-[#1A1A1A] text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentContextQ.type === 'text' && (
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] focus-within:border-[#8DA399] rounded-xl p-4 transition-colors">
                      <textarea
                        autoFocus
                        rows={3}
                        value={answers[currentContextQ.key]}
                        onChange={e => setAnswers(a => ({ ...a, [currentContextQ.key]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && contextCanProceed() && handleContextNext()}
                        placeholder={currentContextQ.placeholder}
                        className="w-full bg-transparent text-[#e4e2e0] text-base resize-none outline-none placeholder:text-zinc-700 leading-relaxed"
                      />
                    </div>
                  )}

                  {currentContextQ.type === 'pills' && (
                    <div className="flex flex-wrap gap-2">
                      {currentContextQ.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setAnswers(a => ({ ...a, [currentContextQ.key]: opt }))}
                          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                            answers[currentContextQ.key] === opt
                              ? 'bg-[#8DA399] text-[#0F0F0F] border-[#8DA399]'
                              : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-500 hover:border-zinc-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => contextStep > 0 ? setContextStep(s => s - 1) : goTo(2)}
                  className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContextNext}
                  disabled={!contextCanProceed()}
                  className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-40"
                >
                  {contextStep === contextQuestions.length - 1 ? 'Generate hooks' : 'Continue'}
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </motion.button>
              </div>

              {/* Answers so far */}
              {contextStep > 0 && (
                <div className="mt-8 border-t border-[#2A2A2A] pt-5 flex flex-col gap-1.5">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-1">So far</div>
                  {Object.entries(answers).filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <span className="text-[#8DA399] capitalize">{k.replace(/([A-Z])/g, ' $1')}: </span>
                      <span className="text-zinc-400">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Step 4: Hook Selection ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center gap-3 mb-8">
                <AIPresence icon="work" size="sm" label="" />
                <div>
                  <h2 className="text-2xl font-bold text-[#e4e2e0] tracking-tight">Choose your hook.</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">The first line determines whether people read the rest.</p>
                </div>
              </div>

              {hooksLoading ? (
                <div className="flex flex-col items-center gap-4 py-16">
                  <div className="flex items-center gap-1.5">
                    <span className="dot-1 w-2 h-2 rounded-full bg-[#8DA399]" />
                    <span className="dot-2 w-2 h-2 rounded-full bg-[#8DA399]" />
                    <span className="dot-3 w-2 h-2 rounded-full bg-[#8DA399]" />
                  </div>
                  <p className="text-xs text-zinc-500">Generating hook variants...</p>
                </div>
              ) : hooks.length > 0 ? (
                <div className="mb-6">
                  <HookSelector
                    hooks={hooks}
                    selectedIndex={selectedHookIndex}
                    onSelect={setSelectedHookIndex}
                  />
                </div>
              ) : null}

              <div className="flex items-center justify-between mt-4">
                <button onClick={() => { goTo(3); setContextStep(contextQuestions.length - 1) }}
                  className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                  <span className="material-symbols-outlined text-base">arrow_back</span>Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => goTo(5)}
                  disabled={hooksLoading || hooks.length === 0}
                  className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-40"
                >
                  Preview structure
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 5: Structure Preview ── */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center gap-3 mb-8">
                <AIPresence icon="account_tree" size="sm" label="" />
                <div>
                  <h2 className="text-2xl font-bold text-[#e4e2e0] tracking-tight">Your post structure.</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">This is how the sections will be arranged. Generate when ready.</p>
                </div>
              </div>

              {/* Selected hook preview */}
              {hooks[selectedHookIndex] && (
                <div className="bg-[#1A1A1A] border border-[#8DA399]/40 rounded-xl p-4 mb-6">
                  <div className="text-[10px] uppercase tracking-widest text-[#8DA399] font-semibold mb-2">Selected Hook</div>
                  <p className="text-sm text-[#e4e2e0] font-medium leading-relaxed">{hooks[selectedHookIndex].text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{hooks[selectedHookIndex].type}</span>
                    <span className="text-[10px] text-[#8DA399] font-semibold">{hooks[selectedHookIndex].performanceLift}</span>
                  </div>
                </div>
              )}

              {/* Structure outline */}
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-[#2A2A2A]">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Expected Structure</div>
                </div>
                <div className="p-5 relative">
                  <div className="absolute left-[28px] top-5 bottom-5 w-px bg-[#2A2A2A]" />
                  {[
                    { type: 'HOOK', role: 'Hook — first line determines "see more" click', color: 'bg-[#8DA399]' },
                    { type: 'BRIDGE', role: 'Short bridge — 1 sentence maximum', color: 'bg-zinc-600' },
                    { type: 'CONTEXT', role: 'Context / Stakes — what this is really about', color: 'bg-[#a9cdcd]' },
                    { type: 'BODY', role: 'Body paragraphs — one idea per paragraph', color: 'bg-zinc-600' },
                    { type: 'CLOSE', role: 'Takeaway / Close — what to do or think next', color: 'bg-[#b5ccc1]' },
                    { type: 'PS', role: 'PS line — drives comments and saves', color: 'bg-[#e4beba]' },
                    { type: 'HASHTAGS', role: 'Hashtags — max 3, lowercase only', color: 'bg-zinc-700' },
                  ].map((section, i) => (
                    <div key={i} className="flex items-center gap-4 mb-3 relative pl-1">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 z-10 border-2 border-[#1A1A1A] ${section.color}`} />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold w-16 flex-shrink-0">{section.type}</span>
                        <span className="text-xs text-zinc-500">{section.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => goTo(4)} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                  <span className="material-symbols-outlined text-base">arrow_back</span>Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateDraft}
                  className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-bold text-sm flex items-center gap-2 uppercase tracking-wide"
                >
                  Generate post
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 6: Draft Output ── */}
          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {generating ? (
                <div className="flex flex-col items-center gap-6 py-24">
                  <AIPresence icon="work" size="lg" />
                  <p className="text-zinc-500 text-sm">Crafting your LinkedIn post...</p>
                </div>
              ) : draftResult ? (
                <div className="flex flex-col lg:flex-row gap-6">

                  {/* Left: Draft */}
                  <div className="flex-1 min-w-0 flex flex-col gap-5">
                    {/* Action toolbar */}
                    <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#2A2A2A]">
                      <CopyButton text={editedDraft} label="Copy Post" />
                      <motion.button whileTap={{ scale: 0.98 }} onClick={() => setEditMode(v => !v)}
                        className={`flex items-center gap-2 border px-4 h-10 rounded-lg font-semibold text-sm transition-colors ${
                          editMode ? 'border-[#8DA399] text-[#8DA399]' : 'border-[#2A2A2A] text-zinc-300 hover:border-zinc-600'
                        }`}>
                        <span className="material-symbols-outlined text-base">edit</span>
                        {editMode ? 'Done' : 'Edit'}
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
                      <button onClick={() => goTo(0)}
                        className="ml-auto text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors font-semibold">
                        Start over
                      </button>
                    </div>

                    {/* Draft text */}
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">Your Draft</div>
                      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 focus-within:border-[#8DA399] transition-colors">
                        {editMode ? (
                          <textarea
                            autoFocus
                            value={editedDraft}
                            onChange={e => setEditedDraft(e.target.value)}
                            rows={20}
                            className="w-full bg-transparent text-[#e4e2e0] text-sm leading-relaxed resize-none outline-none"
                          />
                        ) : (
                          <pre className="text-sm text-[#e4e2e0] leading-relaxed whitespace-pre-wrap font-sans">
                            {editedDraft}
                          </pre>
                        )}
                      </div>
                    </div>

                    {/* Transform note */}
                    <AnimatePresence>
                      {transformNote && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 flex items-start gap-2"
                        >
                          <span className="material-symbols-outlined text-sm text-[#8DA399] mt-0.5 flex-shrink-0">info</span>
                          <p className="text-xs text-zinc-400 leading-relaxed">{transformNote}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Post structure */}
                    <PostStructurePreview draft={editedDraft} />

                    {/* Variants */}
                    <div>
                      <button
                        onClick={() => setShowVariants(v => !v)}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8DA399] font-semibold hover:opacity-70 transition-opacity mb-3"
                      >
                        <span className="material-symbols-outlined text-sm">{showVariants ? 'expand_less' : 'expand_more'}</span>
                        {showVariants ? 'Hide variants' : 'Try a variant'}
                      </button>

                      <AnimatePresence>
                        {showVariants && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-2 pb-2">
                              {[
                                { label: 'Shorter', key: 'shorter' },
                                { label: 'Deeper', key: 'deeper' },
                                { label: 'More personal', key: 'more_personal' },
                                { label: 'More professional', key: 'more_professional' },
                                { label: 'Add storytelling', key: 'add_storytelling' },
                                { label: 'Remove generic lines', key: 'remove_generic' },
                                { label: 'New hook', key: 'new_hook' },
                                { label: 'Strengthen opinion', key: 'stronger' },
                              ].map(t => (
                                <button
                                  key={t.key}
                                  onClick={() => handleTransform(t.key)}
                                  disabled={transforming}
                                  className="px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors disabled:opacity-40"
                                >
                                  {transforming ? '...' : t.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right: Score panel */}
                  <div className="lg:w-72 xl:w-80 flex-shrink-0">
                    <div className="sticky top-4">
                      <LinkedInScorePanel
                        draft={editedDraft}
                        qualityScore={draftResult.qualityScore}
                        antiAiCheck={draftResult.antiAiCheck}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

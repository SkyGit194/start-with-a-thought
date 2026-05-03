import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'

const roles = [
  { value: 'Founder', icon: 'rocket_launch', desc: 'Building something new' },
  { value: 'Creator', icon: 'brush', desc: 'Making content & media' },
  { value: 'Executive', icon: 'corporate_fare', desc: 'Leading organizations' },
  { value: 'Writer', icon: 'edit_note', desc: 'Words are your craft' },
  { value: 'Knowledge Worker', icon: 'psychology', desc: 'Thinking for a living' },
]

const platforms = ['LinkedIn', 'Twitter/X', 'Newsletter', 'Instagram', 'Blog', 'Other']
const writingTypes = ['Personal essays', 'Thought leadership', 'Tutorials', 'Storytelling', 'Analysis', 'Micro-posts']
const struggles = ['Starting from a blank page', 'Being too formal', 'Being too vague', 'Staying consistent', 'Finding my voice', 'Structuring ideas']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useApp()
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 4

  // Step 1
  const [role, setRole] = useState(user.role || '')
  // Step 2
  const [industry, setIndustry] = useState(user.industry || '')
  const [audience, setAudience] = useState(user.audience || '')
  const [selectedPlatforms, setSelectedPlatforms] = useState(user.platforms || [])
  // Step 3
  const [pillarInput, setPillarInput] = useState('')
  const [pillars, setPillars] = useState(user.contentPillars || [])
  const [knownFor, setKnownFor] = useState(user.knownFor || '')
  const [selectedWritingTypes, setSelectedWritingTypes] = useState(user.writingTypes || [])
  // Step 4
  const [selectedStruggles, setSelectedStruggles] = useState(user.writingStruggles || [])
  const [learningTitle, setLearningTitle] = useState(user.currentLearning?.title || '')

  const progress = (step / TOTAL_STEPS) * 100

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])

  const addPillar = () => {
    if (pillarInput.trim() && pillars.length < 5) {
      setPillars([...pillars, pillarInput.trim()])
      setPillarInput('')
    }
  }

  const canProceed = () => {
    if (step === 1) return !!role
    if (step === 2) return !!industry.trim() && !!audience.trim() && selectedPlatforms.length > 0
    if (step === 3) return pillars.length > 0 && !!knownFor.trim()
    return true
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1)
    } else {
      updateUser({
        role, industry, audience,
        platforms: selectedPlatforms,
        contentPillars: pillars,
        knownFor,
        writingTypes: selectedWritingTypes,
        writingStruggles: selectedStruggles,
        currentLearning: { title: learningTitle, active: !!learningTitle },
        onboardingComplete: true,
      })
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 bg-[#1A1A1A]">
        <motion.div
          className="h-full bg-[#8DA399]"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-[#2A2A2A]">
        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
          Step {step} of {TOTAL_STEPS}
        </span>
        <button
          onClick={() => navigate('/')}
          className="text-zinc-600 hover:text-zinc-400 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">close</span>
          Exit
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2"
          >
            Welcome, {user.name?.split(' ')[0] || 'there'}.
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {step === 1 && (
                <Step1 role={role} setRole={setRole} />
              )}
              {step === 2 && (
                <Step2
                  industry={industry} setIndustry={setIndustry}
                  audience={audience} setAudience={setAudience}
                  selectedPlatforms={selectedPlatforms}
                  togglePlatform={val => toggleArr(selectedPlatforms, setSelectedPlatforms, val)}
                />
              )}
              {step === 3 && (
                <Step3
                  pillarInput={pillarInput} setPillarInput={setPillarInput}
                  pillars={pillars} setPillars={setPillars}
                  addPillar={addPillar}
                  knownFor={knownFor} setKnownFor={setKnownFor}
                  selectedWritingTypes={selectedWritingTypes}
                  toggleWritingType={val => toggleArr(selectedWritingTypes, setSelectedWritingTypes, val)}
                />
              )}
              {step === 4 && (
                <Step4
                  selectedStruggles={selectedStruggles}
                  toggleStruggle={val => toggleArr(selectedStruggles, setSelectedStruggles, val)}
                  learningTitle={learningTitle} setLearningTitle={setLearningTitle}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Previous
            </button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#8DA399] text-[#0F0F0F] px-8 h-11 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === TOTAL_STEPS ? 'Begin thinking' : 'Continue'}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step1({ role, setRole }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#e4e2e0] tracking-tight mb-1">What do you do?</h2>
      <p className="text-sm text-zinc-500 mb-8">This shapes how your thinking workspace is tuned.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roles.map(r => (
          <motion.button
            key={r.value}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole(r.value)}
            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
              role === r.value
                ? 'border-[#8DA399] bg-[#8DA399]/10'
                : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-zinc-600'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-lg text-[#8DA399]">{r.icon}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e4e2e0]">{r.value}</div>
              <div className="text-xs text-zinc-500">{r.desc}</div>
            </div>
            {role === r.value && (
              <span className="material-symbols-outlined text-[#8DA399] ml-auto text-lg">check_circle</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function Step2({ industry, setIndustry, audience, setAudience, selectedPlatforms, togglePlatform }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-[#e4e2e0] tracking-tight">Let's understand your context.</h2>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">
          What industry are you in?
        </label>
        <input
          type="text"
          value={industry}
          onChange={e => setIndustry(e.target.value)}
          placeholder="e.g. Technology, Finance, Healthcare..."
          className="w-full bg-[#1A1A1A] border-b border-[#2A2A2A] focus:border-[#8DA399] px-0 py-3 text-[#e4e2e0] text-base outline-none placeholder:text-zinc-700 transition-colors bg-transparent"
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">
          Who do you write for?
        </label>
        <input
          type="text"
          value={audience}
          onChange={e => setAudience(e.target.value)}
          placeholder="e.g. Early-stage founders, senior engineers..."
          className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-[#8DA399] px-0 py-3 text-[#e4e2e0] text-base outline-none placeholder:text-zinc-700 transition-colors"
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">
          Where do you want to write?
        </label>
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => togglePlatform(p)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                selectedPlatforms.includes(p)
                  ? 'bg-[#8DA399] text-[#0F0F0F] border-[#8DA399]'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step3({ pillarInput, setPillarInput, pillars, setPillars, addPillar, knownFor, setKnownFor, selectedWritingTypes, toggleWritingType }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-[#e4e2e0] tracking-tight">What do you think and write about?</h2>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">
          Content pillars <span className="text-zinc-700">(max 5)</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={pillarInput}
            onChange={e => setPillarInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPillar()}
            placeholder="e.g. Leadership, AI, Mental models..."
            className="flex-1 bg-transparent border-b border-[#2A2A2A] focus:border-[#8DA399] px-0 py-2 text-[#e4e2e0] text-sm outline-none placeholder:text-zinc-700 transition-colors"
          />
          <button onClick={addPillar} disabled={pillars.length >= 5 || !pillarInput.trim()} className="text-[#8DA399] disabled:opacity-40">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {pillars.map(p => (
            <span key={p} className="flex items-center gap-1 px-3 py-1.5 bg-[#2A2A2A] text-zinc-300 text-xs font-semibold uppercase tracking-wider rounded-full">
              {p}
              <button onClick={() => setPillars(pillars.filter(v => v !== p))} className="text-zinc-500 hover:text-red-400 ml-1">
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">
          What are you trying to become known for?
        </label>
        <input
          type="text"
          value={knownFor}
          onChange={e => setKnownFor(e.target.value)}
          placeholder="e.g. Clear thinking on AI strategy..."
          className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-[#8DA399] px-0 py-3 text-[#e4e2e0] text-base outline-none placeholder:text-zinc-700 transition-colors"
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">
          Types of writing you want to create
        </label>
        <div className="flex flex-wrap gap-2">
          {writingTypes.map(t => (
            <button
              key={t}
              onClick={() => toggleWritingType(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                selectedWritingTypes.includes(t)
                  ? 'bg-[#8DA399] text-[#0F0F0F] border-[#8DA399]'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step4({ selectedStruggles, toggleStruggle, learningTitle, setLearningTitle }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-[#e4e2e0] tracking-tight">Let's understand your growth edge.</h2>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">
          What do you struggle with when writing?
        </label>
        <div className="flex flex-wrap gap-2">
          {struggles.map(s => (
            <button
              key={s}
              onClick={() => toggleStruggle(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider border transition-colors ${
                selectedStruggles.includes(s)
                  ? 'bg-[#8DA399] text-[#0F0F0F] border-[#8DA399]'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">
          What are you currently reading, learning, or listening to? <span className="text-zinc-700">(optional)</span>
        </label>
        <input
          type="text"
          value={learningTitle}
          onChange={e => setLearningTitle(e.target.value)}
          placeholder="e.g. 'The Almanack of Naval Ravikant'"
          className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-[#8DA399] px-0 py-3 text-[#e4e2e0] text-base outline-none placeholder:text-zinc-700 transition-colors"
        />
      </div>
    </div>
  )
}

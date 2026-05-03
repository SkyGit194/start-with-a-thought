import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIPresence from './AIPresence.jsx'

function TypedText({ text, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
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

  return <span>{displayed}{!done && <span className="opacity-60 animate-pulse">|</span>}</span>
}

export default function QuestionFlow({
  questions,
  onComplete,
  aiIcon = 'psychology',
  submitLabel = 'Continue',
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [questionReady, setQuestionReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef(null)

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  useEffect(() => {
    setQuestionReady(false)
    setCurrentAnswer('')
  }, [currentIndex])

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return

    const newAnswers = [...answers, { question: currentQuestion, answer: currentAnswer.trim(), timestamp: new Date().toISOString() }]
    setAnswers(newAnswers)

    if (isLast) {
      setIsLoading(true)
      await onComplete(newAnswers)
      setIsLoading(false)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-8">
      <AIPresence icon={aiIcon} size="md" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="w-full text-center"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4 font-semibold">
            {currentIndex + 1} / {questions.length}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#e4e2e0] leading-tight tracking-tight mb-8">
            <TypedText text={currentQuestion} onComplete={() => setQuestionReady(true)} />
          </h2>

          <AnimatePresence>
            {questionReady && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 focus-within:border-[#8DA399] transition-colors">
                  <textarea
                    ref={textareaRef}
                    autoFocus
                    rows={4}
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write freely. There are no wrong answers."
                    className="w-full bg-transparent text-[#e4e2e0] text-base resize-none outline-none placeholder:text-zinc-700 leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-zinc-700">⌘ + Enter to continue</span>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!currentAnswer.trim() || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#8DA399] text-[#0F0F0F] px-6 h-10 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  >
                    {isLoading ? (
                      <>
                        <span className="dot-1 w-1.5 h-1.5 rounded-full bg-[#0F0F0F]" />
                        <span className="dot-2 w-1.5 h-1.5 rounded-full bg-[#0F0F0F]" />
                        <span className="dot-3 w-1.5 h-1.5 rounded-full bg-[#0F0F0F]" />
                      </>
                    ) : (
                      <>
                        {isLast ? 'Generate' : submitLabel}
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {answers.length > 0 && (
        <div className="w-full border-t border-[#2A2A2A] pt-6">
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">Previous answers</div>
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
    </div>
  )
}

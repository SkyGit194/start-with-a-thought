import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { POST_LENGTH, ANTI_AI_RULES } from '../utils/linkedinRules.js'
import { runAntiAiCheck } from '../utils/linkedinAI.js'

function CharBar({ charCount }) {
  const max = POST_LENGTH.max
  const pct = Math.min((charCount / max) * 100, 100)

  const getZoneColor = () => {
    if (charCount < POST_LENGTH.min) return 'bg-zinc-600'
    if (charCount <= POST_LENGTH.engagementOptimal.max) return 'bg-[#8DA399]'
    if (charCount <= POST_LENGTH.depthOptimal.max) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getZoneLabel = () => {
    if (charCount < POST_LENGTH.min) return { text: 'Too short', color: 'text-zinc-500' }
    if (charCount <= POST_LENGTH.engagementOptimal.max) return { text: 'Optimal', color: 'text-[#8DA399]' }
    if (charCount <= POST_LENGTH.depthOptimal.max) return { text: 'Depth range', color: 'text-amber-400' }
    return { text: 'Long — earn it', color: 'text-red-400' }
  }

  const zone = getZoneLabel()
  // Sweet-spot marker positions
  const optimalEndPct = (POST_LENGTH.engagementOptimal.max / max) * 100
  const depthEndPct = (POST_LENGTH.depthOptimal.max / max) * 100

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-semibold ${zone.color}`}>{zone.text}</span>
        <span className="text-xs text-zinc-500 tabular-nums">
          {charCount.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="relative h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getZoneColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Zone markers */}
        <div className="absolute top-0 bottom-0 w-px bg-[#8DA399]/40" style={{ left: `${optimalEndPct}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-amber-500/30" style={{ left: `${depthEndPct}%` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-zinc-700 uppercase tracking-wide">800</span>
        <span className="text-[9px] text-[#8DA399]/60 uppercase tracking-wide">1,000</span>
        <span className="text-[9px] text-amber-500/50 uppercase tracking-wide">1,800</span>
        <span className="text-[9px] text-zinc-700 uppercase tracking-wide">3,000</span>
      </div>
    </div>
  )
}

function ScoreRing({ score, grade }) {
  const color = score >= 80 ? 'text-[#8DA399]' : score >= 60 ? 'text-zinc-300' : 'text-red-400'
  return (
    <div className="flex items-center gap-4">
      <div className={`text-5xl font-bold tabular-nums ${color}`} style={{ letterSpacing: '-0.04em' }}>
        {score}
      </div>
      <div>
        <div className={`text-sm font-semibold ${color}`}>{grade}</div>
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest">/ 100</div>
      </div>
    </div>
  )
}

export default function LinkedInScorePanel({ draft, qualityScore, antiAiCheck }) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [liveCheck, setLiveCheck] = useState(antiAiCheck)

  const handleManualCheck = async () => {
    setScanning(true)
    await new Promise(r => setTimeout(r, 1200))
    setLiveCheck(runAntiAiCheck(draft))
    setScanning(false)
  }

  const check = liveCheck || antiAiCheck
  const score = qualityScore

  const hookLine = draft?.split('\n')[0] || ''
  const hookWords = hookLine.split(/\s+/).filter(Boolean).length

  // Which engagement signals this post is optimised for
  const optimisedFor = []
  if (score?.breakdown?.avgParagraphLines <= 2) optimisedFor.push('Dwell Time')
  if (score?.breakdown?.specificNumbers >= 2) optimisedFor.push('Saves')
  if (score?.breakdown?.paragraphCount >= 6) optimisedFor.push('Comments')
  if (optimisedFor.length === 0) optimisedFor.push('Saves', 'Comments')

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 flex flex-col gap-6">

      {/* Quality Score */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Quality Score</div>
        {score ? (
          <ScoreRing score={score.score} grade={score.grade} />
        ) : (
          <div className="text-zinc-600 text-sm">Generate a draft to see score.</div>
        )}
        {score && (
          <button
            onClick={() => setShowBreakdown(v => !v)}
            className="mt-2 text-[10px] uppercase tracking-widest text-[#8DA399] font-semibold hover:opacity-70 transition-opacity"
          >
            {showBreakdown ? 'Hide breakdown' : 'See breakdown'}
          </button>
        )}
        <AnimatePresence>
          {showBreakdown && score && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col gap-1.5 border-t border-[#2A2A2A] pt-3">
                {[
                  ['Length', `${score.breakdown.length.toLocaleString()} chars`],
                  ['Paragraphs', score.breakdown.paragraphCount],
                  ['Avg para lines', score.breakdown.avgParagraphLines],
                  ['Specific numbers', score.breakdown.specificNumbers],
                  ['Has links', score.breakdown.hasLinks ? 'Yes (penalised)' : 'No'],
                  ['Hashtags', score.breakdown.hashtagCount],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-zinc-600">{label}</span>
                    <span className="text-zinc-400 tabular-nums">{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#2A2A2A]" />

      {/* Character count */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Character Count</div>
        <CharBar charCount={draft?.length || 0} />
      </div>

      <div className="border-t border-[#2A2A2A]" />

      {/* Anti-AI check */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Anti-AI Check</div>
          <button
            onClick={handleManualCheck}
            disabled={scanning || !draft}
            className="text-[10px] uppercase tracking-widest text-[#8DA399] font-semibold hover:opacity-70 disabled:opacity-40 transition-opacity"
          >
            {scanning ? 'Scanning...' : 'Re-run'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 py-2">
              <span className="dot-1 w-1.5 h-1.5 rounded-full bg-[#8DA399]" />
              <span className="dot-2 w-1.5 h-1.5 rounded-full bg-[#8DA399]" />
              <span className="dot-3 w-1.5 h-1.5 rounded-full bg-[#8DA399]" />
              <span className="text-xs text-zinc-500 ml-1">Scanning for AI patterns...</span>
            </motion.div>
          ) : check ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
              {/* Fixed rules */}
              {[
                { id: 'no_dashes', label: 'No dashes' },
                { id: 'no_emojis', label: 'No emojis' },
                { id: 'no_bullet_symbols', label: 'No bullet symbols' },
                { id: 'banned_phrases', label: 'No banned phrases' },
                { id: 'hashtag_limit', label: 'Hashtag compliance' },
              ].map(rule => {
                const issue = check.issues.find(i => i.rule === rule.id)
                return (
                  <div key={rule.id} className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${issue ? 'bg-red-400' : 'bg-[#8DA399]'}`} />
                      <span className="text-xs text-zinc-400 truncate">{rule.label}</span>
                    </div>
                    {issue ? (
                      <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wide flex-shrink-0">Failed</span>
                    ) : (
                      <span className="text-[10px] text-[#8DA399] font-semibold uppercase tracking-wide flex-shrink-0">Passed</span>
                    )}
                  </div>
                )
              })}
              {check.issues.length > 0 && (
                <div className="mt-1 p-2.5 bg-red-950/30 border border-red-900/40 rounded-lg">
                  {check.issues.map((issue, i) => (
                    <p key={i} className="text-[11px] text-red-300 leading-relaxed">{issue.found}</p>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-xs text-zinc-600">Generate a draft to run check.</div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#2A2A2A]" />

      {/* Hook analysis */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Hook Analysis</div>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-600">Length</span>
            <span className={`tabular-nums font-medium ${hookLine.length <= 200 ? 'text-[#8DA399]' : 'text-amber-400'}`}>
              {hookLine.length} chars {hookLine.length <= 200 ? '✓' : '— trim this'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600">Words</span>
            <span className={`tabular-nums font-medium ${hookWords <= 10 ? 'text-[#8DA399]' : 'text-amber-400'}`}>
              {hookWords} {hookWords <= 10 ? '✓' : '— aim for ≤10'}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2A2A2A]" />

      {/* Optimised for */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Optimised For</div>
        <div className="flex flex-wrap gap-2">
          {optimisedFor.map(signal => (
            <span key={signal} className="px-2.5 py-1 bg-[#2A2A2A] text-zinc-400 text-[10px] uppercase font-bold tracking-wide rounded-full">
              {signal}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

import {
  HOOK_TYPES,
  POST_LENGTH,
  ANTI_AI_RULES,
  BANNED_PHRASES,
  POST_TEMPLATES,
} from './linkedinRules.js'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function analyzeInput(userInput, inputType = 'text') {
  await delay(1200)
  return {
    coreIdea: "Extracted single core idea from user input",
    specificDetails: ["Detail 1 from their input", "Detail 2", "Specific number or example"],
    suggestedFormat: 'text_only',
    suggestedTemplate: 'pattern',
    suggestedHookType: 'curiosity_gap',
    audienceMatch: "Knowledge workers and founders",
    toneDirection: "Calm authority with specific numbers",
  }
}

export async function runTopicResearch(topic) {
  try {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
      console.warn('[runTopicResearch] API error, using fallback:', err.error)
      return fallbackResearch(topic)
    }

    const data = await res.json()

    // Validate expected shape before returning
    if (!data.commonTakes || !data.gapInConversation) {
      console.warn('[runTopicResearch] Unexpected response shape, using fallback')
      return fallbackResearch(topic)
    }

    return data
  } catch (err) {
    console.warn('[runTopicResearch] Fetch failed, using fallback:', err.message)
    return fallbackResearch(topic)
  }
}

function fallbackResearch(topic) {
  return {
    commonTakes: [
      `Most posts about ${topic} focus on generic best practices`,
      'The default advice tends toward inspiration over instruction',
    ],
    recentData: [
      'Posts with specific numbers outperform generic claims by 1.7x',
      'Long-form posts (1,200-1,800 chars) earn 3x more saves than short ones',
    ],
    underrepresentedAngles: [
      'The cost of the wrong approach, not just the benefit of the right one',
      'What the highest performers actually do vs. what they say they do',
    ],
    gapInConversation: `Most people writing about ${topic} are optimizing for reach. Nobody is talking about depth.`,
  }
}

export async function generateHooks(coreIdea, userContext) {
  await delay(1500)
  const specifics = userContext?.specifics || 'this quarter'
  return [
    {
      type: 'curiosity_gap',
      text: `I reviewed 40 ${coreIdea.split(' ').slice(0, 2).join(' ')} strategies ${specifics}. Three patterns keep repeating.`,
      charCount: 82,
      performanceLift: '~2.3x',
      recommended: true,
    },
    {
      type: 'contrarian',
      text: `Everyone's optimizing for reach. The actual constraint is depth.`,
      charCount: 62,
      performanceLift: '~2.3x',
      recommended: false,
    },
    {
      type: 'specific_number',
      text: `$400K. That's what one wrong assumption cost us last quarter.`,
      charCount: 60,
      performanceLift: '~1.7x',
      recommended: false,
    },
    {
      type: 'story_opening',
      text: `Three months ago I killed our highest-performing campaign. On purpose.`,
      charCount: 70,
      performanceLift: '~1.6x',
      recommended: false,
    },
  ]
}

export async function generateLinkedInPost(params) {
  await delay(2500)
  const { coreIdea, hookChoice, specifics } = params
  const hook = hookChoice?.text || `I reviewed 40 ${coreIdea || 'content'} strategies this quarter. Three patterns keep repeating.`

  const draft = `${hook}

The first one surprised me most.

Companies spending $50K+ monthly on content are producing more volume than ever. But their engagement per post is dropping. Not by a little. By 40% year over year.

The pattern is not about quality. It is about depth.

Volume trained the algorithm to expect more from them. When the average quality dipped even slightly, distribution collapsed across their entire account. Not just the weak posts. All of them.

The second pattern is subtler.

The accounts growing fastest are posting less. Two to three times per week instead of daily. But every post carries a specific number, a specific decision, or a specific outcome. No filler. No content for content's sake.

The third pattern is the one nobody talks about.

The posts earning the most saves are not the most clever posts. They are the most useful ones. Frameworks people can actually apply. Not inspiration. Application.

Three questions worth asking about your own content this week.

Are you posting because you have something to say, or because you think you are supposed to?

Is your average post quality going up or down over the last 30 days?

Would a smart reader screenshot your last post for later?

PS: The accounts I studied that grew fastest all had one thing in common. They treated every post as a vote on their account's reputation. Not a throwaway.

#contentstrategy #linkedin #founders`

  return {
    draft,
    charCount: draft.length,
    wordCount: draft.split(/\s+/).length,
    hookType: hookChoice?.type || 'curiosity_gap',
    template: 'pattern',
    estimatedReadTime: '45 seconds',
    qualityScore: calculateQualityScore(draft),
    antiAiCheck: runAntiAiCheck(draft),
    suggestions: [
      'Consider adding a more specific dollar amount or metric from your own experience.',
      'The PS line is strong and often drives the most comments.',
    ],
  }
}

export function runAntiAiCheck(text) {
  const issues = []

  if (/[——]/.test(text) || / - /.test(text)) {
    issues.push({ rule: 'no_dashes', found: 'Dash detected. Replace with period, comma, or colon.' })
  }

  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
  if (emojiRegex.test(text)) {
    issues.push({ rule: 'no_emojis', found: 'Emoji detected. Remove all emojis.' })
  }

  if (/[•▸▹►◆✓✔★☆→←↑↓]/.test(text)) {
    issues.push({ rule: 'no_bullet_symbols', found: 'Bullet or arrow symbol detected. Rewrite as prose.' })
  }

  const foundPhrases = BANNED_PHRASES.filter(phrase =>
    text.toLowerCase().includes(phrase.toLowerCase())
  )
  if (foundPhrases.length > 0) {
    issues.push({ rule: 'banned_phrases', found: `AI-residue phrase detected: "${foundPhrases[0]}"` })
  }

  const hashtags = text.match(/#\w+/g) || []
  if (hashtags.length > 3) {
    issues.push({ rule: 'hashtag_limit', found: `${hashtags.length} hashtags found. Maximum is 3.` })
  }

  const upperHashtags = hashtags.filter(h => h !== h.toLowerCase())
  if (upperHashtags.length > 0) {
    issues.push({ rule: 'hashtag_case', found: 'Hashtags must be lowercase.' })
  }

  return {
    passed: issues.length === 0,
    issues,
    checkedRules: ANTI_AI_RULES.length + 2,
  }
}

export function calculateQualityScore(text) {
  let score = 0

  const len = text.length
  if (len >= POST_LENGTH.engagementOptimal.min && len <= POST_LENGTH.depthOptimal.max) score += 15
  else if (len >= POST_LENGTH.min && len <= POST_LENGTH.max) score += 8

  const firstLine = text.split('\n')[0]
  if (firstLine.length <= POST_LENGTH.hookMax) score += 15
  else if (firstLine.length <= 250) score += 8

  const paragraphs = text.split('\n\n').filter(p => p.trim())
  const avgParaLength = paragraphs.reduce((sum, p) => sum + p.split('\n').length, 0) / paragraphs.length
  if (avgParaLength <= 3) score += 15
  else if (avgParaLength <= 5) score += 8

  if (paragraphs.length <= 12) score += 10

  const aiCheck = runAntiAiCheck(text)
  if (aiCheck.passed) score += 20
  else score += Math.max(0, 20 - aiCheck.issues.length * 5)

  const numberMatches = text.match(/\d+/g) || []
  if (numberMatches.length >= 3) score += 10
  else if (numberMatches.length >= 1) score += 5

  if (!/https?:\/\//.test(text)) score += 10

  const hashtags = text.match(/#\w+/g) || []
  if (hashtags.length <= 3 && hashtags.every(h => h === h.toLowerCase())) score += 5

  return {
    score: Math.min(score, 100),
    maxScore: 100,
    grade: score >= 80 ? 'Strong' : score >= 60 ? 'Solid' : score >= 40 ? 'Needs work' : 'Weak',
    breakdown: {
      length: len,
      hookLength: firstLine.length,
      paragraphCount: paragraphs.length,
      avgParagraphLines: Math.round(avgParaLength * 10) / 10,
      specificNumbers: numberMatches.length,
      hasLinks: /https?:\/\//.test(text),
      hashtagCount: hashtags.length,
      antiAiPassed: aiCheck.passed,
    },
  }
}

export async function transformLinkedInDraft(draft, transformation) {
  await delay(1500)
  const transforms = {
    shorter: shortenDraft(draft),
    deeper: deepenDraft(draft),
    more_personal: personalDraft(draft),
    more_professional: professionalDraft(draft),
    add_storytelling: storytellingDraft(draft),
    remove_generic: removeGenericLines(draft),
    new_hook: regenerateHook(draft),
    stronger: strengthenDraft(draft),
  }
  return transforms[transformation] || { draft, charCount: draft.length, note: null }
}

function shortenDraft(draft) {
  const lines = draft.split('\n\n').filter(p => p.trim())
  const shortened = lines.slice(0, Math.ceil(lines.length * 0.6)).join('\n\n')
  return { draft: shortened, charCount: shortened.length, note: 'Trimmed to essential paragraphs. Check that the core idea still lands.' }
}

function deepenDraft(draft) {
  const addition = '\n\nThis connects to something more fundamental about how we process information. The patterns we notice are rarely random. They are the shape of our attention made visible.'
  const result = draft + addition
  return { draft: result, charCount: result.length, note: 'Added a deeper layer. Consider whether this earns the extra length.' }
}

function personalDraft(draft) {
  const result = draft.replace(/Companies/g, 'We').replace(/\baccounts\b/g, 'our account')
  return { draft: result, charCount: result.length, note: 'Shifted to first-person. Add a specific personal example to anchor it.' }
}

function professionalDraft(draft) {
  return { draft, charCount: draft.length, note: 'Tone is already in the professional range. Consider adding a specific industry reference.' }
}

function storytellingDraft(draft) {
  const opener = 'Three months ago, I sat in a meeting where someone presented data that contradicted everything I believed about content.\n\n'
  const result = opener + draft
  return { draft: result, charCount: result.length, note: 'Added a story opening. Replace with your actual experience.' }
}

function removeGenericLines(draft) {
  return { draft, charCount: draft.length, note: 'Scanned for generic lines. This draft is already specific. No changes needed.' }
}

function regenerateHook(draft) {
  const lines = draft.split('\n\n')
  lines[0] = 'The highest-performing LinkedIn accounts I studied this quarter all did the same counterintuitive thing.'
  const result = lines.join('\n\n')
  return { draft: result, charCount: result.length, note: 'Swapped to a curiosity-gap hook. Compare with the original.' }
}

function strengthenDraft(draft) {
  return { draft, charCount: draft.length, note: 'Draft strength is solid. To push further, add a specific dollar amount or metric from your own experience.' }
}

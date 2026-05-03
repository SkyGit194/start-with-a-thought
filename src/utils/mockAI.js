const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mockReflectionQuestions = [
  "What happened today that's still sitting with you?",
  "What moment stayed with you the longest?",
  "What emotion came up most strongly?",
  "What did this situation teach you about yourself?",
  "What pattern are you starting to see?",
  "What did you handle better than before?",
  "What are you still trying to understand?",
]

export const mockDevelopQuestions = [
  { text: "What exactly do you mean by this?", type: "Definition drill" },
  { text: "What are you assuming here that might not be true?", type: "Assumption check" },
  { text: "What evidence supports this idea?", type: "Evidence probe" },
  { text: "What evidence weakens it?", type: "Counter-evidence" },
  { text: "What would someone who disagrees say?", type: "Counter-view" },
  { text: "What is the deeper issue underneath?", type: "Root cause" },
  { text: "What is the real tension here?", type: "Tension mapping" },
  { text: "What is the strongest version of this idea?", type: "Steel-manning" },
  { text: "What is the practical lesson?", type: "Application" },
]

export const dailyPrompts = [
  "What belief are you beginning to question?",
  "What did you learn this week that changed how you see something?",
  "What conversation are you avoiding — and why?",
  "What would you do differently if you had to start over?",
  "What is the most important thing you're not talking about publicly?",
  "What tension in your work are you trying to resolve?",
  "What would your sharpest critic say about your last decision?",
  "What pattern keeps showing up in your work this month?",
  "What idea are you sitting on that deserves to be shared?",
  "What mistake taught you something nobody talks about?",
]

export function getDailyPrompt() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return dailyPrompts[dayOfYear % dailyPrompts.length]
}

export async function generateReflectionInsights(answers) {
  await delay(1500)
  const firstAnswer = answers[0]?.answer || 'your experience'
  return {
    keyInsight: `You're noticing a pattern of self-imposed pressure around ${firstAnswer.split(' ').slice(0, 4).join(' ')}.`,
    keyEmotion: "Frustration mixed with determination",
    lessonLearned: "The gap between intention and execution often lives in the space of unclear priorities.",
    patternNoticed: "You tend to absorb responsibility before checking whether it's yours to hold.",
    actionStep: "Consider setting one non-negotiable boundary this week — and writing it down.",
    writingAngle: "This could become a post about the cost of over-functioning in professional settings.",
  }
}

export async function generateLinkedInDraft(context) {
  await delay(2000)
  const topic = context.mainIdea || 'leadership and growth'
  return {
    coreIdea: `A direct insight about ${topic} that challenges conventional thinking.`,
    hooks: [
      `Most people misunderstand ${topic}. Here's what they're missing:`,
      `I spent years getting ${topic} wrong. This is what changed everything:`,
      `The uncomfortable truth about ${topic} that nobody talks about:`,
    ],
    selectedHook: 0,
    structure: ["Opening hook", "Personal context", "Core insight", "Practical lesson", "CTA"],
    draft: `Most people misunderstand ${topic}. Here's what they're missing:\n\nI used to think ${topic} was about doing more. Working harder. Being louder.\n\nI was wrong.\n\nAfter years of observation, I've realized it's actually about:\n→ Doing less, but better\n→ Building slowly, then all at once\n→ Knowing when to stop\n\nThe professionals who do this well aren't the ones working 80-hour weeks.\n\nThey're the ones who've learned that clarity beats intensity every time.\n\nIf you're struggling with ${topic}, ask yourself: am I busy, or am I effective?\n\nThe answer will tell you everything.\n\nWhat's one thing you're doing that looks productive but isn't?`,
    strongerVersion: `The hard truth about ${topic} is that most people never actually master it. They get better at pretending.`,
    personalVersion: `Three years ago, I was completely wrong about ${topic}. Here's the story of how I figured it out.`,
    professionalVersion: `Research in organizational behavior consistently shows that ${topic} is misunderstood at every level of leadership.`,
  }
}

export async function generateLinkedInHook(context) {
  await delay(1200)
  const hooks = [
    `Most people get ${context.mainIdea || 'this'} completely wrong.`,
    `I learned this lesson the hard way — and I won't let you make the same mistake.`,
    `The uncomfortable truth about ${context.mainIdea || 'this'} that changed how I work:`,
  ]
  return hooks[Math.floor(Math.random() * hooks.length)]
}

export async function generateTwitterThread(context) {
  await delay(2000)
  const topic = context.mainClaim || 'how we think about work'
  return {
    tweets: [
      { type: 'HOOK', content: `A thread on ${topic}:\n\n(This took me 3 years to learn)`, charCount: 67 },
      { type: 'CONTEXT', content: `Most people approach ${topic} with the wrong mental model.\n\nThey optimize for output.\n\nThe best ones optimize for clarity.`, charCount: 118 },
      { type: 'POINT 1', content: `First: stop measuring effort.\n\nBusy is not a strategy.\n\nAsk yourself daily: "Did I move the needle on what actually matters?"`, charCount: 117 },
      { type: 'POINT 2', content: `Second: build decision filters.\n\nNot every opportunity deserves a yes.\n\nThe best leaders I know say no more than they say yes.`, charCount: 121 },
      { type: 'NARRATIVE PIVOT', content: `Here's where it gets interesting:\n\nThe people who master ${topic} don't work harder.\n\nThey think differently about what "working" means.`, charCount: 134 },
      { type: 'EVIDENCE', content: `I've observed this across dozens of high performers.\n\nThe common thread isn't talent. It's intentionality.\n\nThey protect their thinking time fiercely.`, charCount: 140 },
      { type: 'LESSON', content: `The practical lesson:\n\n→ Less reactive work\n→ More intentional creation\n→ Clear criteria for what gets your energy\n→ Ruthless about what doesn't`, charCount: 128 },
      { type: 'CTA', content: `If this resonated — what's one thing you're doing out of habit rather than intention?\n\nReply below. I read everything.`, charCount: 115 },
    ],
    meta: { totalChars: 940, estimatedReadTime: '2 min', threadLength: 8 }
  }
}

export async function generateEssayDraft(context) {
  await delay(2000)
  const topic = context.topic || 'the nature of good work'
  return {
    title: `On ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
    subtitle: `A reflection on what it means to think clearly in a noisy world.`,
    body: `There is a particular kind of clarity that only comes after struggle.\n\nNot the clarity of having answers — but the clarity of knowing which questions are worth asking.\n\nThis is what I've been thinking about lately when it comes to ${topic}.\n\nWe live in an era that rewards the appearance of productivity. We mistake activity for progress, noise for signal, motion for direction. The best thinkers I know have learned to resist this.\n\nThey've learned that the quality of your output is determined entirely by the quality of your thinking. And thinking — real thinking — requires space, friction, and a willingness to sit with uncertainty.\n\n**The paradox of clarity**\n\nHere's what I've come to believe: the people who think most clearly are not the ones who consume the most information. They're the ones who've built the strongest filters.\n\nThey know what they're trying to understand. They know what questions are actually worth their time. And they've learned — sometimes painfully — to ignore everything else.\n\nThis is harder than it sounds. It requires a kind of intellectual discipline that doesn't come naturally in a world designed to scatter your attention.\n\n**A practice, not a destination**\n\nClear thinking is not something you achieve. It's something you practice, every day, through the choices you make about where your attention goes.\n\nThe question isn't whether you'll think clearly today. It's whether you'll create the conditions that make it possible.\n\nStart there.`,
  }
}

export async function transformDraft(draft, transformation) {
  await delay(1200)
  const transformations = {
    shorter: draft.split('\n').slice(0, Math.floor(draft.split('\n').length * 0.6)).join('\n') + '\n\n[Condensed for clarity.]',
    deeper: draft + '\n\n**A deeper layer:**\n\nThis connects to something more fundamental about how we process experience. The patterns we notice are rarely random — they\'re the shape of our attention made visible.',
    personal: 'Let me tell you something I don\'t share often.\n\n' + draft,
    professional: draft.replace(/\bI\b/g, 'Leaders').replace(/\bme\b/g, 'them'),
    storytelling: 'Three years ago, none of this was obvious to me.\n\n' + draft,
    hooks: 'Here\'s something nobody talks about:\n\n' + draft,
  }
  return transformations[transformation] || draft
}

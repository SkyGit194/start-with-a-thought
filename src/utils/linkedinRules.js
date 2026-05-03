export const POST_LENGTH = {
  min: 600,
  engagementOptimal: { min: 800, max: 1000 },
  depthOptimal: { min: 1200, max: 1800 },
  max: 3000,
  hookMax: 200,
  desktopPreview: 210,
};

export const HOOK_TYPES = [
  {
    id: 'curiosity_gap',
    name: 'Curiosity Gap',
    lift: '~2.3x baseline',
    description: 'State something unexpected, withhold the why',
    bestFor: 'Frameworks, contrarian insights, behind-the-scenes',
    templates: [
      "I've reviewed {number} {things} this quarter. Three patterns keep repeating.",
      "Everyone's optimizing for {common thing}. The actual constraint is {real thing}.",
      "{Common practice} looks free. Here's what it actually costs.",
    ],
  },
  {
    id: 'contrarian',
    name: 'Contrarian Statement',
    lift: '~2.3x baseline',
    description: 'Challenges accepted wisdom in your field',
    bestFor: 'Opinion pieces, strategic takes, pattern calls',
    templates: [
      "{Common belief} isn't wrong. It's incomplete in a specific way.",
      "The industry consensus on {topic} is missing something critical.",
      "I used to believe {old belief}. Two years of data changed my mind.",
    ],
  },
  {
    id: 'specific_number',
    name: 'Specific Number',
    lift: '~1.7x baseline',
    description: 'Concrete, surprising data point',
    bestFor: 'Case studies, data-driven posts, results',
    templates: [
      "We {action} {specific number} {things}. One number changed everything.",
      "{Specific dollar amount}. That's what {decision} actually cost us.",
      "{Number} out of {total}. That's the real conversion rate on {thing}.",
    ],
  },
  {
    id: 'story_opening',
    name: 'Story Opening',
    lift: '~1.6x baseline',
    description: 'A moment, a turning point',
    bestFor: 'Lessons learned, founder narratives, transformations',
    templates: [
      "Three months ago, I made a decision that {consequence}.",
      "The meeting lasted 12 minutes. What happened after changed {thing}.",
      "I was wrong about {topic} for {time period}. Here's what I missed.",
    ],
  },
  {
    id: 'question',
    name: 'Question',
    lift: '~1.4x baseline',
    description: 'Only when answer is non-obvious',
    bestFor: 'Discussion-driving posts',
    templates: [
      "What if {common practice} is actually the thing slowing you down?",
      "Why does every {role} optimize for {metric} when {other metric} matters more?",
    ],
  },
];

export const ENGAGEMENT_WEIGHTS = {
  comment15Plus: { label: 'Comment > 15 words', weight: '~15x a like' },
  comment10to15: { label: 'Comment 10-15 words', weight: '~5-10x a like' },
  commentShort: { label: 'Comment < 10 words', weight: 'Approx. a like (often discounted)' },
  save: { label: 'Save', weight: 'Strong quiet vote' },
  shareWithContext: { label: 'Share with context', weight: 'High weight' },
  bareShare: { label: 'Bare share', weight: 'Moderate' },
  like: { label: 'Like / reaction', weight: 'Lowest meaningful signal' },
  dwellTime61Plus: { label: 'Dwell time > 61s', weight: '15.6% engagement rate' },
  seeMoreClick: { label: '"See more" click in first 30 min', weight: 'Strong early signal' },
};

export const FORMAT_PERFORMANCE = [
  { id: 'carousel', name: 'Document / PDF Carousel', engagement: '~6.6%', bestFor: 'Frameworks, case studies, structured insight' },
  { id: 'text_carousel', name: 'Text-oriented Carousel', engagement: '~24% on top performers', bestFor: 'Teaching, breakdowns, "how I think about X"' },
  { id: 'text_only', name: 'Text-only Post', engagement: '~4-6.7%', bestFor: 'Opinion, story, observation, question' },
  { id: 'image_text', name: 'Image + Text', engagement: 'Mid-tier', bestFor: 'Personal stories, day-to-day, quick tips' },
];

export const POST_TEMPLATES = [
  { id: 'framework', name: 'Framework Post', description: 'Hook, then 3-5 principles with specific examples, then synthesis' },
  { id: 'teardown', name: 'Teardown Post', description: 'Specific company/product/decision. What they did, what it actually means, transferable principle' },
  { id: 'pattern', name: 'Pattern Post', description: '"I\'ve seen [X] play out N times this year. Here\'s the pattern."' },
  { id: 'decision', name: 'Decision Post', description: '"We chose A over B. Here\'s the reasoning."' },
  { id: 'correction', name: 'Correction Post', description: '"I argued X for two years. I was wrong. Here\'s what I missed."' },
  { id: 'observation', name: 'Observation Post', description: 'Pattern recognition from your specific lens. "Here\'s what I notice" not "here\'s what you should do."' },
];

export const ANTI_AI_RULES = [
  { id: 'no_dashes', label: 'No dashes', description: 'No em dashes, en dashes, or hyphens as stylistic punctuation. Use periods, commas, or colons.' },
  { id: 'no_emojis', label: 'No emojis', description: 'Zero emojis. Not for decoration, not for bullets, not for emphasis.' },
  { id: 'no_bullet_symbols', label: 'No bullet symbols', description: 'No bullet characters, arrows, checkmarks, stars, or unicode list decorators.' },
  { id: 'no_bold_patterns', label: 'No excessive bolding', description: 'Let sentence structure carry emphasis, not formatting.' },
  { id: 'no_formulaic_starters', label: 'No formulaic starters', description: 'Do not begin consecutive sentences with the same structure.' },
  { id: 'no_listicle_energy', label: 'No listicle energy', description: 'If using numbered points, each must flow into the next with human transitions.' },
];

export const BANNED_PHRASES = [
  "In today's fast-paced world",
  "Let's dive in",
  "Here's the thing",
  "It's not just X, it's Y",
  "At the end of the day",
  "Game-changer",
  "Unlock your potential",
  "Success is a journey",
  "Your network is your net worth",
  "hot take incoming",
  "just a small thought",
  "As a founder of",
  "So last week I was thinking",
];

export const POSTING_RULES = {
  bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
  bestTimeWindow: '8-11 AM target audience local time',
  sweetSpotTime: 'Tuesday 10 AM',
  frequency: '2-3 feed posts per week + 1 newsletter',
  goldenWindow: 'First 60-90 minutes after posting',
  maxPerDay: 1,
  spacingHours: 18,
};

export const HASHTAG_RULES = {
  max: 3,
  style: 'lowercase only',
  rule: '3 specific hashtags > 10 generic ones',
};

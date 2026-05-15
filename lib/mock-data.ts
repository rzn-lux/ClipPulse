// Platform types
export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter'

export interface Video {
  id: string
  title: string
  thumbnail: string
  platform: Platform
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  watchTime: number
  avgRetention: number
  publishedAt: string
  duration: number
  retentionCurve: number[]
  replayHeatmap: number[]
  trafficSources: { source: string; percentage: number }[]
  audienceAge: { range: string; percentage: number }[]
  audienceGender: { gender: string; percentage: number }[]
  topCountries: { country: string; percentage: number }[]
  followerVsNonFollower: { type: string; percentage: number }[]
  sentimentBreakdown: { sentiment: string; percentage: number }[]
  topComments: { text: string; sentiment: 'positive' | 'neutral' | 'negative'; likes: number }[]
  aiInsights: string[]
  aiSuggestions: string[]
}

export interface ConceptBrief {
  id: string
  title: string
  description: string
  hook: string
  confidence: number
  predictedViewsMin: number
  predictedViewsMax: number
  reasoningChips: string[]
  hookScript: string
  visualDirection: string
  beats: {
    timecode: string
    description: string
    onScreenText: string
    brollNotes: string
    pacingTip: string
  }[]
  recommendedLength: { min: number; max: number; reason: string }
  captions: string[]
  hashtags: { tag: string; trendScore: number }[]
  sounds: { name: string; artist: string; usageCount: number; growthPercent: number }[]
  thumbnailIdeas: { layout: string; expression: string; colorPalette: string; textPlacement: string }[]
  bestTimeToPost: { day: string; hour: number; confidence: number }[]
  ctaSuggestion: string
  whyItWillWork: { insight: string; sourceVideo?: string }[]
  avoidThis: string[]
}

// Generate sparkline data for a new user (all zeros with slight variance)
export const generateSparkline = (length: number, trend: 'up' | 'down' | 'stable' = 'stable'): number[] => {
  // New user - return flat line at zero
  return Array(length).fill(0)
}

// KPI Data - New user with zero stats
export const kpiData = {
  totalViews: {
    value: 0,
    delta: 0,
    sparkline: generateSparkline(14)
  },
  engagementRate: {
    value: 0,
    delta: 0,
    sparkline: generateSparkline(14)
  },
  watchTime: {
    value: 0,
    delta: 0,
    sparkline: generateSparkline(14)
  },
  followersGained: {
    value: 0,
    delta: 0,
    sparkline: generateSparkline(14)
  },
  shares: {
    value: 0,
    delta: 0,
    sparkline: generateSparkline(14)
  }
}

// Views over time by platform - New user with zero views
export const viewsOverTime = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split('T')[0],
    tiktok: 0,
    instagram: 0,
    youtube: 0,
    twitter: 0
  }
})

// Sample videos - Empty for new user
export const videos: Video[] = []

// Trending sounds - these are platform trends, still visible for new users
export const trendingSounds = [
  {
    id: '1',
    name: 'original sound - aesthetic vibes',
    artist: 'aestheticvibes',
    usageCount: 2847293,
    growthPercent: 234,
    platform: 'tiktok' as Platform
  },
  {
    id: '2',
    name: 'Espresso',
    artist: 'Sabrina Carpenter',
    usageCount: 1928374,
    growthPercent: 156,
    platform: 'instagram' as Platform
  },
  {
    id: '3',
    name: 'Birds of a Feather',
    artist: 'Billie Eilish',
    usageCount: 1574829,
    growthPercent: 189,
    platform: 'tiktok' as Platform
  },
  {
    id: '4',
    name: 'Not Like Us',
    artist: 'Kendrick Lamar',
    usageCount: 1283947,
    growthPercent: 312,
    platform: 'youtube' as Platform
  },
  {
    id: '5',
    name: 'Lunch',
    artist: 'Billie Eilish',
    usageCount: 982374,
    growthPercent: 167,
    platform: 'tiktok' as Platform
  }
]

// Trending hooks - platform trends visible for new users
export const trendingHooks = [
  {
    id: '1',
    text: 'POV: You finally...',
    usageCount: 847293,
    avgEngagement: 8.4,
    platform: 'tiktok' as Platform
  },
  {
    id: '2',
    text: 'I tried [X] for 30 days...',
    usageCount: 629384,
    avgEngagement: 7.8,
    platform: 'instagram' as Platform
  },
  {
    id: '3',
    text: 'Stop scrolling if you...',
    usageCount: 584729,
    avgEngagement: 9.2,
    platform: 'tiktok' as Platform
  },
  {
    id: '4',
    text: 'The [X] that changed my life',
    usageCount: 472839,
    avgEngagement: 7.5,
    platform: 'youtube' as Platform
  },
  {
    id: '5',
    text: 'Why nobody talks about...',
    usageCount: 384729,
    avgEngagement: 8.1,
    platform: 'twitter' as Platform
  }
]

// Concept briefs - AI suggestions based on trending content, still available for new users
export const conceptBriefs: ConceptBrief[] = [
  {
    id: '1',
    title: 'Day in My Life as a Content Creator',
    description: 'Authentic behind-the-scenes look at your daily routine, showing the reality of content creation including the challenges and wins.',
    hook: 'POV: You asked what I actually do all day...',
    confidence: 87,
    predictedViewsMin: 50000,
    predictedViewsMax: 250000,
    reasoningChips: ['Trending format', 'High relatability', 'Strong hook pattern'],
    hookScript: 'Open with an alarm going off, quick cuts of morning routine, then pause and look at camera with "You asked what I actually do all day..."',
    visualDirection: 'Raw, unfiltered aesthetic. Mix of phone footage and quick transitions. Keep it real - show the messy desk, the multiple takes, the snacks.',
    beats: [
      {
        timecode: '0:00-0:03',
        description: 'Hook - direct address to camera',
        onScreenText: '"What I actually do all day"',
        brollNotes: 'Quick flash of setup/workspace',
        pacingTip: 'Start mid-action for immediate engagement'
      },
      {
        timecode: '0:03-0:08',
        description: 'Morning routine montage',
        onScreenText: '6:00 AM',
        brollNotes: 'Coffee, checking phone, natural lighting',
        pacingTip: 'Quick 0.5-1s cuts to maintain energy'
      },
      {
        timecode: '0:08-0:15',
        description: 'Content planning/ideation',
        onScreenText: 'The part nobody sees',
        brollNotes: 'Notes, storyboards, competitor research',
        pacingTip: 'Slow down slightly for contrast'
      },
      {
        timecode: '0:15-0:22',
        description: 'Filming process with bloopers',
        onScreenText: 'Take 47...',
        brollNotes: 'Multiple angles, show failures',
        pacingTip: 'Build humor through repetition'
      },
      {
        timecode: '0:22-0:28',
        description: 'Editing and final result',
        onScreenText: 'Worth it?',
        brollNotes: 'Screen recording of edit, then final post',
        pacingTip: 'End on satisfying before/after'
      }
    ],
    recommendedLength: { min: 25, max: 35, reason: 'Day-in-life format performs best at 30s for first-time viewers' },
    captions: [
      'What I actually do all day (content creator edition)',
      'The reality of being a content creator no one shows you',
      'POV: You romanticized content creation'
    ],
    hashtags: [
      { tag: '#contentcreator', trendScore: 92 },
      { tag: '#dayinmylife', trendScore: 88 },
      { tag: '#behindthescenes', trendScore: 75 },
      { tag: '#creatorlife', trendScore: 82 }
    ],
    sounds: [
      { name: 'original sound - morningvibes', artist: 'morningvibes', usageCount: 284729, growthPercent: 156 },
      { name: 'Chill Vibes', artist: 'LoFi Beats', usageCount: 1847293, growthPercent: 23 }
    ],
    thumbnailIdeas: [
      { layout: 'Split screen - messy desk vs polished content', expression: 'Exhausted but genuine smile', colorPalette: 'Warm, natural tones', textPlacement: 'Bottom third, bold text' }
    ],
    bestTimeToPost: [
      { day: 'Tuesday', hour: 19, confidence: 85 },
      { day: 'Thursday', hour: 12, confidence: 78 },
      { day: 'Sunday', hour: 10, confidence: 72 }
    ],
    ctaSuggestion: 'Follow for more behind-the-scenes content',
    whyItWillWork: [
      { insight: 'Day-in-life format has 2.3x higher completion rates for new creators' },
      { insight: 'Authenticity-focused content trending up 45% this month' },
      { insight: 'Great first video to establish your personality' }
    ],
    avoidThis: [
      'Making it too polished - authenticity is key',
      'Going over 40 seconds - attention drops sharply',
      'Skipping the struggles - people want to see the real journey'
    ]
  },
  {
    id: '2',
    title: 'Unpopular Opinion in Your Niche',
    description: 'Share a controversial but defensible take that will spark conversation and debate in the comments.',
    hook: 'This is going to be controversial but...',
    confidence: 82,
    predictedViewsMin: 75000,
    predictedViewsMax: 400000,
    reasoningChips: ['High engagement potential', 'Comment-driving', 'Shareable'],
    hookScript: 'Start with a knowing look at the camera, slight pause, then deliver the line with confidence. The pause creates anticipation.',
    visualDirection: 'Direct to camera, good lighting, minimal distractions. Your face and expressions carry this one. Consider a subtle background that hints at your niche.',
    beats: [
      {
        timecode: '0:00-0:03',
        description: 'The controversial hook',
        onScreenText: 'Unpopular opinion:',
        brollNotes: 'Face only, direct eye contact',
        pacingTip: 'Pause for 0.5s before reveal for tension'
      },
      {
        timecode: '0:03-0:08',
        description: 'State the opinion clearly',
        onScreenText: '[Your take]',
        brollNotes: 'Hand gestures for emphasis',
        pacingTip: 'Deliver with confidence, no hedging'
      },
      {
        timecode: '0:08-0:18',
        description: 'Back it up with reasoning',
        onScreenText: 'Here\'s why...',
        brollNotes: 'Can cut to examples/evidence',
        pacingTip: '2-3 quick points max'
      },
      {
        timecode: '0:18-0:25',
        description: 'Address the counter-argument',
        onScreenText: '"But what about..."',
        brollNotes: 'Return to face',
        pacingTip: 'Acknowledge and dismiss efficiently'
      },
      {
        timecode: '0:25-0:30',
        description: 'Call to action for debate',
        onScreenText: 'Agree or disagree?',
        brollNotes: 'Confident expression',
        pacingTip: 'End with question to drive comments'
      }
    ],
    recommendedLength: { min: 25, max: 35, reason: 'Opinion content needs enough time to build argument but stay punchy' },
    captions: [
      'Unpopular opinion: [Your take] - change my mind',
      'I said what I said. Fight me in the comments.',
      'This take is going to upset some people but...'
    ],
    hashtags: [
      { tag: '#unpopularopinion', trendScore: 95 },
      { tag: '#controversial', trendScore: 78 },
      { tag: '#hottake', trendScore: 85 },
      { tag: '#debate', trendScore: 72 }
    ],
    sounds: [
      { name: 'original sound', artist: 'Use your voice', usageCount: 0, growthPercent: 0 },
      { name: 'Oh No', artist: 'Kreepa', usageCount: 2847293, growthPercent: -12 }
    ],
    thumbnailIdeas: [
      { layout: 'Close-up face with raised eyebrow', expression: 'Slightly smug but inviting debate', colorPalette: 'High contrast, bold', textPlacement: 'Top, large bold text with opinion' }
    ],
    bestTimeToPost: [
      { day: 'Wednesday', hour: 20, confidence: 82 },
      { day: 'Friday', hour: 18, confidence: 79 },
      { day: 'Saturday', hour: 14, confidence: 75 }
    ],
    ctaSuggestion: 'Drop your take in the comments - I read every one',
    whyItWillWork: [
      { insight: 'Controversial content gets 3.2x more comments' },
      { insight: 'Debate-style videos have highest share rates' },
      { insight: 'Great way to find your audience who resonates with your views' }
    ],
    avoidThis: [
      'Being mean-spirited - controversial ≠ offensive',
      'Not having receipts for your claims',
      'Backing down in the comments - own your take'
    ]
  },
  {
    id: '3',
    title: 'Before/After Transformation',
    description: 'Show a dramatic transformation that provides immediate visual impact and value to viewers.',
    hook: 'Watch this transformation...',
    confidence: 79,
    predictedViewsMin: 40000,
    predictedViewsMax: 200000,
    reasoningChips: ['Visual impact', 'Satisfying content', 'Save-worthy'],
    hookScript: 'Start with the "before" state, quick flash to "after" as a teaser, then go back to show the full process.',
    visualDirection: 'High-quality visuals are essential. Good lighting for both before and after. Consider time-lapse for the process. The contrast should be dramatic.',
    beats: [
      {
        timecode: '0:00-0:02',
        description: 'Quick before/after flash',
        onScreenText: 'Wait for it...',
        brollNotes: 'Split screen or quick cut',
        pacingTip: 'This teaser hooks immediately'
      },
      {
        timecode: '0:02-0:05',
        description: 'Show the "before" state',
        onScreenText: 'BEFORE',
        brollNotes: 'Multiple angles of starting point',
        pacingTip: 'Emphasize the problem/starting point'
      },
      {
        timecode: '0:05-0:18',
        description: 'The transformation process',
        onScreenText: 'The process...',
        brollNotes: 'Time-lapse or key moments',
        pacingTip: 'Speed up boring parts, slow on satisfying moments'
      },
      {
        timecode: '0:18-0:25',
        description: 'The big reveal',
        onScreenText: 'AFTER',
        brollNotes: 'Dramatic reveal, multiple angles',
        pacingTip: 'Build anticipation, then deliver'
      },
      {
        timecode: '0:25-0:30',
        description: 'Final comparison',
        onScreenText: 'Same [thing], different result',
        brollNotes: 'Side by side or morph transition',
        pacingTip: 'Let the result speak for itself'
      }
    ],
    recommendedLength: { min: 25, max: 35, reason: 'Transformation content needs time for impact but should stay tight' },
    captions: [
      'The transformation no one expected',
      'From [before] to [after] in just [time]',
      'This glow-up is insane'
    ],
    hashtags: [
      { tag: '#transformation', trendScore: 91 },
      { tag: '#beforeandafter', trendScore: 87 },
      { tag: '#glowup', trendScore: 83 },
      { tag: '#satisfying', trendScore: 79 }
    ],
    sounds: [
      { name: 'Metamorphosis', artist: 'INTERWORLD', usageCount: 1847293, growthPercent: 89 },
      { name: 'original sound - transformations', artist: 'transformations', usageCount: 482739, growthPercent: 134 }
    ],
    thumbnailIdeas: [
      { layout: 'Split screen before/after', expression: 'N/A - focus on transformation', colorPalette: 'Bright, clean for after; muted for before', textPlacement: 'Center dividing line' }
    ],
    bestTimeToPost: [
      { day: 'Saturday', hour: 11, confidence: 84 },
      { day: 'Sunday', hour: 15, confidence: 81 },
      { day: 'Monday', hour: 19, confidence: 76 }
    ],
    ctaSuggestion: 'Save this for when you need inspiration',
    whyItWillWork: [
      { insight: 'Transformation content has 4.5x higher save rates' },
      { insight: 'Satisfying visual content performs well across all niches' },
      { insight: 'Great way to showcase skills or results' }
    ],
    avoidThis: [
      'Misleading before/after comparisons',
      'Skipping the process - people want to see HOW',
      'Poor lighting that diminishes the transformation impact'
    ]
  }
]

// Extended concept pool across different niches
export const allConceptBriefs: ConceptBrief[] = [
  ...conceptBriefs,
  {
    id: '4',
    title: 'Tech Review Under 60 Seconds',
    description: 'Fast-paced review of a gadget or app that tells viewers everything they need to know before buying.',
    hook: 'Should you buy this? 60 seconds. Go.',
    confidence: 84,
    predictedViewsMin: 60000,
    predictedViewsMax: 350000,
    reasoningChips: ['High purchase intent', 'Save-worthy', 'Search traffic'],
    hookScript: 'Hold product directly to camera, deadpan delivery: "Should you buy this? 60 seconds. Go."',
    visualDirection: 'Clean desk setup, good overhead lighting. Product close-ups. Fast cuts. Timer on screen.',
    beats: [
      { timecode: '0:00-0:03', description: 'Hook with product reveal', onScreenText: '60 SEC REVIEW', brollNotes: 'Product close-up', pacingTip: 'No intro - start instantly' },
      { timecode: '0:03-0:15', description: 'Top 3 pros rapid fire', onScreenText: 'PROS', brollNotes: 'Quick demo clips', pacingTip: 'Cut every 3-4 seconds' },
      { timecode: '0:15-0:22', description: 'The one big con', onScreenText: 'BUT...', brollNotes: 'Reaction shot', pacingTip: 'Slow down for this moment' },
      { timecode: '0:22-0:28', description: 'Verdict', onScreenText: 'BUY IT / SKIP IT', brollNotes: 'Thumbs up or down', pacingTip: 'Be definitive' },
      { timecode: '0:28-0:30', description: 'Price drop', onScreenText: '$XX', brollNotes: 'Price graphic', pacingTip: 'End on value prop' }
    ],
    recommendedLength: { min: 55, max: 60, reason: 'The time constraint itself is the hook' },
    captions: ['60 second honest review of [product]', 'Everything you need to know in 60 seconds', 'I saved you 20 minutes of research'],
    hashtags: [{ tag: '#techreview', trendScore: 88 }, { tag: '#techtok', trendScore: 84 }, { tag: '#gadgets', trendScore: 76 }, { tag: '#review', trendScore: 91 }],
    sounds: [{ name: 'Countdown', artist: 'Sound Effects', usageCount: 847293, growthPercent: 45 }],
    thumbnailIdeas: [{ layout: 'Product + timer graphic', expression: 'Raised eyebrow', colorPalette: 'Clean white/black', textPlacement: 'Bold BUY or SKIP overlay' }],
    bestTimeToPost: [{ day: 'Wednesday', hour: 19, confidence: 86 }, { day: 'Saturday', hour: 11, confidence: 79 }],
    ctaSuggestion: 'Follow for weekly 60-second tech reviews',
    whyItWillWork: [{ insight: 'Tech review shorts get 5x more saves than average' }, { insight: 'Time-constrained format creates urgency' }],
    avoidThis: ['Going over 60 seconds - it breaks the concept', 'Being vague - viewers want a clear verdict'],
    niche: 'tech'
  } as any,
  {
    id: '5',
    title: 'Fitness Myth Debunked',
    description: 'Call out a popular fitness misconception with evidence and show the correct approach.',
    hook: 'This fitness advice is actually making you worse...',
    confidence: 81,
    predictedViewsMin: 80000,
    predictedViewsMax: 500000,
    reasoningChips: ['Educational', 'High share rate', 'Corrects misinformation'],
    hookScript: 'Look frustrated or disappointed at camera: "This fitness advice is ACTUALLY making you worse..." then cut to the myth.',
    visualDirection: 'Gym or home workout background. Show the wrong way briefly, then the correct way. Use text overlays for emphasis.',
    beats: [
      { timecode: '0:00-0:03', description: 'Frustration hook', onScreenText: 'STOP DOING THIS', brollNotes: 'Close-up face', pacingTip: 'Lead with emotion' },
      { timecode: '0:03-0:10', description: 'Show the wrong way', onScreenText: 'The myth:', brollNotes: 'Quick demo of incorrect form', pacingTip: 'Keep it brief - you want to correct it' },
      { timecode: '0:10-0:22', description: 'Why it is wrong', onScreenText: 'Here is the truth:', brollNotes: 'Infographic or demo', pacingTip: 'One clear reason, not five' },
      { timecode: '0:22-0:28', description: 'Show the right way', onScreenText: 'DO THIS INSTEAD', brollNotes: 'Clean demo with cues', pacingTip: 'Make the correction obvious' },
      { timecode: '0:28-0:32', description: 'Reassurance CTA', onScreenText: 'Save this', brollNotes: 'Face to camera', pacingTip: 'End supportively not judgmentally' }
    ],
    recommendedLength: { min: 28, max: 35, reason: 'Myth-bust needs just enough time to be convincing' },
    captions: ['This fitness advice is hurting your gains', 'Stop doing this immediately', 'The myth that is keeping you from results'],
    hashtags: [{ tag: '#fitnesstips', trendScore: 92 }, { tag: '#gymtok', trendScore: 89 }, { tag: '#fitnessadvice', trendScore: 83 }, { tag: '#workout', trendScore: 95 }],
    sounds: [{ name: 'original sound', artist: 'Your voice', usageCount: 0, growthPercent: 0 }],
    thumbnailIdeas: [{ layout: 'Red X over wrong form, green check over correct', expression: 'Confident and authoritative', colorPalette: 'Red/green contrast', textPlacement: 'Bold myth text at top' }],
    bestTimeToPost: [{ day: 'Monday', hour: 7, confidence: 88 }, { day: 'Thursday', hour: 18, confidence: 82 }],
    ctaSuggestion: 'Follow for daily fitness facts',
    whyItWillWork: [{ insight: 'Myth-bust content gets shared 4x more in fitness niche' }, { insight: 'Monday morning posts hit peak gym motivation audience' }],
    avoidThis: ['Shaming people who do it wrong', 'Going too deep into science - keep it digestible'],
    niche: 'fitness'
  } as any,
  {
    id: '6',
    title: 'Cook This in 3 Minutes',
    description: 'An extremely fast recipe video that shows a complete meal in under 3 minutes real time.',
    hook: 'Dinner in 3 minutes, I dare you to try this.',
    confidence: 86,
    predictedViewsMin: 100000,
    predictedViewsMax: 800000,
    reasoningChips: ['Save-worthy', 'High utility', 'Trending format'],
    hookScript: 'Ingredients already laid out. Timer already running. Camera rolls as you say the line and immediately start cooking.',
    visualDirection: 'Overhead shot for most of the cooking. High contrast, well-lit ingredients. Satisfying sounds - sizzle, chop, pour.',
    beats: [
      { timecode: '0:00-0:03', description: 'Challenge hook with timer start', onScreenText: '3 MINUTE DINNER CHALLENGE', brollNotes: 'Overhead flat lay of ingredients', pacingTip: 'Start the timer on screen immediately' },
      { timecode: '0:03-0:45', description: 'Speed-run cooking process', onScreenText: '[Ingredient names as added]', brollNotes: 'Overhead continuous shot with cuts', pacingTip: 'Real-time speed - no fast-forward' },
      { timecode: '0:45-0:55', description: 'Plating', onScreenText: 'The plating era', brollNotes: 'Beauty shot angles', pacingTip: 'Slow down here for contrast' },
      { timecode: '0:55-1:00', description: 'First bite reaction', onScreenText: 'Worth it', brollNotes: 'Reaction close-up', pacingTip: 'Genuine reaction sells it' }
    ],
    recommendedLength: { min: 55, max: 65, reason: 'Real-time cooking in under 3 mins creates tension and urgency' },
    captions: ['Dinner in 3 minutes (no, really)', 'I dare you to try this tonight', 'Easiest weeknight dinner ever'],
    hashtags: [{ tag: '#foodtok', trendScore: 94 }, { tag: '#easyrecipes', trendScore: 91 }, { tag: '#cooking', trendScore: 96 }, { tag: '#quickrecipes', trendScore: 88 }],
    sounds: [{ name: 'Cooking ASMR', artist: 'Sound Effects', usageCount: 2847293, growthPercent: 67 }],
    thumbnailIdeas: [{ layout: 'Final dish close-up with timer overlay', expression: 'N/A', colorPalette: 'Warm food tones', textPlacement: 'Top bold text + timer' }],
    bestTimeToPost: [{ day: 'Sunday', hour: 17, confidence: 91 }, { day: 'Wednesday', hour: 16, confidence: 84 }],
    ctaSuggestion: 'Save this for your next lazy dinner night',
    whyItWillWork: [{ insight: 'Quick recipe content has the highest save rate on all platforms' }, { insight: '5pm-7pm posts catch peak dinner decision time' }],
    avoidThis: ['Cheating on the timer', 'Complex ingredients people do not have at home'],
    niche: 'food'
  } as any,
  {
    id: '7',
    title: 'My Honest Finance Mistake',
    description: 'Share a real money mistake and the lesson learned. Vulnerability drives trust and shares.',
    hook: 'I lost $X doing this and I need you to not make the same mistake.',
    confidence: 83,
    predictedViewsMin: 90000,
    predictedViewsMax: 600000,
    reasoningChips: ['High trust factor', 'Save-worthy', 'Strong emotional hook'],
    hookScript: 'Serious face. No music needed for the hook. Deadpan delivery of the loss amount. Let silence work for you.',
    visualDirection: 'Simple background. Direct camera. Maybe a graphic of the loss amount. Honesty is the whole aesthetic.',
    beats: [
      { timecode: '0:00-0:04', description: 'The loss hook', onScreenText: 'I LOST $X', brollNotes: 'Face only, serious', pacingTip: 'Pause after stating the amount' },
      { timecode: '0:04-0:12', description: 'The mistake explained', onScreenText: 'What I did:', brollNotes: 'Can use screen recording', pacingTip: 'Be specific - vague stories lose trust' },
      { timecode: '0:12-0:22', description: 'Why it went wrong', onScreenText: 'The red flags I ignored:', brollNotes: 'List graphic', pacingTip: 'Two or three clear points' },
      { timecode: '0:22-0:30', description: 'The lesson', onScreenText: 'What to do instead:', brollNotes: 'Return to face', pacingTip: 'This is the save-worthy moment' },
      { timecode: '0:30-0:35', description: 'Encouragement', onScreenText: 'You can recover from this', brollNotes: 'Warm, direct', pacingTip: 'End on empowerment not shame' }
    ],
    recommendedLength: { min: 30, max: 40, reason: 'Finance storytelling needs enough time to build credibility' },
    captions: ['The $X mistake I will never make again', 'Personal finance lesson the hard way', 'I am telling you this so you do not have to learn it like I did'],
    hashtags: [{ tag: '#personalfinance', trendScore: 90 }, { tag: '#moneymistakes', trendScore: 82 }, { tag: '#financetips', trendScore: 88 }, { tag: '#investing', trendScore: 93 }],
    sounds: [{ name: 'original sound', artist: 'Your voice', usageCount: 0, growthPercent: 0 }],
    thumbnailIdeas: [{ layout: 'Face + big red loss number', expression: 'Regretful but calm', colorPalette: 'Red accent on dark background', textPlacement: 'Large centered loss amount' }],
    bestTimeToPost: [{ day: 'Tuesday', hour: 19, confidence: 85 }, { day: 'Friday', hour: 12, confidence: 80 }],
    ctaSuggestion: 'Follow so I can save you from my mistakes',
    whyItWillWork: [{ insight: 'Vulnerability in finance content builds 10x more followers per video' }, { insight: 'Loss stories get shared more than success stories' }],
    avoidThis: ['Exaggerating the loss for drama', 'Not giving the actual lesson - people came for that'],
    niche: 'finance'
  } as any,
]

// Keyword-based niche detection from video titles
export function detectNiche(videoTitles: string[]): string {
  const text = videoTitles.join(' ').toLowerCase()
  const niches: Record<string, string[]> = {
    tech: ['tech', 'gadget', 'phone', 'laptop', 'app', 'software', 'review', 'apple', 'android', 'ai', 'coding', 'programming', 'computer'],
    fitness: ['workout', 'gym', 'fitness', 'exercise', 'muscle', 'weight', 'cardio', 'training', 'gains', 'diet', 'health', 'running'],
    food: ['recipe', 'cook', 'food', 'eat', 'meal', 'dinner', 'breakfast', 'lunch', 'kitchen', 'bake', 'chef', 'cuisine'],
    finance: ['money', 'finance', 'invest', 'crypto', 'stock', 'budget', 'savings', 'income', 'profit', 'trading', 'wealth'],
    gaming: ['game', 'gaming', 'play', 'stream', 'twitch', 'xbox', 'playstation', 'pc', 'fps', 'minecraft', 'fortnite'],
    beauty: ['makeup', 'beauty', 'skincare', 'hair', 'fashion', 'style', 'outfit', 'tutorial', 'glow', 'routine'],
    travel: ['travel', 'vlog', 'trip', 'country', 'hotel', 'flight', 'explore', 'destination', 'adventure', 'road'],
    content: ['content', 'creator', 'youtube', 'tiktok', 'viral', 'social media', 'editing', 'thumbnail', 'algorithm'],
  }
  let topNiche = 'content'
  let topScore = 0
  for (const [niche, keywords] of Object.entries(niches)) {
    const score = keywords.reduce((sum, kw) => sum + (text.includes(kw) ? 1 : 0), 0)
    if (score > topScore) { topScore = score; topNiche = niche }
  }
  return topNiche
}

// Audience demographics - Empty for new user
export const audienceDemographics = {
  ageGroups: [],
  genderSplit: [],
  topCountries: [],
  topCities: [],
  activeHours: []
}

// Comparison data - Empty for new user
export const comparisonData = {
  videos: [],
  metrics: []
}

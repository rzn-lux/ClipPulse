import type { YoutubeVideo } from './account-store'
import type { ConceptBrief } from './mock-data'

// Pick the top N videos by views to surface the best-performing topics
function topVideos(videos: YoutubeVideo[], n = 10) {
  return [...videos].sort((a, b) => b.views - a.views).slice(0, n)
}

// Strip common filler words to get meaningful topic keywords
function extractKeywords(titles: string[]): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'was', 'are', 'be', 'been', 'i',
    'my', 'you', 'your', 'this', 'that', 'it', 'how', 'why', 'what',
    'vs', 'vs.', 'ft', 'ft.', '|', '-', ':', '!', '?', 'part', 'ep',
    'episode', 'video', 'watch', 'full', 'new', 'official', 'short', '#shorts'
  ])
  const words: string[] = []
  for (const title of titles) {
    for (const raw of title.toLowerCase().split(/[\s\-|:#!?]+/)) {
      const word = raw.replace(/[^a-z0-9]/g, '')
      if (word.length > 3 && !stopWords.has(word) && !words.includes(word)) {
        words.push(word)
      }
    }
  }
  return words.slice(0, 20)
}

// Format a duration in seconds to "Mm Ss" label
function fmtDuration(secs: number): string {
  if (secs <= 60) return `${secs}s`
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

// Build 6 coaching concepts derived from the user's actual video performance data
export function buildNicheConcepts(videos: YoutubeVideo[], niche: string): ConceptBrief[] {
  if (videos.length === 0) return []

  const top = topVideos(videos, 10)
  const allKeywords = extractKeywords(top.map(v => v.title))
  const topKeyword = allKeywords[0] ?? niche
  const secondKeyword = allKeywords[1] ?? allKeywords[0] ?? niche

  const avgViews = Math.round(top.reduce((s, v) => s + v.views, 0) / top.length)
  const avgLikes = Math.round(top.reduce((s, v) => s + v.likes, 0) / top.length)

  const topShort = top.find(v => v.isShort)
  const topLong = top.find(v => !v.isShort)
  const bestFormat = topShort && topLong
    ? (topShort.views > topLong.views ? 'Short' : 'Long-form')
    : (topShort ? 'Short' : 'Long-form')

  // Concept 1 — Rebuild your best topic with a stronger hook
  const concept1: ConceptBrief = {
    id: 'niche-1',
    title: `Your Best Topic, Stronger Hook`,
    description: `Your top videos are about "${topKeyword}". This concept takes that same topic and opens with a stronger pattern-interrupt hook to pull in new viewers who scroll past.`,
    hook: `Everyone gets this wrong about ${topKeyword}...`,
    confidence: Math.min(95, 70 + Math.round(avgViews / 10000)),
    predictedViewsMin: Math.round(avgViews * 1.2),
    predictedViewsMax: Math.round(avgViews * 4),
    reasoningChips: ['Your proven topic', 'Stronger hook', 'Same audience'],
    hookScript: `Open facing camera. No music for the first 2 seconds. Say "Everyone gets this wrong about ${topKeyword}..." then immediately cut to your key point.`,
    visualDirection: `Match the visual style of your best-performing video on ${topKeyword}. Same environment, same energy — only the opening changes.`,
    beats: [
      { timecode: '0:00-0:03', description: 'Pattern-interrupt hook', onScreenText: `EVERYONE GETS THIS WRONG`, brollNotes: 'Direct to camera', pacingTip: 'No music, no intro — straight into the hook' },
      { timecode: '0:03-0:15', description: 'Establish the common mistake', onScreenText: `The mistake:`, brollNotes: 'Show or demonstrate', pacingTip: 'Quick cuts, keep moving' },
      { timecode: '0:15-0:35', description: 'Your take / correct approach', onScreenText: `Here is what actually works:`, brollNotes: 'Demo or explanation', pacingTip: 'This is the value — give it room' },
      { timecode: '0:35-0:42', description: 'Result or proof', onScreenText: `The result:`, brollNotes: 'Before/after or proof', pacingTip: 'Show not tell' },
      { timecode: '0:42-0:45', description: 'CTA', onScreenText: `Follow for more`, brollNotes: 'Face to camera', pacingTip: 'One CTA only' },
    ],
    recommendedLength: { min: 40, max: 55, reason: `Based on your average top-performing video length` },
    captions: [
      `Everyone gets ${topKeyword} wrong (here is the fix)`,
      `The ${topKeyword} mistake nobody talks about`,
      `Stop doing this with ${topKeyword}`,
    ],
    hashtags: [
      { tag: `#${topKeyword}`, trendScore: 88 },
      { tag: `#${niche}`, trendScore: 85 },
      { tag: `#${topKeyword}tips`, trendScore: 79 },
    ],
    sounds: [{ name: 'Trending in your niche', artist: 'Browse For You page', usageCount: 500000, growthPercent: 30 }],
    thumbnailIdeas: [{ layout: `Close-up face + bold "${topKeyword.toUpperCase()}" text`, expression: 'Surprised or knowing', colorPalette: 'Match your channel aesthetic', textPlacement: 'Top third — large and readable at small size' }],
    bestTimeToPost: [{ day: 'Tuesday', hour: 19, confidence: 82 }, { day: 'Friday', hour: 17, confidence: 78 }],
    ctaSuggestion: `Follow for more ${topKeyword} content`,
    whyItWillWork: [
      { insight: `"${topKeyword}" is already proven with your audience — you are not guessing on the topic` },
      { insight: `A stronger hook on a proven topic typically doubles view-through rate` },
    ],
    avoidThis: [`Changing the topic too much — the goal is the same content with a better entry`, `Long intros — the hook must hit in the first 2 seconds`],
  } as any

  // Concept 2 — Top video but as the opposite format (Short vs Long)
  const concept2: ConceptBrief = {
    id: 'niche-2',
    title: `Your Top Video as a ${bestFormat === 'Short' ? 'Long-Form' : 'Short'}`,
    description: `Your best-viewed video was a ${bestFormat}. Repurpose that exact topic in the other format to capture a different segment of your audience.`,
    hook: bestFormat === 'Short'
      ? `I made a short on ${topKeyword} — here is everything I left out.`
      : `${topKeyword} in 60 seconds — everything you actually need to know.`,
    confidence: Math.min(90, 65 + Math.round(avgLikes / 1000)),
    predictedViewsMin: Math.round(avgViews * 0.8),
    predictedViewsMax: Math.round(avgViews * 3),
    reasoningChips: ['Format flip', 'Proven topic', 'New audience reach'],
    hookScript: bestFormat === 'Short'
      ? `Start with "I made a short on ${topKeyword} and barely scratched the surface. Here is everything I actually wanted to say."`
      : `Jump straight in: "${topKeyword} in 60 seconds. Go."`,
    visualDirection: bestFormat === 'Short'
      ? 'More relaxed pacing. Can use B-roll, longer explanations, personal story elements.'
      : 'Tight crop, fast cuts. Every second counts. No fluff.',
    beats: [
      { timecode: '0:00-0:03', description: 'Format-aware hook', onScreenText: bestFormat === 'Short' ? 'THE FULL STORY' : '60 SEC VERSION', brollNotes: 'Direct to camera', pacingTip: 'Reference the other format to tease curiosity' },
      { timecode: '0:03-0:20', description: 'Core content', onScreenText: `${topKeyword}`, brollNotes: 'Main content delivery', pacingTip: bestFormat === 'Short' ? 'You have room — use it' : 'Cut mercilessly' },
      { timecode: '0:20-0:25', description: 'Payoff', onScreenText: 'The key takeaway', brollNotes: 'Memorable moment', pacingTip: 'Make it quotable' },
    ],
    recommendedLength: bestFormat === 'Short' ? { min: 180, max: 420, reason: 'Long-form to expand on Short topic' } : { min: 45, max: 60, reason: 'Tight Short version of Long-form topic' },
    captions: [
      bestFormat === 'Short' ? `The full version of my ${topKeyword} short` : `${topKeyword} explained in 60 seconds`,
      `Everything about ${topKeyword} (${bestFormat === 'Short' ? 'full breakdown' : 'quick version'})`,
    ],
    hashtags: [
      { tag: `#${topKeyword}`, trendScore: 88 },
      { tag: bestFormat === 'Short' ? '#longform' : '#shorts', trendScore: 92 },
      { tag: `#${niche}`, trendScore: 85 },
    ],
    sounds: [{ name: 'Your channel audio style', artist: 'Match your brand', usageCount: 0, growthPercent: 0 }],
    thumbnailIdeas: [{ layout: 'Side-by-side or "full version" badge on thumbnail', expression: 'Engaged and direct', colorPalette: 'Consistent with your existing channel', textPlacement: 'Clear format indicator in corner' }],
    bestTimeToPost: [{ day: 'Thursday', hour: 18, confidence: 80 }, { day: 'Saturday', hour: 12, confidence: 76 }],
    ctaSuggestion: `Subscribe to see both formats every week`,
    whyItWillWork: [
      { insight: `Format-flipping a proven topic takes zero research risk — the topic is already validated` },
      { insight: `${bestFormat === 'Short' ? 'Long-form' : 'Shorts'} reaches a different feed and different viewer behavior` },
    ],
    avoidThis: [`Just re-uploading the same video — reframe it for the new format`, `Losing the core value in the format conversion`],
  } as any

  // Concept 3 — "What I wish I knew" based on their top topic
  const concept3: ConceptBrief = {
    id: 'niche-3',
    title: `What I Wish I Knew About ${topKeyword}`,
    description: `A personal-angle video using your most viewed topic. "Wish I knew" framing triggers strong save behavior because viewers want to revisit the lessons.`,
    hook: `If I started ${topKeyword} again from scratch, I would do these 3 things differently.`,
    confidence: 78,
    predictedViewsMin: Math.round(avgViews * 1.0),
    predictedViewsMax: Math.round(avgViews * 3.5),
    reasoningChips: ['High save rate', 'Personal angle', 'Proven topic'],
    hookScript: `Look directly into camera. Slightly more casual delivery than your usual style. "If I was starting ${topKeyword} from scratch right now, I would do these three things completely differently."`,
    visualDirection: 'Talking head style. Clean background. The authenticity is the production value here.',
    beats: [
      { timecode: '0:00-0:04', description: 'Personal regret hook', onScreenText: 'WISH I KNEW THIS EARLIER', brollNotes: 'Face only, honest expression', pacingTip: 'No flashy opener — let the honesty land' },
      { timecode: '0:04-0:16', description: 'Lesson 1', onScreenText: '#1', brollNotes: 'Can cut to relevant B-roll', pacingTip: 'Be specific — not generic advice' },
      { timecode: '0:16-0:26', description: 'Lesson 2', onScreenText: '#2', brollNotes: 'Back to face or demo', pacingTip: 'Each lesson needs a concrete example' },
      { timecode: '0:26-0:36', description: 'Lesson 3', onScreenText: '#3', brollNotes: 'Save the best for last', pacingTip: 'This is the most save-worthy moment' },
      { timecode: '0:36-0:40', description: 'Encouragement close', onScreenText: 'Save this', brollNotes: 'Warm, direct to camera', pacingTip: 'End on a helpful note, not a pitch' },
    ],
    recommendedLength: { min: 35, max: 45, reason: '3 lessons need enough time to be meaningful without dragging' },
    captions: [
      `What I wish I knew about ${topKeyword} before starting`,
      `3 things I would do differently with ${topKeyword}`,
      `Lessons I learned about ${topKeyword} the hard way`,
    ],
    hashtags: [
      { tag: `#${topKeyword}`, trendScore: 88 },
      { tag: '#lessonslearned', trendScore: 82 },
      { tag: `#${niche}tips`, trendScore: 79 },
    ],
    sounds: [{ name: 'Soft background music', artist: 'Lo-fi or ambient', usageCount: 1200000, growthPercent: 18 }],
    thumbnailIdeas: [{ layout: 'Face + "I was WRONG" or "3 LESSONS" text', expression: 'Reflective or slightly regretful', colorPalette: 'Warmer tones for personal content', textPlacement: 'Bold lesson number or key phrase' }],
    bestTimeToPost: [{ day: 'Monday', hour: 8, confidence: 84 }, { day: 'Wednesday', hour: 20, confidence: 79 }],
    ctaSuggestion: `Follow so you learn from my mistakes`,
    whyItWillWork: [
      { insight: `"Wish I knew" content gets 3x more saves than instructional content` },
      { insight: `Personal framing on a proven topic combines trust and discoverability` },
    ],
    avoidThis: [`Vague lessons like "be consistent" — viewers need specific, actionable takeaways`, `Being too self-critical — empowerment sells, pity does not`],
  } as any

  // Concept 4 — Trending angle on their second keyword
  const concept4: ConceptBrief = {
    id: 'niche-4',
    title: `The ${secondKeyword} Trend You Need to Know`,
    description: `Tap into your second most common topic "${secondKeyword}" with a trend-angle hook that positions you as the first to cover something new.`,
    hook: `Nobody in the ${niche} space is talking about this ${secondKeyword} trend yet.`,
    confidence: 74,
    predictedViewsMin: Math.round(avgViews * 0.9),
    predictedViewsMax: Math.round(avgViews * 5),
    reasoningChips: ['Trend-riding', 'First mover advantage', 'High share potential'],
    hookScript: `Slightly conspiratorial tone. Lean toward camera slightly. "Nobody is talking about what is happening with ${secondKeyword} right now. Here is what I am seeing."`,
    visualDirection: 'Energetic. Use text overlays and data if you have it. Make it feel like breaking news.',
    beats: [
      { timecode: '0:00-0:03', description: 'Exclusivity hook', onScreenText: 'NOBODY IS TALKING ABOUT THIS', brollNotes: 'Leaning forward, direct', pacingTip: 'Lower your voice slightly for intrigue' },
      { timecode: '0:03-0:14', description: 'What the trend is', onScreenText: `The ${secondKeyword} shift:`, brollNotes: 'Show data, examples, or demo', pacingTip: 'Be specific — give the viewer the thing you promised' },
      { timecode: '0:14-0:26', description: 'Why it matters to them', onScreenText: `Why this affects you:`, brollNotes: 'Return to face', pacingTip: 'Make it personal to the viewer' },
      { timecode: '0:26-0:32', description: 'What to do about it', onScreenText: `Action step:`, brollNotes: 'One clear thing', pacingTip: 'One action only — do not overwhelm' },
      { timecode: '0:32-0:36', description: 'Share CTA', onScreenText: `Share this`, brollNotes: 'Direct ask', pacingTip: 'Trend content has the highest share rate — ask for it' },
    ],
    recommendedLength: { min: 35, max: 50, reason: 'Trend breakdowns need enough context to be credible' },
    captions: [
      `The ${secondKeyword} trend changing everything right now`,
      `Nobody is talking about this ${secondKeyword} shift`,
      `What is happening with ${secondKeyword} and why it matters`,
    ],
    hashtags: [
      { tag: `#${secondKeyword}`, trendScore: 86 },
      { tag: `#${niche}trends`, trendScore: 83 },
      { tag: '#trending', trendScore: 95 },
    ],
    sounds: [{ name: 'High-energy trending audio', artist: 'Check your For You page', usageCount: 2000000, growthPercent: 55 }],
    thumbnailIdeas: [{ layout: 'Shocked face + "?!" or arrow pointing at text', expression: 'Genuinely surprised', colorPalette: 'High contrast — red or yellow accent', textPlacement: 'Large text, maximum 5 words' }],
    bestTimeToPost: [{ day: 'Wednesday', hour: 12, confidence: 86 }, { day: 'Sunday', hour: 16, confidence: 81 }],
    ctaSuggestion: `Follow — I post trends before they blow up`,
    whyItWillWork: [
      { insight: `Trend-angle hooks on familiar topics trigger the "why haven't I heard this?" response` },
      { insight: `Positioning yourself as early to a trend builds long-term authority` },
    ],
    avoidThis: [`Overstating the trend if you are not sure — credibility is your long-term asset`, `Using the same hook without actual new information behind it`],
  } as any

  // Concept 5 — Respond to a comment or question pattern from their top video
  const concept5: ConceptBrief = {
    id: 'niche-5',
    title: `Answering the Top Question About ${topKeyword}`,
    description: `Check the comments on your highest-viewed ${topKeyword} video. Pick the most-asked question and make a dedicated video answering just that. Reply-to-comment format signals community and drives return viewers.`,
    hook: `So many of you asked me this about ${topKeyword}. Here is the real answer.`,
    confidence: 76,
    predictedViewsMin: Math.round(avgViews * 0.7),
    predictedViewsMax: Math.round(avgViews * 2.5),
    reasoningChips: ['Community-driven', 'Return viewers', 'High comment engagement'],
    hookScript: `Hold your phone showing a comment (or gesture toward it). "I got this question on my ${topKeyword} video so many times I had to make a dedicated video for it."`,
    visualDirection: 'Show the actual comment on screen if possible. Then answer directly. Feels responsive and genuine.',
    beats: [
      { timecode: '0:00-0:04', description: 'Comment hook', onScreenText: 'YOU ASKED, I ANSWERED', brollNotes: 'Show phone or comment screenshot', pacingTip: 'Make the community feel seen' },
      { timecode: '0:04-0:20', description: 'The question framing', onScreenText: 'The question:', brollNotes: 'Read the question or paraphrase', pacingTip: 'Be accurate — do not strawman the question' },
      { timecode: '0:20-0:38', description: 'The full answer', onScreenText: 'Here is the answer:', brollNotes: 'Demo, explanation, or personal experience', pacingTip: 'Give more than they asked for — overdeliver' },
      { timecode: '0:38-0:43', description: 'Invite more questions', onScreenText: 'Drop your questions below', brollNotes: 'Warm, direct close', pacingTip: 'Flywheel: more questions = more content' },
    ],
    recommendedLength: { min: 40, max: 60, reason: 'Enough time to fully answer the question credibly' },
    captions: [
      `Answering the most asked ${topKeyword} question`,
      `You kept asking about ${topKeyword} — here is the real answer`,
      `The ${topKeyword} question everyone has`,
    ],
    hashtags: [
      { tag: `#${topKeyword}`, trendScore: 88 },
      { tag: '#communityqa', trendScore: 75 },
      { tag: `#${niche}`, trendScore: 85 },
    ],
    sounds: [{ name: 'Conversation-style audio', artist: 'Natural ambient', usageCount: 800000, growthPercent: 22 }],
    thumbnailIdeas: [{ layout: 'Comment screenshot + your reaction face', expression: 'Engaged and thoughtful', colorPalette: 'Match your channel', textPlacement: 'Question text prominent' }],
    bestTimeToPost: [{ day: 'Friday', hour: 18, confidence: 83 }, { day: 'Tuesday', hour: 20, confidence: 78 }],
    ctaSuggestion: `Drop your ${topKeyword} questions in the comments`,
    whyItWillWork: [
      { insight: `Community-response videos get 2x the comment rate of standard content` },
      { insight: `Viewers who feel heard subscribe at a much higher rate` },
    ],
    avoidThis: [`Picking a divisive or overly negative comment`, `Not actually answering the question fully — viewers will notice`],
  } as any

  // Concept 6 — Behind the scenes / process reveal
  const concept6: ConceptBrief = {
    id: 'niche-6',
    title: `How I Actually Make ${topKeyword} Content`,
    description: `A behind-the-scenes look at your own content creation process around ${topKeyword}. Process videos build parasocial connection and are highly saveable.`,
    hook: `Here is exactly how I research, film, and post my ${topKeyword} videos.`,
    confidence: 72,
    predictedViewsMin: Math.round(avgViews * 0.6),
    predictedViewsMax: Math.round(avgViews * 2),
    reasoningChips: ['Behind-the-scenes', 'High trust builder', 'Saveable'],
    hookScript: `Start mid-process — already at your desk, phone in hand, or at your filming spot. "Here is my actual process for making ${topKeyword} content from scratch."`,
    visualDirection: 'Authentic and slightly raw. Screen recordings, phone footage of your setup, quick cuts through your workflow.',
    beats: [
      { timecode: '0:00-0:03', description: 'Process hook', onScreenText: 'MY ACTUAL PROCESS', brollNotes: 'Your workspace or filming setup', pacingTip: 'Start mid-action not at the beginning' },
      { timecode: '0:03-0:18', description: 'Research / ideation step', onScreenText: 'Step 1: Idea', brollNotes: 'Screen recording or notebook', pacingTip: 'Show the real tools you actually use' },
      { timecode: '0:18-0:32', description: 'Creation / filming step', onScreenText: 'Step 2: Creation', brollNotes: 'Behind the camera footage', pacingTip: 'Include a mistake or honest moment' },
      { timecode: '0:32-0:44', description: 'Publishing / strategy step', onScreenText: 'Step 3: Posting', brollNotes: 'Phone or dashboard screen', pacingTip: 'Share one genuine insight most creators do not talk about' },
      { timecode: '0:44-0:48', description: 'Invite to follow the journey', onScreenText: 'Follow along', brollNotes: 'Direct to camera', pacingTip: 'Frame it as an ongoing series for retention' },
    ],
    recommendedLength: { min: 45, max: 70, reason: 'Process videos need enough depth to be genuinely useful' },
    captions: [
      `How I actually make ${topKeyword} videos (full process)`,
      `My real workflow for ${topKeyword} content`,
      `Behind the scenes of my ${topKeyword} channel`,
    ],
    hashtags: [
      { tag: '#contentcreator', trendScore: 90 },
      { tag: `#${niche}creator`, trendScore: 82 },
      { tag: '#behindthescenes', trendScore: 87 },
      { tag: `#${topKeyword}`, trendScore: 88 },
    ],
    sounds: [{ name: 'Productive lo-fi', artist: 'Study/work playlist vibes', usageCount: 3000000, growthPercent: 35 }],
    thumbnailIdeas: [{ layout: 'Split screen: camera setup + final video result', expression: 'Focused and working', colorPalette: 'Your brand colors', textPlacement: '"MY PROCESS" prominent top or bottom' }],
    bestTimeToPost: [{ day: 'Saturday', hour: 10, confidence: 80 }, { day: 'Tuesday', hour: 19, confidence: 76 }],
    ctaSuggestion: `Subscribe to follow my ${topKeyword} journey`,
    whyItWillWork: [
      { insight: `Process content turns casual viewers into loyal followers` },
      { insight: `Other creators in your niche will share and engage heavily with process breakdowns` },
    ],
    avoidThis: [`Making it look too polished — the authenticity is the whole point`, `Hiding your actual tools or process — transparency builds trust`],
  } as any

  return [concept1, concept2, concept3, concept4, concept5, concept6]
}

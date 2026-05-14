'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ConceptBrief } from '@/lib/mock-data'
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check,
  Music,
  Clock,
  MessageSquare,
  Image,
  Zap,
  AlertTriangle,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConceptCardProps {
  concept: ConceptBrief
  index: number
  expanded: boolean
  onToggle: () => void
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toString()
}

export function ConceptCard({ concept, index, expanded, onToggle }: ConceptCardProps) {
  const [copiedHashtags, setCopiedHashtags] = useState(false)
  const [checklistItems, setChecklistItems] = useState([
    { id: '1', label: 'Script the hook', completed: false },
    { id: '2', label: 'Film 3 alternate openings (A/B test ready)', completed: false },
    { id: '3', label: 'Capture vertical b-roll', completed: false },
    { id: '4', label: 'Record clean audio', completed: false },
    { id: '5', label: 'Draft caption + hashtags', completed: false },
    { id: '6', label: 'Schedule post for optimal window', completed: false }
  ])

  const copyHashtags = () => {
    const tags = concept.hashtags.map(h => h.tag).join(' ')
    navigator.clipboard.writeText(tags)
    setCopiedHashtags(true)
    setTimeout(() => setCopiedHashtags(false), 2000)
  }

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        'glass-card rounded-xl overflow-hidden transition-all duration-300',
        expanded && 'ring-2 ring-primary/50'
      )}
    >
      {/* Collapsed view */}
      <div 
        className="p-5 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink text-white">
                Concept {index + 1}
              </span>
              <span className="text-xs text-muted-foreground">
                {concept.confidence}% confidence
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-1">{concept.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {concept.description}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold gradient-text">
              {formatNumber(concept.predictedViewsMin)} - {formatNumber(concept.predictedViewsMax)}
            </p>
            <p className="text-xs text-muted-foreground">predicted views</p>
          </div>
        </div>

        {/* Reasoning chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {concept.reasoningChips.map((chip, i) => (
            <span 
              key={i}
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Expand/collapse button */}
        <div className="flex items-center justify-center mt-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="gap-2">
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Collapse brief
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View full brief
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded view */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-6 border-t border-border pt-5">
              
              {/* Hook Section */}
              <div className="glass-card rounded-lg p-4 border-l-4 border-l-gradient-pink">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gradient-pink" />
                  Hook (0-3s)
                </h4>
                <p className="text-sm italic mb-3">&quot;{concept.hookScript}&quot;</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Visual direction:</strong> {concept.visualDirection}
                </p>
              </div>

              {/* Beat-by-beat outline */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Beat-by-Beat Outline
                </h4>
                <div className="space-y-3">
                  {concept.beats.map((beat, i) => (
                    <div key={i} className="glass-card rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                          {beat.timecode}
                        </span>
                        <span className="text-sm font-medium">{beat.description}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">On-screen:</span>{' '}
                          <span>{beat.onScreenText}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">B-roll:</span>{' '}
                          <span>{beat.brollNotes}</span>
                        </div>
                      </div>
                      <p className="text-xs text-primary mt-2">
                        Tip: {beat.pacingTip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended length */}
              <div className="glass-card rounded-lg p-4">
                <h4 className="font-medium mb-2">Recommended Length</h4>
                <p className="text-2xl font-bold gradient-text">
                  {concept.recommendedLength.min}-{concept.recommendedLength.max}s
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {concept.recommendedLength.reason}
                </p>
              </div>

              {/* Caption & Hashtags */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Caption Variants
                </h4>
                <div className="space-y-2">
                  {concept.captions.map((caption, i) => (
                    <div key={i} className="glass-card rounded-lg p-3 text-sm">
                      {caption}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Hashtag Pack</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyHashtags()
                      }}
                      className="gap-2"
                    >
                      {copiedHashtags ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy all
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {concept.hashtags.map((hashtag, i) => (
                      <span 
                        key={i}
                        className="text-sm px-2 py-1 rounded-full bg-muted flex items-center gap-1"
                      >
                        {hashtag.tag}
                        <span className={cn(
                          "text-xs",
                          hashtag.trendScore >= 80 ? "text-green-400" : 
                          hashtag.trendScore >= 60 ? "text-yellow-400" : "text-muted-foreground"
                        )}>
                          {hashtag.trendScore}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sounds */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Trending Sounds
                </h4>
                <div className="space-y-2">
                  {concept.sounds.map((sound, i) => (
                    <div key={i} className="glass-card rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{sound.name}</p>
                        <p className="text-xs text-muted-foreground">{sound.artist}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{formatNumber(sound.usageCount)} uses</p>
                        <p className={cn(
                          "text-xs",
                          sound.growthPercent >= 200 ? "text-green-400" : "text-muted-foreground"
                        )}>
                          +{sound.growthPercent}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thumbnail Ideas */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Thumbnail Suggestions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {concept.thumbnailIdeas.map((idea, i) => (
                    <div key={i} className="glass-card rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">{idea.layout}</p>
                      <p className="text-xs text-muted-foreground">
                        Expression: {idea.expression}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Colors: {idea.colorPalette}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Text: {idea.textPlacement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best time to post */}
              <div className="glass-card rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Best Time to Post
                </h4>
                <div className="flex gap-4">
                  {concept.bestTimeToPost.slice(0, 3).map((time, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "flex-1 text-center p-3 rounded-lg",
                        i === 0 ? "bg-gradient-to-r from-gradient-purple/20 to-gradient-pink/20 border border-primary/30" : "bg-muted/50"
                      )}
                    >
                      <p className="text-sm font-medium">{time.day}</p>
                      <p className="text-lg font-bold">{time.hour}:00</p>
                      <p className="text-xs text-muted-foreground">{time.confidence}% optimal</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Suggestion */}
              <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-gradient-purple/10 to-gradient-pink/10">
                <h4 className="font-medium mb-2">Suggested CTA</h4>
                <p className="text-sm">{concept.ctaSuggestion}</p>
              </div>

              {/* Why it will work */}
              <div>
                <h4 className="font-medium mb-3">&quot;Why This Will Work&quot;</h4>
                <div className="space-y-2">
                  {concept.whyItWillWork.map((item, i) => (
                    <div key={i} className="glass-card rounded-lg p-3 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm">{item.insight}</p>
                        {item.sourceVideo && (
                          <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {item.sourceVideo}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid this */}
              <div className="glass-card rounded-lg p-4 border-l-4 border-l-red-500 bg-red-500/5">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  Avoid This
                </h4>
                <div className="space-y-2">
                  {concept.avoidThis.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">• {item}</p>
                  ))}
                </div>
              </div>

              {/* Pre-production checklist */}
              <div>
                <h4 className="font-medium mb-3">Pre-Production Checklist</h4>
                <div className="space-y-2">
                  {checklistItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="w-4 h-4 rounded border-2 border-muted-foreground checked:bg-primary checked:border-primary"
                      />
                      <span className={cn(
                        "text-sm",
                        item.completed && "line-through text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Export buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm">Export to Notion</Button>
                <Button variant="outline" size="sm">Export to Google Docs</Button>
                <Button variant="outline" size="sm">Export to CapCut</Button>
                <Button variant="outline" size="sm">Download PDF</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

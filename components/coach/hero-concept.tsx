'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { RefreshCw, Calendar, Sparkles } from 'lucide-react'
import type { ConceptBrief } from '@/lib/mock-data'

interface HeroConceptProps {
  concept: ConceptBrief
  onRegenerate: () => void
  hideRegenerateButton?: boolean
}

export function HeroConcept({ concept, onRegenerate, hideRegenerateButton }: HeroConceptProps) {
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      onRegenerate()
      setIsRegenerating(false)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gradient-purple/30 via-gradient-pink/20 to-gradient-orange/30" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      {/* Content */}
      <div className="relative p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gradient-pink" />
              <span className="text-sm font-medium text-gradient-pink">AI-Generated Concept</span>
            </div>
            
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
              Your next video should be about...
            </h2>
            
            <h1 className="text-3xl font-bold mb-4 text-balance">
              {concept.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              &quot;{concept.hook}&quot;
            </p>

            <div className="flex items-center gap-4">
              {!hideRegenerateButton && (
                <Button 
                  onClick={handleRegenerate}
                  variant="outline"
                  className="gap-2"
                  disabled={isRegenerating}
                >
                  <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                  {isRegenerating ? 'Regenerating...' : 'Regenerate Ideas'}
                </Button>
              )}
              <Button className="gap-2 bg-gradient-to-r from-gradient-purple to-gradient-pink hover:opacity-90">
                <Calendar className="w-4 h-4" />
                Save to Calendar
              </Button>
            </div>
          </div>

          {/* Confidence score */}
          <div className="text-center flex-shrink-0">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#confidenceGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${concept.confidence * 2.83} 283`}
                  initial={{ strokeDasharray: '0 283' }}
                  animate={{ strokeDasharray: `${concept.confidence * 2.83} 283` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {concept.confidence}%
                </motion.span>
                <span className="text-xs text-muted-foreground">confidence</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-[120px]">
              Likely to outperform your average
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

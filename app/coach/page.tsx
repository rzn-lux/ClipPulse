'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { HeroConcept } from '@/components/coach/hero-concept'
import { ConceptCard } from '@/components/coach/concept-card'
import { PerformanceSimulator } from '@/components/coach/performance-simulator'
import { allConceptBriefs, detectNiche } from '@/lib/mock-data'
import { buildNicheConcepts } from '@/lib/niche-coach'
import { useAccountStore } from '@/lib/account-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'niche' | 'other'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function CoachPage() {
  const { youtubeStats } = useAccountStore()
  const [activeTab, setActiveTab] = useState<Tab>('niche')
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)
  const [regenerateKey, setRegenerateKey] = useState(0)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const hasVideos = (youtubeStats?.videos?.length ?? 0) > 0

  // Detect niche from real YouTube video titles
  const detectedNiche = useMemo(() => {
    const titles = youtubeStats?.videos?.map(v => v.title) ?? []
    return detectNiche(titles)
  }, [youtubeStats])

  // "In Your Niche" — generated from the user's actual video titles, no mock data
  const nicheConceptPool = useMemo(() =>
    buildNicheConcepts(youtubeStats?.videos ?? [], detectedNiche),
    [youtubeStats, detectedNiche]
  )

  // "Other Niches" — cross-niche ideas from static pool, excluding the user's own niche
  const otherConceptPool = useMemo(() =>
    allConceptBriefs.filter(c => (c as any).niche && (c as any).niche !== detectedNiche),
    [detectedNiche]
  )

  const [nicheOrder, setNicheOrder] = useState(() => shuffle(nicheConceptPool))
  const [otherOrder, setOtherOrder] = useState(() => shuffle(otherConceptPool))

  const activePool = activeTab === 'niche' ? nicheOrder : otherOrder

  const nicheLabel = detectedNiche.charAt(0).toUpperCase() + detectedNiche.slice(1)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      if (activeTab === 'niche') {
        setNicheOrder(shuffle(buildNicheConcepts(youtubeStats?.videos ?? [], detectedNiche)))
      } else {
        setOtherOrder(shuffle(otherConceptPool))
      }
      setExpandedConcept(null)
      setRegenerateKey(k => k + 1)
      setIsRegenerating(false)
    }, 600)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              Next Video Coach
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink text-white">
                AI
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {hasVideos
                ? `Personalized coaching for your ${nicheLabel} channel`
                : 'Get AI-powered ideas to kickstart your content journey'
              }
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium transition-all',
              'hover:border-primary/50 hover:bg-muted/30',
              isRegenerating && 'opacity-50 cursor-not-allowed'
            )}
          >
            <RefreshCw className={cn('w-4 h-4', isRegenerating && 'animate-spin')} />
            Regenerate All
          </button>
        </div>

        {/* No account connected */}
        {!hasVideos && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 bg-gradient-to-br from-gradient-purple/10 to-gradient-pink/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gradient-purple to-gradient-pink flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connect YouTube to unlock personalized coaching</h3>
                <p className="text-sm text-muted-foreground">
                  Once connected, the &quot;In Your Niche&quot; tab will generate coaching ideas built directly from your actual video topics and titles — no guesswork.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Niche detection banner for connected users */}
        {hasVideos && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gradient-purple to-gradient-pink flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Detected niche: <span className="font-semibold bg-gradient-to-r from-gradient-purple to-gradient-pink bg-clip-text text-transparent">{nicheLabel}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Based on your {youtubeStats!.videos.length} most recent video titles
              </p>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/40 rounded-xl w-fit">
          <button
            onClick={() => { setActiveTab('niche'); setExpandedConcept(null) }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === 'niche'
                ? 'bg-gradient-to-r from-gradient-purple to-gradient-pink text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            In Your Niche
          </button>
          <button
            onClick={() => { setActiveTab('other'); setExpandedConcept(null) }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === 'other'
                ? 'bg-gradient-to-r from-gradient-purple to-gradient-pink text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Other Niches
          </button>
        </div>

        {/* Entire column animates out/in on regenerate or tab switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${regenerateKey}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {activePool.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <p className="text-muted-foreground text-sm">
                  {activeTab === 'niche'
                    ? 'Connect your YouTube account to get coaching ideas built from your own videos.'
                    : 'No cross-niche ideas available yet.'
                  }
                </p>
              </div>
            ) : (
              <>
                {activePool[0] && (
                  <HeroConcept
                    concept={activePool[0]}
                    onRegenerate={handleRegenerate}
                    hideRegenerateButton
                  />
                )}

                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    {activeTab === 'niche' ? `More ${nicheLabel} Ideas` : 'Ideas From Other Niches'}
                  </h2>
                  <div className="space-y-4">
                    {activePool.map((concept, index) => (
                      <ConceptCard
                        key={concept.id}
                        concept={concept}
                        index={index}
                        expanded={expandedConcept === concept.id}
                        onToggle={() => setExpandedConcept(
                          expandedConcept === concept.id ? null : concept.id
                        )}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <PerformanceSimulator />
      </div>
    </DashboardLayout>
  )
}

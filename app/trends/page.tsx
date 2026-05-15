'use client'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccountStore } from '@/lib/account-store'
import { TrendingUp, Music, Hash, Flame, ArrowUp, Info, Sparkles, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toString()
}

// Extract keywords from video titles
function extractKeywords(titles: string[]): { keyword: string; count: number; avgViews: number }[] {
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'just', 'don', 'now', 'i', 'my', 'me', 'you', 'your', 'we', 'our', 'it', 'its', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'and', 'but', 'if', 'or', 'because', 'until', 'while', 'about', 'against', 'amp', 'shorts', 'short', 'video'])
  const wordMap = new Map<string, { count: number; totalViews: number }>()
  
  titles.forEach((title, idx) => {
    const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/)
    words.forEach(word => {
      if (word.length > 2 && !stopWords.has(word)) {
        const existing = wordMap.get(word) || { count: 0, totalViews: 0 }
        wordMap.set(word, { count: existing.count + 1, totalViews: existing.totalViews + 1 })
      }
    })
  })

  return Array.from(wordMap.entries())
    .map(([keyword, data]) => ({ keyword, count: data.count, avgViews: Math.round(data.totalViews / data.count) }))
    .filter(k => k.count >= 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

// Analyze video performance patterns
function analyzePerformance(videos: { title: string; views: number; likes: number; isShort: boolean }[]) {
  if (videos.length === 0) return null
  
  const shorts = videos.filter(v => v.isShort)
  const longForm = videos.filter(v => !v.isShort)
  
  const avgShortsViews = shorts.length > 0 ? shorts.reduce((a, b) => a + b.views, 0) / shorts.length : 0
  const avgLongViews = longForm.length > 0 ? longForm.reduce((a, b) => a + b.views, 0) / longForm.length : 0
  
  const topVideo = [...videos].sort((a, b) => b.views - a.views)[0]
  const avgEngagement = videos.reduce((a, b) => a + (b.likes / Math.max(b.views, 1)), 0) / videos.length * 100
  
  return {
    shortsCount: shorts.length,
    longFormCount: longForm.length,
    avgShortsViews: Math.round(avgShortsViews),
    avgLongViews: Math.round(avgLongViews),
    topVideoTitle: topVideo?.title ?? '',
    avgEngagementRate: avgEngagement.toFixed(1),
    betterFormat: avgShortsViews > avgLongViews ? 'Shorts' : 'Long-form',
  }
}

export default function TrendsPage() {
  const { youtubeStats, connectedAccounts } = useAccountStore()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => { setMounted(true) }, [])
  
  const hasVideos = mounted && (youtubeStats?.videos?.length ?? 0) > 0
  const isConnected = mounted && connectedAccounts.length > 0

  const topicTrends = useMemo(() => {
    if (!youtubeStats?.videos) return []
    const titles = youtubeStats.videos.map(v => v.title)
    return extractKeywords(titles)
  }, [youtubeStats])

  const performanceInsights = useMemo(() => {
    if (!youtubeStats?.videos) return null
    return analyzePerformance(youtubeStats.videos.map(v => ({
      title: v.title,
      views: v.views,
      likes: v.likes,
      isShort: v.isShort
    })))
  }, [youtubeStats])

  const topPerformingVideos = useMemo(() => {
    if (!youtubeStats?.videos) return []
    return [...youtubeStats.videos]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  }, [youtubeStats])

  // Empty state
  if (!mounted || !isConnected) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Trends</h1>
            <p className="text-muted-foreground mt-1">Discover what works best for your channel</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-12"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gradient-purple/20 to-gradient-pink/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-10 h-10 text-gradient-purple" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Connect to see your trends</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Connect your YouTube account to analyze your video performance and discover what topics and formats work best for your audience.
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gradient-purple to-gradient-pink text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Connect YouTube
              </Link>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold">Your Trends</h1>
          <p className="text-muted-foreground mt-1">
            Insights from your {youtubeStats?.videos?.length ?? 0} most recent videos
          </p>
        </div>

        {/* Performance Overview */}
        {performanceInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6 bg-gradient-to-r from-gradient-purple/10 via-gradient-pink/10 to-gradient-orange/10 border border-primary/20"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gradient-purple" />
              Performance Summary
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Best Format</p>
                <p className="text-lg font-semibold">{performanceInsights.betterFormat}</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Avg Shorts Views</p>
                <p className="text-lg font-semibold">{formatNumber(performanceInsights.avgShortsViews)}</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Avg Long-form Views</p>
                <p className="text-lg font-semibold">{formatNumber(performanceInsights.avgLongViews)}</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Avg Engagement Rate</p>
                <p className="text-lg font-semibold">{performanceInsights.avgEngagementRate}%</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Your Top Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-gradient-pink" />
              Your Top Topics
            </h3>
            {topicTrends.length > 0 ? (
              <div className="space-y-3">
                {topicTrends.map((topic, index) => (
                  <div 
                    key={topic.keyword}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        index < 3 ? "bg-gradient-to-r from-gradient-pink to-gradient-orange text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium capitalize">{topic.keyword}</p>
                        <p className="text-xs text-muted-foreground">Used in {topic.count} video{topic.count > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not enough data to extract topics yet.</p>
            )}
          </motion.div>

          {/* Top Performing Videos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gradient-purple" />
              Your Top Performers
            </h3>
            {topPerformingVideos.length > 0 ? (
              <div className="space-y-3">
                {topPerformingVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                        index < 3 ? "bg-gradient-to-r from-gradient-purple to-gradient-pink text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{video.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {video.isShort ? 'Short' : 'Video'} - {formatNumber(video.views)} views
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-medium">{formatNumber(video.likes)}</p>
                      <p className="text-xs text-muted-foreground">likes</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No video data available yet.</p>
            )}
          </motion.div>
        </div>

        {/* AI Recommendation */}
        {performanceInsights && topicTrends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 bg-gradient-to-r from-gradient-purple/10 via-gradient-pink/10 to-gradient-orange/10 border border-primary/20"
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gradient-purple" />
              AI Recommendation
            </h3>
            <p className="text-muted-foreground">
              Based on your data, <strong className="text-foreground">{performanceInsights.betterFormat}</strong> perform 
              better for your channel. Your top topic <strong className="text-foreground capitalize">{topicTrends[0]?.keyword}</strong> appears 
              frequently in your content. Consider making more {performanceInsights.betterFormat.toLowerCase()} about 
              {topicTrends.slice(0, 3).map(t => ` "${t.keyword}"`).join(',')} to maximize engagement.
            </p>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-2 text-xs text-muted-foreground/60"
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Insights are based on your {youtubeStats?.videos?.length ?? 0} most recent videos. 
            More videos = more accurate trends. Data refreshes when you reconnect your account.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

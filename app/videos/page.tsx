'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { VideoDetailDrawer } from '@/components/dashboard/video-detail-drawer'
import { type Video, type Platform } from '@/lib/mock-data'
import { useAccountStore } from '@/lib/account-store'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Eye, Heart, MessageCircle, Share2, Video as VideoIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

type Tab = 'all' | 'shorts' | 'videos'

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [tab, setTab] = useState<Tab>('all')
  const [sortBy, setSortBy] = useState<'views' | 'date'>('views')
  const [mounted, setMounted] = useState(false)
  const { youtubeStats } = useAccountStore()

  useEffect(() => { setMounted(true) }, [])

  const realVideos = (youtubeStats?.videos ?? []).map(v => ({
    id: v.id,
    title: v.title,
    platform: 'youtube' as Platform,
    views: v.views,
    likes: v.likes,
    comments: v.comments,
    shares: 0,
    thumbnail: v.thumbnail,
    isShort: v.isShort,
    durationSeconds: v.durationSeconds,
    publishedAt: v.publishedAt,
    avgRetention: 0,
    duration: v.durationSeconds,
    trendScore: 0,
    beats: [],
    aiInsights: { hooks: [], improvements: [], trending: [] },
    platformBreakdown: {},
  } as any))

  const filteredVideos = realVideos
    .filter(v => {
      if (tab === 'shorts') return v.isShort
      if (tab === 'videos') return !v.isShort
      return true
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'views') return b.views - a.views
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

  const shortsCount = realVideos.filter((v: any) => v.isShort).length
  const videosCount = realVideos.filter((v: any) => !v.isShort).length

  if (!mounted || realVideos.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Videos</h1>
            <p className="text-muted-foreground mt-1">All your videos across platforms</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-12"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gradient-purple/20 to-gradient-pink/20 flex items-center justify-center mb-6">
                <VideoIcon className="w-10 h-10 text-gradient-purple" />
              </div>
              <h3 className="font-semibold text-xl mb-2">No videos yet</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Connect your social accounts to import your videos, or start creating content to see your library populate here.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gradient-purple to-gradient-pink text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Connect Accounts
                </Link>
                <Link
                  href="/coach"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  Get Video Ideas
                </Link>
              </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Videos</h1>
            <p className="text-muted-foreground mt-1">
              Showing {realVideos.length} most recent
              {youtubeStats?.videoCount ? ` of ${youtubeStats.videoCount} total` : ''} videos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <button
              onClick={() => setSortBy(sortBy === 'views' ? 'date' : 'views')}
              className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              {sortBy === 'views' ? 'Most Views' : 'Latest'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-xl w-fit">
          {([
            { key: 'all', label: `All (${realVideos.length})` },
            { key: 'shorts', label: `Shorts (${shortsCount})` },
            { key: 'videos', label: `Videos (${videosCount})` },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                tab === t.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Videos table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Video</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Views</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Likes</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Comments</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Published</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video: any, index: number) => (
                  <motion.tr
                    key={video.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedVideo(video)}
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {video.thumbnail ? (
                          <div className="relative w-16 h-9 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className={cn(
                            "w-16 h-9 rounded-lg flex-shrink-0",
                            index % 4 === 0 && "bg-gradient-to-br from-gradient-purple/30 to-gradient-pink/30",
                            index % 4 === 1 && "bg-gradient-to-br from-gradient-pink/30 to-gradient-orange/30",
                            index % 4 === 2 && "bg-gradient-to-br from-tiktok/30 to-gradient-purple/30",
                            index % 4 === 3 && "bg-gradient-to-br from-youtube/30 to-gradient-orange/30"
                          )} />
                        )}
                        <span className="text-sm font-medium line-clamp-1 max-w-[220px]">
                          {video.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium text-white',
                        video.isShort ? 'bg-youtube' : 'bg-gradient-purple'
                      )}>
                        {video.isShort ? 'Short' : 'Video'}
                      </span>
                    </td>
                    <td className="p-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatNumber(video.views)}
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatNumber(video.likes)}
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatNumber(video.comments)}
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm text-muted-foreground">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <VideoDetailDrawer
        video={selectedVideo}
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </DashboardLayout>
  )
}

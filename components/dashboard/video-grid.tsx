'use client'

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type Video, type Platform } from '@/lib/mock-data'
import { useAccountStore } from '@/lib/account-store'
import { Eye, Heart, MessageCircle, Share2, Video as VideoIcon, Plus } from 'lucide-react'
import { VideoDetailDrawer } from './video-detail-drawer'
import Link from 'next/link'
import Image from 'next/image'

const platformBadges: Record<Platform, { name: string; color: string }> = {
  tiktok: { name: 'TikTok', color: 'bg-tiktok' },
  instagram: { name: 'Reels', color: 'bg-instagram' },
  youtube: { name: 'Shorts', color: 'bg-youtube' },
  twitter: { name: 'X', color: 'bg-twitter' },
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

interface VideoCardProps {
  video: Video
  index: number
  onClick: () => void
}

function VideoCard({ video, index, onClick }: VideoCardProps) {
  const platform = platformBadges[video.platform]
  const badgeLabel = video.platform === 'youtube'
    ? ((video as any).isShort ? 'Short' : 'Video')
    : platform.name

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted mb-3">
        {/* Real thumbnail or gradient fallback */}
        {(video as any).thumbnail ? (
          <Image
            src={(video as any).thumbnail}
            alt={video.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className={cn(
            "absolute inset-0",
            index % 4 === 0 && "bg-gradient-to-br from-gradient-purple/30 to-gradient-pink/30",
            index % 4 === 1 && "bg-gradient-to-br from-gradient-pink/30 to-gradient-orange/30",
            index % 4 === 2 && "bg-gradient-to-br from-tiktok/30 to-gradient-purple/30",
            index % 4 === 3 && "bg-gradient-to-br from-youtube/30 to-gradient-orange/30"
          )} />
        )}

        {/* Platform badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium text-white",
            platform.color
          )}>
            {badgeLabel}
          </span>
        </div>

        {/* Stats overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="flex items-center gap-1.5 text-white">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(video.views)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(video.likes)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(video.comments)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(video.shares)}</span>
            </div>
          </div>
        </div>


      </div>

      <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
        {video.title}
      </h4>
      <p className="text-xs text-muted-foreground mt-1">
        {formatNumber(video.views)} views • {video.publishedAt}
      </p>
    </motion.div>
  )
}

export function VideoGrid() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const { youtubeStats } = useAccountStore()

  // Use real YouTube videos from store, sorted by views
  const topVideos = youtubeStats?.videos
    ? [...youtubeStats.videos]
        .sort((a, b) => b.views - a.views)
        .slice(0, 8)
        .map(v => ({
          id: v.id,
          title: v.title,
          platform: 'youtube' as Platform,
          views: v.views,
          likes: v.likes,
          comments: v.comments,
          shares: 0,
          thumbnail: v.thumbnail,
          isShort: v.isShort,
          publishedAt: new Date(v.publishedAt).toLocaleDateString(),
          avgRetention: 0,
          duration: v.durationSeconds,
          trendScore: 0,
          beats: [],
          aiInsights: { hooks: [], improvements: [], trending: [] },
          platformBreakdown: {},
        } as Video & { thumbnail: string; isShort: boolean }))
    : []

  // Empty state for new users
  if (topVideos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass-card rounded-xl p-8"
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gradient-purple/20 to-gradient-pink/20 flex items-center justify-center mb-4">
            <VideoIcon className="w-8 h-8 text-gradient-purple" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No videos yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Connect your social accounts and start posting videos to see your performance analytics here.
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
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Top Performing Videos</h3>
          <button className="text-sm text-primary hover:underline">
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {topVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>
      </motion.div>

      <VideoDetailDrawer
        video={selectedVideo}
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  )
}

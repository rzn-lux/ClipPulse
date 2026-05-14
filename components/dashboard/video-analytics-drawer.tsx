'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { YoutubeVideo, YoutubeStats } from '@/lib/account-store'
import {
  X,
  Eye,
  Heart,
  MessageCircle,
  Activity,
  Calendar,
  Clock,
  ExternalLink,
  TrendingUp,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface VideoAnalyticsDrawerProps {
  video: YoutubeVideo | null
  stats: YoutubeStats | null
  open: boolean
  onClose: () => void
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return Math.round(num).toString()
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime()
  return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

export function VideoAnalyticsDrawer({ video, stats, open, onClose }: VideoAnalyticsDrawerProps) {
  if (!video) return null

  const views = video.views
  const likes = video.likes
  const comments = video.comments
  const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0
  const likeRate = views > 0 ? (likes / views) * 100 : 0
  const commentRate = views > 0 ? (comments / views) * 100 : 0
  const days = daysSince(video.publishedAt)
  const viewsPerDay = views / days

  const channelVideos = stats?.videos ?? []
  const channelAvgViews =
    channelVideos.length > 0
      ? channelVideos.reduce((sum, v) => sum + v.views, 0) / channelVideos.length
      : 0
  const channelAvgLikes =
    channelVideos.length > 0
      ? channelVideos.reduce((sum, v) => sum + v.likes, 0) / channelVideos.length
      : 0
  const channelAvgComments =
    channelVideos.length > 0
      ? channelVideos.reduce((sum, v) => sum + v.comments, 0) / channelVideos.length
      : 0

  const comparisonData = [
    { name: 'Views', 'This Video': views, 'Channel Avg': Math.round(channelAvgViews) },
    { name: 'Likes', 'This Video': likes, 'Channel Avg': Math.round(channelAvgLikes) },
    { name: 'Comments', 'This Video': comments, 'Channel Avg': Math.round(channelAvgComments) },
  ]

  const viewsVsAvg = channelAvgViews > 0 ? ((views - channelAvgViews) / channelAvgViews) * 100 : 0

  const youtubeUrl = video.isShort
    ? `https://www.youtube.com/shorts/${video.id}`
    : `https://www.youtube.com/watch?v=${video.id}`

  const metrics = [
    { label: 'Views', value: formatNumber(views), icon: Eye },
    { label: 'Likes', value: formatNumber(likes), icon: Heart },
    { label: 'Comments', value: formatNumber(comments), icon: MessageCircle },
    { label: 'Engagement', value: `${engagementRate.toFixed(2)}%`, icon: Activity },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
              <div className="flex items-start justify-between p-6 gap-4">
                <div className="flex gap-4 min-w-0 flex-1">
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {video.thumbnail && (
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-lg line-clamp-2">{video.title}</h2>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(video.durationSeconds)}
                      </span>
                      <span
                        className={
                          video.isShort
                            ? 'px-2 py-0.5 rounded-full text-xs font-medium text-white bg-youtube'
                            : 'px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-purple'
                        }
                      >
                        {video.isShort ? 'Short' : 'Video'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Open on YouTube */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-youtube text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Open on YouTube
              </a>

              {/* Key metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {metrics.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-xl font-bold">{value}</div>
                  </div>
                ))}
              </div>

              {/* Engagement breakdown */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Engagement Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Like rate</span>
                      <span className="text-sm font-medium">{likeRate.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(likeRate * 10, 100)}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-gradient-pink to-gradient-purple"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Comment rate</span>
                      <span className="text-sm font-medium">{commentRate.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(commentRate * 50, 100)}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-gradient-orange to-gradient-pink"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Avg views / day</span>
                      <span className="text-sm font-medium">{formatNumber(viewsPerDay)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Live for {days} day{days === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
              </div>

              {/* This vs channel average */}
              {channelVideos.length > 1 && (
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">This Video vs Channel Average</h3>
                    {channelAvgViews > 0 && (
                      <span
                        className={
                          'flex items-center gap-1 text-xs font-medium ' +
                          (viewsVsAvg >= 0 ? 'text-green-400' : 'text-red-400')
                        }
                      >
                        <TrendingUp className={'w-3 h-3 ' + (viewsVsAvg < 0 ? 'rotate-180' : '')} />
                        {viewsVsAvg >= 0 ? '+' : ''}
                        {viewsVsAvg.toFixed(0)}% views
                      </span>
                    )}
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData}>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => formatNumber(v)}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(20,20,25,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(value: number) => formatNumber(value)}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="This Video" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Channel Avg" fill="#f97316" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-3">Details</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Video ID</dt>
                    <dd className="font-mono text-xs truncate">{video.id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Channel</dt>
                    <dd className="truncate">{stats?.channelName ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Published</dt>
                    <dd>{new Date(video.publishedAt).toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Duration</dt>
                    <dd>{formatDuration(video.durationSeconds)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

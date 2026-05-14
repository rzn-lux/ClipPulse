'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useAccountStore, type ConnectedAccount, type YoutubeStats, type YoutubeVideo } from '@/lib/account-store'
import { motion } from 'framer-motion'
import { Users, Eye, Video as VideoIcon, Heart, MessageCircle, BarChart3, GitCompare, Plus, ChevronDown, Activity, Film } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

interface ChannelMetrics {
  subscribers: number
  totalViews: number
  videoCount: number
  totalLikes: number
  totalComments: number
  avgViewsPerVideo: number
}

function metricsFor(account: ConnectedAccount, stats: YoutubeStats | undefined): ChannelMetrics {
  const subscribers = stats?.subscribers ?? account.followers ?? 0
  const totalViews = stats?.totalViews ?? account.totalViews ?? 0
  const videoCount = stats?.videoCount ?? account.videoCount ?? 0
  const totalLikes = stats?.videos?.reduce((sum, v) => sum + v.likes, 0) ?? 0
  const totalComments = stats?.videos?.reduce((sum, v) => sum + v.comments, 0) ?? 0
  const avgViewsPerVideo = videoCount > 0 ? Math.round(totalViews / videoCount) : 0
  return { subscribers, totalViews, videoCount, totalLikes, totalComments, avgViewsPerVideo }
}

export default function ComparePage() {
  const { connectedAccounts, youtubeStatsByChannel } = useAccountStore()
  const [mounted, setMounted] = useState(false)
  const [channelAId, setChannelAId] = useState<string | null>(null)
  const [channelBId, setChannelBId] = useState<string | null>(null)
  const [videoAId, setVideoAId] = useState<string | null>(null)
  const [videoBId, setVideoBId] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Default-select the first two channels once the store has hydrated.
  useEffect(() => {
    if (!mounted) return
    if (connectedAccounts.length < 2) return
    if (channelAId && channelBId) return
    const defaultA = connectedAccounts[0]?.channelId ?? null
    const defaultB = connectedAccounts.find(a => a.channelId !== defaultA)?.channelId ?? null
    if (!channelAId) setChannelAId(defaultA)
    if (!channelBId) setChannelBId(defaultB)
  }, [mounted, connectedAccounts, channelAId, channelBId])

  // Reset video selection when its channel changes, then default to first video of the channel.
  useEffect(() => {
    if (!channelAId) return
    const videos = youtubeStatsByChannel[channelAId]?.videos ?? []
    if (!videos.some(v => v.id === videoAId)) {
      setVideoAId(videos[0]?.id ?? null)
    }
  }, [channelAId, youtubeStatsByChannel, videoAId])

  useEffect(() => {
    if (!channelBId) return
    const videos = youtubeStatsByChannel[channelBId]?.videos ?? []
    if (!videos.some(v => v.id === videoBId)) {
      setVideoBId(videos[0]?.id ?? null)
    }
  }, [channelBId, youtubeStatsByChannel, videoBId])

  // Empty state — fewer than 2 connected channels
  if (mounted && connectedAccounts.length < 2) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Compare</h1>
            <p className="text-muted-foreground mt-1">
              Compare performance between channels
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-12"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gradient-purple/20 to-gradient-pink/20 flex items-center justify-center mb-6">
                <GitCompare className="w-10 h-10 text-gradient-purple" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Connect at least 2 channels to compare</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Link a second YouTube channel and you&apos;ll be able to compare subscribers, views, and engagement side by side.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gradient-purple to-gradient-pink text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Connect Channel
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Compare</h1>
            <p className="text-muted-foreground mt-1">Compare performance between channels</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const channelA = connectedAccounts.find(a => a.channelId === channelAId) ?? connectedAccounts[0]
  const channelB =
    connectedAccounts.find(a => a.channelId === channelBId && a.channelId !== channelA?.channelId)
    ?? connectedAccounts.find(a => a.channelId !== channelA?.channelId)
    ?? connectedAccounts[1]

  if (!channelA || !channelB) return null

  const statsA = youtubeStatsByChannel[channelA.channelId]
  const statsB = youtubeStatsByChannel[channelB.channelId]
  const metricsA = metricsFor(channelA, statsA)
  const metricsB = metricsFor(channelB, statsB)

  const compareStats: { label: string; key: keyof ChannelMetrics; icon: typeof Users }[] = [
    { label: 'Subscribers', key: 'subscribers', icon: Users },
    { label: 'Total Views', key: 'totalViews', icon: Eye },
    { label: 'Videos', key: 'videoCount', icon: VideoIcon },
    { label: 'Avg Views/Video', key: 'avgViewsPerVideo', icon: BarChart3 },
    { label: 'Total Likes', key: 'totalLikes', icon: Heart },
    { label: 'Total Comments', key: 'totalComments', icon: MessageCircle },
  ]

  const radarData = compareStats.map(({ label, key }) => {
    const a = metricsA[key]
    const b = metricsB[key]
    const max = Math.max(a, b, 1)
    return { metric: label, a: (a / max) * 100, b: (b / max) * 100 }
  })

  const renderChannelSelector = (
    label: string,
    selectedId: string,
    onChange: (id: string) => void,
    excludeId: string | undefined,
    motionInitialX: number,
  ) => {
    const selected = connectedAccounts.find(a => a.channelId === selectedId)
    return (
      <motion.div
        initial={{ opacity: 0, x: motionInitialX }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-xl p-4"
      >
        <label className="text-sm text-muted-foreground mb-2 block">{label}</label>
        <div className="relative">
          <div className="flex items-center gap-3 pl-3 pr-9 py-2 rounded-lg bg-muted border border-border">
            {selected && (
              <Image
                src={selected.avatar}
                alt={selected.channelName}
                width={28}
                height={28}
                className="rounded-full flex-shrink-0"
              />
            )}
            <span className="text-sm font-medium truncate flex-1">
              {selected?.channelName ?? 'Select a channel'}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedId}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label={label}
            >
              {connectedAccounts.map((account) => (
                <option
                  key={account.channelId}
                  value={account.channelId}
                  disabled={account.channelId === excludeId}
                >
                  {account.channelName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    )
  }

  const videosA = statsA?.videos ?? []
  const videosB = statsB?.videos ?? []
  const videoA = videosA.find(v => v.id === videoAId) ?? videosA[0] ?? null
  const videoB = videosB.find(v => v.id === videoBId) ?? videosB[0] ?? null

  interface VideoMetrics {
    views: number
    likes: number
    comments: number
    engagementRate: number
    durationSeconds: number
  }
  const videoMetricsFor = (v: YoutubeVideo | null): VideoMetrics => ({
    views: v?.views ?? 0,
    likes: v?.likes ?? 0,
    comments: v?.comments ?? 0,
    engagementRate: v && v.views > 0 ? ((v.likes + v.comments) / v.views) * 100 : 0,
    durationSeconds: v?.durationSeconds ?? 0,
  })
  const vMetricsA = videoMetricsFor(videoA)
  const vMetricsB = videoMetricsFor(videoB)

  const videoCompareStats: {
    label: string
    key: keyof VideoMetrics
    icon: typeof Users
    format: (n: number) => string
  }[] = [
    { label: 'Views', key: 'views', icon: Eye, format: formatNumber },
    { label: 'Likes', key: 'likes', icon: Heart, format: formatNumber },
    { label: 'Comments', key: 'comments', icon: MessageCircle, format: formatNumber },
    { label: 'Engagement', key: 'engagementRate', icon: Activity, format: (n) => `${n.toFixed(2)}%` },
    {
      label: 'Duration',
      key: 'durationSeconds',
      icon: Film,
      format: (n) => {
        const m = Math.floor(n / 60)
        const s = Math.floor(n % 60)
        return `${m}:${s.toString().padStart(2, '0')}`
      },
    },
  ]

  const renderVideoSelector = (
    channel: ConnectedAccount,
    videos: YoutubeVideo[],
    selectedId: string,
    onChange: (id: string) => void,
    motionInitialX: number,
  ) => {
    const selected = videos.find(v => v.id === selectedId)
    return (
      <motion.div
        initial={{ opacity: 0, x: motionInitialX }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-xl p-4 space-y-3"
      >
        <div className="flex items-center gap-2">
          <Image
            src={channel.avatar}
            alt={channel.channelName}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-xs text-muted-foreground truncate">{channel.channelName}</span>
        </div>
        {videos.length === 0 ? (
          <div className="rounded-lg bg-muted/50 border border-dashed border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">
              No videos synced yet for this channel.
            </p>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="flex items-center gap-2 pl-3 pr-9 py-2 rounded-lg bg-muted border border-border">
                <span className="text-sm truncate flex-1">
                  {selected?.title ?? 'Select a video'}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedId}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label={`Video from ${channel.channelName}`}
                >
                  {videos.map((v) => (
                    <option key={v.id} value={v.id}>{v.title}</option>
                  ))}
                </select>
              </div>
            </div>
            {selected && (
              <div className="flex gap-3">
                <div className="relative w-32 aspect-video rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={selected.thumbnail}
                    alt={selected.title}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{selected.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selected.publishedAt).toLocaleDateString()} · {selected.isShort ? 'Short' : 'Video'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    )
  }

  const winsForA = compareStats.filter(s => metricsA[s.key] > metricsB[s.key]).length
  const winsForB = compareStats.filter(s => metricsB[s.key] > metricsA[s.key]).length
  const leader = winsForA === winsForB ? null : winsForA > winsForB ? channelA : channelB
  const trailing = leader === channelA ? channelB : leader === channelB ? channelA : null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold">Compare</h1>
          <p className="text-muted-foreground mt-1">
            Compare performance between channels
          </p>
        </div>

        {/* Channel selectors */}
        <div className="grid lg:grid-cols-2 gap-6">
          {renderChannelSelector('Channel A', channelA.channelId, setChannelAId, channelB.channelId, -20)}
          {renderChannelSelector('Channel B', channelB.channelId, setChannelBId, channelA.channelId, 20)}
        </div>

        {/* Comparison stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="space-y-4">
            {compareStats.map((stat) => {
              const aValue = metricsA[stat.key]
              const bValue = metricsB[stat.key]
              const maxValue = Math.max(aValue, bValue, 1)
              const Icon = stat.icon

              return (
                <div key={stat.key} className="grid grid-cols-[1fr_120px_1fr] gap-4 items-center">
                  {/* Channel A bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden flex justify-end">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(aValue / maxValue) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-gradient-pink to-gradient-purple rounded-lg flex items-center justify-end px-3"
                      >
                        <span className="text-xs font-medium text-white">
                          {formatNumber(aValue)}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center flex flex-col items-center">
                    <Icon className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>

                  {/* Channel B bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(bValue / maxValue) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-gradient-orange to-gradient-pink rounded-lg flex items-center px-3"
                      >
                        <span className="text-xs font-medium text-white">
                          {formatNumber(bValue)}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Radar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4">Performance Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                />
                <Radar
                  name={channelA.channelName}
                  dataKey="a"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name={channelB.channelName}
                  dataKey="b"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-purple" />
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">{channelA.channelName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-orange" />
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">{channelB.channelName}</span>
            </div>
          </div>
        </motion.div>

        {/* Video comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-xl font-bold">Compare Videos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pick a video from each channel to compare them head-to-head.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {renderVideoSelector(channelA, videosA, videoAId ?? '', setVideoAId, -20)}
            {renderVideoSelector(channelB, videosB, videoBId ?? '', setVideoBId, 20)}
          </div>

          {videoA && videoB ? (
            <div className="glass-card rounded-xl p-6">
              <div className="space-y-4">
                {videoCompareStats.map((stat) => {
                  const aValue = vMetricsA[stat.key]
                  const bValue = vMetricsB[stat.key]
                  const maxValue = Math.max(aValue, bValue, 0.0001)
                  const Icon = stat.icon

                  return (
                    <div key={stat.key} className="grid grid-cols-[1fr_120px_1fr] gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden flex justify-end">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(aValue / maxValue) * 100}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-gradient-pink to-gradient-purple rounded-lg flex items-center justify-end px-3"
                          >
                            <span className="text-xs font-medium text-white">
                              {stat.format(aValue)}
                            </span>
                          </motion.div>
                        </div>
                      </div>

                      <div className="text-center flex flex-col items-center">
                        <Icon className="w-4 h-4 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(bValue / maxValue) * 100}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-gradient-orange to-gradient-pink rounded-lg flex items-center px-3"
                          >
                            <span className="text-xs font-medium text-white">
                              {stat.format(bValue)}
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 text-center text-sm text-muted-foreground">
              Select a video from each channel above to see a side-by-side comparison.
            </div>
          )}
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 border-l-4 border-l-primary"
        >
          <h3 className="font-semibold mb-3">Comparison Insights</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {leader && trailing ? (
              <p>
                • <strong className="text-foreground">{leader.channelName}</strong> leads in{' '}
                {leader === channelA ? winsForA : winsForB} of {compareStats.length} metrics versus{' '}
                <strong className="text-foreground">{trailing.channelName}</strong>.
              </p>
            ) : (
              <p>• Both channels are evenly matched across the tracked metrics.</p>
            )}
            <p>
              • <strong className="text-foreground">{channelA.channelName}</strong> averages{' '}
              <span className="text-foreground">{formatNumber(metricsA.avgViewsPerVideo)}</span> views per video;{' '}
              <strong className="text-foreground">{channelB.channelName}</strong> averages{' '}
              <span className="text-foreground">{formatNumber(metricsB.avgViewsPerVideo)}</span>.
            </p>
            {(!statsA || !statsB) && (
              <p>
                • Stats for one or both channels haven&apos;t been synced yet — open each channel from the Overview page to refresh.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

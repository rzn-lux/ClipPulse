'use client'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useAccountStore, type YoutubeVideo } from '@/lib/account-store'
import { useEffect, useMemo, useState } from 'react'
import { Users, Plus, ChevronDown, Info } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const COLORS = ['#a855f7', '#ec4899', '#f97316', '#6366f1', '#14b8a6', '#8b5cf6']

const ageBase = [
  { range: '13-17', base: 8 },
  { range: '18-24', base: 35 },
  { range: '25-34', base: 38 },
  { range: '35-44', base: 14 },
  { range: '45+', base: 5 },
]

const genderBase = [
  { name: 'Female', base: 54 },
  { name: 'Male', base: 44 },
  { name: 'Other', base: 2 },
]

const countryBase = [
  { country: 'United States', base: 45 },
  { country: 'United Kingdom', base: 14 },
  { country: 'Canada', base: 11 },
  { country: 'Australia', base: 8 },
  { country: 'Germany', base: 6 },
  { country: 'India', base: 5 },
  { country: 'Brazil', base: 4 },
  { country: 'France', base: 3 },
  { country: 'Other', base: 4 },
]

const activityBase = [
  { hour: '12am', base: 15 },
  { hour: '3am', base: 8 },
  { hour: '6am', base: 25 },
  { hour: '9am', base: 45 },
  { hour: '12pm', base: 65 },
  { hour: '3pm', base: 55 },
  { hour: '6pm', base: 85 },
  { hour: '9pm', base: 100 },
]

function hashString(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0
  }
  return h
}

function seededRandom(seed: number): () => number {
  let state = seed || 1
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0xffffffff
  }
}

function jitterAndNormalize<T extends { base: number }>(
  items: T[],
  rand: () => number,
  spread = 0.4,
): (T & { value: number })[] {
  const jittered = items.map((it) => ({
    ...it,
    raw: Math.max(0.5, it.base * (1 + (rand() - 0.5) * 2 * spread)),
  }))
  const total = jittered.reduce((s, it) => s + it.raw, 0)
  let running = 0
  const out = jittered.map((it, i) => {
    if (i === jittered.length - 1) {
      return { ...it, value: Math.max(0, Math.round((100 - running) * 10) / 10) }
    }
    const v = Math.round((it.raw / total) * 100 * 10) / 10
    running += v
    return { ...it, value: v }
  })
  return out as (T & { value: number })[]
}

export default function AudiencePage() {
  const { connectedAccounts, youtubeStatsByChannel, activeChannelId } = useAccountStore()
  const [mounted, setMounted] = useState(false)
  const [channelId, setChannelId] = useState<string | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Default to active (or first) channel once hydrated
  useEffect(() => {
    if (!mounted) return
    if (channelId && connectedAccounts.some(a => a.channelId === channelId)) return
    setChannelId(activeChannelId ?? connectedAccounts[0]?.channelId ?? null)
  }, [mounted, activeChannelId, connectedAccounts, channelId])

  // Default to first video when the channel changes
  useEffect(() => {
    if (!channelId) return
    const videos = youtubeStatsByChannel[channelId]?.videos ?? []
    if (!videos.some(v => v.id === videoId)) {
      setVideoId(videos[0]?.id ?? null)
    }
  }, [channelId, youtubeStatsByChannel, videoId])

  const channel = connectedAccounts.find(a => a.channelId === channelId)
  const stats = channelId ? youtubeStatsByChannel[channelId] : undefined
  const videos = stats?.videos ?? []
  const video: YoutubeVideo | undefined = videos.find(v => v.id === videoId)

  const seed = useMemo(() => hashString(video?.id ?? channelId ?? 'default'), [video?.id, channelId])
  const ageData = useMemo(() => {
    const rand = seededRandom(seed)
    return jitterAndNormalize(ageBase, rand, 0.5).map(({ range, value }) => ({
      range,
      percentage: value,
    }))
  }, [seed])
  const genderData = useMemo(() => {
    const rand = seededRandom(seed ^ 0xdeadbeef)
    return jitterAndNormalize(genderBase, rand, 0.3).map(({ name, value }) => ({ name, value }))
  }, [seed])
  const countryData = useMemo(() => {
    const rand = seededRandom(seed ^ 0xc0ffee)
    return jitterAndNormalize(countryBase, rand, 0.5).map(({ country, value }) => ({
      country,
      percentage: value,
    }))
  }, [seed])
  const activityData = useMemo(() => {
    const rand = seededRandom(seed ^ 0xfacefeed)
    return activityBase.map(({ hour, base }) => ({
      hour,
      value: Math.max(0, Math.round(base * (1 + (rand() - 0.5) * 0.5))),
    }))
  }, [seed])

  const peakActivity = activityData.reduce((a, b) => (a.value > b.value ? a : b), activityData[0])
  const topGender = [...genderData].sort((a, b) => b.value - a.value)[0]
  const topAge = [...ageData].sort((a, b) => b.percentage - a.percentage)[0]

  const isNewUser = !mounted || connectedAccounts.length === 0

  // Empty state for new users
  if (isNewUser) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Audience</h1>
            <p className="text-muted-foreground mt-1">
              Understand who watches your content
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-12"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gradient-purple/20 to-gradient-pink/20 flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-gradient-purple" />
              </div>
              <h3 className="font-semibold text-xl mb-2">No audience data yet</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Once you start posting videos and building an audience, you&apos;ll see detailed demographics, geographic distribution, and activity patterns here.
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
        <div>
          <h1 className="text-2xl font-bold">Audience</h1>
          <p className="text-muted-foreground mt-1">
            Understand who watches your content
          </p>
        </div>

        {/* Channel + video selectors */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-4">
            <label className="text-sm text-muted-foreground mb-2 block">Channel</label>
            <div className="relative">
              <div className="flex items-center gap-3 pl-3 pr-9 py-2 rounded-lg bg-muted border border-border">
                {channel && (
                  <Image
                    src={channel.avatar}
                    alt={channel.channelName}
                    width={24}
                    height={24}
                    className="rounded-full flex-shrink-0"
                  />
                )}
                <span className="text-sm font-medium truncate flex-1">
                  {channel?.channelName ?? 'Select a channel'}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={channelId ?? ''}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Channel"
                >
                  {connectedAccounts.map((account) => (
                    <option key={account.channelId} value={account.channelId}>
                      {account.channelName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <label className="text-sm text-muted-foreground mb-2 block">Video</label>
            {videos.length === 0 ? (
              <div className="rounded-lg bg-muted/50 border border-dashed border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  No videos synced for this channel yet.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center gap-2 pl-3 pr-9 py-2 rounded-lg bg-muted border border-border">
                  <span className="text-sm truncate flex-1">
                    {video?.title ?? 'Select a video'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={videoId ?? ''}
                    onChange={(e) => setVideoId(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Video"
                  >
                    {videos.map((v) => (
                      <option key={v.id} value={v.id}>{v.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected video preview */}
        {video && (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 flex items-center gap-4"
          >
            <div className="relative w-28 aspect-video rounded-md overflow-hidden bg-muted flex-shrink-0">
              {video.thumbnail && (
                <Image src={video.thumbnail} alt={video.title} fill sizes="112px" className="object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Showing audience for</p>
              <p className="font-medium line-clamp-2">{video.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(video.publishedAt).toLocaleDateString()} · {video.isShort ? 'Short' : 'Video'} · {video.views.toLocaleString()} views
              </p>
            </div>
          </motion.div>
        )}

        {/* Sample-data notice */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 border border-border/50 rounded-lg px-3 py-2">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <p>
            Demographic breakdowns shown are illustrative — YouTube&apos;s Analytics API is required for real per-video demographics and isn&apos;t connected yet. Numbers below are deterministic from the selected video.
          </p>
        </div>

        <div key={seed} className="grid lg:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold mb-6">Age Distribution</h3>
            <div className="space-y-4">
              {ageData.map((item, index) => (
                <div key={item.range} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.range}</span>
                    <span className="text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Gender Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold mb-6">Gender Distribution</h3>
            <div className="flex items-center gap-8">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {genderData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {genderData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-bold ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold mb-6">Top Countries</h3>
            <div className="space-y-3">
              {countryData.map((item, index) => (
                <div key={item.country} className="flex items-center gap-4">
                  <span className="text-sm w-28 truncate">{item.country}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity by Hour */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold mb-6">Audience Activity by Hour</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20,16,32,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Activity']}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    fill="url(#activityGradient)"
                  />
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Peak activity: {peakActivity?.hour}
            </p>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6 border-l-4 border-l-primary"
        >
          <h3 className="font-semibold mb-4">Audience Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Primary Demographic</p>
              <p className="font-medium">
                {topAge?.range} year-old {topGender?.name.toLowerCase()}s
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Peak Activity</p>
              <p className="font-medium">{peakActivity?.hour}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Top Country</p>
              <p className="font-medium">{countryData[0]?.country}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { videos, type Video } from '@/lib/mock-data'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowRight, Eye, Heart, MessageCircle, Share2, Clock, TrendingUp, GitCompare, Plus } from 'lucide-react'
import Link from 'next/link'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from 'recharts'

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export default function ComparePage() {
  const [video1, setVideo1] = useState<Video | null>(videos[0] || null)
  const [video2, setVideo2] = useState<Video | null>(videos[3] || videos[1] || null)

  // Empty state for new users
  if (videos.length < 2) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Compare</h1>
            <p className="text-muted-foreground mt-1">
              Compare performance between videos
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
              <h3 className="font-semibold text-xl mb-2">Need at least 2 videos to compare</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Once you have multiple videos, you&apos;ll be able to compare their performance side by side with detailed metrics and AI-powered insights.
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

  if (!video1 || !video2) return null

  const compareStats = [
    { label: 'Views', key: 'views', icon: Eye },
    { label: 'Likes', key: 'likes', icon: Heart },
    { label: 'Comments', key: 'comments', icon: MessageCircle },
    { label: 'Shares', key: 'shares', icon: Share2 },
    { label: 'Watch Time', key: 'watchTime', icon: Clock },
    { label: 'Retention', key: 'avgRetention', icon: TrendingUp },
  ]

  const radarData = [
    { metric: 'Views', v1: video1.views / 15000, v2: video2.views / 15000 },
    { metric: 'Likes', v1: video1.likes / 2000, v2: video2.likes / 2000 },
    { metric: 'Comments', v1: video1.comments / 100, v2: video2.comments / 100 },
    { metric: 'Shares', v1: video1.shares / 500, v2: video2.shares / 500 },
    { metric: 'Retention', v1: video1.avgRetention, v2: video2.avgRetention },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold">Compare</h1>
          <p className="text-muted-foreground mt-1">
            Compare performance between videos
          </p>
        </div>

        {/* Video selectors */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl p-4"
          >
            <label className="text-sm text-muted-foreground mb-2 block">Video A</label>
            <select
              value={video1.id}
              onChange={(e) => setVideo1(videos.find(v => v.id === e.target.value) || videos[0])}
              className="w-full p-3 rounded-lg bg-muted border border-border text-sm"
            >
              {videos.map((v) => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl p-4"
          >
            <label className="text-sm text-muted-foreground mb-2 block">Video B</label>
            <select
              value={video2.id}
              onChange={(e) => setVideo2(videos.find(v => v.id === e.target.value) || videos[0])}
              className="w-full p-3 rounded-lg bg-muted border border-border text-sm"
            >
              {videos.map((v) => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          </motion.div>
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
              const v1Value = video1[stat.key as keyof Video] as number
              const v2Value = video2[stat.key as keyof Video] as number
              const maxValue = Math.max(v1Value, v2Value)
              const Icon = stat.icon

              return (
                <div key={stat.key} className="grid grid-cols-[1fr_100px_1fr] gap-4 items-center">
                  {/* Video 1 bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden flex justify-end">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(v1Value / maxValue) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-gradient-pink to-gradient-purple rounded-lg flex items-center justify-end px-3"
                      >
                        <span className="text-xs font-medium text-white">
                          {stat.key === 'avgRetention' ? `${v1Value}%` : formatNumber(v1Value)}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center flex flex-col items-center">
                    <Icon className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>

                  {/* Video 2 bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(v2Value / maxValue) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-gradient-orange to-gradient-pink rounded-lg flex items-center px-3"
                      >
                        <span className="text-xs font-medium text-white">
                          {stat.key === 'avgRetention' ? `${v2Value}%` : formatNumber(v2Value)}
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
                  name="Video A"
                  dataKey="v1"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Video B"
                  dataKey="v2"
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
              <span className="text-sm text-muted-foreground">Video A</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-orange" />
              <span className="text-sm text-muted-foreground">Video B</span>
            </div>
          </div>
        </motion.div>

        {/* AI insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 border-l-4 border-l-primary"
        >
          <h3 className="font-semibold mb-3">Comparison Insights</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              • <strong className="text-foreground">&quot;{video1.title}&quot;</strong> outperforms in{' '}
              {video1.views > video2.views ? 'views' : 'engagement'} by{' '}
              <span className="text-green-400">{Math.abs(((video1.views - video2.views) / video2.views) * 100).toFixed(0)}%</span>
            </p>
            <p>
              • The higher retention video uses{' '}
              <strong className="text-foreground">{video1.avgRetention > video2.avgRetention ? video1.duration : video2.duration}s</strong> format
            </p>
            <p>
              • Consider combining the hook style from Video A with the pacing of Video B for optimal performance
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

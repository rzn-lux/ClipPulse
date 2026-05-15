'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { ViewsChart } from '@/components/dashboard/views-chart'
import { VideoGrid } from '@/components/dashboard/video-grid'
import { useAccountStore } from '@/lib/account-store'
import { motion } from 'framer-motion'
import { Link as LinkIcon, Plus, Sparkles, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function OverviewPage() {
  const { connectedAccounts, youtubeStats, setYoutubeStats, isConnected } = useAccountStore()
  const [mounted, setMounted] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-fetch YouTube stats when YouTube is connected
  useEffect(() => {
    if (mounted && isConnected('youtube') && !youtubeStats) {
      fetchYoutubeStats()
    }
  }, [mounted, isConnected('youtube')])

  const fetchYoutubeStats = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/youtube/stats')
      if (res.ok) {
        const data = await res.json()
        setYoutubeStats(data)
      }
    } catch (e) {
      console.log('[v0] Failed to fetch YouTube stats:', e)
    } finally {
      setSyncing(false)
    }
  }

  const hasConnectedAccounts = mounted && connectedAccounts.length > 0

  const subscribers = youtubeStats?.subscribers ?? 0
  const totalViews = youtubeStats?.totalViews ?? 0
  const videoCount = youtubeStats?.videoCount ?? 0

  // Build sparkline arrays from video data
  const videoViews = youtubeStats?.videos?.slice(0, 7).map(v => v.views) ?? [0]
  const videoLikes = youtubeStats?.videos?.slice(0, 7).map(v => v.likes) ?? [0]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="text-muted-foreground mt-1">
              Track your video performance across all platforms
            </p>
          </div>

          {mounted && (
            <div className="flex items-center gap-2">
              {connectedAccounts.length > 0 ? (
                <div className="flex items-center gap-2">
                  {isConnected('youtube') && (
                    <button
                      onClick={fetchYoutubeStats}
                      disabled={syncing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors text-xs text-muted-foreground"
                    >
                      <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                      {syncing ? 'Syncing...' : 'Sync'}
                    </button>
                  )}
                  <Link href="/settings" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex -space-x-2">
                      {connectedAccounts.slice(0, 3).map((account) => (
                        <Image
                          key={account.platform}
                          src={account.avatar}
                          alt={account.channelName}
                          width={24}
                          height={24}
                          className="rounded-full border-2 border-background"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {connectedAccounts.length} connected
                    </span>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">Connect accounts</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* New user welcome banner */}
        {mounted && !hasConnectedAccounts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-xl p-6 bg-gradient-to-br from-gradient-purple/10 to-gradient-pink/10 border-gradient-purple/20"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gradient-purple to-gradient-pink flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Welcome to ClipPulse!</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your YouTube account to start tracking your real analytics.
                  We&apos;ll pull your actual subscribers, views, and videos automatically.
                </p>
              </div>
              <Link
                href="/settings"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-gradient-purple to-gradient-pink text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <LinkIcon className="w-4 h-4" />
                Connect YouTube
              </Link>
            </div>
          </motion.div>
        )}

        {/* Connected accounts bar */}
        {mounted && hasConnectedAccounts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium">Connected</p>
                <div className="flex items-center gap-3">
                  {connectedAccounts.map((account) => (
                    <div key={account.platform} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                      <Image
                        src={account.avatar}
                        alt={account.channelName}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-xs font-medium">{account.handle}</span>
                      {account.followers > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {account.followers >= 1000000
                            ? `${(account.followers / 1000000).toFixed(1)}M`
                            : account.followers >= 1000
                            ? `${(account.followers / 1000).toFixed(1)}K`
                            : account.followers} subs
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/settings" className="text-xs text-primary hover:underline">
                Manage
              </Link>
            </div>
          </motion.div>
        )}

        {/* KPI Cards — real data when connected, zeros when not */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Subscribers"
            value={subscribers}
            delta={0}
            sparkline={videoViews.length > 1 ? videoViews : [0, 0, subscribers]}
            delay={0}
          />
          <KpiCard
            title="Total Views"
            value={totalViews}
            delta={0}
            sparkline={videoViews.length > 1 ? videoViews : [0, 0, totalViews]}
            delay={100}
          />
          <KpiCard
            title="Total Videos"
            value={youtubeStats?.videoCount ?? 0}
            delta={0}
            sparkline={[0, 0, youtubeStats?.videoCount ?? 0]}
            delay={200}
          />
          <KpiCard
            title="Total Likes"
            value={youtubeStats?.videos?.reduce((sum, v) => sum + v.likes, 0) ?? 0}
            delta={0}
            sparkline={videoLikes.length > 1 ? videoLikes : [0, 0, 0]}
            delay={300}
          />
        </div>

        {/* Views Chart */}
        <ViewsChart />

        {/* Video Grid */}
        <VideoGrid />

        {/* Footer */}
        <div className="pt-6">
          <div className="border-t border-border/40" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} ClipPulse. All rights reserved.</span>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:clippulseapp@gmail.com" className="hover:text-foreground transition-colors">
                clippulseapp@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

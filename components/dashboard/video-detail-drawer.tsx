'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Video } from '@/lib/mock-data'
import { X, TrendingUp, MessageCircle, Users, Radio, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface VideoDetailDrawerProps {
  video: Video | null
  open: boolean
  onClose: () => void
}

const tabs = [
  { id: 'performance', name: 'Performance', icon: TrendingUp },
  { id: 'engagement', name: 'Engagement', icon: MessageCircle },
  { id: 'audience', name: 'Audience', icon: Users },
  { id: 'reach', name: 'Reach', icon: Radio },
  { id: 'insights', name: 'AI Insights', icon: Sparkles },
]

const COLORS = ['#a855f7', '#ec4899', '#f97316', '#6366f1', '#14b8a6']

export function VideoDetailDrawer({ video, open, onClose }: VideoDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('performance')

  if (!video) return null

  const retentionData = video.retentionCurve.map((value, index) => ({
    second: Math.round((index / video.retentionCurve.length) * video.duration),
    retention: value
  }))

  const replayData = video.replayHeatmap.map((value, index) => ({
    second: Math.round((index / video.replayHeatmap.length) * video.duration),
    replays: value
  }))

  const sentimentData = video.sentimentBreakdown.map(item => ({
    name: item.sentiment,
    value: item.percentage
  }))

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
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{video.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {video.views.toLocaleString()} views • {video.publishedAt}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4 overflow-x-auto pb-1 -mx-4 px-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {activeTab === 'performance' && (
                <>
                  {/* Retention Curve */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Retention Curve</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={retentionData}>
                          <defs>
                            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="second" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                            tickFormatter={(v) => `${v}s`}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'rgba(20,16,32,0.9)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Retention']}
                            labelFormatter={(label) => `${label}s`}
                          />
                          <Area
                            type="monotone"
                            dataKey="retention"
                            stroke="#a855f7"
                            strokeWidth={2}
                            fill="url(#retentionGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-muted-foreground">Drop-off at 15s: -12%</span>
                      </div>
                    </div>
                  </div>

                  {/* Rewatch Heatmap */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Rewatch Heatmap</h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={replayData}>
                          <XAxis 
                            dataKey="second" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                            tickFormatter={(v) => `${v}s`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'rgba(20,16,32,0.9)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value.toFixed(1)}x`, 'Replay Rate']}
                          />
                          <Bar 
                            dataKey="replays" 
                            fill="#ec4899"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'engagement' && (
                <>
                  {/* Engagement Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Likes', value: video.likes },
                      { label: 'Comments', value: video.comments },
                      { label: 'Shares', value: video.shares },
                      { label: 'Saves', value: video.saves },
                    ].map((stat) => (
                      <div key={stat.label} className="glass-card rounded-xl p-4">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xl font-bold mt-1">{stat.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Sentiment Breakdown */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Comment Sentiment</h3>
                    <div className="flex items-center gap-8">
                      <div className="w-32 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={sentimentData}
                              innerRadius={35}
                              outerRadius={55}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {sentimentData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2">
                        {sentimentData.map((item, index) => (
                          <div key={item.name} className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index] }}
                            />
                            <span className="text-sm">{item.name}</span>
                            <span className="text-sm text-muted-foreground">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Comments */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Top Comments</h3>
                    <div className="space-y-3">
                      {video.topComments.map((comment, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                            comment.sentiment === 'positive' && 'bg-green-500',
                            comment.sentiment === 'neutral' && 'bg-yellow-500',
                            comment.sentiment === 'negative' && 'bg-red-500'
                          )} />
                          <div className="flex-1">
                            <p className="text-sm">{comment.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {comment.likes.toLocaleString()} likes
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'audience' && (
                <>
                  {/* Age Distribution */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Age Distribution</h3>
                    <div className="space-y-3">
                      {video.audienceAge.map((item, index) => (
                        <div key={item.range} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.range}</span>
                            <span className="text-muted-foreground">{item.percentage}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gender Distribution */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Gender Distribution</h3>
                    <div className="flex gap-4">
                      {video.audienceGender.map((item, index) => (
                        <div key={item.gender} className="flex-1 text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold">{item.percentage}%</p>
                          <p className="text-sm text-muted-foreground">{item.gender}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Countries */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Top Countries</h3>
                    <div className="space-y-3">
                      {video.topCountries.map((item, index) => (
                        <div key={item.country} className="flex items-center justify-between">
                          <span className="text-sm">{item.country}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-10 text-right">
                              {item.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'reach' && (
                <>
                  {/* Traffic Sources */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Traffic Sources</h3>
                    <div className="space-y-3">
                      {video.trafficSources.map((item, index) => (
                        <div key={item.source} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.source}</span>
                            <span className="text-muted-foreground">{item.percentage}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Follower vs Non-Follower */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4">Viewer Type</h3>
                    <div className="flex gap-4">
                      {video.followerVsNonFollower.map((item, index) => (
                        <div key={item.type} className="flex-1 text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold">{item.percentage}%</p>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'insights' && (
                <>
                  {/* AI Insights */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Why It Performed This Way
                    </h3>
                    <div className="space-y-3">
                      {video.aiInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="glass-card rounded-xl p-4 border-l-4 border-l-gradient-pink">
                    <h3 className="font-medium mb-4">Actionable Suggestions</h3>
                    <div className="space-y-3">
                      {video.aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink text-white text-xs flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { viewsOverTime } from '@/lib/mock-data'
import { BarChart3 } from 'lucide-react'

const platformColors = {
  tiktok: { stroke: '#00f2ea', fill: '#00f2ea' },
  instagram: { stroke: '#e1306c', fill: '#e1306c' },
  youtube: { stroke: '#ff0000', fill: '#ff0000' },
  twitter: { stroke: '#1da1f2', fill: '#1da1f2' },
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null

  return (
    <div className="glass-card rounded-lg p-3 min-w-[160px]">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-xs capitalize">{entry.name}</span>
            </div>
            <span className="text-xs font-medium">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ViewsChart() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Check if there's any actual data
  const hasData = useMemo(() => {
    return viewsOverTime.some(
      (day) => day.tiktok > 0 || day.instagram > 0 || day.youtube > 0 || day.twitter > 0
    )
  }, [])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-xl p-6 h-[400px]"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-[320px] bg-muted/50 rounded animate-pulse" />
      </motion.div>
    )
  }

  // Empty state for new users
  if (!hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Views Over Time</h3>
          <div className="flex items-center gap-4">
            {Object.entries(platformColors).map(([platform, colors]) => (
              <div key={platform} className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: colors.stroke }} 
                />
                <span className="text-xs text-muted-foreground capitalize">{platform}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[320px] flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <BarChart3 className="w-7 h-7 text-muted-foreground" />
          </div>
          <h4 className="font-medium mb-1">No view data yet</h4>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your view statistics will appear here once you start posting videos across your connected platforms.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Views Over Time</h3>
        <div className="flex items-center gap-4">
          {Object.entries(platformColors).map(([platform, colors]) => (
            <div key={platform} className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: colors.stroke }} 
              />
              <span className="text-xs text-muted-foreground capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={viewsOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {Object.entries(platformColors).map(([platform, colors]) => (
                <linearGradient key={platform} id={`gradient-${platform}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.fill} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.fill} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="tiktok"
              stackId="1"
              stroke={platformColors.tiktok.stroke}
              fill={`url(#gradient-tiktok)`}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="instagram"
              stackId="1"
              stroke={platformColors.instagram.stroke}
              fill={`url(#gradient-instagram)`}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="youtube"
              stackId="1"
              stroke={platformColors.youtube.stroke}
              fill={`url(#gradient-youtube)`}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="twitter"
              stackId="1"
              stroke={platformColors.twitter.stroke}
              fill={`url(#gradient-twitter)`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

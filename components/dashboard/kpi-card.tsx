'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

interface KpiCardProps {
  title: string
  value: number
  delta: number
  sparkline: number[]
  format?: 'number' | 'percent' | 'time'
  delay?: number
}

function formatValue(value: number, format: 'number' | 'percent' | 'time'): string {
  switch (format) {
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'time':
      const hours = Math.floor(value / 3600)
      const minutes = Math.floor((value % 3600) / 60)
      return `${hours.toLocaleString()}h ${minutes}m`
    default:
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
      }
      return value.toLocaleString()
  }
}

export function KpiCard({ title, value, delta, sparkline, format = 'number', delay = 0 }: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const isPositive = delta >= 0

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(interval)
        } else {
          setDisplayValue(current)
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  const chartData = sparkline.map((v, i) => ({ value: v, index: i }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className="glass-card rounded-xl p-4 hover:border-border/80 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={cn(
          'flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded',
          isPositive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
        )}>
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(delta)}%
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold tracking-tight">
          {formatValue(displayValue, format)}
        </p>
        <div className="w-20 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`sparkline-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#22c55e' : '#ef4444'}
                strokeWidth={1.5}
                fill={`url(#sparkline-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

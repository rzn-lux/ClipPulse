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
  Tooltip
} from 'recharts'
import { useAccountStore } from '@/lib/account-store'
import { useState, useEffect } from 'react'
import { Users, Plus } from 'lucide-react'
import Link from 'next/link'

const COLORS = ['#a855f7', '#ec4899', '#f97316', '#6366f1', '#14b8a6', '#8b5cf6']

const ageData = [
  { range: '13-17', percentage: 8 },
  { range: '18-24', percentage: 35 },
  { range: '25-34', percentage: 38 },
  { range: '35-44', percentage: 14 },
  { range: '45+', percentage: 5 },
]

const genderData = [
  { name: 'Female', value: 54 },
  { name: 'Male', value: 44 },
  { name: 'Other', value: 2 },
]

const countryData = [
  { country: 'United States', percentage: 45 },
  { country: 'United Kingdom', percentage: 14 },
  { country: 'Canada', percentage: 11 },
  { country: 'Australia', percentage: 8 },
  { country: 'Germany', percentage: 6 },
  { country: 'India', percentage: 5 },
  { country: 'Brazil', percentage: 4 },
  { country: 'France', percentage: 3 },
  { country: 'Other', percentage: 4 },
]

const activityData = [
  { hour: '12am', value: 15 },
  { hour: '3am', value: 8 },
  { hour: '6am', value: 25 },
  { hour: '9am', value: 45 },
  { hour: '12pm', value: 65 },
  { hour: '3pm', value: 55 },
  { hour: '6pm', value: 85 },
  { hour: '9pm', value: 100 },
]

export default function AudiencePage() {
  const { connectedAccounts } = useAccountStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
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

        <div className="grid lg:grid-cols-2 gap-6">
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
                      borderRadius: '8px'
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
              Peak activity: 9pm EST
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
              <p className="font-medium">18-34 year old females in the US</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Best Posting Window</p>
              <p className="font-medium">6-9pm EST on weekdays</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Audience Growth</p>
              <p className="font-medium text-green-400">+18.7% this month</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

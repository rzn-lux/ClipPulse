'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown, Command, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const platforms = [
  { id: 'all', name: 'All', color: 'bg-foreground' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-tiktok' },
  { id: 'instagram', name: 'Reels', color: 'bg-instagram' },
  { id: 'youtube', name: 'Shorts', color: 'bg-youtube' },
  { id: 'twitter', name: 'X', color: 'bg-twitter' },
]

const dateRanges = [
  { id: '7d', name: 'Last 7 days' },
  { id: '14d', name: 'Last 14 days' },
  { id: '30d', name: 'Last 30 days' },
  { id: '90d', name: 'Last 90 days' },
  { id: 'custom', name: 'Custom range' },
]

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState('30d')
  const [showDatePicker, setShowDatePicker] = useState(false)

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border z-30 flex items-center justify-between px-6 transition-all duration-300",
        sidebarCollapsed ? "left-[72px]" : "left-[240px]"
      )}
    >
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search videos..."
            className="w-64 h-9 pl-9 pr-12 rounded-lg bg-input border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>
      </div>

      {/* Center: Platform filters */}
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={cn(
              'relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedPlatform === platform.id
                ? 'text-secondary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {selectedPlatform === platform.id && (
              <motion.div
                layoutId="platformBg"
                className="absolute inset-0 bg-background rounded-md shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full', platform.color)} />
              {platform.name}
            </span>
          </button>
        ))}
      </div>

      {/* Right: Date range + Profile */}
      <div className="flex items-center gap-4">
        {/* Date range picker */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            {dateRanges.find(d => d.id === selectedDateRange)?.name}
            <ChevronDown className="w-3 h-3" />
          </Button>

          <AnimatePresence>
            {showDatePicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
              >
                {dateRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => {
                      setSelectedDateRange(range.id)
                      setShowDatePicker(false)
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors',
                      selectedDateRange === range.id && 'bg-accent'
                    )}
                  >
                    {range.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile avatar */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-gradient-purple via-gradient-pink to-gradient-orange p-0.5">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xs font-semibold">
            CP
          </div>
        </button>
      </div>
    </header>
  )
}

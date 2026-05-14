'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown, Command, Search, Eye, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccountStore } from '@/lib/account-store'
import Image from 'next/image'

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

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const MAX_RESULTS = 8

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const [selectedDateRange, setSelectedDateRange] = useState('30d')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const { connectedAccounts, youtubeStatsByChannel } = useAccountStore()

  // Build the searchable corpus once per stats change.
  const allVideos = useMemo(() => {
    const out: {
      id: string
      title: string
      thumbnail: string
      views: number
      isShort: boolean
      channelName: string
      channelAvatar: string
    }[] = []
    for (const account of connectedAccounts) {
      const stats = youtubeStatsByChannel[account.channelId]
      if (!stats) continue
      for (const v of stats.videos) {
        out.push({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          views: v.views,
          isShort: v.isShort,
          channelName: stats.channelName || account.channelName,
          channelAvatar: stats.avatar || account.avatar,
        })
      }
    }
    return out
  }, [connectedAccounts, youtubeStatsByChannel])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allVideos
      .filter(v => v.title.toLowerCase().includes(q) || v.channelName.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS)
  }, [allVideos, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // ⌘K / Ctrl+K focuses the search input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Click outside closes the dropdown
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!searchContainerRef.current) return
      if (!searchContainerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const openResult = (videoId: string, isShort: boolean) => {
    const url = isShort
      ? `https://www.youtube.com/shorts/${videoId}`
      : `https://www.youtube.com/watch?v=${videoId}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setShowResults(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowResults(false)
      inputRef.current?.blur()
      return
    }
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const r = results[activeIndex]
      if (r) openResult(r.id, r.isShort)
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border z-30 flex items-center justify-between px-6 transition-all duration-300",
        sidebarCollapsed ? "left-[72px]" : "left-[240px]"
      )}
    >
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className="relative" ref={searchContainerRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true) }}
            onFocus={() => setShowResults(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search videos..."
            className="w-80 h-9 pl-9 pr-16 rounded-lg bg-input border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
          {query ? (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              <Command className="w-3 h-3" />K
            </kbd>
          )}

          <AnimatePresence>
            {showResults && query.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 top-full mt-2 w-[420px] max-h-[480px] overflow-y-auto bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-40"
              >
                {results.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    {allVideos.length === 0
                      ? 'Connect a channel to search your videos.'
                      : `No videos match "${query}".`}
                  </div>
                ) : (
                  <ul className="py-1">
                    {results.map((r, i) => (
                      <li key={`${r.channelName}-${r.id}`}>
                        <button
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => openResult(r.id, r.isShort)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                            i === activeIndex ? 'bg-accent' : 'hover:bg-accent/60'
                          )}
                        >
                          <div className="relative w-16 h-9 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                            {r.thumbnail && (
                              <Image
                                src={r.thumbnail}
                                alt={r.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{r.title}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                              <Image
                                src={r.channelAvatar}
                                alt={r.channelName}
                                width={14}
                                height={14}
                                className="rounded-full"
                              />
                              <span className="truncate">{r.channelName}</span>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Eye className="w-3 h-3" />
                                {formatNumber(r.views)}
                              </span>
                              {r.isShort && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-youtube">Short</span>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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

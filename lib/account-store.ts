'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Platform = 'youtube'

export interface ConnectedAccount {
  platform: Platform
  channelId: string
  channelName: string
  handle: string
  avatar: string
  followers: number
  totalViews: number
  videoCount: number
  connectedAt: string
  lastSyncedAt?: string
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

export interface YoutubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  views: number
  likes: number
  comments: number
  duration: string
  durationSeconds: number
  isShort: boolean
  platform: 'youtube'
}

export interface YoutubeStats {
  subscribers: number
  totalViews: number
  videoCount: number
  channelName: string
  handle: string
  avatar: string
  videos: YoutubeVideo[]
  fetchedAt: string
}

interface AccountStore {
  connectedAccounts: ConnectedAccount[]
  activeChannelId: string | null
  youtubeStatsByChannel: Record<string, YoutubeStats>
  /** Stats for the active channel — kept in sync so existing consumers don't need to change. */
  youtubeStats: YoutubeStats | null

  connectAccount: (account: ConnectedAccount) => void
  disconnectAccount: (channelId: string) => void
  setActiveChannel: (channelId: string) => void
  updateAccountTokens: (channelId: string, tokens: { accessToken: string; expiresAt?: number }) => void
  setYoutubeStatsForChannel: (channelId: string, stats: Omit<YoutubeStats, 'fetchedAt'>) => void

  isConnected: (platform: Platform) => boolean
  getAccount: (platform: Platform) => ConnectedAccount | undefined
  getActiveAccount: () => ConnectedAccount | undefined

  /** @deprecated Use setYoutubeStatsForChannel — kept for callsites that haven't migrated. */
  setYoutubeStats: (stats: Omit<YoutubeStats, 'fetchedAt'>) => void
}

function deriveActiveStats(
  byChannel: Record<string, YoutubeStats>,
  activeChannelId: string | null,
): YoutubeStats | null {
  if (!activeChannelId) return null
  return byChannel[activeChannelId] ?? null
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      connectedAccounts: [],
      activeChannelId: null,
      youtubeStatsByChannel: {},
      youtubeStats: null,

      connectAccount: (account) => set((state) => {
        const others = state.connectedAccounts.filter(a => a.channelId !== account.channelId)
        const nextAccounts = [...others, account]
        const nextActive = state.activeChannelId && nextAccounts.some(a => a.channelId === state.activeChannelId)
          ? state.activeChannelId
          : account.channelId
        return {
          connectedAccounts: nextAccounts,
          activeChannelId: nextActive,
          youtubeStats: deriveActiveStats(state.youtubeStatsByChannel, nextActive),
        }
      }),

      disconnectAccount: (channelId) => set((state) => {
        const nextAccounts = state.connectedAccounts.filter(a => a.channelId !== channelId)
        const { [channelId]: _removed, ...nextByChannel } = state.youtubeStatsByChannel
        const nextActive = state.activeChannelId === channelId
          ? (nextAccounts[0]?.channelId ?? null)
          : state.activeChannelId
        return {
          connectedAccounts: nextAccounts,
          activeChannelId: nextActive,
          youtubeStatsByChannel: nextByChannel,
          youtubeStats: deriveActiveStats(nextByChannel, nextActive),
        }
      }),

      setActiveChannel: (channelId) => set((state) => {
        if (!state.connectedAccounts.some(a => a.channelId === channelId)) return state
        return {
          activeChannelId: channelId,
          youtubeStats: deriveActiveStats(state.youtubeStatsByChannel, channelId),
        }
      }),

      updateAccountTokens: (channelId, tokens) => set((state) => ({
        connectedAccounts: state.connectedAccounts.map(a =>
          a.channelId === channelId
            ? { ...a, accessToken: tokens.accessToken, expiresAt: tokens.expiresAt ?? a.expiresAt }
            : a
        ),
      })),

      setYoutubeStatsForChannel: (channelId, stats) => set((state) => {
        const withTimestamp: YoutubeStats = { ...stats, fetchedAt: new Date().toISOString() }
        const nextByChannel = { ...state.youtubeStatsByChannel, [channelId]: withTimestamp }
        return {
          youtubeStatsByChannel: nextByChannel,
          youtubeStats: state.activeChannelId === channelId ? withTimestamp : state.youtubeStats,
        }
      }),

      setYoutubeStats: (stats) => set((state) => {
        if (!state.activeChannelId) return state
        const withTimestamp: YoutubeStats = { ...stats, fetchedAt: new Date().toISOString() }
        return {
          youtubeStatsByChannel: { ...state.youtubeStatsByChannel, [state.activeChannelId]: withTimestamp },
          youtubeStats: withTimestamp,
        }
      }),

      isConnected: (platform) => get().connectedAccounts.some(a => a.platform === platform),
      getAccount: (platform) => get().connectedAccounts.find(a => a.platform === platform),
      getActiveAccount: () => {
        const { activeChannelId, connectedAccounts } = get()
        if (!activeChannelId) return undefined
        return connectedAccounts.find(a => a.channelId === activeChannelId)
      },
    }),
    {
      name: 'clippulse-accounts',
    }
  )
)

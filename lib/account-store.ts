'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter'

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
}

interface AccountStore {
  connectedAccounts: ConnectedAccount[]
  youtubeStats: YoutubeStats | null
  connectAccount: (account: ConnectedAccount) => void
  disconnectAccount: (platform: Platform) => void
  isConnected: (platform: Platform) => boolean
  getAccount: (platform: Platform) => ConnectedAccount | undefined
  setYoutubeStats: (stats: YoutubeStats) => void
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

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      connectedAccounts: [],
      youtubeStats: null,

      setYoutubeStats: (stats) => set({ youtubeStats: { ...stats, fetchedAt: new Date().toISOString() } }),
      
      connectAccount: (account) => set((state) => ({
        connectedAccounts: [
          ...state.connectedAccounts.filter(a => a.platform !== account.platform),
          account
        ]
      })),
      
      disconnectAccount: (platform) => set((state) => ({
        connectedAccounts: state.connectedAccounts.filter(a => a.platform !== platform)
      })),
      
      isConnected: (platform) => {
        return get().connectedAccounts.some(a => a.platform === platform)
      },
      
      getAccount: (platform) => {
        return get().connectedAccounts.find(a => a.platform === platform)
      }
    }),
    {
      name: 'clippulse-accounts'
    }
  )
)



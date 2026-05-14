'use client'

import { useAccountStore, type ConnectedAccount, type YoutubeStats } from './account-store'

const EXPIRY_BUFFER_MS = 30_000

async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: number }> {
  const res = await fetch('/api/youtube/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) throw new Error('Failed to refresh access token')
  return res.json()
}

async function ensureFreshToken(account: ConnectedAccount): Promise<string> {
  const expired = account.expiresAt && account.expiresAt < Date.now() + EXPIRY_BUFFER_MS
  if (!expired) return account.accessToken
  if (!account.refreshToken) return account.accessToken
  const fresh = await refreshAccessToken(account.refreshToken)
  useAccountStore.getState().updateAccountTokens(account.channelId, fresh)
  return fresh.accessToken
}

export async function fetchYoutubeStatsForAccount(
  account: ConnectedAccount,
): Promise<Omit<YoutubeStats, 'fetchedAt'>> {
  let token = await ensureFreshToken(account)
  let res = await fetch('/api/youtube/stats', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 401 && account.refreshToken) {
    const fresh = await refreshAccessToken(account.refreshToken)
    useAccountStore.getState().updateAccountTokens(account.channelId, fresh)
    token = fresh.accessToken
    res = await fetch('/api/youtube/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  if (!res.ok) {
    const detail = await res.json().catch(() => null)
    throw new Error(detail?.error ?? `Stats fetch failed (${res.status})`)
  }

  return res.json()
}

/** Fetch stats for the active account and write them into the store. */
export async function syncActiveAccount(): Promise<void> {
  const account = useAccountStore.getState().getActiveAccount()
  if (!account) throw new Error('No active account')
  const stats = await fetchYoutubeStatsForAccount(account)
  useAccountStore.getState().setYoutubeStatsForChannel(account.channelId, stats)
}

export interface ViralHashtag {
  tag: string
  count: number
  totalViews: number
}

export interface ViralSound {
  id: string
  title: string
  channel: string
  thumbnail: string
  views: number
  likes: number
  publishedAt: string
}

export interface ViralTrends {
  region: string
  hashtags: ViralHashtag[]
  sounds: ViralSound[]
  fetchedAt: string
}

export async function fetchViralTrends(region = 'US'): Promise<ViralTrends> {
  const account = useAccountStore.getState().getActiveAccount()
  if (!account) throw new Error('No active account')
  let token = await ensureFreshToken(account)
  let res = await fetch(`/api/youtube/viral?region=${encodeURIComponent(region)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 401 && account.refreshToken) {
    const fresh = await refreshAccessToken(account.refreshToken)
    useAccountStore.getState().updateAccountTokens(account.channelId, fresh)
    token = fresh.accessToken
    res = await fetch(`/api/youtube/viral?region=${encodeURIComponent(region)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  if (!res.ok) {
    const detail = await res.json().catch(() => null)
    throw new Error(detail?.error ?? `Viral trends fetch failed (${res.status})`)
  }

  return res.json()
}

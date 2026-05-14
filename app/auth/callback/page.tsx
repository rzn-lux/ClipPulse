'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAccountStore } from '@/lib/account-store'
import { fetchYoutubeStatsForAccount } from '@/lib/youtube-client'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

function CallbackContent() {
  const router = useRouter()
  const { connectAccount, setActiveChannel, setYoutubeStatsForChannel, connectedAccounts } = useAccountStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Fetching your channel...')

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await fetch('/api/youtube/channel')
        const responseData = await res.json()

        if (!res.ok) {
          if (responseData.code === 'NO_CHANNEL') {
            throw new Error('This Google account has no YouTube channel. Please sign in with an account that has a YouTube channel.')
          }
          throw new Error(responseData.error ?? 'Failed to fetch channel')
        }

        const alreadyConnected = connectedAccounts.some(a => a.channelId === responseData.channelId)

        const account = {
          platform: 'youtube' as const,
          channelId: responseData.channelId,
          channelName: responseData.channelName,
          handle: responseData.handle,
          avatar: responseData.avatar,
          followers: responseData.subscribers,
          totalViews: 0,
          videoCount: responseData.videoCount,
          connectedAt: new Date().toISOString(),
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken ?? undefined,
          expiresAt: responseData.expiresAt ?? undefined,
        }

        connectAccount(account)
        setActiveChannel(account.channelId)

        // Fire-and-forget initial stats sync so the dashboard renders immediately.
        fetchYoutubeStatsForAccount(account)
          .then(stats => setYoutubeStatsForChannel(account.channelId, stats))
          .catch(() => { /* dashboard will retry */ })

        setStatus('success')
        setMessage(alreadyConnected
          ? `Refreshed ${responseData.handle}`
          : `Connected ${responseData.handle} successfully!`
        )
        setTimeout(() => router.push('/settings'), 1500)
      } catch (err: any) {
        setStatus('error')
        setMessage(err.message ?? 'Something went wrong')
        setTimeout(() => router.push('/settings'), 4000)
      }
    }

    fetchChannel()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="glass-card rounded-xl p-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 text-gradient-purple animate-spin" />
            <p className="font-medium">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-10 h-10 text-green-500" />
            <p className="font-medium text-green-500">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-10 h-10 text-red-500" />
            <p className="font-medium text-red-500">Connection failed</p>
            <p className="text-sm text-muted-foreground">{message}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Redirecting back to settings...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gradient-purple animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}

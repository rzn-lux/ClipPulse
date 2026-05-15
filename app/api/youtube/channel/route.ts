import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch channel', details: data }, { status: 500 })
  }

  const channel = data.items?.[0]

  if (!channel) {
    return NextResponse.json({ 
      error: 'No YouTube channel found. Make sure this Google account has a YouTube channel.',
      code: 'NO_CHANNEL'
    }, { status: 404 })
  }

  return NextResponse.json({
    channelId: channel.id,
    channelName: channel.snippet.title,
    handle: channel.snippet.customUrl ?? `@${channel.snippet.title.replace(/\s+/g, '').toLowerCase()}`,
    avatar: channel.snippet.thumbnails?.default?.url ?? '',
    subscribers: parseInt(channel.statistics.subscriberCount ?? '0'),
    videoCount: parseInt(channel.statistics.videoCount ?? '0'),
  })
}

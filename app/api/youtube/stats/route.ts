import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function normalizeHandle(customUrl: string | undefined | null): string {
  if (!customUrl) return ''
  const trimmed = customUrl.trim().replace(/^\/+/, '').replace(/^(c\/|user\/|channel\/)/i, '')
  if (!trimmed) return ''
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 })
  }

  // Fetch channel stats
  const channelRes = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (channelRes.status === 401) {
    return NextResponse.json({ error: 'Token expired' }, { status: 401 })
  }

  const channelData = await channelRes.json()
  const channel = channelData.items?.[0]

  if (!channel) {
    return NextResponse.json({ error: 'No channel found' }, { status: 404 })
  }

  // Fetch recent videos (up to 25)
  const searchRes = await fetch(
    'https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=25&order=date',
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const searchData = await searchRes.json()
  const videoIds = (searchData.items ?? []).map((v: any) => v.id.videoId).join(',')

  let videos: any[] = []
  if (videoIds) {
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const videoData = await videoRes.json()
    videos = (videoData.items ?? []).map((v: any) => {
      const iso = v.contentDetails.duration as string // e.g. PT1M3S
      const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
      const hours = parseInt(match?.[1] ?? '0')
      const minutes = parseInt(match?.[2] ?? '0')
      const seconds = parseInt(match?.[3] ?? '0')
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      const isShort = totalSeconds > 0 && totalSeconds <= 60
      return {
        id: v.id,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails?.medium?.url ?? '',
        publishedAt: v.snippet.publishedAt,
        views: parseInt(v.statistics.viewCount ?? '0'),
        likes: parseInt(v.statistics.likeCount ?? '0'),
        comments: parseInt(v.statistics.commentCount ?? '0'),
        duration: iso,
        durationSeconds: totalSeconds,
        isShort,
        platform: 'youtube',
      }
    })
  }

  return NextResponse.json({
    subscribers: parseInt(channel.statistics.subscriberCount ?? '0'),
    totalViews: parseInt(channel.statistics.viewCount ?? '0'),
    videoCount: parseInt(channel.statistics.videoCount ?? '0'),
    channelName: channel.snippet.title,
    handle: normalizeHandle(channel.snippet.customUrl),
    avatar: channel.snippet.thumbnails?.default?.url ?? '',
    videos,
  })
}

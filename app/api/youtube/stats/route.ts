import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Fetch channel stats
  const channelRes = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  )
  const channelData = await channelRes.json()
  const channel = channelData.items?.[0]

  if (!channel) {
    return NextResponse.json({ error: 'No channel found' }, { status: 404 })
  }

  // Fetch recent videos (up to 25)
  const searchRes = await fetch(
    'https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=25&order=date',
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  )
  const searchData = await searchRes.json()
  const videoIds = (searchData.items ?? []).map((v: any) => v.id.videoId).join(',')

  let videos: any[] = []
  if (videoIds) {
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}`,
      { headers: { Authorization: `Bearer ${session.accessToken}` } }
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
    handle: channel.snippet.customUrl ?? '',
    avatar: channel.snippet.thumbnails?.default?.url ?? '',
    videos,
  })
}

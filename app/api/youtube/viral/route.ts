import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface TrendingVideo {
  id: string
  snippet: {
    title: string
    description: string
    channelTitle: string
    thumbnails: { medium?: { url: string }; default?: { url: string } }
    tags?: string[]
    categoryId: string
    publishedAt: string
  }
  statistics: {
    viewCount?: string
    likeCount?: string
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 })
  }

  const url = new URL(req.url)
  const region = url.searchParams.get('region') ?? 'US'

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=${encodeURIComponent(region)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (res.status === 401) {
    return NextResponse.json({ error: 'Token expired' }, { status: 401 })
  }

  if (!res.ok) {
    const detail = await res.json().catch(() => null)
    return NextResponse.json({ error: 'Failed to fetch trending', details: detail }, { status: 500 })
  }

  const data = await res.json()
  const videos: TrendingVideo[] = data.items ?? []

  const hashtagMap = new Map<string, { count: number; totalViews: number }>()
  const hashtagRegex = /#([\p{L}\p{N}_]+)/gu

  for (const v of videos) {
    const views = parseInt(v.statistics.viewCount ?? '0')
    const text = `${v.snippet.title}\n${v.snippet.description}`
    const seen = new Set<string>()
    for (const match of text.matchAll(hashtagRegex)) {
      const tag = match[1].toLowerCase()
      if (tag.length < 2 || tag.length > 40) continue
      if (seen.has(tag)) continue
      seen.add(tag)
      const existing = hashtagMap.get(tag) ?? { count: 0, totalViews: 0 }
      hashtagMap.set(tag, { count: existing.count + 1, totalViews: existing.totalViews + views })
    }
  }

  const hashtags = Array.from(hashtagMap.entries())
    .map(([tag, { count, totalViews }]) => ({ tag, count, totalViews }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 20)

  const sounds = videos
    .filter(v => v.snippet.categoryId === '10')
    .map(v => ({
      id: v.id,
      title: v.snippet.title,
      channel: v.snippet.channelTitle,
      thumbnail: v.snippet.thumbnails?.medium?.url ?? v.snippet.thumbnails?.default?.url ?? '',
      views: parseInt(v.statistics.viewCount ?? '0'),
      likes: parseInt(v.statistics.likeCount ?? '0'),
      publishedAt: v.snippet.publishedAt,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  return NextResponse.json({
    region,
    hashtags,
    sounds,
    fetchedAt: new Date().toISOString(),
  })
}

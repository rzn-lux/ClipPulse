'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { motion } from 'framer-motion'
import { useAccountStore, type ConnectedAccount } from '@/lib/account-store'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  Youtube,
  Music2,
  Instagram,
  Twitter,
  CheckCircle2,
  Trash2,
  Rocket,
  Shield,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter'

const platformConfigs = [
  {
    id: 'youtube' as Platform,
    label: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    bg: 'rgba(255,0,0,0.1)',
    description: 'Connect your YouTube channel to track videos, views, and subscribers.',
    hasOAuth: true,
  },
  {
    id: 'tiktok' as Platform,
    label: 'TikTok',
    icon: Music2,
    color: '#69C9D0',
    bg: 'rgba(105,201,208,0.1)',
    description: 'Track your TikTok videos, likes, and follower growth.',
    hasOAuth: false,
  },
  {
    id: 'instagram' as Platform,
    label: 'Instagram',
    icon: Instagram,
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.1)',
    description: 'Monitor Reels performance and audience engagement on Instagram.',
    hasOAuth: false,
  },
  {
    id: 'twitter' as Platform,
    label: 'X (Twitter)',
    icon: Twitter,
    color: '#1DA1F2',
    bg: 'rgba(29,161,242,0.1)',
    description: 'Analyze your X posts, impressions, and audience growth.',
    hasOAuth: false,
  },
]

export default function SettingsPage() {
  const { connectedAccounts: accounts, disconnectAccount } = useAccountStore()
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  const handleConnect = async (platform: Platform) => {
    const callbackUrl = `${window.location.origin}/auth/callback?platform=${platform}`
    const csrfRes = await fetch('/api/auth/csrf')
    const { csrfToken } = await csrfRes.json()

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/api/auth/signin/google'

    const csrfInput = document.createElement('input')
    csrfInput.type = 'hidden'
    csrfInput.name = 'csrfToken'
    csrfInput.value = csrfToken

    const callbackInput = document.createElement('input')
    callbackInput.type = 'hidden'
    callbackInput.name = 'callbackUrl'
    callbackInput.value = callbackUrl

    form.appendChild(csrfInput)
    form.appendChild(callbackInput)
    document.body.appendChild(form)
    form.submit()
  }

  const handleDisconnect = async (account: ConnectedAccount) => {
    setDisconnecting(account.channelId)
    await new Promise(r => setTimeout(r, 600))
    disconnectAccount(account.platform)
    setDisconnecting(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your connected accounts and preferences</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="font-semibold text-lg mb-1">Connected Accounts</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Connect your social platforms to start tracking your content performance.
          </p>

          <div className="space-y-3">
            {platformConfigs.map((config) => {
              const Icon = config.icon
              const connected = accounts.find(a => a.platform === config.id)

              return (
                <div
                  key={config.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/20"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: config.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {connected ? (
                      <div className="flex items-center gap-2">
                        {connected.avatar && (
                          <Image
                            src={connected.avatar}
                            alt={connected.channelName}
                            width={22}
                            height={22}
                            className="rounded-full"
                          />
                        )}
                        <span className="font-medium text-sm">{connected.channelName}</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      </div>
                    ) : (
                      <p className="font-medium text-sm">{config.label}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {connected
                        ? `${connected.handle} · Connected ${new Date(connected.connectedAt).toLocaleDateString()}`
                        : config.description}
                    </p>
                  </div>

                  {connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "gap-1.5 flex-shrink-0 text-red-500 border-red-500/30 hover:bg-red-500/10",
                        disconnecting === connected.channelId && "opacity-50 pointer-events-none"
                      )}
                      onClick={() => handleDisconnect(connected)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {disconnecting === connected.channelId ? 'Removing...' : 'Disconnect'}
                    </Button>
                  ) : config.hasOAuth ? (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-gradient-purple to-gradient-pink text-white hover:opacity-90 flex-shrink-0"
                      onClick={() => handleConnect(config.id)}
                    >
                      Connect
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-md border border-border flex-shrink-0">
                      Coming soon
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 flex items-start gap-3"
        >
          <Rocket className="w-5 h-5 text-gradient-purple flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">More integrations coming soon</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              TikTok, Instagram, and X connections are in development. YouTube is fully supported now.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-xl p-5 flex items-center justify-between"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gradient-pink flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Privacy Policy</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Learn how we handle your data and protect your privacy.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="text-sm text-gradient-purple hover:underline"
          >
            View Policy
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-5 flex items-center justify-between"
        >
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gradient-purple flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Terms of Service</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Read our terms and conditions for using Clip Pulse.
              </p>
            </div>
          </div>
          <Link
            href="/terms"
            className="text-sm text-gradient-purple hover:underline"
          >
            View Terms
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { motion } from 'framer-motion'
import { useAccountStore, type ConnectedAccount } from '@/lib/account-store'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  Youtube,
  CheckCircle2,
  Trash2,
  Plus,
  Shield,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SettingsPage() {
  const {
    connectedAccounts,
    activeChannelId,
    disconnectAccount,
    setActiveChannel,
  } = useAccountStore()
  const youtubeAccounts = connectedAccounts.filter(a => a.platform === 'youtube')
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  const handleConnect = async () => {
    const callbackUrl = `${window.location.origin}/auth/callback?platform=youtube`
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
    await new Promise(r => setTimeout(r, 400))
    disconnectAccount(account.channelId)
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
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-lg">YouTube Channels</h2>
            <span className="text-xs text-muted-foreground">
              {youtubeAccounts.length} connected
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Connect one or more YouTube channels. Switch between them with the Active toggle.
          </p>

          <div className="space-y-3">
            {youtubeAccounts.map((account) => {
              const isActive = account.channelId === activeChannelId
              const isDisconnecting = disconnecting === account.channelId
              return (
                <div
                  key={account.channelId}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg border bg-muted/20 transition-colors',
                    isActive ? 'border-gradient-purple/60' : 'border-border'
                  )}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,0,0,0.1)' }}
                  >
                    {account.avatar ? (
                      <Image
                        src={account.avatar}
                        alt={account.channelName}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    ) : (
                      <Youtube className="w-5 h-5" style={{ color: '#FF0000' }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{account.channelName}</span>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-gradient-purple bg-gradient-purple/10 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {account.handle && account.handle.replace(/^@/, '').toLowerCase() !== account.channelName.replace(/\s+/g, '').toLowerCase()
                        ? `${account.handle} · `
                        : ''}
                      Connected {new Date(account.connectedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveChannel(account.channelId)}
                      >
                        Set active
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'gap-1.5 text-red-500 border-red-500/30 hover:bg-red-500/10',
                        isDisconnecting && 'opacity-50 pointer-events-none'
                      )}
                      onClick={() => handleDisconnect(account)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isDisconnecting ? 'Removing...' : 'Disconnect'}
                    </Button>
                  </div>
                </div>
              )
            })}

            <button
              onClick={handleConnect}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gradient-purple/50 hover:bg-muted/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {youtubeAccounts.length === 0 ? 'Connect a YouTube channel' : 'Connect another YouTube channel'}
            </button>
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

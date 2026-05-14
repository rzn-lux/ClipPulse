'use client'

import { motion } from 'framer-motion'
import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-6 sm:p-10"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gradient-purple to-gradient-pink flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Terms of Service</h1>
              <p className="text-sm text-muted-foreground">for Clip Pulse</p>
            </div>
          </div>

          {/* Last updated */}
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: May 2026
          </p>

          {/* Content */}
          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              By using Clip Pulse, you agree to these Terms of Service.
            </p>

            <p>
              Clip Pulse provides tools and features for content creation, media interaction, and related services. Users agree to use the app responsibly and not misuse the platform.
            </p>

            <div>
              <p className="font-semibold mb-3">You may not:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                <li>Use the app for illegal activities</li>
                <li>Attempt to disrupt or damage the service</li>
                <li>Upload harmful or malicious content</li>
                <li>Violate the rights of others</li>
              </ul>
            </div>

            <p>
              Clip Pulse may update, modify, or discontinue features at any time.
            </p>

            <p>
              The app is provided &quot;as is&quot; without warranties of any kind.
            </p>

            <p>
              Clip Pulse is not responsible for damages, data loss, or issues resulting from use of the app.
            </p>

            <p>
              By continuing to use the app, you agree to these terms.
            </p>

            <div className="pt-4 border-t border-border">
              <p className="font-semibold mb-2">For questions, contact:</p>
              <a 
                href="mailto:clippulseapp@gmail.com" 
                className="text-gradient-purple hover:underline"
              >
                clippulseapp@gmail.com
              </a>
            </div>
          </div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 pt-6 border-t border-border"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-gradient-purple to-gradient-pink text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

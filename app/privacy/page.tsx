'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 md:p-8">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-pink/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        {/* Card container */}
        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Glow effect on card */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gradient-purple/5 to-gradient-pink/5 pointer-events-none" />
          
          {/* Content */}
          <div className="relative space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gradient-purple to-gradient-pink flex items-center justify-center shadow-lg shadow-gradient-purple/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-white/50 text-sm">for Clip Pulse</p>
              </div>
            </div>

            {/* Last updated */}
            <p className="text-white/40 text-sm">Last updated: May 2026</p>

            {/* Policy content */}
            <div className="space-y-6 text-white/70 leading-relaxed">
              <p>
                Clip Pulse respects your privacy. This app may collect limited information necessary to operate and improve the service, such as device information, analytics data, and app performance data.
              </p>

              <p className="font-medium text-white">
                We do not sell your personal information.
              </p>

              <p>
                Information may be collected through trusted third-party services such as Google Play Services, Firebase, or analytics providers used to improve app functionality and stability.
              </p>

              <p>
                Clip Pulse may request access to certain device features such as storage, camera, or notifications only when required for app functionality.
              </p>

              <p>
                Users can uninstall the app at any time to stop data collection.
              </p>

              <div className="pt-4 border-t border-white/10">
                <p className="text-white/50 text-sm mb-2">
                  If you have questions about this Privacy Policy, contact:
                </p>
                <a 
                  href="mailto:clippulseapp@gmail.com" 
                  className="text-gradient-purple hover:text-gradient-pink transition-colors font-medium"
                >
                  clippulseapp@gmail.com
                </a>
              </div>
            </div>

            {/* Back to Home button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom glow accent */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-gradient-purple/20 via-gradient-pink/20 to-gradient-orange/20 blur-2xl rounded-full" />
      </motion.div>

      {/* Footer */}
      <div className="relative mt-12 text-center text-xs text-white/30 flex flex-col sm:flex-row items-center justify-center gap-4">
        <span>© {new Date().getFullYear()} ClipPulse. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-white/60 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white/60 transition-colors">
            Terms of Service
          </Link>
          <a href="mailto:clippulseapp@gmail.com" className="hover:text-white/60 transition-colors">
            clippulseapp@gmail.com
          </a>
        </div>
      </div>
    </div>
  )
}

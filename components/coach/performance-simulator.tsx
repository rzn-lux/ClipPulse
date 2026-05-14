'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SliderConfig {
  id: string
  label: string
  min: number
  max: number
  step: number
  defaultValue: number
  unit?: string
}

const sliders: SliderConfig[] = [
  { id: 'hook', label: 'Hook Strength', min: 1, max: 10, step: 1, defaultValue: 7 },
  { id: 'length', label: 'Video Length', min: 15, max: 60, step: 5, defaultValue: 30, unit: 's' },
  { id: 'sound', label: 'Trending Sound', min: 0, max: 100, step: 10, defaultValue: 70, unit: '%' },
  { id: 'postTime', label: 'Optimal Post Time', min: 0, max: 100, step: 10, defaultValue: 80, unit: '%' },
  { id: 'cta', label: 'CTA Included', min: 0, max: 1, step: 1, defaultValue: 1 },
]

function calculatePredictions(values: Record<string, number>) {
  const baseViews = 50000
  const hookMultiplier = 1 + (values.hook - 5) * 0.15
  const lengthPenalty = values.length > 35 ? 0.85 : values.length < 20 ? 0.9 : 1
  const soundBonus = 1 + (values.sound / 100) * 0.4
  const timeBonus = 1 + (values.postTime / 100) * 0.25
  const ctaBonus = values.cta === 1 ? 1.15 : 1

  const views = Math.round(baseViews * hookMultiplier * lengthPenalty * soundBonus * timeBonus * ctaBonus)
  const engagement = Math.min(15, 4 + (values.hook * 0.5) + (values.cta * 2) + (values.sound / 25))
  const followers = Math.round(views * (engagement / 100) * 0.08)

  return { views, engagement: engagement.toFixed(1), followers }
}

export function PerformanceSimulator() {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    sliders.forEach(s => { initial[s.id] = s.defaultValue })
    return initial
  })

  const [predictions, setPredictions] = useState(calculatePredictions(values))
  const [animatedPredictions, setAnimatedPredictions] = useState(predictions)

  useEffect(() => {
    const newPredictions = calculatePredictions(values)
    setPredictions(newPredictions)

    // Animate the numbers
    const duration = 300
    const steps = 20
    const startViews = animatedPredictions.views
    const startEngagement = parseFloat(animatedPredictions.engagement)
    const startFollowers = animatedPredictions.followers
    const viewsIncrement = (newPredictions.views - startViews) / steps
    const engagementIncrement = (parseFloat(newPredictions.engagement) - startEngagement) / steps
    const followersIncrement = (newPredictions.followers - startFollowers) / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setAnimatedPredictions(newPredictions)
        clearInterval(interval)
      } else {
        setAnimatedPredictions({
          views: Math.round(startViews + viewsIncrement * currentStep),
          engagement: (startEngagement + engagementIncrement * currentStep).toFixed(1),
          followers: Math.round(startFollowers + followersIncrement * currentStep)
        })
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [values])

  const updateValue = (id: string, value: number) => {
    setValues(prev => ({ ...prev, [id]: value }))
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="font-semibold mb-6">Predicted Performance Simulator</h3>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-6">
          {sliders.map((slider) => (
            <div key={slider.id}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">{slider.label}</label>
                <span className="text-sm text-muted-foreground">
                  {slider.id === 'cta' ? (values[slider.id] === 1 ? 'Yes' : 'No') : `${values[slider.id]}${slider.unit || ''}`}
                </span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={values[slider.id]}
                onChange={(e) => updateValue(slider.id, parseFloat(e.target.value))}
                className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-gradient-to-r
                  [&::-webkit-slider-thumb]:from-gradient-purple
                  [&::-webkit-slider-thumb]:to-gradient-pink
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg"
              />
            </div>
          ))}
        </div>

        {/* Predictions */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 glass-card rounded-xl">
              <p className="text-3xl font-bold gradient-text">
                {formatNumber(animatedPredictions.views)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Predicted Views</p>
            </div>
            <div className="text-center p-4 glass-card rounded-xl">
              <p className="text-3xl font-bold gradient-text">
                {animatedPredictions.engagement}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Engagement Rate</p>
            </div>
            <div className="text-center p-4 glass-card rounded-xl">
              <p className="text-3xl font-bold gradient-text">
                +{formatNumber(animatedPredictions.followers)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Follower Gain</p>
            </div>
          </div>

          {/* Visual indicator */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Performance Score</span>
              <span className="font-medium">
                {Math.round((animatedPredictions.views / 150000) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-orange"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (animatedPredictions.views / 150000) * 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

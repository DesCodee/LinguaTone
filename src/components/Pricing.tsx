import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Sparkles, ArrowRight, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CheckoutModal } from './CheckoutModal'

export default function Pricing() {
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)

  const freeFeatures = [
    'Mandarin Tone (HSK 1-4) practice',
    'Japanese Pitch Accent & Hiragana drills',
    'Korean Pronunciation & Batchim exercises',
    'Real-time Pitch Contour visualizer',
    'Native audio with 0.75x & 1.0x playback',
    '5 Free AI Custom Text breakdowns / day',
    'Daily streaks & goal tracking',
  ]

  const proFeatures = [
    'Unlimited AI Custom Text & Dialogue breakdowns',
    'Full Syllable Pitch Contours & Tone Sandhi Rules',
    'Advanced HSK 5-6, JLPT N1 & TOPIK master levels',
    'Personalized Acoustic Mistake Heatmap & History',
    'Offline PWA Cache for practice on the go',
    'Priority CJK Neural Voice Synthesis',
  ]

  return (
    <section id="pricing" className="relative overflow-hidden bg-gradient-to-b from-white to-sand-50 py-16 md:py-24">
      <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-ocean-100/30 blur-3xl" />
      <div className="absolute bottom-20 left-0 h-56 w-56 rounded-full bg-cyan-100/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-ocean-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ocean-600">
            <Sparkles size={12} />
            Simple & Transparent Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            Start Free, Upgrade for Unlimited AI
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-stone-500">
            Practice foundational tones for free, or unlock unlimited custom sentence breakdowns with Gemini AI.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {/* Free Standard Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-ocean-100 bg-white/80 backdrop-blur-sm p-8 shadow-lg shadow-ocean-900/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-100 text-ocean-600">
                    <Zap size={16} />
                  </div>
                  <h3 className="text-base font-bold text-ink-900">Standard Free</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-200">
                  FREE FOREVER
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-ink-900">$0</span>
                <span className="text-sm font-medium text-stone-400">/ forever</span>
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Everything you need to master correct pitch, tones, and cadence.
              </p>

              <ul className="mt-6 space-y-3">
                {freeFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-stone-600 leading-relaxed">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ocean-50 mt-0.5">
                      <Check size={11} className="text-ocean-500" strokeWidth={2.5} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/app')}
              className="mt-8 w-full rounded-xl bg-ocean-50 border border-ocean-200 py-3 text-sm font-semibold text-ocean-700 transition-all hover:bg-ocean-100 hover:border-ocean-300 cursor-pointer flex items-center justify-center gap-2"
            >
              Start Free Practice
              <ArrowRight size={15} />
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 p-8 shadow-xl shadow-amber-500/10 flex flex-col justify-between"
          >
            <div className="absolute -top-3.5 right-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <Crown size={11} />
                POPULAR (40% OFF)
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                  <Crown size={16} />
                </div>
                <h3 className="text-base font-bold text-ink-900">PRO AI Accent Coach</h3>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight text-ink-900">$6.99</span>
                <span className="text-sm font-medium text-stone-500">/ month (or $49/yr)</span>
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Unlimited AI phrase parsing, custom anime/k-pop lyrics breakdowns, and offline access.
              </p>

              <ul className="mt-6 space-y-3">
                {proFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-stone-700 font-medium leading-relaxed">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 mt-0.5 text-amber-600">
                      <Check size={11} strokeWidth={2.5} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Crown size={16} />
              Unlock PRO Features
            </button>
          </motion.div>
        </div>
      </div>

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => navigate('/app')}
      />
    </section>
  )
}


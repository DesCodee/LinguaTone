import { motion } from 'framer-motion'
import { Check, Zap, Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
  const navigate = useNavigate()

  const freeFeatures = [
    'Unlimited Mandarin Tone (HSK 1-4) practice',
    'Japanese Pitch Accent & Hiragana drills',
    'Korean Pronunciation & Batchim exercises',
    'Real-time Pitch Contour waveform visualizer',
    'Native voice audio with 0.75x & 1.0x playback',
    'Daily streaks, goal tracking & spaced repetition',
  ]

  const upcomingProFeatures = [
    'Offline AI neural voice diagnosis (Coming Soon)',
    'Advanced HSK 5-6 & JLPT N1 business phrasing',
    'Custom vocabulary & sentence deck uploads',
    'Personalized accent reduction report PDF',
    'Early supporter badge & priority community access',
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
            100% Free Public Beta
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            Free & Open For All Learners
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-stone-500">
            No credit card, no paywalls. Practice as much as you need while we build the best CJK pronunciation tool together.
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
                  <h3 className="text-base font-bold text-ink-900">Standard Access</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-200">
                  ACTIVE
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

          {/* Pro / Early Supporter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl border-2 border-ocean-200/80 bg-gradient-to-br from-white via-ocean-50/30 to-cyan-50/40 p-8 shadow-xl shadow-ocean-400/10 flex flex-col justify-between"
          >
            <div className="absolute -top-3.5 right-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                <Clock size={11} />
                COMING SOON
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-cyan-500 text-white shadow-md">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-base font-bold text-ink-900">Pro AI Accent Coach</h3>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-ink-900">In Development</span>
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Advanced AI accent reduction features currently being trained for future release.
              </p>

              <ul className="mt-6 space-y-3">
                {upcomingProFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-stone-600 leading-relaxed">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ocean-100 mt-0.5">
                      <Sparkles size={10} className="text-ocean-600" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/app')}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-ocean-450 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-400/25 transition-all hover:shadow-xl hover:shadow-ocean-400/35 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              Try Full Beta Access For Free
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

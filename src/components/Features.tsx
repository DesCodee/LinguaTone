import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { TrendingUp, Type, Brain, RotateCcw, Route, ClipboardCheck } from 'lucide-react'

const features = [
  { icon: TrendingUp, key: 'toneTraining', gradient: 'from-ocean-50 to-cyan-50', border: 'border-ocean-200/60', iconBg: 'bg-ocean-100 text-ocean-600' },
  { icon: Type, key: 'initialsFinals', gradient: 'from-cyan-50 to-teal-50', border: 'border-cyan-200/60', iconBg: 'bg-cyan-100 text-cyan-600' },
  { icon: Brain, key: 'aiFeedback', gradient: 'from-sky-50 to-blue-50', border: 'border-sky-200/60', iconBg: 'bg-sky-100 text-sky-600' },
  { icon: RotateCcw, key: 'spacedRepetition', gradient: 'from-teal-50 to-emerald-50', border: 'border-teal-200/60', iconBg: 'bg-teal-100 text-teal-600' },
  { icon: Route, key: 'learningPath', gradient: 'from-indigo-50 to-violet-50', border: 'border-indigo-200/60', iconBg: 'bg-indigo-100 text-indigo-600' },
  { icon: ClipboardCheck, key: 'placementTest', gradient: 'from-amber-50 to-orange-50', border: 'border-amber-200/60', iconBg: 'bg-amber-100 text-amber-600' },
]

export default function Features() {
  const { t } = useTranslation()

  return (
    <section id="features" className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-ocean-200 to-transparent" />
      
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-ocean-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ocean-600">
            <span className="h-1.5 w-1.5 rounded-full bg-ocean-400 animate-pulse" />
            {t('features.title')}
          </span>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, i) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative overflow-hidden rounded-2xl border ${feat.border} bg-gradient-to-br ${feat.gradient} p-6 transition-shadow hover:shadow-xl hover:shadow-ocean-900/5`}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-ocean-400/10 opacity-0 transition-opacity group-hover:opacity-100 blur-2xl" />
                
                <div className="relative">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feat.iconBg} shadow-sm transition-transform group-hover:scale-110`}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold text-ink-900">
                    {t(`features.${feat.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                    {t(`features.${feat.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
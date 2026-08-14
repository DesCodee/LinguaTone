import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Headphones, Mic2, BarChart3, ArrowRight } from 'lucide-react'

const steps = [
  { icon: Headphones, key: 'step1', color: 'from-ocean-400 to-ocean-500', shadow: 'shadow-ocean-400/25', delay: 0 },
  { icon: Mic2, key: 'step2', color: 'from-cyan-400 to-cyan-500', shadow: 'shadow-cyan-400/25', delay: 0.15 },
  { icon: BarChart3, key: 'step3', color: 'from-teal-400 to-teal-500', shadow: 'shadow-teal-400/25', delay: 0.3 },
]

export default function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section id="how-it-works" className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-ocean-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ocean-600">
          <span className="h-1.5 w-1.5 rounded-full bg-ocean-400 animate-pulse" />
          {t('howItWorks.title')}
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          {t('howItWorks.subtitle')}
        </h2>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: step.delay }}
              className="group relative"
            >
              {i < 2 && (
                <div className="absolute left-1/2 top-10 hidden h-px w-full md:block">
                  <div className="h-full w-full bg-gradient-to-r from-ocean-200 via-ocean-100 to-transparent" />
                </div>
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg ${step.shadow} transition-transform group-hover:scale-110`}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-ocean-600 shadow-md border border-ocean-100">
                    {i + 1}
                  </div>
                </div>

                <h3 className="mt-6 text-lg font-bold text-ink-900">
                  {t(`howItWorks.${step.key}Title`)}
                </h3>
                <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-stone-500">
                  {t(`howItWorks.${step.key}Desc`)}
                </p>

                {i < 2 && (
                  <ArrowRight size={16} className="mt-4 text-ocean-300 md:hidden" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
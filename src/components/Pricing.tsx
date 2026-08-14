import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Check, Zap, Crown } from 'lucide-react'

export default function Pricing() {
  const { t } = useTranslation()

  const freeFeatures = t('pricing.free.features', { returnObjects: true }) as string[]
  const premiumFeatures = t('pricing.premium.features', { returnObjects: true }) as string[]

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
            <Zap size={12} />
            {t('pricing.title')}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            {t('pricing.subtitle')}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-stone-500">
            {t('pricing.description')}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:max-w-3xl lg:mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-ocean-100 bg-white/70 backdrop-blur-sm p-8 shadow-lg shadow-ocean-900/5"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-100 text-ocean-600">
                <Zap size={16} />
              </div>
              <h3 className="text-base font-bold text-ink-900">{t('pricing.free.name')}</h3>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-ink-900">{t('pricing.free.price')}</span>
              <span className="text-sm text-stone-400">{t('pricing.free.period')}</span>
            </div>
            <ul className="mt-6 space-y-3.5">
              {freeFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ocean-50 mt-0.5">
                    <Check size={12} className="text-ocean-500" strokeWidth={2.5} />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-xl border-2 border-ocean-200 bg-ocean-50/50 py-3 text-sm font-semibold text-ocean-700 transition-all hover:bg-ocean-100 hover:border-ocean-300">
              {t('pricing.free.cta')}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl border-2 border-ocean-300 bg-gradient-to-br from-white to-ocean-50/50 p-8 shadow-xl shadow-ocean-400/10"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-ocean-450 to-cyan-500 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-ocean-400/25">
                <Crown size={12} />
                {t('pricing.premium.badge')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-cyan-500 text-white shadow-md">
                <Crown size={16} />
              </div>
              <h3 className="text-base font-bold text-ink-900">{t('pricing.premium.name')}</h3>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-ink-900">{t('pricing.premium.price')}</span>
              <span className="text-sm text-stone-400">{t('pricing.premium.period')}</span>
            </div>
            <ul className="mt-6 space-y-3.5">
              {premiumFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ocean-100 mt-0.5">
                    <Check size={12} className="text-ocean-600" strokeWidth={2.5} />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-ocean-450 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-400/25 transition-all hover:shadow-xl hover:shadow-ocean-400/35 hover:-translate-y-0.5 active:translate-y-0">
              {t('pricing.premium.cta')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
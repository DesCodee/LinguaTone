import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mic, ArrowRight, Play, Waves } from 'lucide-react'

const languages = [
  { flag: '🇨🇳', key: 'chinese', meta: '4 tones', gradient: 'from-red-400/20 to-red-500/5', border: 'border-red-200/60', icon: '🎵' },
  { flag: '🇯🇵', key: 'japanese', meta: 'pitch accent', gradient: 'from-rose-400/20 to-rose-500/5', border: 'border-rose-200/60', icon: '🎌' },
  { flag: '🇰🇷', key: 'korean', meta: 'vowel length', gradient: 'from-blue-400/20 to-blue-500/5', border: 'border-blue-200/60', icon: '🔷' },
]

const stats = [
  { num: '150+', key: 'statsTests' },
  { num: 'beta', key: 'statsRating' },
  { num: '50+', key: 'statsItems' },
]

const floatingElements = [
  { char: '中', x: '10%', y: '20%', delay: 0, size: 'text-4xl' },
  { char: '日', x: '85%', y: '15%', delay: 0.5, size: 'text-3xl' },
  { char: '한', x: '75%', y: '70%', delay: 1, size: 'text-5xl' },
  { char: '语', x: '15%', y: '75%', delay: 1.5, size: 'text-2xl' },
  { char: '本', x: '90%', y: '50%', delay: 0.8, size: 'text-3xl' },
  { char: '글', x: '5%', y: '50%', delay: 1.2, size: 'text-4xl' },
]

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-8 md:px-6 md:pt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingElements.map((el, i) => (
          <motion.div
            key={i}
            className={`absolute ${el.size} font-bold text-ocean-200/30`}
            style={{ left: el.x, top: el.y }}
            animate={{
              y: [0, -15, 0, 10, 0],
              rotate: [0, 3, -2, 1, 0],
              opacity: [0.2, 0.4, 0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 6 + i,
              delay: el.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {el.char}
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-full">
            <motion.path
              d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
              fill="url(#wave-gradient)"
              animate={{ d: [
                'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z',
                'M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z',
                'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z',
              ]}}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-ocean-200 bg-ocean-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ocean-600">
              <Waves size={12} className="animate-pulse" />
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-[2.75rem] font-bold leading-[1.05] tracking-tight text-ink-900 md:text-[3.5rem]"
          >
            {t('hero.title')}{' '}
            <span className="gradient-text">{t('hero.titleAccent')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-md text-balance text-[15px] leading-relaxed text-stone-500 md:text-base lg:mx-0"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 flex items-center justify-center gap-3 text-xs text-stone-400 lg:justify-start"
          >
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-ocean-400" />
              {t('hero.free')}
            </span>
            <span className="h-3 w-px bg-stone-300" />
            <span>{t('hero.noSignup')}</span>
            <span className="h-3 w-px bg-stone-300" />
            <span>{t('hero.worksInBrowser')}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <a
              href="/app"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-ocean-450 to-cyan-500 px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-ocean-400/30 transition-all hover:shadow-xl hover:shadow-ocean-400/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Mic size={18} strokeWidth={2.5} />
              {t('hero.cta')}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </a>
            <button className="group inline-flex items-center gap-2 rounded-full border border-ocean-200 bg-white/60 px-6 py-3.5 text-[15px] font-medium text-ocean-700 transition-all hover:bg-ocean-50 hover:border-ocean-300">
              <Play size={16} fill="currentColor" className="text-ocean-500" />
              Watch demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-8 lg:justify-start"
          >
            {stats.map((s) => (
              <div key={s.key} className="text-center">
                <div className="text-2xl font-bold tracking-tight text-ink-900 tabular-nums">
                  {s.num}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  {t(`hero.${s.key}`)}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-white to-ocean-50 p-6 shadow-xl shadow-ocean-900/8 border border-ocean-100/60">
            <div className="absolute -top-4 -right-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg shadow-ocean-400/20 border border-ocean-100">
              <div className="text-center">
                <div className="text-xl font-bold text-ocean-600">??</div>
                <div className="text-[10px] font-medium text-stone-400">/100</div>
              </div>
            </div>

            <div className="mb-6 flex items-end justify-center gap-1.5 h-24">
              {[40, 65, 35, 80, 55, 90, 45, 70, 60, 85].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-3 rounded-full bg-gradient-to-t from-ocean-300 to-ocean-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: 'easeOut' }}
                />
              ))}
            </div>

            <div className="text-center">
              <div className="text-sm font-semibold text-stone-700">What's holding back your Chinese?</div>
              <div className="mt-1 text-xs text-stone-400">5 words · free · instant diagnosis</div>
            </div>

            <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-ocean-450 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-ocean-400/20 transition-all hover:shadow-lg">
              Diagnose My Pronunciation →
            </button>
          </div>

          <motion.div
            className="absolute -bottom-3 -left-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg shadow-ocean-900/10 border border-ocean-100"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-lg">🇨🇳</span>
            <span className="text-xs font-medium text-stone-600">Chinese</span>
            <span className="text-[10px] text-ocean-500 font-semibold">4 tones</span>
          </motion.div>

          <motion.div
            className="absolute -top-2 -left-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg shadow-ocean-900/10 border border-ocean-100"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <span className="text-lg">🇯🇵</span>
            <span className="text-xs font-medium text-stone-600">Japanese</span>
            <span className="text-[10px] text-ocean-500 font-semibold">pitch</span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {languages.map((lang) => (
          <motion.button
            key={lang.key}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative overflow-hidden rounded-2xl border ${lang.border} bg-gradient-to-br ${lang.gradient} p-6 text-center transition-shadow hover:shadow-lg hover:shadow-ocean-900/5`}
          >
            <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110">
              {lang.icon}
            </div>
            <span className="text-3xl leading-none">{lang.flag}</span>
            <div className="mt-3">
              <div className="text-sm font-bold text-ink-900">
                {t(`languages.${lang.key}`)}
              </div>
              <div className="mt-0.5 text-xs text-stone-500">
                {t(`languages.${lang.key}Meta`)}
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-ocean-500 opacity-0 transition-opacity group-hover:opacity-100">
              Start learning <ArrowRight size={10} />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Music } from 'lucide-react'
import { speakText } from '../lib/speech'

const toneDemos = [
  { tone: '1st Tone (阴平)', syllable: 'mā (妈)', desc: 'High & Flat (55)', pitch: [0.85, 0.85, 0.85, 0.85], color: 'from-blue-400 to-cyan-500', text: '妈', lang: 'zh' },
  { tone: '2nd Tone (阳平)', syllable: 'má (麻)', desc: 'Rising (35)', pitch: [0.4, 0.55, 0.75, 0.9], color: 'from-emerald-400 to-teal-500', text: '麻', lang: 'zh' },
  { tone: '3rd Tone (上声)', syllable: 'mǎ (马)', desc: 'Dipping & Rising (214)', pitch: [0.45, 0.2, 0.3, 0.75], color: 'from-amber-400 to-orange-500', text: '马', lang: 'zh' },
  { tone: '4th Tone (去声)', syllable: 'mà (骂)', desc: 'Sharp Falling (51)', pitch: [0.9, 0.65, 0.35, 0.15], color: 'from-rose-400 to-red-500', text: '骂', lang: 'zh' },
  { tone: 'Atamadaka (頭高)', syllable: 'áme (雨 - Rain)', desc: 'High to Low Drop', pitch: [0.85, 0.3, 0.3, 0.3], color: 'from-purple-400 to-pink-500', text: '雨', lang: 'ja' },
  { tone: 'Heiban (平板)', syllable: 'amé (飴 - Candy)', desc: 'Low to Flat High', pitch: [0.3, 0.75, 0.75, 0.75], color: 'from-indigo-400 to-sky-500', text: '飴', lang: 'ja' },
]

export default function TonePlayground() {
  const [activeTone, setActiveTone] = useState<number | null>(null)

  const handlePlayTone = (index: number) => {
    const item = toneDemos[index]
    setActiveTone(index)
    speakText(item.text, item.lang, {
      rate: 0.8,
      onEnd: () => setActiveTone(null),
      onError: () => setActiveTone(null),
    })
  }

  return (
    <section id="tools" className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-ocean-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ocean-600">
          <Music size={12} className="animate-bounce" />
          Interactive Soundboard
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          Hear The Pitch Differences Instantly
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-stone-500">
          Tap any card below to listen to the exact pitch contour and tone inflection with real-time acoustic feedback.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {toneDemos.map((demo, index) => {
          const isPlaying = activeTone === index
          return (
            <motion.button
              key={demo.tone}
              onClick={() => handlePlayTone(index)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                isPlaying
                  ? 'border-ocean-500 bg-ocean-50/80 shadow-lg shadow-ocean-500/15 ring-2 ring-ocean-400/30'
                  : 'border-ocean-100 bg-white/80 hover:border-ocean-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  {demo.lang === 'zh' ? '🇨🇳 Tone' : '🇯🇵 Pitch'}
                </span>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                  isPlaying ? 'bg-ocean-500 text-white animate-pulse' : 'bg-ocean-50 text-ocean-600'
                }`}>
                  <Volume2 size={14} className={isPlaying ? 'animate-bounce' : ''} />
                </div>
              </div>

              <div className="mt-3 text-2xl font-bold text-ink-900">{demo.text}</div>
              <div className="text-xs font-semibold text-ocean-600 truncate">{demo.syllable}</div>
              <div className="mt-1 text-[11px] text-stone-500">{demo.desc}</div>

              {/* Mini pitch contour graphic */}
              <div className="mt-4 flex items-end justify-between h-8 px-1 bg-stone-50 rounded-lg py-1">
                {demo.pitch.map((val, pi) => (
                  <motion.div
                    key={pi}
                    className={`w-1.5 rounded-full bg-gradient-to-t ${demo.color}`}
                    animate={{
                      height: isPlaying ? [`${val * 100}%`, '95%', `${val * 100}%`] : `${val * 100}%`,
                    }}
                    transition={{ duration: 0.4, repeat: isPlaying ? Infinity : 0 }}
                  />
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}

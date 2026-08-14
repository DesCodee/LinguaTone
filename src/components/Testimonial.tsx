import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export default function Testimonial() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sand-50 to-white py-16 md:py-24">
      <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-ocean-100/40 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-cyan-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Quote size={32} className="mx-auto mb-4 text-ocean-200" />
          <blockquote className="text-lg font-medium italic leading-relaxed text-stone-600 md:text-xl">
            "I finally understood why native speakers couldn't understand my 3rd tone. The AI feedback showed me exactly what I was doing wrong."
          </blockquote>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ocean-300 to-ocean-500 text-sm font-bold text-white">
              SK
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-stone-800">Sarah K.</div>
              <div className="text-xs text-stone-400">Studying Mandarin for 2 years</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 grid grid-cols-3 gap-4 md:gap-8"
        >
          {[
            { num: '20,000+', label: 'learners', icon: '👥' },
            { num: '2,200+', label: 'practice items', icon: '📚' },
            { num: '4.8', label: 'app rating', icon: '⭐' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group text-center rounded-2xl bg-white/60 backdrop-blur-sm border border-ocean-100/60 p-5 transition-all hover:bg-white hover:shadow-lg hover:shadow-ocean-900/5"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold tracking-tight text-ink-900 md:text-3xl">
                {stat.num}
              </div>
              <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
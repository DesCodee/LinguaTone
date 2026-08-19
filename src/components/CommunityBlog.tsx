import { motion } from 'framer-motion'
import { Instagram, Sparkles, ExternalLink, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const articles = [
  {
    tag: 'Mandarin Guide',
    title: 'The 3rd Tone Secret: Why It’s Rarely a Full Dipping 214 Tone',
    excerpt: 'Native speakers almost always pronounce 3rd tones as a low flat (21) tone unless at the very end of a sentence.',
    readTime: '3 min read',
    gradient: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600',
  },
  {
    tag: 'Japanese Accent',
    title: 'Heiban vs. Atamadaka: Pitch Accent Cheat Sheet',
    excerpt: 'Mastering the initial pitch jump in Japanese will immediately make your spoken speech sound natural and effortless.',
    readTime: '4 min read',
    gradient: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600',
  },
  {
    tag: 'Korean Pronunciation',
    title: 'Batchim (받침) Assimilation: Making Consonant Transitions Smooth',
    excerpt: 'How final consonants blend into the next syllable to eliminate choppy phrasing in spoken Korean.',
    readTime: '3 min read',
    gradient: 'from-ocean-500/10 to-cyan-500/10 border-ocean-500/20 text-ocean-600',
  },
]

export default function CommunityBlog() {
  const navigate = useNavigate()

  return (
    <section id="community" className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 border-t border-ocean-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ocean-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ocean-600">
            <Sparkles size={12} />
            Community & Insights
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            Pronunciation Tips & Daily Drills
          </h2>
          <p className="mt-2 text-sm text-stone-500 max-w-lg">
            Stay consistent with quick guides, tone rule breakdowns, and daily interactive practice clips.
          </p>
        </div>

        {/* Instagram CTA Card */}
        <a
          href="https://www.instagram.com/linguatoneapp?igsh=aDBsd3ltbjA1eGlh"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-[1px] shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 transition-colors group-hover:bg-opacity-95">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-amber-500 text-white shadow-sm">
              <Instagram size={20} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-ink-900 flex items-center gap-1">
                Follow @linguatoneapp
                <ExternalLink size={12} className="text-stone-400 group-hover:text-pink-500 transition-colors" />
              </div>
              <div className="text-[11px] text-stone-500">Daily tone drills & micro-lessons</div>
            </div>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {articles.map((article, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col justify-between rounded-3xl border border-ocean-100 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-ocean-200"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${article.gradient}`}>
                  {article.tag}
                </span>
                <span className="text-[11px] text-stone-400">{article.readTime}</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-900 leading-snug">
                {article.title}
              </h3>
              <p className="mt-2.5 text-xs text-stone-500 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <button
              onClick={() => navigate('/path')}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-600 hover:text-ocean-700 transition-colors cursor-pointer"
            >
              Practice this rule now
              <ArrowRight size={13} />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

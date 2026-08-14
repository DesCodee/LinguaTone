import { useTranslation } from 'react-i18next'
import { Mic, Heart, Github, Twitter } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-ocean-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-cyan-500 text-white">
              <Mic size={14} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-ink-900">LinguaTone</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-stone-400 transition-colors hover:text-ocean-500">
              <Github size={18} />
            </a>
            <a href="#" className="text-stone-400 transition-colors hover:text-ocean-500">
              <Twitter size={18} />
            </a>
          </div>

          <p className="flex items-center gap-1 text-xs text-stone-400">
            Made with <Heart size={12} className="text-red-400" fill="currentColor" /> · {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
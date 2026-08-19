import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, Menu, X, Globe, ChevronDown, Sparkles, User, Map } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

const navItems = [
  { key: 'features', href: '#features' },
  { key: 'practice', href: '#how-it-works' },
  { key: 'tools', href: '#features' },
  { key: 'hsk', href: '/path' },
  { key: 'freeTest', href: '/app' },
]

export default function Header() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/' + href)
      }
    } else {
      navigate(href)
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-sm shadow-ocean-900/5 border-b border-ocean-100' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
        <a href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 text-white shadow-lg shadow-ocean-400/25 transition-transform group-hover:scale-105">
            <Sparkles size={16} className="relative z-10" />
            <div className="absolute inset-0 rounded-xl bg-ocean-400 opacity-0 transition-opacity group-hover:opacity-30 blur-md" />
          </div>
          <span className="text-lg font-bold tracking-tight text-ink-900">LinguaTone</span>
        </a>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.href)}
              className="relative rounded-lg px-3 py-2 text-[13px] font-medium text-stone-500 transition-all hover:text-ocean-600 hover:bg-ocean-50/60 cursor-pointer"
            >
              {t(`header.${item.key}`)}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-stone-500 transition-all hover:text-ocean-600 hover:bg-ocean-50/60 cursor-pointer"
            >
              <Globe size={14} />
              {languages.find((l) => l.code === i18n.language)?.label || 'English'}
              <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-ocean-100 bg-white shadow-xl shadow-ocean-900/10"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code)
                        setLangOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-all hover:bg-ocean-50 cursor-pointer ${
                        i18n.language === lang.code ? 'font-semibold text-ocean-600' : 'text-stone-600'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      {lang.label}
                      {i18n.language === lang.code && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-ocean-450" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => navigate('/path')}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-500 transition-all hover:bg-ocean-50 hover:text-ocean-600 cursor-pointer"
            title="Learning Path"
          >
            <Map size={18} />
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-500 transition-all hover:bg-ocean-50 hover:text-ocean-600 cursor-pointer"
            title="Profile"
          >
            <User size={18} />
          </button>

          <button
            onClick={() => navigate('/app')}
            className="group relative flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-ocean-450 to-cyan-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-ocean-400/25 transition-all hover:shadow-xl hover:shadow-ocean-400/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Mic size={14} strokeWidth={2.5} />
            {t('header.openApp')}
          </button>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-600 transition-colors hover:bg-ocean-50 md:hidden cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-ocean-100 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-0.5 px-4 py-3">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-ocean-50 hover:text-ocean-600 cursor-pointer"
                >
                  {t(`header.${item.key}`)}
                </button>
              ))}
              <div className="my-2 border-t border-ocean-100 pt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code)
                      setMobileOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm cursor-pointer ${
                      i18n.language === lang.code ? 'font-semibold text-ocean-600' : 'text-stone-600'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false)
                  navigate('/path')
                }}
                className="block w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-ocean-50 hover:text-ocean-600 cursor-pointer"
              >
                Learning Path
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false)
                  navigate('/profile')
                }}
                className="block w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-ocean-50 hover:text-ocean-600 cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false)
                  navigate('/app')
                }}
                className="mt-2 block w-full rounded-xl bg-gradient-to-r from-ocean-450 to-cyan-500 py-2.5 text-center text-sm font-semibold text-white cursor-pointer"
              >
                {t('header.openApp')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

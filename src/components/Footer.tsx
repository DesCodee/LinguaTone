import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, Heart, Github, Twitter, Shield, FileText, X, Instagram } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Footer() {
  const { t } = useTranslation()
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null)

  return (
    <footer className="border-t border-ocean-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-cyan-500 text-white shadow-sm">
              <Mic size={14} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-ink-900">LinguaTone</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-500">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-ocean-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Shield size={12} />
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-ocean-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileText size={12} />
              Terms of Service
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/linguatoneapp?igsh=aDBsd3ltbjA1eGlh" 
              target="_blank" 
              rel="noreferrer"
              className="text-stone-400 transition-colors hover:text-pink-500"
              title="Instagram @linguatoneapp"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://github.com/DesCodee/LinguaTone" 
              target="_blank" 
              rel="noreferrer"
              className="text-stone-400 transition-colors hover:text-ocean-500"
              title="GitHub Repository"
            >
              <Github size={18} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-stone-400 transition-colors hover:text-ocean-500"
              title="Twitter / X"
            >
              <Twitter size={18} />
            </a>
          </div>

          <p className="flex items-center gap-1 text-xs text-stone-400">
            Made with <Heart size={12} className="text-red-400" fill="currentColor" /> · {t('footer.copyright')}
          </p>
        </div>
      </div>

      {/* Legal Modal */}
      <AnimatePresence>
        {legalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setLegalModal(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {legalModal === 'privacy' ? (
                <div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2 flex items-center gap-2">
                    <Shield className="text-ocean-500" size={18} />
                    Privacy Policy
                  </h3>
                  <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
                    <p>
                      <strong>1. Voice Data Privacy:</strong> LinguaTone does not store or sell your raw audio recordings on external servers. All pitch detection analysis runs directly in your browser using standard Web Audio APIs.
                    </p>
                    <p>
                      <strong>2. Local Storage:</strong> Your lesson progress, daily goals, and streaks are safely saved in your browser&apos;s local storage.
                    </p>
                    <p>
                      <strong>3. Zero Hidden Costs:</strong> LinguaTone is an open and accessible web application designed to be completely free to practice.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2 flex items-center gap-2">
                    <FileText className="text-ocean-500" size={18} />
                    Terms of Service
                  </h3>
                  <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
                    <p>
                      <strong>1. Usage:</strong> LinguaTone provides pronunciation training tools for personal, non-commercial language learning.
                    </p>
                    <p>
                      <strong>2. Accuracy Disclaimer:</strong> Automated pitch contours and AI feedback are educational guides and should complement practice with native speakers and teachers.
                    </p>
                    <p>
                      <strong>3. Availability:</strong> The service is provided &quot;as is&quot; with 99.9% uptime on modern browsers supporting Web Audio &amp; Speech Synthesis.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setLegalModal(null)}
                className="mt-6 w-full rounded-xl bg-ocean-500 py-2.5 text-xs font-semibold text-white hover:bg-ocean-600 transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  )
}

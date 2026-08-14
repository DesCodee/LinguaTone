import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, Volume2, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudioRecorder } from '../hooks/useAudioRecorder'

const samplePhrases = [
  { text: '你好，我想学中文', pinyin: 'nǐ hǎo wǒ xiǎng xué zhōng wén', translation: 'Hi, I want to learn Chinese' },
  { text: '谢谢你的帮助', pinyin: 'xiè xie nǐ de bāng zhù', translation: 'Thank you for your help' },
  { text: '今天天气很好', pinyin: 'jīn tiān tiān qì hěn hǎo', translation: 'The weather is nice today' },
]

export default function AppDashboard() {
  const { t } = useTranslation()
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [phase, setPhase] = useState<'listen' | 'record' | 'result'>('listen')
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()

  const phrase = samplePhrases[currentPhrase]

  return (
    <div className="min-h-screen bg-ink-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-ocean-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative flex items-center justify-between border-b border-ink-600 px-4 py-3 md:px-6">
        <a href="/" className="flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-white">
          <ArrowLeft size={16} />
          Back
        </a>
        <div className="flex items-center gap-3 flex-1 mx-6 max-w-md">
          <div className="h-1.5 flex-1 rounded-full bg-ink-600 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ocean-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${((currentPhrase + 1) / samplePhrases.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">{currentPhrase + 1}/{samplePhrases.length}</span>
        </div>
        <button
          onClick={() => {
            setCurrentPhrase((p) => (p + 1) % samplePhrases.length)
            setPhase('listen')
          }}
          className="text-sm text-stone-400 transition-colors hover:text-white"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-12 md:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={phrase.text}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-3xl border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-700 p-8 text-center md:p-10 shadow-2xl shadow-black/20"
          >
            <div className="text-3xl font-medium tracking-wide text-white md:text-4xl">
              {phrase.text}
            </div>
            <div className="mt-3 text-lg text-ocean-300 font-medium">{phrase.pinyin}</div>
            <div className="mt-1.5 text-sm text-stone-500">{phrase.translation}</div>

            <button
              onClick={() => setPhase('record')}
              className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-ink-600 px-5 py-2 text-sm font-medium text-ocean-300 transition-all hover:bg-ink-500 hover:text-ocean-200"
            >
              <Volume2 size={16} />
              {t('voiceCheck.hearFirst')}
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-stone-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          {t('voiceCheck.privacy')}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <motion.button
            onClick={() => {
              if (isRecording) {
                stopRecording()
                setPhase('result')
              } else {
                startRecording()
                setPhase('record')
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all ${
              isRecording
                ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-2xl shadow-red-500/30'
                : 'bg-gradient-to-br from-ocean-400 to-cyan-500 shadow-2xl shadow-ocean-400/30'
            }`}
          >
            {isRecording && (
              <div className="absolute inset-0 rounded-full animate-ping bg-red-400/30" />
            )}
            <Mic size={36} strokeWidth={1.5} className="text-white relative z-10" />
          </motion.button>
          <span className="text-sm font-medium text-stone-400">
            {isRecording ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                Recording...
              </span>
            ) : (
              t('voiceCheck.tapToRecord')
            )}
          </span>
        </div>

        <AnimatePresence>
          {phase === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mt-8 w-full rounded-3xl border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-700 p-6 md:p-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-stone-400">Your score</div>
                  <div className="text-4xl font-bold text-ocean-300">72<span className="text-xl text-stone-500">/100</span></div>
                </div>
                <div className="relative h-20 w-20">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-ink-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <motion.path className="text-ocean-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="72, 100"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: "72, 100" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-ocean-300">72</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { label: 'Tones', value: 75, color: 'from-ocean-400 to-cyan-400' },
                  { label: 'Sounds', value: 68, color: 'from-cyan-400 to-teal-400' },
                  { label: 'Intonation', value: 82, color: 'from-teal-400 to-emerald-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="w-20 text-xs font-medium text-stone-400">{item.label}</span>
                    <div className="h-2.5 flex-1 rounded-full bg-ink-600 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-ocean-300">{item.value}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-xl bg-ink-600/50 p-4">
                <Sparkles size={16} className="text-ocean-400" />
                <span className="text-xs text-stone-300">Focus on your 3rd tone — it's 15% lower than native speakers</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
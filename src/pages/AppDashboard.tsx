import { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, Volume2, ArrowLeft, RotateCcw, Sparkles, ChevronRight, Flame } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useStreak } from '../hooks/useStreak'
import { useProgress } from '../hooks/useProgress'


const samplePhrases = [
  { text: '你好，我想学中文', pinyin: 'nǐ hǎo wǒ xiǎng xué zhōng wén', translation: 'Hi, I want to learn Chinese', lang: 'zh' },
  { text: '谢谢你的帮助', pinyin: 'xiè xie nǐ de bāng zhù', translation: 'Thank you for your help', lang: 'zh' },
  { text: '今天天气很好', pinyin: 'jīn tiān tiān qì hěn hǎo', translation: 'The weather is nice today', lang: 'zh' },
  { text: 'こんにちは', pinyin: 'kon-ni-chi-wa', translation: 'Hello', lang: 'ja' },
  { text: '안녕하세요', pinyin: 'an-nyeong-ha-se-yo', translation: 'Hello', lang: 'ko' },
]

const languages = [
  { code: 'zh', flag: '🇨🇳', name: 'Chinese' },
  { code: 'ja', flag: '🇯🇵', name: 'Japanese' },
  { code: 'ko', flag: '🇰🇷', name: 'Korean' },
]

function generatePitchData() {
  const native = []
  const user = []
  for (let i = 0; i <= 120; i++) {
    const x = i / 120
    const nativeY = 0.5 + 0.25 * Math.sin(x * Math.PI * 4) + 0.08 * Math.sin(x * Math.PI * 9)
    const userY = nativeY + (Math.random() - 0.5) * 0.18 + 0.06 * Math.sin(x * Math.PI * 12)
    native.push({ x, y: Math.max(0.1, Math.min(0.9, nativeY)) })
    user.push({ x, y: Math.max(0.1, Math.min(0.9, userY)) })
  }
  return { native, user }
}

export default function AppDashboard() {
  const { t } = useTranslation()
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [phase, setPhase] = useState<'listen' | 'record' | 'result'>('listen')
  const [selectedLang, setSelectedLang] = useState('zh')
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { streak } = useStreak()
  const { addSession: saveSessionToStorage } = useProgress()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const phrase = samplePhrases[currentPhrase]
  const pitchData = useMemo(() => generatePitchData(), [currentPhrase])

  // Canvas pitch contour
  useEffect(() => {
    if (phase !== 'result' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    ctx.clearRect(0, 0, w, h)

    // Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
    ctx.lineWidth = 1
    for (let i = 1; i < 5; i++) {
      const y = (h / 5) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Fill between curves
    ctx.beginPath()
    pitchData.user.forEach((p, i) => {
      const x = p.x * w
      const y = h - p.y * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    for (let i = pitchData.native.length - 1; i >= 0; i--) {
      const p = pitchData.native[i]
      ctx.lineTo(p.x * w, h - p.y * h)
    }
    ctx.closePath()
    ctx.fillStyle = 'rgba(34, 211, 238, 0.06)'
    ctx.fill()

    // Native curve
    ctx.beginPath()
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    pitchData.native.forEach((p, i) => {
      const x = p.x * w
      const y = h - p.y * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // User curve
    ctx.beginPath()
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    pitchData.user.forEach((p, i) => {
      const x = p.x * w
      const y = h - p.y * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }, [phase, pitchData])

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording()
      setPhase('result')
      // Сохраняем сессию
      saveSessionToStorage({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        phrase: phrase.text,
        lang: phrase.lang,
        scores: {
          tones: 75,
          sounds: 68,
          rhythm: 82,
          overall: 72,
        },
        mistakes: ['3rd tone', 'initial n/l'],
      })
    } else {
      startRecording()
      setPhase('record')
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 text-white relative overflow-hidden selection:bg-ocean-500/30">
      {/* Background orbs */}
      <div className="fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-ocean-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Top bar */}
      <div className="relative flex items-center justify-between border-b border-ink-700/50 px-4 py-4 md:px-6">
        <a href="/" className="flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-white">
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </a>

        {/* Streak */}
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5">
          <Flame size={14} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-300">{streak}</span>
          <span className="text-[10px] text-amber-400/70 uppercase tracking-wider hidden sm:inline">day streak</span>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedLang === lang.code
                  ? 'bg-ocean-500/15 text-ocean-300 border border-ocean-500/30'
                  : 'text-stone-500 hover:text-stone-300 border border-transparent hover:bg-ink-800'
              }`}
            >
              <span>{lang.flag}</span>
              <span className="hidden sm:inline">{lang.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentPhrase((p) => (p + 1) % samplePhrases.length)
            setPhase('listen')
          }}
          className="flex items-center gap-1 text-sm text-stone-400 transition-colors hover:text-white"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-8 md:py-12">
        {/* Progress dots */}
        <div className="mb-8 flex items-center gap-2">
          {samplePhrases.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentPhrase ? 'w-8 bg-ocean-400' : i < currentPhrase ? 'w-1.5 bg-ocean-600' : 'w-1.5 bg-ink-600'
              }`}
            />
          ))}
        </div>

        {/* Phrase card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phrase.text}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-3xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-8 md:p-10 text-center shadow-2xl shadow-black/20"
          >
            <div className="text-4xl md:text-5xl font-medium tracking-wide text-white mb-3">
              {phrase.text}
            </div>
            <div className="text-lg md:text-xl text-ocean-300 font-medium tracking-wider">
              {phrase.pinyin}
            </div>
            <div className="mt-2 text-sm text-stone-500">
              {phrase.translation}
            </div>

            {phase === 'listen' && (
              <button
                onClick={() => setPhase('record')}
                className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-ink-700/50 border border-ink-600 px-5 py-2.5 text-sm font-medium text-ocean-300 transition-all hover:bg-ink-700 hover:text-ocean-200"
              >
                <Volume2 size={16} />
                {t('voiceCheck.hearFirst')}
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Record button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <motion.button
            onClick={handleRecordToggle}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all ${
              isRecording
                ? 'bg-gradient-to-br from-red-400 to-rose-600 shadow-2xl shadow-red-500/30'
                : 'bg-gradient-to-br from-ocean-400 to-cyan-500 shadow-2xl shadow-ocean-500/30'
            }`}
          >
            {isRecording ? (
              <>
                <div className="absolute inset-0 rounded-full animate-ping bg-red-400/20" />
                <div className="absolute -inset-3 rounded-full border border-red-400/20 animate-pulse" />
              </>
            ) : (
              <div className="absolute -inset-3 rounded-full border border-ocean-400/20 animate-pulse" />
            )}
            <Mic size={32} strokeWidth={1.5} className="text-white relative z-10" />
          </motion.button>
          
          <span className="text-sm font-medium text-stone-400">
            {isRecording ? (
              <span className="flex items-center gap-2 text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                Recording...
              </span>
            ) : phase === 'result' ? (
              'Tap to re-record'
            ) : (
              t('voiceCheck.tapToRecord')
            )}
          </span>
        </div>

        {/* Results panel */}
        <AnimatePresence>
          {phase === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-10 w-full space-y-5"
            >
              {/* Score header */}
              <div className="flex items-center justify-between rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-6">
                <div>
                  <div className="text-sm text-stone-400 mb-1">Pronunciation Score</div>
                  <div className="text-5xl font-bold text-white tracking-tight">
                    72<span className="text-2xl text-stone-500 font-normal">/100</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ocean-500/10 border border-ocean-500/20 px-3 py-1 text-xs font-medium text-ocean-300">
                    <Sparkles size={12} />
                    Good effort! Focus on tones
                  </div>
                </div>
                
                {/* Circular progress */}
                <div className="relative h-24 w-24 shrink-0">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-ink-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <motion.path 
                      className="text-ocean-400" 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: "72, 100" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">72</span>
                  </div>
                </div>
              </div>

              {/* Pitch contour */}
              <div className="rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-stone-300">Pitch Contour</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-stone-400">
                      <span className="h-0.5 w-4 bg-ocean-400 rounded-full" />
                      Native
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-400">
                      <span className="h-0.5 w-4 bg-cyan-400 rounded-full" />
                      You
                    </span>
                  </div>
                </div>
                <canvas 
                  ref={canvasRef} 
                  className="w-full rounded-xl bg-ink-900/50"
                  style={{ width: '100%', height: '140px' }}
                />
              </div>

              {/* Skills */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Tones', value: 75, color: 'bg-ocean-400', text: 'text-ocean-300' },
                  { label: 'Sounds', value: 68, color: 'bg-cyan-400', text: 'text-cyan-300' },
                  { label: 'Rhythm', value: 82, color: 'bg-teal-400', text: 'text-teal-300' },
                ].map((skill) => (
                  <div key={skill.label} className="rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-4 text-center">
                    <div className="text-xs text-stone-500 mb-2">{skill.label}</div>
                    <div className={`text-2xl font-bold ${skill.text} mb-2`}>{skill.value}%</div>
                    <div className="h-1.5 w-full rounded-full bg-ink-700 overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${skill.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Feedback */}
              <div className="rounded-2xl border border-ocean-500/20 bg-gradient-to-br from-ocean-900/20 to-ink-800/40 backdrop-blur-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ocean-500/20 text-ocean-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ocean-200 mb-1">AI Feedback</h4>
                    <p className="text-sm text-stone-400 leading-relaxed">
                      Your 3rd tone starts too high compared to native speakers. Try starting lower and rising more gradually. The pitch contour shows your curve (cyan) deviating upward from the native pattern (blue) at syllables 2–4.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={() => {
                  setCurrentPhrase((p) => (p + 1) % samplePhrases.length)
                  setPhase('listen')
                }}
                className="group w-full rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ocean-500/25 transition-all hover:shadow-xl hover:shadow-ocean-500/30 flex items-center justify-center gap-2"
              >
                Next Phrase
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy */}
        <div className="mt-8 flex items-center gap-1.5 text-xs text-stone-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          {t('voiceCheck.privacy')}
        </div>
      </div>
    </div>
  )
}
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { 
  Mic, Volume2, ArrowLeft, RotateCcw, Sparkles, ChevronRight, 
  Flame, BookOpen, Target, TrendingUp, Trophy, Bell
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useStreak } from '../hooks/useStreak'
import { useProgress } from '../hooks/useProgress'
import { useLessons } from '../hooks/useLessons'
import { useReview } from '../hooks/useReview'
import { useDailyGoal } from '../hooks/useDailyGoal'
import { lessons, getLessonsByLang } from '../data/lessons'
import { requestNotificationPermission } from '../lib/notifications'
import { speakText, stopSpeech, playSuccessChime } from '../lib/speech'
import { evaluatePronunciation, getNativePitchContour, PitchPoint } from '../lib/audioAnalysis'
import DailyGoalSetup from '../components/DailyGoalSetup'

// ===== Confetti particles =====
function Confetti() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    color: ['#0ea5e9', '#22d3ee', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}%`, opacity: 1, scale: 0 }}
          animate={{ 
            y: '100vh', 
            opacity: 0, 
            scale: 1,
            rotate: Math.random() * 720 - 360 
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay, 
            ease: 'easeOut' 
          }}
          className="absolute h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  )
}

// ===== Audio visualizer bars =====
function AudioVisualizer({ isRecording, volume }: { isRecording: boolean; volume: number }) {
  const [bars, setBars] = useState<number[]>(Array(12).fill(4))

  useEffect(() => {
    if (!isRecording) {
      setBars(Array(12).fill(4))
      return
    }
    const factor = Math.min(1, Math.max(0.15, volume * 18))
    setBars(
      Array(12)
        .fill(0)
        .map(() => 4 + factor * (10 + Math.random() * 24))
    )
  }, [isRecording, volume])

  return (
    <div className="flex items-end justify-center gap-1 h-8 my-2">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-ocean-500 to-cyan-400"
          animate={{ height: `${Math.max(4, Math.min(32, h))}px` }}
          transition={{ duration: 0.06 }}
        />
      ))}
    </div>
  )
}

const samplePhrases = [
  { text: '你好，我想学中文', pinyin: 'nǐ hǎo, wǒ xiǎng xué zhōng wén', translation: 'Hi, I want to learn Chinese', lang: 'zh', toneTip: 'Natural greetings tone flow' },
  { text: '谢谢你的帮助', pinyin: 'xiè xie nǐ de bāng zhù', translation: 'Thank you for your help', lang: 'zh', toneTip: '4th tone downbeat on xiè' },
  { text: '今天天气很好', pinyin: 'jīn tiān tiān qì hěn hǎo', translation: 'The weather is nice today', lang: 'zh', toneTip: 'High flat 1st tones + dipping 3rd' },
  { text: 'こんにちは', pinyin: 'kon-ni-chi-wa', translation: 'Hello / Good afternoon', lang: 'ja', toneTip: 'Heiban flat pitch accent' },
  { text: '안녕하세요', pinyin: 'an-nyeong-ha-se-yo', translation: 'Hello / Good day', lang: 'ko', toneTip: 'Smooth rise on ha, gentle fall on se-yo' },
]

const languages = [
  { code: 'zh', flag: '🇨🇳', name: 'Chinese' },
  { code: 'ja', flag: '🇯🇵', name: 'Japanese' },
  { code: 'ko', flag: '🇰🇷', name: 'Korean' },
]

export default function AppDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0)
  const [phase, setPhase] = useState<'listen' | 'record' | 'result'>('listen')
  const [selectedLang, setSelectedLang] = useState('zh')
  const [showComplete, setShowComplete] = useState(false)
  const [mode, setMode] = useState<'lesson' | 'review'>('lesson')
  const [showConfetti, setShowConfetti] = useState(false)
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [playbackRate, setPlaybackRate] = useState<number>(0.85)
  const [currentScores, setCurrentScores] = useState({
    tones: 85,
    sounds: 80,
    rhythm: 82,
    overall: 83,
    feedback: 'Pronounce the phrase clearly and match the target tone contour.',
  })

  const [pitchData, setPitchData] = useState<{ user: PitchPoint[]; native: PitchPoint[] }>({
    user: [],
    native: [],
  })

  const { isRecording, currentVolume, startRecording, stopRecording } = useAudioRecorder()
  const { streak } = useStreak()
  const { addSession: saveSessionToStorage } = useProgress()
  const { markComplete, selectLesson, currentLessonId } = useLessons()
  const reviewItems = useReview()
  const { goal, progress, percent, isGoalReached, showSetup, setShowSetup, setGoal, addSessionTime } = useDailyGoal()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const goalWasReached = useRef(false)

  // Stop speech synthesis on phrase or mode changes / unmount
  useEffect(() => {
    return () => {
      stopSpeech()
    }
  }, [currentPhraseIdx, mode])

  // Check if goal just reached for confetti
  useEffect(() => {
    if (isGoalReached && !goalWasReached.current && !showSetup) {
      goalWasReached.current = true
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [isGoalReached, showSetup])

  const currentLesson = useMemo(() => {
    if (!currentLessonId) {
      const langLessons = getLessonsByLang(selectedLang)
      return langLessons[0] || null
    }
    return lessons.find((l) => l.id === currentLessonId) || null
  }, [currentLessonId, selectedLang])

  const phrases = useMemo(() => {
    if (mode === 'review' && reviewItems.length > 0) {
      return reviewItems.map((r) => {
        let pinyin = ''
        let translation = 'Review item'
        let toneTip: string | undefined = undefined
        for (const lesson of lessons) {
          const found = lesson.phrases.find((p) => p.text === r.phrase)
          if (found) {
            pinyin = found.pinyin
            translation = found.translation
            toneTip = found.toneTip
            break
          }
        }
        return { text: r.phrase, pinyin, translation, toneTip, lang: r.lang, lastScore: r.lastScore }
      })
    }
    if (currentLesson) return currentLesson.phrases.map((p) => ({ ...p, lang: currentLesson.lang }))
    return samplePhrases
  }, [mode, reviewItems, currentLesson])

  const phrase = phrases[currentPhraseIdx]

  // Update target native contour when phrase changes
  useEffect(() => {
    if (phrase) {
      const nativePoints = getNativePitchContour(phrase.text, phrase.pinyin, phrase.lang)
      setPitchData((prev) => ({
        ...prev,
        native: nativePoints,
      }))
    }
  }, [phrase])

  useEffect(() => {
    if (currentLesson && mode === 'lesson') {
      setSelectedLang(currentLesson.lang)
    }
  }, [currentLesson, mode])

  // Canvas waveform rendering
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

    // Background grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
    ctx.lineWidth = 1
    for (let i = 1; i < 5; i++) {
      const y = (h / 5) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    if (pitchData.native.length > 0 && pitchData.user.length > 0) {
      // Area fill between curves
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
    }

    // Target native pitch curve (Sky Blue)
    if (pitchData.native.length > 0) {
      ctx.beginPath()
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      pitchData.native.forEach((p, i) => {
        const x = p.x * w
        const y = h - p.y * h
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    // User's voice pitch curve (Bright Cyan / Emerald)
    if (pitchData.user.length > 0) {
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
    }
  }, [phase, pitchData])

  // Play audio helper with instant voice trigger
  const handlePlayAudio = useCallback((rate: number = playbackRate) => {
    if (!phrase) return
    setIsPlayingAudio(true)
    speakText(phrase.text, phrase.lang, {
      rate,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    })
  }, [phrase, playbackRate])

  // "Hear it first" action: instantly plays native voice then enables record phase
  const handleHearFirst = useCallback(() => {
    if (!phrase) return
    setIsPlayingAudio(true)
    speakText(phrase.text, phrase.lang, {
      rate: playbackRate,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => {
        setIsPlayingAudio(false)
        setPhase('record')
      },
      onError: () => {
        setIsPlayingAudio(false)
        setPhase('record')
      },
    })
  }, [phrase, playbackRate])

  const handleRecordToggle = () => {
    stopSpeech()
    setIsPlayingAudio(false)

    if (isRecording) {
      const recordingResult = stopRecording()
      setPhase('result')

      if (phrase) {
        // Real acoustic and tone pitch evaluation
        const evalResult = evaluatePronunciation(
          recordingResult.frames,
          recordingResult.duration,
          phrase
        )

        setCurrentScores({
          tones: evalResult.tones,
          sounds: evalResult.sounds,
          rhythm: evalResult.rhythm,
          overall: evalResult.overall,
          feedback: evalResult.feedback,
        })

        setPitchData({
          user: evalResult.userContour,
          native: evalResult.nativeContour,
        })

        if (evalResult.overall >= 80) {
          playSuccessChime()
        }

        saveSessionToStorage({
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          phrase: phrase.text,
          lang: phrase.lang,
          scores: {
            tones: evalResult.tones,
            sounds: evalResult.sounds,
            rhythm: evalResult.rhythm,
            overall: evalResult.overall,
          },
          mistakes: evalResult.mistakes,
        })
        addSessionTime(Math.max(1, Math.round(recordingResult.duration / 60) || 1))
      }
    } else {
      startRecording()
      setPhase('record')
    }
  }

  const handleNext = () => {
    stopSpeech()
    setIsPlayingAudio(false)
    const nextIdx = currentPhraseIdx + 1
    if (nextIdx >= phrases.length) {
      if (mode === 'lesson' && currentLesson) markComplete(currentLesson.id)
      setShowComplete(true)
      playSuccessChime()
      if (progress.sessionsCount === 0 && !notifEnabled) {
        requestNotificationPermission().then((granted) => {
          if (granted) setNotifEnabled(true)
        })
      }
    } else {
      setCurrentPhraseIdx(nextIdx)
      setPhase('listen')
    }
  }

  const isLastPhrase = currentPhraseIdx === phrases.length - 1

  const startReview = () => {
    setMode('review')
    setCurrentPhraseIdx(0)
    setPhase('listen')
  }

  const startLesson = () => {
    setMode('lesson')
    setCurrentPhraseIdx(0)
    setPhase('listen')
  }

  return (
    <div className="min-h-screen bg-ink-950 text-white relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-ocean-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      {showConfetti && <Confetti />}

      {/* Daily Goal Setup Modal */}
      <DailyGoalSetup
        open={showSetup}
        onClose={() => setShowSetup(false)}
        onSelect={(mins) => setGoal(mins)}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-800 bg-ink-950/90 backdrop-blur-xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-ink-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-white">
              {mode === 'review' ? 'Mistake Review' : currentLesson ? currentLesson.title : 'Voice Check'}
            </h1>
            <p className="text-[11px] text-stone-400">
              {mode === 'review' ? 'Targeted accent correction' : currentLesson ? currentLesson.description : 'Pronunciation & tone analysis'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Daily streak indicator */}
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-400">
            <Flame size={14} className="fill-amber-400" />
            <span className="font-semibold">{streak}</span>
            <span className="hidden sm:inline text-amber-300/80">days</span>
          </div>

          {/* Goal button */}
          <button
            onClick={() => setShowSetup(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink-800 border border-ink-700 px-3 py-1 text-xs text-stone-300 hover:bg-ink-700 transition-colors cursor-pointer"
            title="Configure daily practice goal"
          >
            <Target size={13} className={isGoalReached ? 'text-emerald-400' : 'text-ocean-400'} />
            <span className="hidden sm:inline font-medium">{percent}%</span>
          </button>

          {/* Language selector in voice check mode */}
          {mode === 'lesson' && (
            <div className="flex items-center gap-1 bg-ink-900 rounded-full p-0.5 border border-ink-800">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code)
                    setCurrentPhraseIdx(0)
                    setPhase('listen')
                    const langLessons = getLessonsByLang(lang.code)
                    if (langLessons[0]) selectLesson(langLessons[0].id)
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedLang === lang.code
                      ? 'bg-ocean-500 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span className="mr-1">{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.name}</span>
                </button>
              ))}
            </div>
          )}

          {reviewItems.length > 0 && mode === 'lesson' && (
            <button
              onClick={startReview}
              className="flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 transition-all hover:bg-red-500/20 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Review</span>
              <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full text-[10px]">{reviewItems.length}</span>
            </button>
          )}
          {mode === 'review' && (
            <button
              onClick={startLesson}
              className="flex items-center gap-1.5 rounded-full bg-ocean-500/10 border border-ocean-500/20 px-3 py-1.5 text-xs font-medium text-ocean-300 transition-all hover:bg-ocean-500/20 cursor-pointer"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Lesson</span>
            </button>
          )}
          <button
            onClick={() => navigate('/path')}
            className="flex items-center gap-1.5 rounded-full bg-ink-800 px-3 py-1.5 text-xs text-stone-300 border border-ink-700 hover:bg-ink-700 transition-colors cursor-pointer"
            title="Learning Path"
          >
            <BookOpen size={14} className="text-ocean-400" />
            <span className="hidden sm:inline">Path</span>
          </button>
          <button
            onClick={() => {
              stopSpeech()
              setCurrentPhraseIdx((p) => (p + 1) % phrases.length)
              setPhase('listen')
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-ink-800 transition-colors cursor-pointer"
            title="Next phrase"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-8 md:py-12">
        {/* Daily Goal Progress */}
        {goal.enabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 w-full"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-stone-300">
                <Target size={13} className="text-ocean-400" />
                Daily Practice Goal
              </span>
              <span>{progress.minutesDone} / {goal.minutes} min ({percent}%)</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-ink-800 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isGoalReached ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-ocean-500 to-cyan-400'}`}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Progress dots */}
        <div className="mb-8 flex items-center gap-2">
          {phrases.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                stopSpeech()
                setCurrentPhraseIdx(idx)
                setPhase('listen')
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentPhraseIdx 
                  ? 'w-8 bg-ocean-400' 
                  : idx < currentPhraseIdx 
                  ? 'w-2 bg-ocean-400/40' 
                  : 'w-2 bg-ink-800'
              }`}
            />
          ))}
        </div>

        {/* Practice Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${currentPhraseIdx}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="relative w-full rounded-3xl border border-ink-800 bg-ink-900/60 backdrop-blur-xl p-8 text-center shadow-2xl"
          >
            {/* Speed control & audio button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1 bg-ink-800/80 rounded-full p-1 border border-ink-700/50">
                <button
                  onClick={() => {
                    setPlaybackRate(0.75)
                    handlePlayAudio(0.75)
                  }}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                    playbackRate === 0.75 ? 'bg-ocean-500 text-white font-semibold shadow-sm' : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Play at 0.75x slow speed"
                >
                  <span>🐢</span>
                  <span>0.75x</span>
                </button>
                <button
                  onClick={() => {
                    setPlaybackRate(0.95)
                    handlePlayAudio(0.95)
                  }}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                    playbackRate !== 0.75 ? 'bg-ocean-500 text-white font-semibold shadow-sm' : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Play at 1.0x normal speed"
                >
                  <span>🐇</span>
                  <span>1.0x</span>
                </button>
              </div>

              <button
                onClick={() => handlePlayAudio()}
                disabled={isPlayingAudio}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-ocean-500/20 text-ocean-300 border-ocean-500/40 animate-pulse'
                    : 'bg-ink-700/60 text-stone-300 border-ink-600/50 hover:bg-ink-700 hover:text-white'
                }`}
                title="Listen to native pronunciation"
              >
                <Volume2 size={15} className={isPlayingAudio ? 'animate-bounce text-ocean-400' : 'text-ocean-300'} />
                <span>{isPlayingAudio ? 'Playing...' : 'Audio'}</span>
              </button>
            </div>

            {/* Target script */}
            <div className="text-4xl md:text-5xl font-medium tracking-wide text-white mb-3">
              {phrase.text}
            </div>

            {/* Pinyin / Romaji / Reading */}
            {phrase.pinyin && (
              <div className="text-lg md:text-xl text-ocean-300 font-medium tracking-wider mb-2">
                {phrase.pinyin}
              </div>
            )}

            {/* Translation */}
            <div className="text-sm text-stone-400">
              {phrase.translation}
            </div>

            {/* Tone & Pitch guide badge */}
            {'toneTip' in phrase && phrase.toneTip && (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-ocean-500/10 border border-ocean-500/20 px-3.5 py-1.5 text-xs text-ocean-200">
                <Sparkles size={13} className="text-ocean-400 shrink-0" />
                <span>{phrase.toneTip}</span>
              </div>
            )}
            
            {/* Last score indicator in review mode */}
            {mode === 'review' && 'lastScore' in phrase && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1">
                <TrendingUp size={12} className="text-red-400" />
                <span className="text-xs text-red-300">Last attempt: {(phrase as any).lastScore}%</span>
              </div>
            )}

            {/* "Hear it first" primary action button */}
            {phase === 'listen' && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleHearFirst}
                  disabled={isPlayingAudio}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-ocean-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-500/25 transition-all hover:shadow-xl hover:shadow-ocean-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-80 cursor-pointer"
                >
                  <Volume2 size={18} className={isPlayingAudio ? 'animate-bounce' : ''} />
                  <span>{isPlayingAudio ? 'Listening...' : t('voiceCheck.hearFirst')}</span>
                </button>
                <button
                  onClick={() => setPhase('record')}
                  className="text-xs text-stone-400 hover:text-stone-200 transition-colors py-2 px-3 cursor-pointer"
                >
                  Skip to recording →
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Audio Visualizer during recording */}
        {isRecording && (
          <AudioVisualizer isRecording={isRecording} volume={currentVolume} />
        )}

        {/* Record button */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <motion.button
            onClick={handleRecordToggle}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all cursor-pointer ${
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
                Recording voice... Tap when finished
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
                    {currentScores.overall}<span className="text-2xl text-stone-500 font-normal">/100</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ocean-500/10 border border-ocean-500/20 px-3 py-1 text-xs font-medium text-ocean-300">
                    <Sparkles size={12} />
                    {currentScores.overall >= 80 ? 'Excellent pronunciation!' : 'Good effort! Refine tone pitch.'}
                  </div>
                </div>
                
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
                      animate={{ strokeDasharray: `${currentScores.overall}, 100` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{currentScores.overall}</span>
                  </div>
                </div>
              </div>

              {/* Pitch contour */}
              <div className="rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-stone-300">Pitch Contour</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => handlePlayAudio()}
                      className="inline-flex items-center gap-1 text-ocean-300 hover:text-ocean-200 transition-colors mr-2 cursor-pointer"
                    >
                      <Volume2 size={13} />
                      Hear native
                    </button>
                    <span className="flex items-center gap-1.5 text-stone-400">
                      <span className="h-0.5 w-4 bg-ocean-400 rounded-full" />
                      Target
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-400">
                      <span className="h-0.5 w-4 bg-cyan-400 rounded-full" />
                      Your Voice
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
                  { label: 'Tones', value: currentScores.tones, color: 'bg-ocean-400', text: 'text-ocean-300' },
                  { label: 'Sounds', value: currentScores.sounds, color: 'bg-cyan-400', text: 'text-cyan-300' },
                  { label: 'Rhythm', value: currentScores.rhythm, color: 'bg-teal-400', text: 'text-teal-300' },
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
                    <h4 className="text-sm font-semibold text-ocean-200 mb-1">Acoustic Pronunciation Diagnosis</h4>
                    <p className="text-sm text-stone-400 leading-relaxed">
                      {currentScores.feedback}
                    </p>
                  </div>
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                className="group w-full rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ocean-500/25 transition-all hover:shadow-xl hover:shadow-ocean-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLastPhrase ? (mode === 'review' ? 'Finish Review' : currentLesson ? 'Complete Lesson' : 'Next Phrase') : 'Next Phrase'}
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy note */}
        <div className="mt-8 flex items-center gap-1.5 text-xs text-stone-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Voice data is processed entirely in your browser. No audio recordings leave your device.</span>
        </div>
      </div>

      {/* Lesson Complete Modal */}
      <AnimatePresence>
        {showComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-ink-800 bg-ink-900 p-6 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 mb-4">
                <Trophy size={32} />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {mode === 'review' ? 'Review Complete!' : 'Lesson Complete!'}
              </h3>
              <p className="text-sm text-stone-400 mb-6">
                {mode === 'review' 
                  ? `Great work reviewing your tricky tone patterns.`
                  : `You finished "${currentLesson?.title || 'Daily Session'}". Progress saved!`}
              </p>

              {/* Notification opt-in prompt */}
              {!notifEnabled && (
                <div className="mb-6 rounded-2xl bg-ink-800/80 p-4 text-left border border-ink-700">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ocean-500/20 text-ocean-400">
                      <Bell size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-white">Daily Practice Reminder</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        Get a gentle notification at your preferred time to maintain your streak.
                      </div>
                      <button
                        onClick={async () => {
                          const ok = await requestNotificationPermission()
                          if (ok) setNotifEnabled(true)
                        }}
                        className="mt-2 text-xs font-medium text-ocean-400 hover:text-ocean-300 transition-colors cursor-pointer"
                      >
                        Enable reminders →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowComplete(false)
                    setCurrentPhraseIdx(0)
                    setPhase('listen')
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-500/25 hover:shadow-xl transition-all cursor-pointer"
                >
                  Practice Again
                </button>
                <button
                  onClick={() => navigate('/path')}
                  className="w-full rounded-xl bg-ink-800 py-3 text-sm font-medium text-stone-300 hover:bg-ink-700 hover:text-white transition-colors cursor-pointer"
                >
                  Choose Next Lesson
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-2 text-xs text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                >
                  View Full Analytics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

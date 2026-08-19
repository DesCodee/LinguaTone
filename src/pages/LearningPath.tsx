import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, CheckCircle2, Play, Star, BookOpen, Map, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLessons } from '../hooks/useLessons'
import { speakText, stopSpeech } from '../lib/speech'

const langs = [
  { code: 'zh', flag: '🇨🇳', name: 'Chinese' },
  { code: 'ja', flag: '🇯🇵', name: 'Japanese' },
  { code: 'ko', flag: '🇰🇷', name: 'Korean' },
]

export default function LearningPath() {
  const navigate = useNavigate()
  const { getLangLessons, selectLesson } = useLessons()
  const [selectedLang, setSelectedLang] = useState('zh')
  const [playingLessonId, setPlayingLessonId] = useState<string | null>(null)

  const lessons = getLangLessons(selectedLang)

  const handlePreviewAudio = (e: React.MouseEvent, lesson: any) => {
    e.stopPropagation()
    if (!lesson.phrases || lesson.phrases.length === 0) return
    const firstPhrase = lesson.phrases[0]
    setPlayingLessonId(lesson.id)
    speakText(firstPhrase.text, lesson.lang, {
      rate: 0.85,
      onStart: () => setPlayingLessonId(lesson.id),
      onEnd: () => setPlayingLessonId(null),
      onError: () => setPlayingLessonId(null),
    })
  }

  return (
    <div className="min-h-screen bg-ink-900 text-white relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-ocean-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      <div className="relative flex items-center gap-4 border-b border-ink-700/50 px-4 py-4 md:px-6">
        <button
          onClick={() => {
            stopSpeech()
            navigate('/app')
          }}
          className="flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Map size={18} className="text-ocean-400" />
          Learning Path
        </h1>
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8 md:py-12">
        {/* Language switcher */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {langs.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                stopSpeech()
                setSelectedLang(lang.code)
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedLang === lang.code
                  ? 'bg-ocean-500/20 text-ocean-300 border border-ocean-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 border border-transparent hover:bg-ink-800'
              }`}
            >
              <span>{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>

        {/* Path */}
        <div className="space-y-4 relative">
          {lessons.map((lesson, index) => {
            const isLocked = !lesson.unlocked
            const isCompleted = lesson.completed
            const isCurrent = lesson.current
            const isPlaying = playingLessonId === lesson.id

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => {
                  if (!isLocked) {
                    stopSpeech()
                    selectLesson(lesson.id)
                    navigate('/app')
                  }
                }}
                className={`relative flex items-center gap-4 rounded-2xl border p-5 transition-all ${
                  isLocked
                    ? 'border-ink-700/50 bg-ink-900/30 opacity-50 cursor-not-allowed'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10'
                    : isCurrent
                    ? 'border-ocean-500/40 bg-ocean-500/10 cursor-pointer hover:bg-ocean-500/15'
                    : 'border-ink-700/50 bg-ink-800/40 cursor-pointer hover:bg-ink-800/60'
                }`}
              >
                {/* Connector line */}
                {index < lessons.length - 1 && (
                  <div className="absolute left-[2.25rem] top-full h-4 w-0.5 bg-ink-700/50" />
                )}

                {/* Icon */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  isLocked
                    ? 'bg-ink-700 text-stone-600'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-ocean-500/20 text-ocean-400'
                    : 'bg-ink-700 text-stone-400'
                }`}>
                  {isLocked ? <Lock size={20} /> : isCompleted ? <CheckCircle2 size={20} /> : <Play size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">{lesson.level}</span>
                    {isCompleted && <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Completed</span>}
                    {isCurrent && <span className="text-[10px] font-bold text-ocean-400 uppercase tracking-wider">Current</span>}
                  </div>
                  <h3 className={`text-base font-semibold truncate ${isLocked ? 'text-stone-600' : 'text-white'}`}>{lesson.title}</h3>
                  <p className="text-sm text-stone-400">{lesson.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {lesson.phrases.length} phrases
                    </span>
                    {lesson.phrases[0] && (
                      <span className="text-stone-400 truncate max-w-[200px]">
                        Preview: {lesson.phrases[0].text}
                      </span>
                    )}
                  </div>
                </div>

                {!isLocked && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handlePreviewAudio(e, lesson)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all ${
                        isPlaying
                          ? 'bg-ocean-500/30 text-ocean-300 border-ocean-500 animate-pulse'
                          : 'bg-ink-700/60 text-stone-400 border-ink-600 hover:text-white hover:bg-ink-700'
                      }`}
                      title="Listen to sample audio"
                    >
                      <Volume2 size={16} className={isPlaying ? 'animate-bounce' : ''} />
                    </button>
                    {!isCompleted && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ocean-500/20 text-ocean-400">
                        <Star size={14} />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

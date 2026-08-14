import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Flame, Target, TrendingUp, Award, Mic, Calendar, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProgress } from '../hooks/useProgress'
import { useStreak } from '../hooks/useStreak'

function getLast7Days(): string[] {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function drawChart(canvas: HTMLCanvasElement, sessions: { date: string; scores: { overall: number } }[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const padding = { top: 20, bottom: 30, left: 10, right: 10 }
  const chartW = w - padding.left - padding.right
  const chartH = h - padding.top - padding.bottom

  ctx.clearRect(0, 0, w, h)

  const days = getLast7Days()
  const data = days.map((day) => {
    const daySessions = sessions.filter((s) => s.date.startsWith(day))
    if (daySessions.length === 0) return null
    const avg = daySessions.reduce((sum, s) => sum + s.scores.overall, 0) / daySessions.length
    return Math.round(avg)
  })

  const maxScore = 100
  const barWidth = chartW / days.length * 0.5
  const gap = chartW / days.length

  ctx.strokeStyle = 'rgba(148,163,184,0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top + chartH * 0.5)
  ctx.lineTo(w - padding.right, padding.top + chartH * 0.5)
  ctx.stroke()

  data.forEach((score, i) => {
    const x = padding.left + gap * i + gap / 2
    const barH = score ? (score / maxScore) * chartH : 4
    const y = padding.top + chartH - barH

    const gradient = ctx.createLinearGradient(x, y, x, y + barH)
    if (score && score >= 70) {
      gradient.addColorStop(0, '#0ea5e9')
      gradient.addColorStop(1, '#06b6d4')
    } else if (score && score >= 50) {
      gradient.addColorStop(0, '#f59e0b')
      gradient.addColorStop(1, '#d97706')
    } else {
      gradient.addColorStop(0, '#ef4444')
      gradient.addColorStop(1, '#dc2626')
    }

    ctx.fillStyle = score ? gradient : '#1e293b'
    ctx.beginPath()
    ctx.roundRect(x - barWidth / 2, y, barWidth, barH, 6)
    ctx.fill()

    const dayLabel = new Date(days[i]).toLocaleDateString('en', { weekday: 'narrow' })
    ctx.fillStyle = '#64748b'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(dayLabel, x, h - 8)

    if (score) {
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.fillText(String(score), x, y - 6)
    }
  })
}

const achievements = [
  { id: 'first', name: 'First Step', desc: 'Complete your first session', icon: Mic, check: (p: any) => (p?.totalPhrases || 0) >= 1 },
  { id: 'week', name: '7-Day Streak', desc: 'Practice 7 days in a row', icon: Flame, check: (_p: any, s: number) => s >= 7 },
  { id: 'explorer', name: 'Polyglot', desc: 'Practice 3 languages', icon: Star, check: (p: any) => new Set(p?.sessions?.map((s: any) => s.lang)).size >= 3 },
  { id: 'master', name: 'Tone Master', desc: 'Score 90+ on tones', icon: Target, check: (p: any) => p?.sessions?.some((s: any) => s.scores.tones >= 90) },
  { id: 'hundred', name: 'Century', desc: '100 phrases completed', icon: TrendingUp, check: (p: any) => (p?.totalPhrases || 0) >= 100 },
]

export default function Profile() {
  const navigate = useNavigate()
  const { progress, getAverageScore, getTopWeakSounds } = useProgress()
  const { streak } = useStreak()
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current && progress) {
      drawChart(chartRef.current, progress.sessions)
    }
  }, [progress])

  const avg = getAverageScore()
  const weakSounds = getTopWeakSounds(3)

  return (
    <div className="min-h-screen bg-ink-900 text-white relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-ocean-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      <div className="relative flex items-center gap-4 border-b border-ink-700/50 px-4 py-4 md:px-6">
        <button onClick={() => navigate('/app')} className="flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-white">
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="text-lg font-bold text-white">Profile</h1>
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8 md:py-12 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-6 md:p-8 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-cyan-500 text-xl font-bold text-white shadow-lg">
            LT
          </div>
          <div>
            <div className="text-xl font-bold text-white">Learner</div>
            <div className="text-sm text-stone-400">Joined recently</div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1">
              <Flame size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-300">{streak} day streak</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions', value: progress?.totalPhrases || 0, icon: Mic },
            { label: 'Avg Score', value: avg, icon: Target },
            { label: 'Best Streak', value: streak, icon: Calendar },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-4 text-center">
              <stat.icon size={18} className="mx-auto mb-2 text-ocean-400" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-[11px] text-stone-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-6">
          <h3 className="text-sm font-semibold text-stone-300 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-ocean-400" />
            Last 7 Days
          </h3>
          <canvas ref={chartRef} className="w-full" style={{ width: '100%', height: '160px' }} />
        </motion.div>

        {weakSounds.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-6">
            <h3 className="text-sm font-semibold text-stone-300 mb-4">Focus Areas</h3>
            <div className="space-y-3">
              {weakSounds.map((w) => (
                <div key={w.sound} className="flex items-center justify-between">
                  <span className="text-sm text-stone-400 capitalize">{w.sound}</span>
                  <div className="flex items-center gap-2 flex-1 mx-4">
                    <div className="h-2 flex-1 rounded-full bg-ink-700 overflow-hidden">
                      <div className="h-full rounded-full bg-red-400" style={{ width: `${Math.min(100, w.count * 10)}%` }} />
                    </div>
                    <span className="text-xs text-stone-500 w-8 text-right">{w.count}x</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-6">
          <h3 className="text-sm font-semibold text-stone-300 mb-4 flex items-center gap-2">
            <Award size={16} className="text-ocean-400" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => {
              const unlocked = ach.check(progress, streak)
              return (
                <div
                  key={ach.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    unlocked
                      ? 'border-ocean-500/30 bg-ocean-500/10'
                      : 'border-ink-700/50 bg-ink-900/30 opacity-50'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    unlocked ? 'bg-ocean-500/20 text-ocean-300' : 'bg-ink-700 text-stone-600'
                  }`}>
                    <ach.icon size={18} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${unlocked ? 'text-white' : 'text-stone-500'}`}>{ach.name}</div>
                    <div className="text-xs text-stone-500">{ach.desc}</div>
                  </div>
                  {unlocked && <div className="ml-auto text-ocean-400 text-xs font-bold">UNLOCKED</div>}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

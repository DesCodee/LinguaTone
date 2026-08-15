import { useState, useEffect, useCallback } from 'react'

const GOAL_KEY = 'linguatone_daily_goal_v1'
const PROGRESS_KEY = 'linguatone_daily_progress_v1'

export interface DailyGoal {
  minutes: number // 5, 10, 15
  enabled: boolean
}

export interface DailyProgress {
  date: string // YYYY-MM-DD
  minutesDone: number
  sessionsCount: number
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getGoal(): DailyGoal {
  try {
    const raw = localStorage.getItem(GOAL_KEY)
    if (!raw) return { minutes: 10, enabled: true }
    return JSON.parse(raw)
  } catch {
    return { minutes: 10, enabled: true }
  }
}

function getProgress(): DailyProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return { date: getToday(), minutesDone: 0, sessionsCount: 0 }
    const parsed = JSON.parse(raw)
    // Сброс если день сменился
    if (parsed.date !== getToday()) {
      return { date: getToday(), minutesDone: 0, sessionsCount: 0 }
    }
    return parsed
  } catch {
    return { date: getToday(), minutesDone: 0, sessionsCount: 0 }
  }
}

function saveGoal(goal: DailyGoal) {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal))
}

function saveProgress(progress: DailyProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function useDailyGoal() {
  const [goal, setGoalState] = useState<DailyGoal>({ minutes: 10, enabled: true })
  const [progress, setProgressState] = useState<DailyProgress>({ date: getToday(), minutesDone: 0, sessionsCount: 0 })
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    const g = getGoal()
    const p = getProgress()
    setGoalState(g)
    setProgressState(p)
    // Показываем настройку при первом входе (нет цели)
    if (!localStorage.getItem(GOAL_KEY)) {
      setShowSetup(true)
    }
  }, [])

  const setGoal = useCallback((minutes: number) => {
    const newGoal = { minutes, enabled: true }
    saveGoal(newGoal)
    setGoalState(newGoal)
    setShowSetup(false)
  }, [])

  const addSessionTime = useCallback((minutes: number = 2) => {
    const current = getProgress()
    const updated = {
      date: getToday(),
      minutesDone: current.minutesDone + minutes,
      sessionsCount: current.sessionsCount + 1,
    }
    saveProgress(updated)
    setProgressState(updated)
  }, [])

  const isGoalReached = progress.minutesDone >= goal.minutes
  const percent = Math.min(100, Math.round((progress.minutesDone / goal.minutes) * 100))

  return {
    goal,
    progress,
    percent,
    isGoalReached,
    showSetup,
    setShowSetup,
    setGoal,
    addSessionTime,
  }
}
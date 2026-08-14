import { useState, useEffect } from 'react'
import { getProgress, saveProgress } from '../lib/storage'

export function useStreak() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const progress = getProgress()
    const today = new Date().toISOString().split('T')[0]

    if (!progress.lastActive) {
      progress.streak = 1
      progress.lastActive = today
      saveProgress(progress)
      setStreak(1)
      return
    }

    const last = new Date(progress.lastActive)
    const now = new Date(today)
    const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      setStreak(progress.streak)
    } else if (diffDays === 1) {
      progress.streak += 1
      progress.lastActive = today
      saveProgress(progress)
      setStreak(progress.streak)
    } else {
      progress.streak = 1
      progress.lastActive = today
      saveProgress(progress)
      setStreak(1)
    }
  }, [])

  return { streak }
}
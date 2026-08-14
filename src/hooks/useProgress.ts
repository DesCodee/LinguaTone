import { useState, useEffect, useCallback } from 'react'
import { getProgress, saveProgress, type SessionRecord, type UserProgress } from '../lib/storage'

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  const addSession = useCallback((session: SessionRecord) => {
    const current = getProgress()
    current.sessions.push(session)
    current.totalPhrases += 1
    session.mistakes.forEach((m) => {
      current.weakSounds[m] = (current.weakSounds[m] || 0) + 1
    })
    saveProgress(current)
    setProgress({ ...current })
  }, [])

  const getAverageScore = useCallback(() => {
    if (!progress || progress.sessions.length === 0) return 0
    const sum = progress.sessions.reduce((acc, s) => acc + s.scores.overall, 0)
    return Math.round(sum / progress.sessions.length)
  }, [progress])

  const getTopWeakSounds = useCallback((limit = 3) => {
    if (!progress) return []
    return Object.entries(progress.weakSounds)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([sound, count]) => ({ sound, count }))
  }, [progress])

  return { progress, addSession, getAverageScore, getTopWeakSounds }
}
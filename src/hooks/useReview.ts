import { useMemo } from 'react'
import { getProgress } from '../lib/storage'

export interface ReviewItem {
  phrase: string
  lang: string
  lastScore: number
  mistakes: string[]
  date: string
}

export function useReview() {
  return useMemo(() => {
    const progress = getProgress()
    if (!progress.sessions.length) return []

    // Группируем по фразе, берём последнюю сессию
    const byPhrase = new Map<string, ReviewItem>()
    
    progress.sessions.forEach((s) => {
      const existing = byPhrase.get(s.phrase)
      if (!existing || new Date(s.date) > new Date(existing.date)) {
        byPhrase.set(s.phrase, {
          phrase: s.phrase,
          lang: s.lang,
          lastScore: s.scores.overall,
          mistakes: s.mistakes,
          date: s.date,
        })
      }
    })

    // Берём фразы со score < 75, сортируем по худшему
    return Array.from(byPhrase.values())
      .filter((item) => item.lastScore < 75)
      .sort((a, b) => a.lastScore - b.lastScore)
      .slice(0, 5)
  }, [])
}
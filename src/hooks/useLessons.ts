import { useState, useEffect, useCallback } from 'react'
import { getLessonsByLang, isLessonUnlocked, type Lesson } from '../data/lessons'
import { getProgress, completeLesson, setCurrentLesson } from '../lib/storage'

export type EnrichedLesson = Lesson & {
  unlocked: boolean
  completed: boolean
  current: boolean
}

export function useLessons() {
  const [completed, setCompleted] = useState<string[]>([])
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const progress = getProgress()
    setCompleted(progress.completedLessons || [])
    setCurrentLessonId(progress.currentLessonId)
    setInitialized(true)
  }, [])

  const getLangLessons = useCallback((lang: string): EnrichedLesson[] => {
    return getLessonsByLang(lang).map((lesson) => ({
      ...lesson,
      unlocked: isLessonUnlocked(lesson, completed),
      completed: completed.includes(lesson.id),
      current: lesson.id === currentLessonId,
    }))
  }, [completed, currentLessonId])

  const selectLesson = useCallback((lessonId: string) => {
    setCurrentLesson(lessonId)
    setCurrentLessonId(lessonId)
  }, [])

  const markComplete = useCallback((lessonId: string) => {
    completeLesson(lessonId)
    setCompleted((prev) => [...prev, lessonId])
  }, [])

  return { getLangLessons, selectLesson, markComplete, currentLessonId, initialized }
}
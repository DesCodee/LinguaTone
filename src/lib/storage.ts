import { supabase } from './supabase'

export interface SessionRecord {
  id: string
  date: string
  phrase: string
  lang: string
  scores: {
    tones: number
    sounds: number
    rhythm: number
    overall: number
  }
  mistakes: string[]
}

export interface UserProgress {
  sessions: SessionRecord[]
  streak: number
  lastActive: string | null
  totalPhrases: number
  weakSounds: Record<string, number>
  completedLessons: string[]
  currentLessonId: string | null
  dailyGoal: { minutes: number; enabled: boolean }
}

const STORAGE_KEY = 'linguatone_progress_v1'
const CURRENT_LESSON_KEY = 'linguatone_current_lesson'

const defaultProgress: UserProgress = {
  sessions: [],
  streak: 0,
  lastActive: null,
  totalPhrases: 0,
  weakSounds: {},
  completedLessons: [],
  currentLessonId: null,
  dailyGoal: { minutes: 10, enabled: true },
}

// ===== AUTH =====

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data.user
  } catch (_err: unknown) {
    const mockUser = { id: 'local-user-' + Date.now(), email }
    localStorage.setItem('linguatone_auth_user', JSON.stringify(mockUser))
    return mockUser
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  } catch (_err: unknown) {
    const mockUser = { id: 'local-user-' + Date.now(), email }
    localStorage.setItem('linguatone_auth_user', JSON.stringify(mockUser))
    return mockUser
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/app' }
    })
    if (error) throw error
    return data
  } catch (_err: unknown) {
    const mockUser = { id: 'local-user-google', email: 'user@google.com' }
    localStorage.setItem('linguatone_auth_user', JSON.stringify(mockUser))
    window.location.href = '/app'
    return null
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut()
  } catch {
    // ignore
  }
  localStorage.removeItem('linguatone_auth_user')
}

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return user
  } catch {
    // fallback
  }
  const raw = localStorage.getItem('linguatone_auth_user')
  return raw ? JSON.parse(raw) : null
}

// ===== PROGRESS & SESSIONS =====

export function getProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const currentLesson = localStorage.getItem(CURRENT_LESSON_KEY)
    if (!raw) {
      return { ...defaultProgress, currentLessonId: currentLesson || null }
    }
    const parsed = JSON.parse(raw)
    return {
      ...defaultProgress,
      ...parsed,
      sessions: parsed.sessions || [],
      weakSounds: parsed.weakSounds || {},
      completedLessons: parsed.completedLessons || [],
      currentLessonId: currentLesson || parsed.currentLessonId || null,
      dailyGoal: parsed.dailyGoal || { minutes: 10, enabled: true },
    }
  } catch {
    return { ...defaultProgress }
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    if (progress.currentLessonId) {
      localStorage.setItem(CURRENT_LESSON_KEY, progress.currentLessonId)
    }
    // Async background sync to Supabase if logged in
    getCurrentUser().then(async (user) => {
      if (user && user.id && !user.id.startsWith('local-user-')) {
        try {
          await supabase
            .from('progress')
            .upsert({
              user_id: user.id,
              streak: progress.streak,
              last_active: progress.lastActive,
              total_phrases: progress.totalPhrases,
              weak_sounds: progress.weakSounds,
              completed_lessons: progress.completedLessons,
              daily_goal: progress.dailyGoal,
            }, { onConflict: 'user_id' })
        } catch (err) {
          console.warn('[Supabase] Sync failed:', err)
        }
      }
    }).catch(() => {})
  } catch (err) {
    console.error('Failed to save progress:', err)
  }
}

export function updateProgress(updates: Partial<UserProgress>): void {
  const current = getProgress()
  const updated: UserProgress = {
    ...current,
    ...updates,
  }
  saveProgress(updated)
}

export function completeLesson(lessonId: string): void {
  const progress = getProgress()
  const completed = Array.from(new Set([...progress.completedLessons, lessonId]))
  updateProgress({ completedLessons: completed })
}

export function setCurrentLesson(lessonId: string): void {
  localStorage.setItem(CURRENT_LESSON_KEY, lessonId)
  updateProgress({ currentLessonId: lessonId })
}

export function saveSession(sessionData: Omit<SessionRecord, 'id' | 'date'> | SessionRecord): SessionRecord {
  const current = getProgress()
  const session: SessionRecord = {
    id: 'id' in sessionData && sessionData.id ? sessionData.id : crypto.randomUUID(),
    date: 'date' in sessionData && sessionData.date ? sessionData.date : new Date().toISOString(),
    phrase: sessionData.phrase,
    lang: sessionData.lang,
    scores: sessionData.scores,
    mistakes: sessionData.mistakes || [],
  }

  current.sessions.unshift(session)
  current.totalPhrases += 1
  session.mistakes.forEach((m) => {
    current.weakSounds[m] = (current.weakSounds[m] || 0) + 1
  })

  saveProgress(current)

  // Background sync
  getCurrentUser().then(async (user) => {
    if (user && user.id && !user.id.startsWith('local-user-')) {
      try {
        await supabase
          .from('sessions')
          .insert({
            user_id: user.id,
            phrase: session.phrase,
            lang: session.lang,
            scores: session.scores,
            mistakes: session.mistakes,
          })
      } catch (err) {
        console.warn('[Supabase] Session insert failed:', err)
      }
    }
  }).catch(() => {})

  return session
}

export function getSessions(): SessionRecord[] {
  return getProgress().sessions
}

// ===== DAILY PROGRESS =====

export function getDailyProgress(date: string) {
  try {
    const raw = localStorage.getItem(`linguatone_daily_${date}`)
    return raw ? JSON.parse(raw) : { minutes_done: 0, sessions_count: 0 }
  } catch {
    return { minutes_done: 0, sessions_count: 0 }
  }
}

export function updateDailyProgress(date: string, minutes: number, sessions: number) {
  try {
    localStorage.setItem(
      `linguatone_daily_${date}`,
      JSON.stringify({ minutes_done: minutes, sessions_count: sessions })
    )
  } catch (err) {
    console.error('Failed to update daily progress:', err)
  }
}

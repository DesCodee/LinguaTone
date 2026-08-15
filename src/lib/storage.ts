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

// ===== AUTH =====

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data.user
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/app' }
  })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ===== SESSIONS =====

export async function saveSession(session: Omit<SessionRecord, 'id' | 'date'>) {
  const user = await getCurrentUser()
  if (!user) {
    // Fallback to localStorage if not logged in
    localStorage.setItem('linguatone_session_' + Date.now(), JSON.stringify(session))
    return null
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      phrase: session.phrase,
      lang: session.lang,
      scores: session.scores,
      mistakes: session.mistakes,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSessions(): Promise<SessionRecord[]> {
  const user = await getCurrentUser()
  if (!user) {
    // Fallback: read all localStorage sessions
    const sessions: SessionRecord[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('linguatone_session_')) {
        sessions.push(JSON.parse(localStorage.getItem(key)!))
      }
    }
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map((s: any) => ({
    id: s.id,
    date: s.created_at,
    phrase: s.phrase,
    lang: s.lang,
    scores: s.scores,
    mistakes: s.mistakes || [],
  }))
}

// ===== PROGRESS =====

export async function getProgress(): Promise<UserProgress> {
  const user = await getCurrentUser()
  
  // Default progress
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

  if (!user) {
    const raw = localStorage.getItem('linguatone_progress_v1')
    return raw ? { ...defaultProgress, ...JSON.parse(raw) } : defaultProgress
  }

  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    // Create initial progress
    await supabase.from('progress').insert({
      user_id: user.id,
      completed_lessons: [],
      streak: 0,
      last_active: null,
      total_phrases: 0,
      weak_sounds: {},
      daily_goal: { minutes: 10, enabled: true },
    })
    return defaultProgress
  }

  const sessions = await getSessions()

  return {
    sessions,
    streak: data.streak || 0,
    lastActive: data.last_active,
    totalPhrases: data.total_phrases || 0,
    weakSounds: data.weak_sounds || {},
    completedLessons: data.completed_lessons || [],
    currentLessonId: localStorage.getItem('linguatone_current_lesson') || null,
    dailyGoal: data.daily_goal || { minutes: 10, enabled: true },
  }
}

export async function updateProgress(updates: Partial<UserProgress>) {
  const user = await getCurrentUser()
  if (!user) {
    // Fallback to localStorage
    const current = JSON.parse(localStorage.getItem('linguatone_progress_v1') || '{}')
    localStorage.setItem('linguatone_progress_v1', JSON.stringify({ ...current, ...updates }))
    return
  }

  const dbUpdates: any = {}
  if (updates.streak !== undefined) dbUpdates.streak = updates.streak
  if (updates.lastActive !== undefined) dbUpdates.last_active = updates.lastActive
  if (updates.totalPhrases !== undefined) dbUpdates.total_phrases = updates.totalPhrases
  if (updates.weakSounds !== undefined) dbUpdates.weak_sounds = updates.weakSounds
  if (updates.completedLessons !== undefined) dbUpdates.completed_lessons = updates.completedLessons
  if (updates.dailyGoal !== undefined) dbUpdates.daily_goal = updates.dailyGoal

  const { error } = await supabase
    .from('progress')
    .upsert({ user_id: user.id, ...dbUpdates }, { onConflict: 'user_id' })

  if (error) throw error
}

export async function completeLesson(lessonId: string) {
  const progress = await getProgress()
  const completed = [...new Set([...progress.completedLessons, lessonId])]
  await updateProgress({ completedLessons: completed })
}

export async function setCurrentLesson(lessonId: string) {
  localStorage.setItem('linguatone_current_lesson', lessonId)
}

// ===== DAILY PROGRESS =====

export async function getDailyProgress(date: string) {
  const user = await getCurrentUser()
  if (!user) {
    const raw = localStorage.getItem(`linguatone_daily_${date}`)
    return raw ? JSON.parse(raw) : { minutes_done: 0, sessions_count: 0 }
  }

  const { data, error } = await supabase
    .from('daily_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single()

  if (error || !data) return { minutes_done: 0, sessions_count: 0 }
  return data
}

export async function updateDailyProgress(date: string, minutes: number, sessions: number) {
  const user = await getCurrentUser()
  if (!user) {
    localStorage.setItem(`linguatone_daily_${date}`, JSON.stringify({ minutes_done: minutes, sessions_count: sessions }))
    return
  }

  const { error } = await supabase
    .from('daily_progress')
    .upsert({
      user_id: user.id,
      date,
      minutes_done: minutes,
      sessions_count: sessions,
    }, { onConflict: 'user_id,date' })

  if (error) throw error
}
const STORAGE_KEY = 'linguatone_progress_v1'

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
}

const defaultProgress: UserProgress = {
  sessions: [],
  streak: 0,
  lastActive: null,
  totalPhrases: 0,
  weakSounds: {},
}

export function getProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw)
    return { ...defaultProgress, ...parsed }
  } catch {
    return defaultProgress
  }
}

export function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function addSession(session: SessionRecord) {
  const progress = getProgress()
  progress.sessions.push(session)
  progress.totalPhrases += 1
  session.mistakes.forEach((m) => {
    progress.weakSounds[m] = (progress.weakSounds[m] || 0) + 1
  })
  saveProgress(progress)
}
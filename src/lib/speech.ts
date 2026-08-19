// Speech Synthesis & Acoustic Audio Engine for CJK Pronunciation Playback

const LANG_MAP: Record<string, string> = {
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

let currentUtterance: SpeechSynthesisUtterance | null = null
let cachedVoices: SpeechSynthesisVoice[] = []

// Eagerly preload voices to prevent initial delay on Chrome / Safari
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices()
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices()
    }
  }
}

export interface SpeakOptions {
  rate?: number // e.g. 0.85 for slow/clear or 1.0 for normal
  pitch?: number // e.g. 1.0
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: any) => void
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
    } catch {
      // ignore
    }
  }
  currentUtterance = null
}

function findBestVoice(langCode: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices()
  if (!voices || voices.length === 0) return null

  const targetPrefix = langCode.toLowerCase().replace('_', '-')
  const basePrefix = targetPrefix.split('-')[0]

  // Priority 1: Exact match with high quality name keywords
  const preferred = voices.find(
    (v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith(targetPrefix) &&
      (v.name.includes('Natural') ||
        v.name.includes('Neural') ||
        v.name.includes('Google') ||
        v.name.includes('Siri') ||
        v.name.includes('Premium'))
  )
  if (preferred) return preferred

  // Priority 2: Exact language code match
  const exact = voices.find((v) =>
    v.lang.toLowerCase().replace('_', '-').startsWith(targetPrefix)
  )
  if (exact) return exact

  // Priority 3: Base language match (e.g. zh)
  const base = voices.find((v) =>
    v.lang.toLowerCase().replace('_', '-').startsWith(basePrefix)
  )
  return base || null
}

export function speakText(
  text: string,
  lang: string,
  options: SpeakOptions = {}
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    fallbackToneMelody(lang, options.onStart, options.onEnd)
    return
  }

  try {
    // Immediate cancel to clear any pending queue
    window.speechSynthesis.cancel()

    const targetLang = LANG_MAP[lang] || lang || 'zh-CN'
    const utterance = new SpeechSynthesisUtterance(text)

    utterance.lang = targetLang
    utterance.rate = options.rate ?? 0.88
    utterance.pitch = options.pitch ?? 1.0

    const bestVoice = findBestVoice(targetLang)
    if (bestVoice) {
      utterance.voice = bestVoice
    }

    let started = false
    utterance.onstart = () => {
      started = true
      options.onStart?.()
    }

    utterance.onend = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null
      }
      options.onEnd?.()
    }

    utterance.onerror = (e) => {
      if (currentUtterance === utterance) {
        currentUtterance = null
      }
      if (!started) {
        // Fallback if browser speech synthesis fails
        fallbackToneMelody(lang, options.onStart, options.onEnd)
      } else {
        options.onError?.(e)
        options.onEnd?.()
      }
    }

    currentUtterance = utterance
    window.speechSynthesis.speak(utterance)

    // Un-pause chrome background freeze
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  } catch (err) {
    console.warn('Speech synthesis exception, playing tone fallback:', err)
    fallbackToneMelody(lang, options.onStart, options.onEnd)
  }
}

// Fallback pitch audio synthesizer using Web Audio API
function fallbackToneMelody(
  lang: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) {
      onEnd?.()
      return
    }
    const ctx = new AudioCtx()
    onStart?.()

    const pitches =
      lang === 'zh'
        ? [261.63, 329.63, 293.66, 392.0]
        : lang === 'ja'
        ? [329.63, 392.0, 440.0, 329.63]
        : [293.66, 369.99, 440.0, 329.63]

    let time = ctx.currentTime + 0.05
    pitches.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, time)

      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.15, time + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(time)
      osc.stop(time + 0.38)
      time += 0.32

      if (i === pitches.length - 1) {
        setTimeout(() => {
          onEnd?.()
          ctx.close()
        }, (time - ctx.currentTime) * 1000 + 100)
      }
    })
  } catch {
    onEnd?.()
  }
}

// Success chime on completing lessons or great tone pronunciation
export function playSuccessChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + i * 0.09)

      gain.gain.setValueAtTime(0, now + i * 0.09)
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.09 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + i * 0.09)
      osc.stop(now + i * 0.09 + 0.35)
    })

    setTimeout(() => {
      ctx.close()
    }, 800)
  } catch {
    // ignore
  }
}

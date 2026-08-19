import { useState, useRef, useCallback } from 'react'

export interface RecordedPitchFrame {
  pitch: number
  volume: number
  clarity: number
}

export interface RecordingResult {
  frames: RecordedPitchFrame[]
  duration: number
}

interface UseAudioRecorderReturn {
  isRecording: boolean
  audioBlob: Blob | null
  pitchFrames: RecordedPitchFrame[]
  durationSeconds: number
  currentVolume: number
  startRecording: () => Promise<void>
  stopRecording: () => RecordingResult
  error: string | null
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [pitchFrames, setPitchFrames] = useState<RecordedPitchFrame[]>([])
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [currentVolume, setCurrentVolume] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const startTimeRef = useRef<number>(0)
  const chunksRef = useRef<Blob[]>([])
  const framesBufferRef = useRef<RecordedPitchFrame[]>([])

  const processPitchDetection = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return

    const buffer = new Float32Array(analyserRef.current.fftSize)
    analyserRef.current.getFloatTimeDomainData(buffer)

    const sampleRate = audioContextRef.current.sampleRate || 44100
    const rms = Math.sqrt(buffer.reduce((sum, v) => sum + v * v, 0) / buffer.length)
    setCurrentVolume(rms)

    if (rms > 0.01) {
      let bestOffset = -1
      let bestCorrelation = 0

      for (let offset = 20; offset < buffer.length / 2; offset++) {
        let correlation = 0
        for (let i = 0; i < buffer.length - offset; i++) {
          correlation += buffer[i] * buffer[i + offset]
        }
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation
          bestOffset = offset
        }
      }

      const pitch = bestOffset > 0 ? sampleRate / bestOffset : 0
      const clarity = bestCorrelation / (buffer.length * rms * rms)

      if (pitch > 60 && pitch < 600) {
        framesBufferRef.current.push({ pitch, volume: rms, clarity })
      } else {
        framesBufferRef.current.push({ pitch: 0, volume: rms, clarity: 0 })
      }
    } else {
      framesBufferRef.current.push({ pitch: 0, volume: rms, clarity: 0 })
    }

    animationFrameRef.current = requestAnimationFrame(processPitchDetection)
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioCtx()
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      source.connect(analyserRef.current)

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      framesBufferRef.current = []
      startTimeRef.current = Date.now()

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setError(null)
      processPitchDetection()
    } catch (err) {
      setError('Microphone access denied or unavailable')
      console.error(err)
    }
  }, [processPitchDetection])

  const stopRecording = useCallback((): RecordingResult => {
    const duration = (Date.now() - (startTimeRef.current || Date.now())) / 1000
    const capturedFrames = [...framesBufferRef.current]

    setPitchFrames(capturedFrames)
    setDurationSeconds(duration)
    setCurrentVolume(0)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch {
        // ignore
      }
    }
    setIsRecording(false)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
    }

    return {
      frames: capturedFrames,
      duration,
    }
  }, [])

  return {
    isRecording,
    audioBlob,
    pitchFrames,
    durationSeconds,
    currentVolume,
    startRecording,
    stopRecording,
    error,
  }
}

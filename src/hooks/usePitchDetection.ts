import { useState, useRef, useCallback, useEffect } from 'react'

interface PitchData {
  pitch: number
  clarity: number
  volume: number
}

interface UsePitchDetectionReturn {
  isListening: boolean
  pitchData: PitchData | null
  startListening: () => Promise<void>
  stopListening: () => void
  error: string | null
}

export function usePitchDetection(): UsePitchDetectionReturn {
  const [isListening, setIsListening] = useState(false)
  const [pitchData, setPitchData] = useState<PitchData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>(0)

  const detectPitch = useCallback(() => {
    if (!analyserRef.current) return
    const buffer = new Float32Array(analyserRef.current.fftSize)
    analyserRef.current.getFloatTimeDomainData(buffer)

    const sampleRate = audioContextRef.current?.sampleRate || 44100
    let bestOffset = -1
    let bestCorrelation = 0
    const rms = Math.sqrt(buffer.reduce((sum, v) => sum + v * v, 0) / buffer.length)

    if (rms < 0.01) {
      setPitchData({ pitch: 0, clarity: 0, volume: rms })
      animationFrameRef.current = requestAnimationFrame(detectPitch)
      return
    }

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

    setPitchData({ pitch, clarity, volume: rms })
    animationFrameRef.current = requestAnimationFrame(detectPitch)
  }, [])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      source.connect(analyserRef.current)

      setIsListening(true)
      setError(null)
      detectPitch()
    } catch (err) {
      setError('Microphone access denied')
      console.error(err)
    }
  }, [detectPitch])

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    audioContextRef.current?.close()
    setIsListening(false)
    setPitchData(null)
  }, [])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      audioContextRef.current?.close()
    }
  }, [])

  return { isListening, pitchData, startListening, stopListening, error }
}
import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Podcast audio player hook.
 * Wraps HTMLAudioElement with play/pause/seek/volume controls.
 */
export function useAudioPlayer(src) {
  const audioRef              = useRef(null)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]       = useState(0)
  const [volume, setVolume]           = useState(1)
  const [isMuted, setIsMuted]         = useState(false)
  const [isLoading, setIsLoading]     = useState(false)

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audioRef.current = audio
    setIsLoading(true)

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setIsLoading(false)
    })
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
    audio.addEventListener('ended',      () => setIsPlaying(false))

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [src])

  const play  = useCallback(() => { audioRef.current?.play();  setIsPlaying(true)  }, [])
  const pause = useCallback(() => { audioRef.current?.pause(); setIsPlaying(false) }, [])
  const toggle = useCallback(() => (isPlaying ? pause() : play()), [isPlaying, play, pause])

  const seek = useCallback((time) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const changeVolume = useCallback((val) => {
    if (!audioRef.current) return
    audioRef.current.volume = val
    setVolume(val)
    setIsMuted(val === 0)
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  const skipForward  = useCallback(() => seek(Math.min(currentTime + 15, duration)), [seek, currentTime, duration])
  const skipBackward = useCallback(() => seek(Math.max(currentTime - 15, 0)), [seek, currentTime])

  return {
    isPlaying, currentTime, duration, volume, isMuted, isLoading,
    play, pause, toggle, seek, changeVolume, toggleMute, skipForward, skipBackward,
  }
}

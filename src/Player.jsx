import { useEffect, useRef, useState } from 'react'

// SVG Icons
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
)

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
)

const SkipBackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
  </svg>
)

const SkipForwardIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
)

const ShuffleIcon = ({ active }) => (
  <svg viewBox="0 0 16 16" fill={active ? '#1db954' : 'currentColor'} className="h-4 w-4">
    <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06l2.306-2.306a.75.75 0 0 0 0-1.06L13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" />
    <path d="m7.5 10.723.98-1.167 4.405 5.249a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.306 2.306a.75.75 0 0 1 0 1.06l-2.306 2.306a.75.75 0 1 1-1.06-1.06l1.017-1.018H11.16a3.75 3.75 0 0 1-2.873-1.34L7.5 10.723z" />
  </svg>
)

const RepeatIcon = ({ active }) => (
  <svg viewBox="0 0 16 16" fill={active ? '#1db954' : 'currentColor'} className="h-4 w-4">
    <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z" />
  </svg>
)

const VolumeIcon = ({ level }) => {
  if (level === 0) {
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
        <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z" />
        <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z" />
      </svg>
    )
  }
  if (level < 0.5) {
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z" />
    </svg>
  )
}

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 16 16" fill={filled ? '#1db954' : 'none'} stroke={filled ? '#1db954' : 'currentColor'} strokeWidth="1.5" className="h-4 w-4">
    <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.25 1.25 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z" />
  </svg>
)

const QueueIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
    <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z" />
  </svg>
)

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function Player({ track, onNext, onPrevious }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
        setIsPlaying(true)
      } else if (onNext) {
        onNext()
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [isRepeat, onNext])

  useEffect(() => {
    if (track?.preview_url && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [track?.id])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !track?.preview_url) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = e.target.value
    setCurrentTime(e.target.value)
  }

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value))
  }

  if (!track) {
    return (
      <footer className="now-playing-bar fixed bottom-0 left-0 right-0 z-50 h-[90px] px-4">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between">
          <div className="flex w-[30%] items-center gap-3">
            <div className="h-14 w-14 rounded bg-[#282828]" />
            <div>
              <div className="h-3 w-24 rounded bg-[#282828]" />
              <div className="mt-2 h-2 w-16 rounded bg-[#282828]" />
            </div>
          </div>
          <div className="flex w-[40%] flex-col items-center">
            <div className="flex items-center gap-4">
              <button disabled className="icon-btn opacity-50"><ShuffleIcon /></button>
              <button disabled className="icon-btn opacity-50"><SkipBackIcon /></button>
              <button disabled className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <PlayIcon />
              </button>
              <button disabled className="icon-btn opacity-50"><SkipForwardIcon /></button>
              <button disabled className="icon-btn opacity-50"><RepeatIcon /></button>
            </div>
            <div className="mt-2 flex w-full max-w-[600px] items-center gap-2">
              <span className="text-[11px] text-[#a7a7a7]">0:00</span>
              <div className="h-1 flex-1 rounded-full bg-[#4d4d4d]" />
              <span className="text-[11px] text-[#a7a7a7]">0:00</span>
            </div>
          </div>
          <div className="flex w-[30%] justify-end">
            <div className="flex items-center gap-3">
              <button disabled className="icon-btn opacity-50"><QueueIcon /></button>
              <button disabled className="icon-btn opacity-50"><VolumeIcon level={0.7} /></button>
              <div className="h-1 w-24 rounded-full bg-[#4d4d4d]" />
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="now-playing-bar fixed bottom-0 left-0 right-0 z-50 h-[90px] px-4">
      <audio ref={audioRef} src={track.preview_url} />
      
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between">
        {/* Now Playing Info */}
        <div className="flex w-[30%] min-w-[180px] items-center gap-3">
          <img
            src={track.album?.images?.[0]?.url || track.album?.images?.[2]?.url}
            alt={track.album?.name}
            className="h-14 w-14 rounded shadow-lg"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-normal text-white hover:underline cursor-pointer">
              {track.name}
            </p>
            <p className="truncate text-[11px] text-[#a7a7a7] hover:text-white hover:underline cursor-pointer">
              {track.artists?.map(a => a.name).join(', ')}
            </p>
          </div>
          <button 
            className={`icon-btn ml-2 ${isLiked ? 'active' : ''}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <HeartIcon filled={isLiked} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex w-[40%] max-w-[722px] flex-col items-center">
          <div className="mb-2 flex items-center gap-4">
            <button 
              className={`icon-btn ${isShuffle ? 'active' : ''}`}
              onClick={() => setIsShuffle(!isShuffle)}
            >
              <ShuffleIcon active={isShuffle} />
            </button>
            <button className="icon-btn" onClick={onPrevious}>
              <SkipBackIcon />
            </button>
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
              onClick={togglePlay}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="icon-btn" onClick={onNext}>
              <SkipForwardIcon />
            </button>
            <button 
              className={`icon-btn ${isRepeat ? 'active' : ''}`}
              onClick={() => setIsRepeat(!isRepeat)}
            >
              <RepeatIcon active={isRepeat} />
            </button>
          </div>
          
          <div className="flex w-full items-center gap-2">
            <span className="w-10 text-right text-[11px] text-[#a7a7a7]">
              {formatTime(currentTime)}
            </span>
            <div className="group relative flex-1">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="player-progress w-full"
                style={{
                  background: `linear-gradient(to right, #fff ${(currentTime / (duration || 1)) * 100}%, #4d4d4d ${(currentTime / (duration || 1)) * 100}%)`
                }}
              />
            </div>
            <span className="w-10 text-[11px] text-[#a7a7a7]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume & Other Controls */}
        <div className="flex w-[30%] min-w-[180px] items-center justify-end gap-3">
          <button className="icon-btn">
            <QueueIcon />
          </button>
          <div className="flex items-center gap-2">
            <button 
              className="icon-btn"
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            >
              <VolumeIcon level={volume} />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider w-24"
              style={{
                background: `linear-gradient(to right, #fff ${volume * 100}%, #4d4d4d ${volume * 100}%)`
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Player

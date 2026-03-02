import { useEffect, useRef, useState } from 'react'

const formatDuration = (durationMs) => {
  if (!durationMs) {
    return '--:--'
  }

  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function Playlist({ tracks }) {
  const [playingTrackId, setPlayingTrackId] = useState(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [activeTrack, setActiveTrack] = useState(null)
  const audioRef = useRef(null)
  const playerOverlayRef = useRef(null)

  const requestElementFullscreen = async (element) => {
    if (!element || document.fullscreenElement) {
      return
    }

    try {
      await element.requestFullscreen()
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
    }
  }

  const exitElementFullscreen = async () => {
    if (!document.fullscreenElement) {
      return
    }

    try {
      await document.exitFullscreen()
    } catch (error) {
      console.error('Failed to exit fullscreen:', error)
    }
  }

  // Stop audio when component unmounts.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  // Open full-screen player and play selected track preview.
  const openFullScreenPlayer = (track) => {
    if (!track?.preview_url) {
      return
    }

    setActiveTrack(track)
    setIsPlayerOpen(true)
    setPlayingTrackId(track.id)
  }

  const closePlayer = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setIsPlayerOpen(false)
    setPlayingTrackId(null)
    exitElementFullscreen()
  }

  // Lock page scroll when full-screen player is open.
  useEffect(() => {
    document.body.style.overflow = isPlayerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isPlayerOpen])

  // Open/close browser fullscreen with the player overlay.
  useEffect(() => {
    if (isPlayerOpen) {
      requestElementFullscreen(playerOverlayRef.current)
    } else {
      exitElementFullscreen()
    }
  }, [isPlayerOpen])

  // Close player when user exits fullscreen with ESC.
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && isPlayerOpen) {
        setIsPlayerOpen(false)
        setPlayingTrackId(null)
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [isPlayerOpen])

  // Reset play state when audio finishes.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    const onEnded = () => setPlayingTrackId(null)
    const onPause = () => setPlayingTrackId(null)
    const onPlay = () => setPlayingTrackId(activeTrack?.id || null)

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('play', onPlay)

    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('play', onPlay)
    }
  }, [activeTrack?.id])

  if (!tracks.length) {
    return (
      <p className="rounded-xl border border-white/10 bg-neutral-900/70 p-4 text-sm text-neutral-300">
        No tracks available for this playlist.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {tracks.map((item, index) => {
        const track = item.track
        if (!track) {
          return null
        }

        return (
          <div
            className="group grid grid-cols-[48px_1fr] items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/60 p-2.5 transition hover:border-white/20 hover:bg-neutral-800/80 sm:grid-cols-[56px_1fr_auto]"
            key={track.id || `${track.name}-${item.added_at}`}
          >
            <img
              src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
              alt={track.album?.name || 'Album'}
              className="h-12 w-12 rounded-lg object-cover sm:h-14 sm:w-14"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white sm:text-sm">
                {index + 1}. {track.name}
              </p>
              <p className="truncate text-xs text-neutral-400">
                {track.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist'}
              </p>
              <p className="truncate text-[11px] text-neutral-500">
                {track.album?.name || 'Unknown Album'} • {formatDuration(track.duration_ms)}
              </p>
            </div>
            <div className="col-span-2 mt-1 flex flex-wrap items-center gap-2 sm:col-span-1 sm:mt-0 sm:justify-end">
              {track.preview_url ? (
                <button
                  className="rounded-full bg-green-500 px-3 py-1.5 text-[11px] font-semibold text-black transition hover:bg-green-400 sm:px-4 sm:py-2 sm:text-xs"
                  onClick={() => openFullScreenPlayer(track)}
                >
                  {playingTrackId === track.id && isPlayerOpen ? 'Playing' : 'Play'}
                </button>
              ) : (
                <span className="text-xs text-neutral-500">No preview</span>
              )}
              {track.external_url ? (
                <a
                  href={track.external_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-neutral-300 transition hover:bg-white/10"
                >
                  Open
                </a>
              ) : null}
            </div>
          </div>
        )
      })}

      {isPlayerOpen && activeTrack ? (
        <div ref={playerOverlayRef} className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900 to-black p-4 shadow-2xl sm:p-5 md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">Now Playing</p>
              <button
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-300 transition hover:bg-white/10"
                onClick={closePlayer}
              >
                Close
              </button>
            </div>

            <div className="mb-6 flex flex-col items-center gap-4 text-center">
              <img
                src={activeTrack.album?.images?.[0]?.url || activeTrack.album?.images?.[2]?.url}
                alt={activeTrack.album?.name || 'Album'}
                className="h-44 w-44 rounded-2xl object-cover shadow-2xl sm:h-56 sm:w-56 md:h-72 md:w-72"
              />
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">{activeTrack.name}</h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {activeTrack.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist'}
                </p>
                <p className="mt-1 text-xs text-neutral-500">{activeTrack.album?.name || 'Unknown Album'}</p>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={activeTrack.preview_url}
              controls
              autoPlay
              className="w-full"
            >
              <track kind="captions" />
            </audio>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Playlist

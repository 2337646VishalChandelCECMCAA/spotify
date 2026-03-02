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
  const audioRef = useRef(new Audio())

  // Stop audio when component unmounts.
  useEffect(() => {
    const audio = audioRef.current
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  // Play/pause 30-second preview using preview_url.
  const togglePreview = (track) => {
    if (!track?.preview_url) {
      return
    }

    const audio = audioRef.current
    if (playingTrackId === track.id) {
      audio.pause()
      setPlayingTrackId(null)
      return
    }

    audio.src = track.preview_url
    audio.play()
    setPlayingTrackId(track.id)
  }

  // Reset play state when audio finishes.
  useEffect(() => {
    const audio = audioRef.current
    const onEnded = () => setPlayingTrackId(null)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

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
            className="group grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/60 p-2.5 transition hover:border-white/20 hover:bg-neutral-800/80"
            key={track.id || `${track.name}-${item.added_at}`}
          >
            <img
              src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
              alt={track.album?.name || 'Album'}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {index + 1}. {track.name}
              </p>
              <p className="truncate text-xs text-neutral-400">
                {track.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist'}
              </p>
              <p className="truncate text-[11px] text-neutral-500">
                {track.album?.name || 'Unknown Album'} • {formatDuration(track.duration_ms)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {track.preview_url ? (
                <button
                  className="rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-black transition hover:bg-green-400"
                  onClick={() => togglePreview(track)}
                >
                  {playingTrackId === track.id ? 'Pause' : 'Play 30s'}
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
    </div>
  )
}

export default Playlist

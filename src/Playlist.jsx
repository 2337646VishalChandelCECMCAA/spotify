import { useState } from "react"

const formatDuration = (durationMs) => {
  if (!durationMs) {
    return '--:--'
  }

  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

// Icons
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
)

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
)

const EqualizerIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="#1db954">
    <rect x="2" y="4" width="2" height="8" className="animate-pulse-slow" />
    <rect x="5" y="2" width="2" height="12" className="animate-pulse-slow" style={{ animationDelay: '0.2s' }} />
    <rect x="8" y="5" width="2" height="6" className="animate-pulse-slow" style={{ animationDelay: '0.4s' }} />
    <rect x="11" y="3" width="2" height="10" className="animate-pulse-slow" style={{ animationDelay: '0.6s' }} />
  </svg>
)

function Playlist({ tracks, onPlayTrack, currentTrackId }) {
  if (!tracks.length) {
    return (
      <div className="py-8 text-center text-[#a7a7a7]">
        <p>No tracks available for this playlist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {tracks.map((item, index) => {
        const track = item.track
        if (!track) {
          return null
        }

        const isCurrentTrack = currentTrackId === track.id
        const hasPreview = !!track.preview_url

        return (
          <div
            className={`track-row group grid grid-cols-[16px_4fr_2fr_minmax(80px,1fr)] items-center gap-4 rounded-md px-4 py-2 mx-2 my-0.5 ${
              isCurrentTrack 
                ? 'bg-[#ffffff1a]' 
                : 'hover:bg-[#ffffff1a]'
            }`}
            key={track.id || `${track.name}-${index}`}
            onClick={() => hasPreview && onPlayTrack(track, index)}
            style={{ cursor: hasPreview ? 'pointer' : 'default' }}
          >
            {/* Track Number / Play Button */}
            <div className="flex items-center justify-center">
              {isCurrentTrack ? (
                <EqualizerIcon />
              ) : (
                <>
                  <span className={`track-number text-sm ${isCurrentTrack ? 'text-[#1db954]' : 'text-[#a7a7a7]'}`}>
                    {index + 1}
                  </span>
                  {hasPreview && (
                    <button className="track-play-icon text-white">
                      <PlayIcon />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Track Info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative overflow-hidden h-10 w-10 flex-shrink-0 bg-[#282828] mr-2">
                <img
                  src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                  alt={track.album?.name || 'Album'}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-base font-normal ${
                  isCurrentTrack ? 'text-[#1db954]' : 'text-white'
                }`}>
                  {track.name}
                </p>
                <p className="truncate text-sm text-[#a7a7a7] hover:text-white hover:underline transition-colors mt-0.5">
                  {track.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist'}
                </p>
              </div>
            </div>

            {/* Album Name */}
            <div className="hidden min-w-0 md:block">
              <p className="truncate text-sm text-[#a7a7a7] group-hover:text-white transition-colors duration-200 hover:underline">
                {track.album?.name || 'Unknown Album'}
              </p>
            </div>

            {/* Duration & Actions */}
            <div className="flex items-center justify-end gap-6 text-sm">
              {track.external_url && (
                <a
                  href={track.external_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden text-xs font-semibold uppercase tracking-wider text-[#a7a7a7] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:text-white hover:scale-105"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open
                </a>
              )}
              <span className="text-[#a7a7a7] font-variant-numeric: tabular-nums">
                {formatDuration(track.duration_ms)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Playlist

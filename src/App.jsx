import { useEffect, useState } from 'react'
import { getSearchTracks } from './spotify'
import Sidebar from './Sidebar.jsx'
import Body from './Body.jsx'
import Player from './Player.jsx'

const PLAYLIST_TYPES = [
  { id: 'top-hits', name: 'Top Hits', query: 'global top hits', mood: 'Trending now', color: '#e13300' },
  { id: 'bollywood', name: 'Bollywood', query: 'bollywood hits', mood: 'Hindi chartbusters', color: '#8400e7' },
  { id: 'pop', name: 'Pop Essentials', query: 'pop hits', mood: 'Popular anthems', color: '#1e3264' },
  { id: 'chill', name: 'Chill Vibes', query: 'chill music', mood: 'Relax and unwind', color: '#503750' },
  { id: 'workout', name: 'Workout Mix', query: 'workout music', mood: 'High energy tracks', color: '#e8115b' },
  { id: 'romance', name: 'Romantic', query: 'romantic songs', mood: 'Love mood playlist', color: '#dc148c' },
  { id: 'hip-hop', name: 'Hip-Hop', query: 'hip hop hits', mood: 'Rap and rhythm', color: '#ba5d07' },
  { id: 'party', name: 'Party Time', query: 'party songs', mood: 'Dance floor ready', color: '#e61e32' },
  { id: 'focus', name: 'Focus Flow', query: 'focus music', mood: 'Deep work beats', color: '#1e3264' },
  { id: 'lofi', name: 'Lo-Fi Lounge', query: 'lofi beats', mood: 'Calm study atmosphere', color: '#477d95' },
  { id: 'rock', name: 'Rock Classics', query: 'classic rock', mood: 'Guitar-driven legends', color: '#e91429' },
  { id: 'indie', name: 'Indie Mix', query: 'indie music', mood: 'Fresh alternative sounds', color: '#608108' },
  { id: 'edm', name: 'EDM Blast', query: 'edm hits', mood: 'Festival energy', color: '#0d73ec' },
  { id: 'jazz', name: 'Jazz Evening', query: 'jazz songs', mood: 'Smooth and soulful', color: '#7d4b32' },
  { id: 'sleep', name: 'Sleep Sounds', query: 'sleep music', mood: 'Soft night-time tracks', color: '#1e3264' },
  { id: 'devotional', name: 'Devotional', query: 'devotional songs', mood: 'Peaceful spiritual songs', color: '#b06239' },
]

const mapApiTracks = (results) =>
  (results || []).map((item) => ({
    track: {
      id: item.trackId,
      name: item.trackName,
      artists: [{ name: item.artistName }], 
      album: {
        name: item.collectionName,
        images: [{ url: item.artworkUrl100 }],
      },
      preview_url: item.previewUrl,
      external_url: item.trackViewUrl,
      duration_ms: item.trackTimeMillis,
    },
  }))

function App() {
  const [selectedPlaylistType, setSelectedPlaylistType] = useState(PLAYLIST_TYPES[0])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState({
    id: PLAYLIST_TYPES[0].id,
    name: PLAYLIST_TYPES[0].name,
    images: [],
    tracks: { total: 0 },
    color: PLAYLIST_TYPES[0].color,
  })
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1)

  // Load tracks for selected playlist type or search query with debounce.
  useEffect(() => {
    let isCurrentRequest = true
    const query = searchTerm.trim() || selectedPlaylistType.query

    const searchTimer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await getSearchTracks(query)
        if (!isCurrentRequest) {
          return
        }

        const mappedTracks = mapApiTracks(response.data.results)
        setTracks(mappedTracks)
        setSelectedPlaylist((current) => ({
          ...current,
          id: selectedPlaylistType.id,
          name: searchTerm.trim() ? `Results: ${searchTerm.trim()}` : selectedPlaylistType.name,
          images: mappedTracks[0]?.track?.album?.images || [],
          tracks: { total: mappedTracks.length },
          color: selectedPlaylistType.color,
        }))
      } catch (error) {
        if (isCurrentRequest) {
          console.error('Failed to load tracks:', error)
          setTracks([])
          setSelectedPlaylist((current) => ({
            ...current,
            id: selectedPlaylistType.id,
            name: searchTerm.trim() ? `Results: ${searchTerm.trim()}` : selectedPlaylistType.name,
            images: [],
            tracks: { total: 0 },
            color: selectedPlaylistType.color,
          }))
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false)
        }
      }
    }, 400)

    return () => {
      isCurrentRequest = false
      clearTimeout(searchTimer)
    }
  }, [searchTerm, selectedPlaylistType])

  // Change active playlist type from sidebar or home cards.
  const handleSelectPlaylistType = (playlistType) => {
    setSelectedPlaylistType(playlistType)
    setSearchTerm('')
    setIsSidebarOpen(false)
  }

  // Play a track
  const handlePlayTrack = (track, index) => {
    setCurrentTrack(track)
    setCurrentTrackIndex(index)
  }

  // Play next track
  const handleNextTrack = () => {
    if (tracks.length === 0) return
    const nextIndex = (currentTrackIndex + 1) % tracks.length
    const nextTrack = tracks[nextIndex]?.track
    if (nextTrack?.preview_url) {
      setCurrentTrack(nextTrack)
      setCurrentTrackIndex(nextIndex)
    }
  }

  // Play previous track
  const handlePreviousTrack = () => {
    if (tracks.length === 0) return
    const prevIndex = currentTrackIndex <= 0 ? tracks.length - 1 : currentTrackIndex - 1
    const prevTrack = tracks[prevIndex]?.track
    if (prevTrack?.preview_url) {
      setCurrentTrack(prevTrack)
      setCurrentTrackIndex(prevIndex)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#121212] text-white pb-[90px]">
      <Sidebar
        profile={null}
        playlists={PLAYLIST_TYPES}
        selectedPlaylistId={selectedPlaylistType?.id}
        onSelectPlaylist={handleSelectPlaylistType}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((current) => !current)}
      />
      <div className="md:ml-[280px]">
        <Body
          selectedPlaylist={selectedPlaylist}
          tracks={tracks}
          loading={loading}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          playlists={PLAYLIST_TYPES}
          selectedPlaylistId={selectedPlaylistType?.id}
          onSelectPlaylist={handleSelectPlaylistType}
          onPlayTrack={handlePlayTrack}
          currentTrackId={currentTrack?.id}
        />
      </div>
      <Player 
        track={currentTrack} 
        onNext={handleNextTrack}
        onPrevious={handlePreviousTrack}
      />
    </div>
  )
}

export default App

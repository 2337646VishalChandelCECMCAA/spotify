import { useEffect, useState } from 'react'
import { getSearchTracks } from './spotify'
import Sidebar from './Sidebar.jsx'
import Body from './Body.jsx'

const PLAYLIST_TYPES = [
  { id: 'top-hits', name: 'Top Hits', query: 'global top hits', mood: 'Trending now' },
  { id: 'bollywood', name: 'Bollywood', query: 'bollywood hits', mood: 'Hindi chartbusters' },
  { id: 'pop', name: 'Pop Essentials', query: 'pop hits', mood: 'Popular anthems' },
  { id: 'chill', name: 'Chill Vibes', query: 'chill music', mood: 'Relax and unwind' },
  { id: 'workout', name: 'Workout Mix', query: 'workout music', mood: 'High energy tracks' },
  { id: 'romance', name: 'Romantic', query: 'romantic songs', mood: 'Love mood playlist' },
  { id: 'hip-hop', name: 'Hip-Hop', query: 'hip hop hits', mood: 'Rap and rhythm' },
  { id: 'party', name: 'Party Time', query: 'party songs', mood: 'Dance floor ready' },
  { id: 'focus', name: 'Focus Flow', query: 'focus music', mood: 'Deep work beats' },
  { id: 'lofi', name: 'Lo-Fi Lounge', query: 'lofi beats', mood: 'Calm study atmosphere' },
  { id: 'rock', name: 'Rock Classics', query: 'classic rock', mood: 'Guitar-driven legends' },
  { id: 'indie', name: 'Indie Mix', query: 'indie music', mood: 'Fresh alternative sounds' },
  { id: 'edm', name: 'EDM Blast', query: 'edm hits', mood: 'Festival energy' },
  { id: 'jazz', name: 'Jazz Evening', query: 'jazz songs', mood: 'Smooth and soulful' },
  { id: 'sleep', name: 'Sleep Sounds', query: 'sleep music', mood: 'Soft night-time tracks' },
  { id: 'devotional', name: 'Devotional', query: 'devotional songs', mood: 'Peaceful spiritual songs' },
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
  })
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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

  return (
    <div className="min-h-screen overflow-x-hidden bg-neutral-950 text-white">
      <Sidebar
        profile={null}
        playlists={PLAYLIST_TYPES}
        selectedPlaylistId={selectedPlaylistType?.id}
        onSelectPlaylist={handleSelectPlaylistType}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((current) => !current)}
      />
      <div className="md:ml-[320px]">
        <Body
          selectedPlaylist={selectedPlaylist}
          tracks={tracks}
          loading={loading}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          playlists={PLAYLIST_TYPES}
          selectedPlaylistId={selectedPlaylistType?.id}
          onSelectPlaylist={handleSelectPlaylistType}
        />
      </div>
    </div>
  )
}

export default App

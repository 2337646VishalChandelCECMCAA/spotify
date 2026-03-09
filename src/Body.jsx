import { useState, useRef, useEffect } from 'react'
import Playlist from './Playlist.jsx'

// Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
    <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z" />
  </svg>
)

const TrendingIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
    <path d="M10.907 2.553L11 2.5h2.5a.5.5 0 0 1 .5.5v2.5l-.053.093L9.354 10.5a.5.5 0 0 1-.708 0L5.5 7.354a.5.5 0 0 1 0-.708l4.907-4.093zM13 3.5h-1.293l-4.5 3.75L8.5 8.543l4.5-3.75V3.5z" />
    <path d="M5.5.5A.5.5 0 0 1 6 1v2.5l-.053.093L1.354 8.5a.5.5 0 0 1-.708 0L.5 8.354a.5.5 0 0 1 0-.708L5 3.253V1a.5.5 0 0 1 .5-.5z" />
  </svg>
)

const HistoryIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
  </svg>
)

// Popular search suggestions
const POPULAR_SEARCHES = [
  { text: 'Arijit Singh', type: 'trending' },
  { text: 'Taylor Swift', type: 'trending' },
  { text: 'The Weeknd', type: 'trending' },
  { text: 'Dua Lipa', type: 'trending' },
  { text: 'Ed Sheeran', type: 'trending' },
  { text: 'Drake', type: 'trending' },
  { text: 'BTS', type: 'trending' },
  { text: 'Coldplay', type: 'trending' },
  { text: 'Billie Eilish', type: 'trending' },
  { text: 'Justin Bieber', type: 'trending' },
  { text: 'Imagine Dragons', type: 'trending' },
  { text: 'Post Malone', type: 'trending' },
  { text: 'Ariana Grande', type: 'trending' },
  { text: 'Bad Bunny', type: 'trending' },
  { text: 'Selena Gomez', type: 'trending' },
]

function Body({ selectedPlaylist, tracks, loading, searchTerm, onSearchTermChange, playlists, onSelectPlaylist, onPlayTrack, currentTrackId }) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches')
    return saved ? JSON.parse(saved) : []
  })
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Filter suggestions based on search term
  const filteredSuggestions = searchTerm.trim()
    ? POPULAR_SEARCHES.filter(s => 
        s.text.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : []

  // Combine recent searches and popular suggestions
  const suggestions = searchTerm.trim()
    ? [
        ...recentSearches
          .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
          .slice(0, 3)
          .map(text => ({ text, type: 'recent' })),
        ...filteredSuggestions.filter(s => 
          !recentSearches.some(r => r.toLowerCase() === s.text.toLowerCase())
        )
      ].slice(0, 8)
    : [
        ...recentSearches.slice(0, 3).map(text => ({ text, type: 'recent' })),
        ...POPULAR_SEARCHES.slice(0, 5)
      ]

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Save to recent searches
  const saveRecentSearch = (term) => {
    if (!term.trim()) return
    const updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Handle suggestion click
  const handleSuggestionClick = (text) => {
    onSearchTermChange(text)
    saveRecentSearch(text)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex].text)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  // Clear a recent search
  const clearRecentSearch = (text, e) => {
    e.stopPropagation()
    const updated = recentSearches.filter(s => s !== text)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  return (
    <main className="min-h-screen pt-4 md:pt-0">
      {/* Header with search */}
      <header className="sticky top-0 z-20 flex items-center gap-4 bg-[#121212]/95 px-4 py-4 backdrop-blur-sm md:px-8">
        {/* Navigation Buttons */}
        <div className="hidden gap-2 md:flex">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70">
            <svg viewBox="0 0 16 16" fill="#fff" className="h-4 w-4">
              <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z" />
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70">
            <svg viewBox="0 0 16 16" fill="#fff" className="h-4 w-4">
              <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z" />
            </svg>
          </button>
        </div>

        {/* Search Bar with Suggestions */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 z-10">
            <SearchIcon />
          </div>
          <input
            ref={searchRef}
            id="song-search"
            type="text"
            value={searchTerm}
            onChange={(event) => {
              onSearchTermChange(event.target.value)
              setSelectedIndex(-1)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to listen to?"
            className="w-full rounded-full bg-[#242424] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-[#a7a7a7] focus:bg-[#2a2a2a] focus:ring-2 focus:ring-white/20"
            autoComplete="off"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-lg bg-[#282828] shadow-xl animate-fade-in"
            >
              {!searchTerm.trim() && recentSearches.length > 0 && (
                <div className="px-4 py-2 text-xs font-bold text-[#a7a7a7] uppercase tracking-wider">
                  Recent searches
                </div>
              )}
              {!searchTerm.trim() && recentSearches.length === 0 && (
                <div className="px-4 py-2 text-xs font-bold text-[#a7a7a7] uppercase tracking-wider">
                  Popular searches
                </div>
              )}
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li key={`${suggestion.type}-${suggestion.text}`}>
                    <div
                      role="button"
                      tabIndex={0}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition cursor-pointer ${
                        selectedIndex === index 
                          ? 'bg-[#3e3e3e] text-white' 
                          : 'text-[#b3b3b3] hover:bg-[#3e3e3e] hover:text-white'
                      }`}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3e3e3e]">
                        {suggestion.type === 'recent' ? <HistoryIcon /> : <TrendingIcon />}
                      </span>
                      <span className="flex-1 truncate text-sm font-medium">
                        {suggestion.text}
                      </span>
                      {suggestion.type === 'recent' && (
                        <button
                          onClick={(e) => clearRecentSearch(suggestion.text, e)}
                          className="rounded-full p-1 text-[#a7a7a7] hover:bg-[#4e4e4e] hover:text-white"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                            <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06z" />
                          </svg>
                        </button>
                      )}
                      {suggestion.type === 'trending' && (
                        <span className="text-xs text-[#1db954]">Trending</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:scale-105 transition">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.127-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.249.054.908.468 1.717 1.08 2.449l.438.525a2.25 2.25 0 0 1-.603 3.39l-2.21 1.274A3.25 3.25 0 0 0 2.22 14.5h11.56a3.25 3.25 0 0 0-1.624-2.816l-2.21-1.275a2.25 2.25 0 0 1-.603-3.39l.438-.525c.612-.732 1.026-1.54 1.08-2.449.032-.466-.066-1.023-.143-1.249a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="px-4 pb-8 md:px-8">
        {!selectedPlaylist ? (
          <div className="grid min-h-[60vh] place-items-center text-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Select a playlist</h2>
              <p className="mt-2 text-[#a7a7a7]">Choose one from the sidebar to view tracks.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Playlist Header */}
            <div 
              className="relative -mx-4 -mt-4 mb-6 px-4 pb-6 pt-8 md:-mx-8 md:px-8 md:pb-8 md:pt-16"
              style={{ 
                background: `linear-gradient(to bottom, ${selectedPlaylist.color || '#535353'} 0%, #121212 100%)`
              }}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
                {selectedPlaylist?.images?.[0]?.url ? (
                  <img
                    src={selectedPlaylist.images[0].url}
                    alt={selectedPlaylist.name}
                    className="h-40 w-40 rounded object-cover shadow-2xl md:h-56 md:w-56"
                  />
                ) : (
                  <div 
                    className="flex h-40 w-40 items-center justify-center rounded text-5xl shadow-2xl md:h-56 md:w-56 md:text-7xl"
                    style={{ backgroundColor: selectedPlaylist.color || '#282828' }}
                  >
                    ♪
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase">Playlist</span>
                  <h1 className="text-4xl font-black md:text-6xl lg:text-7xl">{selectedPlaylist.name}</h1>
                  <p className="mt-2 text-sm text-[#b3b3b3]">
                    {selectedPlaylist.tracks?.total || 0} songs
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex items-center gap-6">
              <button 
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1db954] text-black shadow-lg transition hover:scale-105 hover:bg-[#1ed760]"
                onClick={() => {
                  const firstPlayable = tracks.find(t => t.track?.preview_url)
                  if (firstPlayable) {
                    onPlayTrack(firstPlayable.track, tracks.indexOf(firstPlayable))
                  }
                }}
              >
                <PlayIcon />
              </button>
            </div>

            {/* Track List Header */}
            <div className="mb-2 grid grid-cols-[16px_4fr_2fr_minmax(80px,1fr)] gap-4 border-b border-[#ffffff1a] px-4 pb-2 text-[#b3b3b3]">
              <div className="text-sm">#</div>
              <div className="text-sm">Title</div>
              <div className="hidden text-sm md:block">Album</div>
              <div className="flex justify-end">
                <ClockIcon />
              </div>
            </div>

            {loading ? (
              <div className="space-y-2 py-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex animate-pulse items-center gap-4 rounded-md p-2">
                    <div className="h-4 w-4 rounded bg-[#282828]" />
                    <div className="h-10 w-10 rounded bg-[#282828]" />
                    <div className="flex-1">
                      <div className="h-4 w-48 rounded bg-[#282828]" />
                      <div className="mt-2 h-3 w-32 rounded bg-[#282828]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Playlist 
                tracks={tracks} 
                onPlayTrack={onPlayTrack}
                currentTrackId={currentTrackId}
              />
            )}
          </>
        )}

        {/* Quick Picks Grid */}
        {!searchTerm && (
          <div className="mt-10">
            <h2 className="mb-4 text-2xl font-bold">Browse All</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {playlists.slice(0, 12).map((playlist) => (
                <button
                  key={playlist.id}
                  className="playlist-card group relative overflow-hidden rounded-lg p-4 text-left transition"
                  style={{ backgroundColor: playlist.color || '#282828' }}
                  onClick={() => onSelectPlaylist(playlist)}
                >
                  <div className="relative">
                    <h3 className="line-clamp-2 text-base font-bold">{playlist.name}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Body

// Icons
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.28c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
  </svg>
)

const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
    <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z" />
  </svg>
)

const SpotifyLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-white">
    <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)

function Sidebar({ profile, playlists, selectedPlaylistId, onSelectPlaylist, isOpen, onToggle, onHomeClick }) {
  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-[#121212] px-4 md:hidden">
        <div className="flex items-center gap-2">
          <SpotifyLogo />
          <span className="text-lg font-bold">Spotify</span>
        </div>
        <button
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden" 
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Desktop Layout (Islands) / Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 ease-in-out
        bg-black md:bg-transparent
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:top-0 md:z-30 md:flex md:flex-col md:h-full md:w-[80px] lg:w-[280px]
      `}>
        <div className="flex flex-col h-full md:gap-2">
          {/* Navigation Section */}
          <div className="spotify-island p-3 pt-4 bg-[#121212] lg:p-4">
            <div className="mb-6 hidden items-center gap-1 px-3 lg:flex">
              <SpotifyLogo />
              <span className="ml-1 text-xl font-bold tracking-tight">Spotify</span>
            </div>
            
            <nav className="space-y-2">
              <a 
                href="#" 
                className="flex items-center gap-4 px-3 py-2 text-[#b3b3b3] transition duration-200 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  if (onHomeClick) onHomeClick();
                }}
              >
                <HomeIcon />
                <span className="font-bold hidden lg:block">Home</span>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-4 px-3 py-2 text-[#b3b3b3] transition duration-200 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  // Focus search input or trigger search view
                  document.getElementById('song-search')?.focus();
                }}
              >
                <SearchIcon />
                <span className="font-bold hidden lg:block">Search</span>
              </a>
            </nav>
          </div>

          {/* Library Section */}
          <div className="flex flex-1 flex-col spotify-island overflow-hidden bg-[#121212]">
            <div className="flex items-center justify-between p-4 pb-0">
              <button className="flex items-center gap-3 text-[#b3b3b3] transition duration-200 hover:text-white w-full">
                <LibraryIcon />
                <span className="font-bold hidden lg:block">Your Library</span>
              </button>
              <button className="hidden lg:flex h-8 w-8 items-center justify-center rounded-full text-[#b3b3b3] transition duration-200 hover:bg-[#1a1a1a] hover:text-white">
                <PlusIcon />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="hidden lg:flex gap-2 px-4 py-3">
              <button className="nav-pill active">Playlists</button>
            </div>

            {/* Playlist List */}
            <div className="spotify-scroll flex-1 overflow-y-auto px-2 pb-2">
              <ul className="space-y-0.5">
                {playlists.map((playlist) => (
                  <li key={playlist.id}>
                    <button
                      className={`library-item group flex w-full items-center gap-3 text-left transition-colors duration-200 ${
                        selectedPlaylistId === playlist.id ? 'bg-[#232323]' : 'hover:bg-[#1a1a1a]'
                      }`}
                      onClick={() => onSelectPlaylist(playlist)}
                    >
                      <img 
                        src={`https://picsum.photos/seed/${playlist.id}/48/48`}
                        alt={playlist.name}
                        className="h-12 w-12 flex-shrink-0 rounded object-cover"
                        style={{ display: 'block' }} // Fallback if images fail
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded text-lg text-white"
                        style={{ backgroundColor: playlist.color || '#282828' }}
                      >
                        ♪
                      </div>
                      <div className="min-w-0 flex-1 hidden lg:block">
                        <p className={`truncate text-sm font-medium ${
                          selectedPlaylistId === playlist.id ? 'text-white' : 'text-white'
                        }`}>
                          {playlist.name}
                        </p>
                        <p className="truncate text-xs text-[#b3b3b3]">
                          Playlist • {playlist.mood}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile spacing */}
      <div className="h-16 md:hidden" />
    </>
  )
}

export default Sidebar

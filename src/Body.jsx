import Playlist from './Playlist.jsx'

function Body({ selectedPlaylist, tracks, loading, searchTerm, onSearchTermChange }) {
  return (
    <main className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 px-3 py-4 pb-8 sm:px-4 sm:py-6 md:px-8 md:py-8 md:pb-10">
      <div className="mb-4 rounded-2xl border border-white/10 bg-neutral-900/70 p-4">
        <label
          htmlFor="song-search"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400"
        >
          Search Songs
        </label>
        <input
          id="song-search"
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Try: arijit singh, weeknd, taylor swift..."
          className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-green-500/70 focus:ring-2 focus:ring-green-500/30"
        />
      </div>

      {!selectedPlaylist ? (
        <div className="grid min-h-[70vh] place-items-center rounded-2xl border border-white/10 bg-neutral-900/40 text-center">
          <div>
            <h2 className="text-2xl font-semibold text-white">Select a playlist</h2>
            <p className="mt-2 text-neutral-400">Choose one from the sidebar to view tracks.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl sm:p-4 md:mb-6 md:flex-row md:items-end md:p-6">
            {selectedPlaylist?.images?.[0]?.url ? (
              <img
                src={selectedPlaylist.images[0].url}
                alt={selectedPlaylist.name}
                className="h-28 w-28 rounded-xl object-cover shadow-lg sm:h-32 sm:w-32 md:h-40 md:w-40"
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-400 text-3xl text-black shadow-lg sm:h-32 sm:w-32 sm:text-4xl md:h-40 md:w-40">
                ♪
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">Playlist</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-5xl">{selectedPlaylist.name}</h2>
              <p className="mt-2 text-sm text-neutral-300">{selectedPlaylist.tracks?.total || 0} songs</p>
            </div>
          </div>

          {loading ? (
            <p className="rounded-xl border border-white/10 bg-neutral-900/70 p-4 text-sm text-neutral-300">Loading tracks...</p>
          ) : (
            <Playlist tracks={tracks} />
          )}
        </>
      )}
    </main>
  )
}

export default Body

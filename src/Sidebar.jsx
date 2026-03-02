function Sidebar({ profile, playlists, selectedPlaylistId, onSelectPlaylist }) {
  return (
    <aside className="border-b border-white/10 bg-black px-4 py-5 md:border-b-0 md:border-r md:border-white/10 md:px-5 md:py-6">
      <div className="mb-5 flex items-center gap-2 text-xl font-extrabold tracking-tight">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-black">
          ♪
        </span>
        Spotify Clone
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-800 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Now browsing</p>
        <div className="flex items-center gap-3">
          {profile?.images?.[0]?.url ? (
            <img
              src={profile.images[0].url}
              alt={profile.display_name || 'User profile'}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-full bg-neutral-700">♪</div>
          )}
          <div>
            <p className="text-sm font-semibold text-white">Guest Listener</p>
            <p className="text-xs text-neutral-400">Home Playlists</p>
          </div>
        </div>
      </div>

      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">Playlist Types</h3>
      <ul className="space-y-2">
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <button
              className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                selectedPlaylistId === playlist.id
                  ? 'border-green-500/40 bg-green-500/20 text-white shadow-[0_0_0_1px_rgba(34,197,94,0.2)]'
                  : 'border-white/10 bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
              onClick={() => onSelectPlaylist(playlist)}
            >
              <p className="line-clamp-1">{playlist.name}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-neutral-400">{playlist.mood}</p>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar

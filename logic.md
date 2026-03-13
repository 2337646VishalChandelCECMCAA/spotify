# Spotify Clone Logic (Updated: 2026-03-13)

This document explains the current app behavior after the latest updates.

## 1. Architecture

The app is split into a few main responsibilities:

- `src/App.jsx`: Central state + orchestration.
- `src/Body.jsx`: Main page content (home, playlist view, search view).
- `src/Sidebar.jsx`: Navigation + playlist list.
- `src/Player.jsx`: Audio playback controls and timeline.
- `src/spotify.js`: iTunes API fetch logic with proxy fallback.

Data mostly flows one way:

1. User action (click/search/play).
2. `App.jsx` updates state.
3. `Body`/`Sidebar`/`Player` receive new props.
4. UI re-renders.

## 2. Core App State (`src/App.jsx`)

`App` tracks these key values:

- `selectedPlaylistType`: selected playlist category (`null` on Home).
- `selectedPlaylist`: active playlist/search metadata shown in header.
- `tracks`: mapped list of API tracks.
- `searchTerm`: current search string.
- `loading`: fetch status.
- `currentTrack`: currently playing track object.
- `currentTrackIndex`: position of current track in `tracks`.
- `isSidebarOpen`: mobile sidebar toggle.

## 3. Track Mapping Logic

API data is normalized in `mapApiTracks`:

- `trackId -> track.id`
- `trackName -> track.name`
- `artistName -> track.artists[0].name`
- `artworkUrl100 -> track.album.images[0].url`
- `previewUrl -> track.preview_url`
- `trackViewUrl -> track.external_url`
- `trackTimeMillis -> track.duration_ms`

This keeps UI components independent from raw iTunes response format.

## 4. Fetch Flow (Search + Playlist)

Main fetch effect in `App.jsx`:

1. Compute search mode:
   - `trimmedSearchTerm = searchTerm.trim()`
   - `isSearchMode = Boolean(trimmedSearchTerm)`
2. Build query:
   - Search mode: use `trimmedSearchTerm`
   - Playlist mode: use `selectedPlaylistType?.query`
3. If no query exists, clear tracks and stop loading.
4. Debounce network call by 400ms.
5. Use `isCurrentRequest` guard to ignore stale responses.
6. On success:
   - map tracks
   - build `playlistMeta`
   - update `selectedPlaylist`
7. On failure:
   - log error
   - clear tracks
   - still update `selectedPlaylist` metadata safely.

### Important crash fix included

Search can run while `selectedPlaylistType` is `null` (for example from Home -> Trending Artists click). The code now avoids direct access like `selectedPlaylistType.id` and uses safe optional chaining plus a search-specific fallback object (`playlistMeta`).

## 5. Home / Playlist / Search View Logic (`src/Body.jsx`)

`Body` has three display modes:

1. Home mode: `!selectedPlaylist && !searchTerm`
   - Shows Good Evening cards.
   - Shows Top Mixes cards.
   - Shows Trending Artists row.
   - Shows Browse All section.
2. Playlist mode: `selectedPlaylist && !searchTerm`
   - Shows playlist hero header.
   - Shows play button for first playable preview.
   - Shows track table.
3. Search mode: `searchTerm`
   - Shows search result title.
   - Shows loading skeleton or `Playlist` rows.
   - Shows empty-state message when no tracks found.

## 6. Home Card Image Logic (new)

Home cards now render real images instead of only placeholder colors.

Image helper functions:

- `getPlaylistImage(playlistId)`
- `getArtistImage(artistName)`

Both use deterministic seeded URLs from Picsum so image identity stays stable for each card.

Fallback behavior:

- Cards keep a background color.
- If image loading fails, `<img>` is hidden via `onError`, so the card still looks valid.

## 7. Search Suggestions + Recent Searches (`src/Body.jsx`)

Suggestions are built from:

- `recentSearches` in `localStorage`.
- static `POPULAR_SEARCHES` list.

Behavior:

- On focus, dropdown opens.
- Click outside closes dropdown.
- ArrowUp/ArrowDown moves highlighted suggestion.
- Enter selects highlighted suggestion.
- Escape closes dropdown.
- Selecting a suggestion also saves it to recents.
- Recent terms are de-duplicated and capped at 10.

## 8. Sidebar Logic (`src/Sidebar.jsx`)

- Home button triggers `onHomeClick` from `App`:
  - clears selected playlist type
  - clears selected playlist
  - clears search term
  - closes mobile sidebar
- Search button focuses `#song-search` input.
- Playlist list supports selected-state highlight.
- Sidebar playlist thumbnails use Picsum images with a fallback music-tile on image error.
- Mobile overlay closes drawer on background click.

## 9. Playback Logic (`src/Player.jsx` + `src/App.jsx`)

### Selecting a track

- Clicking a playable row calls `onPlayTrack(track, index)`.
- `App` stores both `currentTrack` and `currentTrackIndex`.

### Auto-play

- When `track?.id` changes, player attempts `audio.play()` and sets `isPlaying`.

### Audio event sync

`Player` subscribes to:

- `timeupdate` -> updates `currentTime`
- `loadedmetadata` -> updates `duration`
- `ended` -> repeat current track or call `onNext`

### Next / Previous

In `App`:

- Next: wraps with modulo.
- Previous: wraps to end when at index 0.
- Only advances to tracks with `preview_url`.

### Other controls

- Shuffle: UI toggle state.
- Repeat: UI toggle + end-of-track behavior.
- Volume slider: `0..1`, synced to audio element.
- Seek bar: updates `audio.currentTime`.

## 10. Playlist Row Logic (`src/Playlist.jsx`)

- Ignores invalid items without `track`.
- Row click only works when `preview_url` exists.
- Current track row is highlighted and shows equalizer icon.
- Track artist, album, duration, and external open-link are rendered with hover interactions.

## 11. Network Layer (`src/spotify.js`)

`getSearchTracks(term)`:

1. Builds iTunes search URL with `media=music`, `entity=song`, `limit=25`.
2. Tries proxy list in order:
   - `codetabs`
   - `thingproxy`
3. Returns first successful response with `data.results`.
4. Throws a user-facing fetch error if all proxies fail.

`getDemoTracks()` is compatibility alias to `getSearchTracks('top hits')`.

## 12. Recent Changes Captured Here

- Fixed black screen on artist click by guarding search flow when no playlist type is selected.
- Added deterministic images for home playlist cards and artist cards with robust fallbacks.
- Kept search, playlist, and home rendering paths explicit and mutually consistent.

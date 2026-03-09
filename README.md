# 🎵 Spotify Clone

A beautiful Spotify-inspired music player built with React and Vite. Search for songs, browse playlists, and play track previews!

## ✨ Features

- 🔍 **Search Songs** - Search for your favorite artists and tracks with auto-suggestions
- 📋 **Browse Playlists** - Explore curated playlists (Pop, Bollywood, Hip-Hop, etc.)
- ▶️ **Play Previews** - Listen to 30-second track previews
- 🎨 **Spotify UI** - Modern, responsive design matching Spotify's look
- 💾 **Search History** - Your recent searches are saved locally
- 📱 **Mobile Friendly** - Works great on all screen sizes

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Choose the "LTS" (Long Term Support) version
   - Run the installer and follow the prompts

2. **A Code Editor** (recommended: VS Code)
   - Download from: https://code.visualstudio.com/

### Installation

Follow these steps to run the project on your computer:

#### Step 1: Open the Project

Open the `spotify-clone` folder in VS Code (or your preferred code editor).

#### Step 2: Open Terminal

In VS Code, open the terminal:
- **Windows/Linux:** Press `` Ctrl + ` `` (backtick key, usually below Escape)
- **Mac:** Press `` Cmd + ` ``
- Or go to **View → Terminal** from the menu

#### Step 3: Install Dependencies

In the terminal, type this command and press Enter:

```bash
npm install
```

This downloads all the packages the project needs. Wait for it to finish.

#### Step 4: Start the Development Server

Run this command:

```bash
npm run dev
```

You should see output like:

```
VITE v7.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

#### Step 5: View the App

Open your web browser and go to:

```
http://localhost:5173/
```

🎉 **You should now see the Spotify Clone running!**

---

## 📖 How to Use

### Searching for Songs

1. Click on the search bar at the top
2. Type an artist name (e.g., "Taylor Swift", "Arijit Singh")
3. Select from suggestions or press Enter
4. Browse the search results

### Playing Music

1. Find a song you want to hear
2. Click on the song row to play its preview
3. Use the player controls at the bottom:
   - ▶️ Play/Pause
   - ⏮️ Previous track
   - ⏭️ Next track
   - 🔀 Shuffle
   - 🔁 Repeat

### Browsing Playlists

1. Click on any playlist in the left sidebar
2. Or click on the colored category cards at the bottom
3. The tracks for that playlist will load automatically

---

## 📁 Project Structure

```
spotify-clone/
├── public/           # Static files
├── src/
│   ├── App.jsx       # Main app component (the brain)
│   ├── Body.jsx      # Main content area with search
│   ├── Sidebar.jsx   # Left navigation sidebar
│   ├── Playlist.jsx  # Track list display
│   ├── Player.jsx    # Bottom music player bar
│   ├── spotify.js    # API for fetching music data
│   ├── index.css     # Global styles
│   └── main.jsx      # App entry point
├── index.html        # HTML template
├── package.json      # Project dependencies
└── vite.config.js    # Vite configuration
```

---

## 🧩 Understanding the Components

### 1. `App.jsx` - The Brain
- Stores all important app data (selected playlist, tracks, search text)
- Calls the API to fetch songs
- Passes data to other components

### 2. `Sidebar.jsx` - Left Navigation
- Shows playlist categories (Top Hits, Chill, Workout, etc.)
- Highlights the currently selected playlist
- Mobile-friendly collapsible drawer

### 3. `Body.jsx` - Main Content
- Contains the search bar with suggestions
- Displays playlist header with gradient background
- Shows the track list

### 4. `Playlist.jsx` - Track List
- Displays songs in a table format
- Shows track number, name, artist, album, duration
- Handles click-to-play functionality

### 5. `Player.jsx` - Music Player
- Fixed bar at the bottom
- Play/pause, skip, shuffle, repeat controls
- Volume control and progress bar
- Shows currently playing track info

### 6. `spotify.js` - API Helper
- Fetches music data from iTunes Search API
- Keeps network code separate from UI components

---

## 🔄 How Data Flows

```
User types in search → Body.jsx → App.jsx → spotify.js → iTunes API
                                                            ↓
User sees results   ← Body.jsx ← App.jsx ← spotify.js ← API Response
```

---

## ❓ Common Issues & Solutions

### "npm is not recognized"
Node.js isn't installed properly. Reinstall Node.js and check "Add to PATH" during installation.

### "Port 5173 is already in use"
Another app is using that port. Run: `npm run dev -- --port 3000`

### Songs won't play
Not all tracks have previews. Look for songs that show the Play button.

### Changes not showing
Refresh the browser (`Ctrl + R`). If that doesn't work, restart the server.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🛠️ Technologies Used

- **React** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **iTunes Search API** - Music data

---

## 📚 Learning Resources

New to web development? Check out:

- [React Documentation](https://react.dev/learn)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JavaScript Basics (MDN)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)

---

## ⚖️ License

This project is for educational purposes only. Spotify® is a registered trademark of Spotify AB.

---

Happy coding! 🎧

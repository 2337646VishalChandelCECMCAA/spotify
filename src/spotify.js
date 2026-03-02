import axios from 'axios'

// Shared axios instance for public demo API calls.
const demoApi = axios.create({
  baseURL: 'https://itunes.apple.com',
})

// Search tracks by keyword from a public API without authentication.
export const getSearchTracks = (term) =>
  demoApi.get('/search', {
    params: {
      term,
      media: 'music',
      entity: 'song',
      limit: 25,
    },
  })

// Keep demo loader helper for compatibility with earlier implementation.
export const getDemoTracks = () => getSearchTracks('top hits')

export default demoApi

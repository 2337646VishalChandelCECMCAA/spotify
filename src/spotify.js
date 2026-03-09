import axios from 'axios'

// Multiple CORS proxies to try
const PROXIES = [
  {
    name: 'codetabs',
    getUrl: (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    parseResponse: (data) => data,
  },
  {
    name: 'thingproxy', 
    getUrl: (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
    parseResponse: (data) => data,
  },
]

// Search tracks by keyword from iTunes API
export const getSearchTracks = async (term) => {
  const params = new URLSearchParams({
    term,
    media: 'music',
    entity: 'song',
    limit: 25,
  })
  
  const targetUrl = `https://itunes.apple.com/search?${params.toString()}`
  
  for (const proxy of PROXIES) {
    try {
      console.log(`Trying ${proxy.name} proxy...`)
      const response = await axios.get(proxy.getUrl(targetUrl), {
        timeout: 10000,
      })
      
      const data = proxy.parseResponse(response.data)
      if (data && data.results) {
        console.log(`${proxy.name} proxy succeeded!`)
        return { data }
      }
    } catch (error) {
      console.log(`${proxy.name} failed:`, error.message)
      continue
    }
  }
  
  throw new Error('Failed to fetch tracks. Please try again.')
}

// Keep demo loader helper for compatibility
export const getDemoTracks = () => getSearchTracks('top hits')

// NewsAPI utility with CORS handling
import axios from 'axios';

const NEWS_API_KEY = process.env.REACT_APP_NEWSAPI_KEY;

// Using CORS proxy to avoid CORS issues
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export async function fetchNewsArticles(category = 'technology', pageSize = 10) {
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
  
  try {
    const response = await axios.get(proxyUrl);
    const data = JSON.parse(response.data.contents);
    
    if (data.status !== 'ok') {
      throw new Error(data.message || 'News API error');
    }
    
    return data.articles || [];
  } catch (error) {
    console.error('News API error:', error);
    
    // Fallback to mock data if API fails
    return [
      {
        title: "Breaking: Advanced AI Research Breakthrough",
        description: "Scientists achieve major breakthrough in neural network architecture...",
        url: "#",
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        source: { name: "Tech News" }
      },
      {
        title: "Global Markets React to Economic Data",
        description: "Financial markets show strong response to latest economic indicators...",
        url: "#",
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        source: { name: "Financial Times" }
      },
      {
        title: "Space Technology Advances Continue",
        description: "New developments in space exploration technology show promise...",
        url: "#",
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        source: { name: "Space Today" }
      }
    ];
  }
}

// Alternative news source using Guardian API (no key needed)
export async function fetchGuardianNews(section = 'technology') {
  const url = `https://content.guardianapis.com/search?section=${section}&show-fields=headline,bodyText&page-size=10`;
  
  try {
    const response = await axios.get(url);
    if (response.data.response.status !== 'ok') {
      throw new Error('Guardian API error');
    }
    
    return response.data.response.results.map(article => ({
      title: article.fields?.headline || article.webTitle,
      description: article.fields?.bodyText?.substring(0, 200) + '...' || '',
      url: article.webUrl,
      urlToImage: null,
      publishedAt: article.webPublicationDate,
      source: { name: 'The Guardian' }
    }));
  } catch (error) {
    console.error('Guardian API error:', error);
    return [];
  }
}

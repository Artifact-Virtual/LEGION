import React, { useState, useEffect } from 'react';
import { FiGlobe, FiTrendingUp, FiUsers, FiClock, FiExternalLink } from 'react-icons/fi';

const NewsAndEventsWidget = () => {
  const [newsData, setNewsData] = useState([]);
  const [globalEvents, setGlobalEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'politics', label: 'Politics' },
    { value: 'science', label: 'Science' }
  ];

  useEffect(() => {
    // Mock news data since we don't have real API keys
    const mockNewsData = [
      {
        id: 1,
        title: "AI Revolution Transforms Global Industries",
        description: "Artificial intelligence continues to reshape manufacturing, healthcare, and finance sectors worldwide.",
        category: 'technology',
        source: 'Tech News Daily',
        publishedAt: new Date(Date.now() - 1800000).toISOString(),
        url: '#',
        sentiment: 'positive',
        impact: 'high'
      },
      {
        id: 2,
        title: "Global Markets React to Central Bank Decisions",
        description: "Major stock indices see volatility following Federal Reserve and ECB policy announcements.",
        category: 'business',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        url: '#',
        sentiment: 'neutral',
        impact: 'high'
      },
      {
        id: 3,
        title: "Breakthrough in Quantum Computing Achieved",
        description: "Scientists demonstrate new quantum algorithm with potential for cryptography applications.",
        category: 'science',
        source: 'Science Journal',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        url: '#',
        sentiment: 'positive',
        impact: 'medium'
      },
      {
        id: 4,
        title: "Climate Summit Reaches Historic Agreement",
        description: "World leaders commit to ambitious carbon reduction targets for 2030.",
        category: 'politics',
        source: 'Global News Network',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        url: '#',
        sentiment: 'positive',
        impact: 'high'
      },
      {
        id: 5,
        title: "Cybersecurity Threats Increase Globally",
        description: "New report shows 40% increase in ransomware attacks targeting critical infrastructure.",
        category: 'technology',
        source: 'Cyber Security Today',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        url: '#',
        sentiment: 'negative',
        impact: 'high'
      }
    ];

    const mockGlobalEvents = [
      {
        id: 1,
        event: "G20 Economic Summit",
        location: "Tokyo, Japan",
        date: "2025-07-25",
        type: "economic",
        participants: 20,
        significance: "High impact on global trade policies"
      },
      {
        id: 2,
        event: "Climate Action Conference",
        location: "Geneva, Switzerland",
        date: "2025-08-02",
        type: "environmental",
        participants: 195,
        significance: "Major climate commitments expected"
      },
      {
        id: 3,
        event: "Tech Innovation Expo",
        location: "San Francisco, USA",
        date: "2025-08-15",
        type: "technology",
        participants: 50000,
        significance: "AI and quantum computing focus"
      }
    ];

    setNewsData(mockNewsData);
    setGlobalEvents(mockGlobalEvents);
    setLoading(false);
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? newsData 
    : newsData.filter(item => item.category === selectedCategory);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      case 'neutral': return '➡️';
      default: return '❓';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'economic': return '💰';
      case 'environmental': return '🌍';
      case 'technology': return '🚀';
      case 'political': return '🏛️';
      default: return '📅';
    }
  };

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading news and events...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiGlobe className="w-6 h-6 text-cyan-400" />
          Global News & Events
        </h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main News Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-white font-semibold mb-4">Latest Headlines</h4>
          {filteredNews.map((article) => (
            <div key={article.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getSentimentIcon(article.sentiment)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    article.category === 'technology' ? 'bg-blue-900 text-blue-300' :
                    article.category === 'business' ? 'bg-green-900 text-green-300' :
                    article.category === 'politics' ? 'bg-purple-900 text-purple-300' :
                    article.category === 'science' ? 'bg-cyan-900 text-cyan-300' :
                    'bg-gray-800 text-gray-300'
                  }`}>
                    {article.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    article.impact === 'high' ? 'bg-red-900 text-red-300' :
                    article.impact === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-gray-800 text-gray-300'
                  }`}>
                    {article.impact} impact
                  </span>
                </div>
                <FiExternalLink className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
              </div>
              
              <h5 className="text-white font-semibold mb-2 line-clamp-2">{article.title}</h5>
              <p className="text-gray-400 text-sm mb-3 line-clamp-3">{article.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{article.source}</span>
                <div className="flex items-center gap-2">
                  <FiClock className="w-3 h-3" />
                  <span className="text-gray-500">
                    {new Date(article.publishedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-purple-400" />
              Upcoming Global Events
            </h4>
            <div className="space-y-4">
              {globalEvents.map((event) => (
                <div key={event.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                    <div className="flex-1">
                      <h5 className="text-white font-semibold text-sm mb-1">{event.event}</h5>
                      <p className="text-gray-400 text-xs mb-2">{event.location}</p>
                      <p className="text-gray-400 text-xs mb-2">{event.significance}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 text-xs">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="text-purple-400 text-xs">
                          {event.participants.toLocaleString()} participants
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Sentiment Analysis */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">Sentiment Analysis</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm">Positive</span>
                <span className="text-white text-sm">
                  {Math.round((newsData.filter(n => n.sentiment === 'positive').length / newsData.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full" 
                  style={{ width: `${(newsData.filter(n => n.sentiment === 'positive').length / newsData.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 text-sm">Neutral</span>
                <span className="text-white text-sm">
                  {Math.round((newsData.filter(n => n.sentiment === 'neutral').length / newsData.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${(newsData.filter(n => n.sentiment === 'neutral').length / newsData.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-red-400 text-sm">Negative</span>
                <span className="text-white text-sm">
                  {Math.round((newsData.filter(n => n.sentiment === 'negative').length / newsData.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full" 
                  style={{ width: `${(newsData.filter(n => n.sentiment === 'negative').length / newsData.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-orange-400" />
              Trending Topics
            </h4>
            <div className="space-y-2">
              {['Artificial Intelligence', 'Climate Change', 'Cryptocurrency', 'Space Exploration', 'Quantum Computing'].map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <span className="text-white text-sm">#{topic}</span>
                  <span className="text-orange-400 text-xs">
                    {Math.floor(Math.random() * 1000 + 100)}k mentions
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsAndEventsWidget;

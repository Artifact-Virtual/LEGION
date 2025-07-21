import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'YOUR_NEWSAPI_KEY';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?language=en&pageSize=50&apiKey=${NEWS_API_KEY}`;

export default function TrendingTopicsTable() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopics() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(NEWS_API_URL);
        const articles = res.data.articles || [];
        // Extract topics from titles/descriptions
        const wordCounts = {};
        articles.forEach(article => {
          const text = `${article.title} ${article.description || ''}`.toLowerCase();
          text.split(/\W+/).forEach(word => {
            if (word.length > 3) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
          });
        });
        const sorted = Object.entries(wordCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([topic, count]) => ({ topic, count }));
        setTopics(sorted);
      } catch (err) {
        setError('Failed to fetch trending topics');
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 animate-pulse">
      <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      Loading topics...
    </div>
  );
  if (error) return (
    <div className="flex items-center gap-2 text-red-400">
      <svg width="20" height="20" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      {error}
    </div>
  );

  return (
    <table className="min-w-full text-xs text-left">
      <thead className="sticky top-0 bg-black z-10">
        <tr className="border-b border-white">
          <th className="px-2 py-1 font-thin text-white">Topic</th>
          <th className="px-2 py-1 font-thin text-white">Mentions</th>
        </tr>
      </thead>
      <tbody>
        {topics.map(({ topic, count }) => (
          <tr key={topic} className="border-b border-gray-700 hover:bg-gray-900 transition-colors duration-150">
            <td className="px-2 py-1 text-white">{topic}</td>
            <td className="px-2 py-1 text-white">{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

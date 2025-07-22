import React, { useEffect, useState } from 'react';
import { fetchPolygonCandles, fetchPolygonForex } from '../utils/polygon';
import { fetchCoinGeckoCandles } from '../utils/coingecko';

const SYMBOLS = [
  // Major Stocks
  { type: 'stock', symbol: 'AAPL', name: 'Apple Inc.' },
  { type: 'stock', symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { type: 'stock', symbol: 'TSLA', name: 'Tesla Inc.' },
  { type: 'stock', symbol: 'MSFT', name: 'Microsoft Corp.' },
  
  // Forex Pairs (Major)
  { type: 'forex', symbol: 'C:EURUSD', name: 'EUR/USD' },
  { type: 'forex', symbol: 'C:GBPUSD', name: 'GBP/USD' },
  { type: 'forex', symbol: 'C:USDJPY', name: 'USD/JPY' },
  { type: 'forex', symbol: 'C:USDCHF', name: 'USD/CHF' },
  { type: 'forex', symbol: 'C:AUDUSD', name: 'AUD/USD' },
  { type: 'forex', symbol: 'C:USDCAD', name: 'USD/CAD' },
  
  // Commodities
  { type: 'forex', symbol: 'C:XAUUSD', name: 'Gold (XAU/USD)' },
  { type: 'forex', symbol: 'C:XAGUSD', name: 'Silver (XAG/USD)' },
  
  // Crypto
  { type: 'crypto', symbol: 'BTCUSD', name: 'Bitcoin' },
  { type: 'crypto', symbol: 'ETHUSD', name: 'Ethereum' }
];

export default function MarketSummaryTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      
      try {
        const results = await Promise.allSettled(
          SYMBOLS.map(async ({ type, symbol, name }) => {
            let candles = [];
            
            try {
              if (type === 'stock') {
                candles = await fetchPolygonCandles(symbol, '1d');
              } else if (type === 'forex') {
                candles = await fetchPolygonForex(symbol, '1d');
              } else if (type === 'crypto') {
                candles = await fetchCoinGeckoCandles(symbol, '1d');
              }
              
              if (!candles || candles.length === 0) {
                console.warn(`No data for ${symbol}`);
                return null;
              }
              
              const last = candles[candles.length - 1];
              const previous = candles.length > 1 ? candles[candles.length - 2] : last;
              
              const change = ((last.close - previous.close) / previous.close * 100);
              
              return {
                symbol: name || symbol,
                price: last.close.toFixed(type === 'forex' || symbol.includes('XAU') ? 5 : 2),
                change: change.toFixed(2),
                volume: last.volume ? last.volume.toLocaleString() : 'N/A',
                type: type
              };
              
            } catch (symbolError) {
              console.error(`Error fetching ${symbol}:`, symbolError);
              return null;
            }
          })
        );
        
        const validResults = results
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => result.value);
          
        if (validResults.length === 0) {
          throw new Error('No market data could be fetched');
        }
        
        setRows(validResults);
        
      } catch (fetchError) {
        console.error('Market data fetch error:', fetchError);
        setError('Failed to fetch market data');
        
        // Provide fallback mock data
        setRows([
          { symbol: 'Apple Inc.', price: '174.50', change: '+1.25', volume: '52,387,456', type: 'stock' },
          { symbol: 'NVIDIA Corp.', price: '891.23', change: '+2.87', volume: '28,456,789', type: 'stock' },
          { symbol: 'Tesla Inc.', price: '248.91', change: '-0.95', volume: '45,123,567', type: 'stock' },
          { symbol: 'EUR/USD', price: '1.08945', change: '+0.12', volume: 'N/A', type: 'forex' },
          { symbol: 'Gold (XAU/USD)', price: '1978.45', change: '+0.85', volume: 'N/A', type: 'forex' },
          { symbol: 'Bitcoin', price: '43250.00', change: '+3.45', volume: 'N/A', type: 'crypto' }
        ]);
        
      } finally {
        setLoading(false);
      }
    }
    
    fetchAll();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change) => {
    const changeNum = parseFloat(change);
    if (changeNum > 0) return 'text-green-400';
    if (changeNum < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'stock': return '📊';
      case 'forex': return '💱';
      case 'crypto': return '₿';
      default: return '📈';
    }
  };

  return (
    <div className="bg-black border border-white rounded-lg p-6 shadow-lg overflow-x-auto">
      <div className="text-white text-lg font-thin mb-2 flex items-center gap-2">
        <span>📈</span>
        Global Markets Summary
        {error && <span className="text-red-400 text-sm">(Using Fallback Data)</span>}
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 animate-pulse">
          <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
          </svg>
          Loading market data...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-gray-400">Symbol</th>
                <th className="py-2 text-gray-400">Price</th>
                <th className="py-2 text-gray-400">Change %</th>
                <th className="py-2 text-gray-400">Volume</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900/50">
                  <td className="py-2 text-white flex items-center gap-2">
                    <span>{getTypeIcon(row.type)}</span>
                    {row.symbol}
                  </td>
                  <td className="py-2 text-white font-mono">
                    ${row.price}
                  </td>
                  <td className={`py-2 font-mono ${getChangeColor(row.change)}`}>
                    {row.change}%
                  </td>
                  <td className="py-2 text-gray-300 font-mono">
                    {row.volume}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {rows.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No market data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

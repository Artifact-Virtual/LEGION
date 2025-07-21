import React, { useEffect, useState } from 'react';
import { fetchMarketstackCandles } from '../utils/marketstack';
import { fetchCoinGeckoCandles } from '../utils/coingecko';

const SYMBOLS = [
  { type: 'stock', symbol: 'AAPL' },
  { type: 'crypto', symbol: 'BTCUSD' },
  { type: 'crypto', symbol: 'ETHUSD' }
];

export default function MarketSummaryTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const results = await Promise.all(SYMBOLS.map(async ({ type, symbol }) => {
        let candles = [];
        if (type === 'stock') {
          candles = await fetchMarketstackCandles(symbol, '1d');
        } else if (type === 'crypto') {
          candles = await fetchCoinGeckoCandles(symbol, '1d');
        }
        if (!candles.length) return null;
        const last = candles[candles.length-1];
        const first = candles[0];
        return {
          symbol,
          price: last.close,
          change: ((last.close - first.open) / first.open * 100).toFixed(2),
          volume: last.volume || 'N/A',
        };
      }));
      setRows(results.filter(Boolean));
      setLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <div className="bg-black border border-white rounded-lg p-6 shadow-lg overflow-x-auto">
      <div className="text-white text-lg font-thin mb-2">Market Summary Table</div>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 animate-pulse">
          <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
          Loading market data...
        </div>
      ) : (
        <table className="min-w-full text-xs text-left">
          <thead className="sticky top-0 bg-black z-10">
            <tr className="border-b border-white">
              <th className="px-2 py-1 font-thin text-white">Symbol</th>
              <th className="px-2 py-1 font-thin text-white">Price</th>
              <th className="px-2 py-1 font-thin text-white">Change (%)</th>
              <th className="px-2 py-1 font-thin text-white">Volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.symbol} className="border-b border-gray-700 hover:bg-gray-900 transition-colors duration-150">
                <td className="px-2 py-1 text-white">{row.symbol}</td>
                <td className="px-2 py-1 text-white">${row.price.toLocaleString()}</td>
                <td className={`px-2 py-1 ${parseFloat(row.change) > 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}`}>{row.change}</td>
                <td className="px-2 py-1 text-white">{row.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

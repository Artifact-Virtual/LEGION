import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiBarChart2 } from 'react-icons/fi';

const CryptoMarketWidget = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d');
        const data = await response.json();
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading crypto data...</div>
      </div>
    );
  }

  const selectedCoin = cryptoData.find(coin => coin.id === selectedCrypto) || cryptoData[0];

  const chartData = {
    labels: Array.from({ length: 168 }, (_, i) => i), // 7 days * 24 hours
    datasets: [
      {
        label: selectedCoin?.name || 'Price',
        data: selectedCoin?.sparkline_in_7d?.price || [],
        borderColor: selectedCoin?.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444',
        backgroundColor: selectedCoin?.price_change_percentage_24h >= 0 ? '#10b98120' : '#ef444420',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiDollarSign className="w-6 h-6 text-yellow-400" />
          Cryptocurrency Market
        </h3>
        <select
          value={selectedCrypto}
          onChange={(e) => setSelectedCrypto(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          {cryptoData.map(coin => (
            <option key={coin.id} value={coin.id}>{coin.name}</option>
          ))}
        </select>
      </div>

      {selectedCoin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={selectedCoin.image} alt={selectedCoin.name} className="w-8 h-8" />
              <div>
                <h4 className="text-white font-semibold">{selectedCoin.name}</h4>
                <p className="text-gray-400 text-sm">{selectedCoin.symbol.toUpperCase()}</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              ${selectedCoin.current_price.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              selectedCoin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedCoin.price_change_percentage_24h >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              {Math.abs(selectedCoin.price_change_percentage_24h).toFixed(2)}% (24h)
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">7-Day Price Chart</h4>
            <div className="h-48">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { display: false },
                    y: {
                      ticks: { color: '#9ca3af' },
                      grid: { color: '#1f2937' }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Top Cryptos Grid */}
      <div className="mt-6">
        <h4 className="text-white font-semibold mb-4">Top Cryptocurrencies</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {cryptoData.slice(0, 5).map(coin => (
            <div
              key={coin.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => setSelectedCrypto(coin.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                <span className="text-white text-sm font-medium">{coin.symbol.toUpperCase()}</span>
              </div>
              <div className="text-white font-semibold">
                ${coin.current_price < 1 ? coin.current_price.toFixed(6) : coin.current_price.toLocaleString()}
              </div>
              <div className={`text-xs ${
                coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoMarketWidget;

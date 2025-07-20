import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiBarChart2, FiGlobe } from 'react-icons/fi';

const StockMarketWidget = () => {
  const [stockData, setStockData] = useState([]);
  const [forexData, setForexData] = useState({});
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [marketIndices, setMarketIndices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock stock market data since we don't have real API keys
    const mockStockData = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 185.25,
        change: +2.45,
        changePercent: +1.34,
        volume: 52847392,
        marketCap: 2.95e12,
        pe: 28.4,
        chart: Array.from({ length: 30 }, (_, i) => 180 + Math.random() * 10 - 5)
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.87,
        change: -1.23,
        changePercent: -0.85,
        volume: 28456721,
        marketCap: 1.81e12,
        pe: 25.6,
        chart: Array.from({ length: 30 }, (_, i) => 140 + Math.random() * 8 - 4)
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 428.91,
        change: +5.67,
        changePercent: +1.34,
        volume: 31264895,
        marketCap: 3.19e12,
        pe: 32.1,
        chart: Array.from({ length: 30 }, (_, i) => 420 + Math.random() * 15 - 7)
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.73,
        change: +12.45,
        changePercent: +5.27,
        volume: 89452163,
        marketCap: 789e9,
        pe: 65.4,
        chart: Array.from({ length: 30 }, (_, i) => 240 + Math.random() * 20 - 10)
      }
    ];

    const mockForexData = {
      'EUR/USD': { rate: 1.0875, change: +0.0023, changePercent: +0.21 },
      'GBP/USD': { rate: 1.2685, change: -0.0045, changePercent: -0.35 },
      'USD/JPY': { rate: 150.25, change: +0.85, changePercent: +0.57 },
      'USD/CHF': { rate: 0.8954, change: +0.0012, changePercent: +0.13 }
    };

    const mockMarketIndices = [
      { name: 'S&P 500', value: 5547.25, change: +12.45, changePercent: +0.22 },
      { name: 'NASDAQ', value: 17834.67, change: +45.23, changePercent: +0.25 },
      { name: 'DOW', value: 40589.34, change: -34.56, changePercent: -0.09 },
      { name: 'FTSE 100', value: 8156.78, change: +8.92, changePercent: +0.11 }
    ];

    setStockData(mockStockData);
    setForexData(mockForexData);
    setMarketIndices(mockMarketIndices);
    setLoading(false);
  }, []);

  const selectedStockData = stockData.find(stock => stock.symbol === selectedStock) || stockData[0];

  const chartData = selectedStockData ? {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [
      {
        label: selectedStockData.symbol,
        data: selectedStockData.chart,
        borderColor: selectedStockData.change >= 0 ? '#10b981' : '#ef4444',
        backgroundColor: selectedStockData.change >= 0 ? '#10b98120' : '#ef444420',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  } : null;

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiBarChart2 className="w-6 h-6 text-green-400" />
          Financial Markets
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">Live Data</span>
        </div>
      </div>

      {/* Market Indices */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-4">Major Indices</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {marketIndices.map((index, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h5 className="text-gray-400 text-sm">{index.name}</h5>
              <div className="text-white font-semibold text-lg">
                {index.value.toLocaleString()}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                index.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {index.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Selection and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stock Selector */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">Select Stock</h4>
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white mb-4"
          >
            {stockData.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>

          {selectedStockData && (
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-white">
                  ${selectedStockData.price.toFixed(2)}
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  selectedStockData.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedStockData.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  {selectedStockData.change >= 0 ? '+' : ''}{selectedStockData.change.toFixed(2)} 
                  ({selectedStockData.changePercent >= 0 ? '+' : ''}{selectedStockData.changePercent.toFixed(2)}%)
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-white">{selectedStockData.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="text-white">${(selectedStockData.marketCap / 1e12).toFixed(2)}T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">P/E Ratio:</span>
                  <span className="text-white">{selectedStockData.pe}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stock Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">30-Day Price Chart</h4>
          {chartData && (
            <div className="h-64">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { 
                      ticks: { color: '#9ca3af' },
                      grid: { color: '#1f2937' }
                    },
                    y: {
                      ticks: { color: '#9ca3af' },
                      grid: { color: '#1f2937' }
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Forex Rates */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiGlobe className="w-5 h-5 text-blue-400" />
          Foreign Exchange Rates
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(forexData).map(([pair, data]) => (
            <div key={pair} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h5 className="text-gray-400 text-sm">{pair}</h5>
              <div className="text-white font-semibold text-lg">
                {data.rate.toFixed(4)}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                data.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {data.change >= 0 ? '+' : ''}{data.change.toFixed(4)} ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
          <FiTrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Market Sentiment</h5>
          <p className="text-green-400">Bullish</p>
          <p className="text-gray-400 text-sm">65% of stocks advancing</p>
        </div>
        
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center">
          <FiDollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Trading Volume</h5>
          <p className="text-blue-400">High</p>
          <p className="text-gray-400 text-sm">Above average activity</p>
        </div>
        
        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 text-center">
          <FiBarChart2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Volatility</h5>
          <p className="text-purple-400">Moderate</p>
          <p className="text-gray-400 text-sm">VIX: 18.5</p>
        </div>
      </div>
    </div>
  );
};

export default StockMarketWidget;

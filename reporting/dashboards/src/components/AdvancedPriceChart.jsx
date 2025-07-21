import React, { useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { fetchMarketstackCandles } from '../utils/marketstack';
import { fetchGoldCandles } from '../utils/gold';
import { fetchCoinGeckoCandles } from '../utils/coingecko';
import { fetchFrankfurterCandles } from '../utils/frankfurter';

const TIMEFRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' },
];

const SYMBOL_TYPES = [
  { label: 'Stocks', value: 'stock' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Forex', value: 'forex' },
];

export default function AdvancedPriceChart() {
  const [symbolType, setSymbolType] = useState('forex');
  const [symbol, setSymbol] = useState('XAUUSD');
  const [timeframe, setTimeframe] = useState('1d');
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartRef = React.useRef();

  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchCandles() {
      try {
        if (symbolType === 'stock') {
          const candles = await fetchMarketstackCandles(symbol, timeframe);
          setCandles(candles);
        } else if (symbolType === 'forex' && symbol.toUpperCase() === 'XAUUSD') {
          const candles = await fetchGoldCandles(timeframe);
          setCandles(candles);
        } else if (symbolType === 'forex') {
          const candles = await fetchFrankfurterCandles(symbol, timeframe);
          setCandles(candles);
        } else if (symbolType === 'crypto') {
          const candles = await fetchCoinGeckoCandles(symbol, timeframe);
          setCandles(candles);
        } else {
          setCandles([]);
        }
      } catch (err) {
        setError('Failed to fetch candlestick data');
        setCandles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCandles();
  }, [symbol, symbolType, timeframe]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.innerHTML = '';
    if (!candles.length) return;
    const chart = createChart(chartRef.current, {
      width: chartRef.current.offsetWidth,
      height: 320,
      layout: { background: { color: '#111' }, textColor: '#eee' },
      grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
      timeScale: { borderColor: '#333' },
    });
    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(candles);
    // EMA overlays
    const ema = (data, period) => {
      const k = 2 / (period + 1);
      let emaArr = [data[0].close];
      for (let i = 1; i < data.length; i++) {
        emaArr.push(data[i].close * k + emaArr[i-1] * (1 - k));
      }
      return emaArr;
    };
    if (candles.length > 20) {
      const ema20 = ema(candles, 20).map((v, i) => ({ time: candles[i].time, value: v }));
      const ema50 = ema(candles, 50).map((v, i) => ({ time: candles[i].time, value: v }));
      const ema20Series = chart.addLineSeries({ color: '#60a5fa', lineWidth: 2 });
      ema20Series.setData(ema20.slice(19));
      const ema50Series = chart.addLineSeries({ color: '#fbbf24', lineWidth: 2 });
      ema50Series.setData(ema50.slice(49));
    }
    // Bollinger Bands (20 period, 2 stddev)
    if (candles.length > 20) {
      const bb = [];
      for (let i = 19; i < candles.length; i++) {
        const slice = candles.slice(i-19, i+1);
        const closes = slice.map(c => c.close);
        const avg = closes.reduce((a,b) => a+b,0)/20;
        const std = Math.sqrt(closes.map(x => Math.pow(x-avg,2)).reduce((a,b) => a+b,0)/20);
        bb.push({
          time: candles[i].time,
          upper: avg + 2*std,
          lower: avg - 2*std
        });
      }
      const upperSeries = chart.addLineSeries({ color: '#a3e635', lineWidth: 1, lineStyle: 1 });
      upperSeries.setData(bb.map(b => ({ time: b.time, value: b.upper })));
      const lowerSeries = chart.addLineSeries({ color: '#f87171', lineWidth: 1, lineStyle: 1 });
      lowerSeries.setData(bb.map(b => ({ time: b.time, value: b.lower })));
    }
    // RSI overlay (14 period)
    if (candles.length > 14) {
      const rsi = [];
      for (let i = 14; i < candles.length; i++) {
        let gains = 0, losses = 0;
        for (let j = i - 13; j <= i; j++) {
          const change = candles[j].close - candles[j-1].close;
          if (change > 0) gains += change;
          else losses -= change;
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push({ time: candles[i].time, value: 100 - (100 / (1 + rs)) });
      }
      const rsiSeries = chart.addLineSeries({ color: '#4ade80', lineWidth: 2 });
      rsiSeries.setData(rsi);
    }
    // MACD overlay (12/26 EMA)
    if (candles.length > 26) {
      const ema12 = ema(candles, 12);
      const ema26 = ema(candles, 26);
      const macd = ema12.map((v, i) => ({ time: candles[i].time, value: v - ema26[i] }));
      const macdSeries = chart.addLineSeries({ color: '#f472b6', lineWidth: 2 });
      macdSeries.setData(macd.slice(26));
    }
    return () => chart.remove();
  }, [candles]);

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <select value={symbolType} onChange={e => setSymbolType(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm">
          {SYMBOL_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <input value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm w-32" placeholder="Symbol (e.g. XAUUSD, BTCUSD, EURUSD)" />
        <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm">
          {TIMEFRAMES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {/* Fundamental info */}
      {candles.length > 0 && (
        <div className="flex gap-6 mb-2 text-xs text-gray-300">
          <div>Current: <span className="text-white font-bold">{candles[candles.length-1].close.toFixed(2)}</span></div>
          <div>Change: <span className={candles[candles.length-1].close - candles[0].open > 0 ? 'text-green-400' : 'text-red-400'}>{(candles[candles.length-1].close - candles[0].open).toFixed(2)}</span></div>
          <div>Volume: <span className="text-white">N/A</span></div>
        </div>
      )}
      <div ref={chartRef} style={{ width: '100%', height: 320 }} />
      {(!candles.length && !loading && !error) && (
        <div className="text-gray-500 mt-4">No data available for selected symbol/timeframe.</div>
      )}
      {loading && <div className="text-gray-400 mt-4">Loading chart...</div>}
      {error && <div className="text-red-400 mt-4">{error}</div>}
    </div>
  );
}

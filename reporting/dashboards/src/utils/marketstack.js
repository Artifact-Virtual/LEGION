// Utility to fetch candlestick data from Marketstack API
// You must set your Marketstack API key here
const API_KEY = 'YOUR_MARKETSTACK_API_KEY';

export async function fetchMarketstackCandles(symbol, timeframe = '1d') {
  // Marketstack supports end-of-day and intraday endpoints
  let endpoint = '';
  if (timeframe === '1d' || timeframe === '1w') {
    endpoint = `https://api.marketstack.com/v1/eod?access_key=${API_KEY}&symbols=${symbol}&limit=60`;
  } else {
    // For intraday, Marketstack supports 1m, 5m, 15m, 30m, 1h
    endpoint = `https://api.marketstack.com/v1/intraday?access_key=${API_KEY}&symbols=${symbol}&interval=${timeframe}&limit=60`;
  }
  const res = await fetch(endpoint);
  const data = await res.json();
  if (!data.data) throw new Error('No data from Marketstack');
  // Convert to lightweight-charts format
  return data.data.map(bar => ({
    time: new Date(bar.date).getTime() / 1000,
    open: bar.open,
    high: bar.high,
    low: bar.low,
    close: bar.close,
    volume: bar.volume,
  })).reverse();
}

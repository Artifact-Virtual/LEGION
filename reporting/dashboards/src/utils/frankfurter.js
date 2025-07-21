// Utility to fetch forex candlestick data from Frankfurter API
// Docs: https://www.frankfurter.app/docs/
import axios from 'axios';

const BASE_URL = 'https://api.frankfurter.app';

// Supported timeframes: '1d', '1w', '1m'
// Symbol format: 'EURUSD', 'GBPUSD', etc.
export async function fetchFrankfurterCandles(symbol = 'EURUSD', timeframe = '1d') {
  // Parse base and quote
  const base = symbol.slice(0, 3).toUpperCase();
  const quote = symbol.slice(3, 6).toUpperCase();
  // Frankfurter only supports daily historical rates
  const endDate = new Date();
  const startDate = new Date();
  if (timeframe === '1w') startDate.setDate(endDate.getDate() - 7);
  else if (timeframe === '1m') startDate.setDate(endDate.getDate() - 30);
  else startDate.setDate(endDate.getDate() - 1);
  const url = `${BASE_URL}/${startDate.toISOString().slice(0,10)}..${endDate.toISOString().slice(0,10)}?from=${base}&to=${quote}`;
  try {
    const res = await axios.get(url);
    if (!res.data || !res.data.rates) return [];
    // Format rates to lightweight-charts candle format
    const rates = res.data.rates;
    const candles = Object.entries(rates).map(([date, value]) => ({
      time: date,
      open: value[quote],
      high: value[quote],
      low: value[quote],
      close: value[quote]
    }));
    return candles;
  } catch (err) {
    return [];
  }
}

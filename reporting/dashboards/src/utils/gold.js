// Utility to fetch gold (XAU/USD) candlestick data from a reliable API
// Uses Metals-API (https://metals-api.com/) as example
// You must provide your own API key in production

import axios from 'axios';

const METALS_API_KEY = process.env.REACT_APP_METALS_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://metals-api.com/api';

// Supported timeframes: '1d', '1w', '1m' (daily, weekly, monthly)
export async function fetchGoldCandles(timeframe = '1d') {
  // Metals-API only supports daily historical data
  // For demo, we fetch last 30 days and format as candles
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  const url = `${BASE_URL}/timeseries?access_key=${METALS_API_KEY}&base=XAU&symbols=USD&start_date=${startDate.toISOString().slice(0,10)}&end_date=${endDate.toISOString().slice(0,10)}`;
  try {
    const res = await axios.get(url);
    if (!res.data || !res.data.rates) return [];
    // Format rates to lightweight-charts candle format
    const rates = res.data.rates;
    const candles = Object.entries(rates).map(([date, value]) => ({
      time: date,
      open: value.USD, // Metals-API only provides close price, so use same for open/high/low/close
      high: value.USD,
      low: value.USD,
      close: value.USD
    }));
    return candles;
  } catch (err) {
    return [];
  }
}

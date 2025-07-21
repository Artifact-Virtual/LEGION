// Utility to fetch crypto candlestick data from CoinGecko
// Docs: https://www.coingecko.com/en/api/documentation
import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Supported timeframes: '1d', '1w', '1m', '1y'
// Symbol format: 'BTCUSD', 'ETHUSD', etc.
export async function fetchCoinGeckoCandles(symbol = 'BTCUSD', timeframe = '1d') {
  // Map symbol to CoinGecko id
  const symbolMap = {
    BTCUSD: 'bitcoin',
    ETHUSD: 'ethereum',
    LTCUSD: 'litecoin',
    DOGEUSD: 'dogecoin',
    SOLUSD: 'solana',
    XRPUSD: 'ripple',
    ADAUSD: 'cardano',
    BNBUSD: 'binancecoin',
    AVAXUSD: 'avalanche-2',
    MATICUSD: 'matic-network',
    // Add more as needed
  };
  const coinId = symbolMap[symbol.toUpperCase()] || 'bitcoin';

  // Map timeframe to days
  const daysMap = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '1y': 365
  };
  const days = daysMap[timeframe] || 1;

  const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  try {
    const res = await axios.get(url);
    if (!res.data || !res.data.prices) return [];
    // CoinGecko only provides price, not OHLC, so use price for all
    const candles = res.data.prices.map(([timestamp, price]) => {
      const date = new Date(timestamp);
      const isoDate = date.toISOString().slice(0, 10);
      return {
        time: isoDate,
        open: price,
        high: price,
        low: price,
        close: price
      };
    });
    return candles;
  } catch (err) {
    return [];
  }
}

// Utility to fetch candlestick data from Marketstack API via backend proxy
export async function fetchMarketstackCandles(symbol = 'AAPL', timeframe = '1d') {
  try {
    const response = await fetch(`/api/marketstack-candles?symbol=${symbol}&timeframe=${timeframe}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Marketstack data');
    }
    
    return data.candles || [];
  } catch (error) {
    console.error('Marketstack fetch error:', error);
    throw error;
  }
}

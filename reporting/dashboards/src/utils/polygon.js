// Utility to fetch candlestick data from Polygon.io API
import axios from 'axios';

const POLYGON_API_KEY = process.env.REACT_APP_POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

// Fetch stock candlestick data
export async function fetchPolygonCandles(symbol = 'AAPL', timeframe = '1d', limit = 100) {
  const multiplier = timeframe === '1d' ? 1 : 1;
  const timespan = timeframe === '1d' ? 'day' : 'day';
  
  // Calculate date range (last 30 days)
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  
  const fromStr = from.toISOString().split('T')[0];
  const toStr = to.toISOString().split('T')[0];
  
  const url = `${BASE_URL}/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${fromStr}/${toStr}?apikey=${POLYGON_API_KEY}`;
  
  try {
    const res = await axios.get(url);
    if (!res.data || !res.data.results) {
      console.warn('No Polygon data for', symbol);
      return [];
    }
    
    const candles = res.data.results.map(bar => ({
      time: new Date(bar.t).toISOString().split('T')[0],
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v
    }));
    
    return candles.sort((a, b) => new Date(a.time) - new Date(b.time));
  } catch (error) {
    console.error('Polygon API error for', symbol, ':', error);
    return [];
  }
}

// Fetch forex data from Polygon
export async function fetchPolygonForex(pair = 'C:EURUSD', timeframe = '1d', limit = 100) {
  const multiplier = 1;
  const timespan = 'day';
  
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  
  const fromStr = from.toISOString().split('T')[0];
  const toStr = to.toISOString().split('T')[0];
  
  const url = `${BASE_URL}/v2/aggs/ticker/${pair}/range/${multiplier}/${timespan}/${fromStr}/${toStr}?apikey=${POLYGON_API_KEY}`;
  
  try {
    const res = await axios.get(url);
    if (!res.data || !res.data.results) {
      console.warn('No Polygon forex data for', pair);
      return [];
    }
    
    const candles = res.data.results.map(bar => ({
      time: new Date(bar.t).toISOString().split('T')[0],
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v || 0
    }));
    
    return candles.sort((a, b) => new Date(a.time) - new Date(b.time));
  } catch (error) {
    console.error('Polygon Forex API error for', pair, ':', error);
    return [];
  }
}

// Get latest quote for a symbol
export async function fetchPolygonQuote(symbol = 'AAPL') {
  const url = `${BASE_URL}/v2/last/trade/${symbol}?apikey=${POLYGON_API_KEY}`;
  
  try {
    const res = await axios.get(url);
    if (!res.data || !res.data.results) return null;
    
    const result = res.data.results;
    return {
      symbol: symbol,
      price: result.p,
      timestamp: result.t,
      volume: result.s
    };
  } catch (error) {
    console.error('Polygon quote error for', symbol, ':', error);
    return null;
  }
}

// Stock Market API Service
// Supports multiple API providers: Alpha Vantage, Finnhub, Twelve Data

const API_PROVIDERS = {
  ALPHA_VANTAGE: 'alpha_vantage',
  FINNHUB: 'finnhub',
  TWELVE_DATA: 'twelve_data',
  POLYGON: 'polygon'
};

// Configure your API provider
const ACTIVE_PROVIDER = API_PROVIDERS.ALPHA_VANTAGE;

// API Keys - Add these to your .env file
const API_KEYS = {
  ALPHA_VANTAGE: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
  FINNHUB: import.meta.env.VITE_FINNHUB_API_KEY,
  TWELVE_DATA: import.meta.env.VITE_TWELVE_DATA_API_KEY,
  POLYGON: import.meta.env.VITE_POLYGON_API_KEY
};

// Cache for search results (reduces API calls)
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Search for stocks using Alpha Vantage
 */
async function searchAlphaVantage(query) {
  const apiKey = API_KEYS.ALPHA_VANTAGE;
  if (!apiKey) {
    throw new Error('Alpha Vantage API key not configured');
  }

  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Note) {
    throw new Error('API rate limit reached. Please try again in a minute.');
  }

  if (!data.bestMatches) {
    return [];
  }

  return data.bestMatches.map(match => ({
    symbol: match['1. symbol'],
    name: match['2. name'],
    type: match['3. type'],
    region: match['4. region'],
    currency: match['8. currency'],
    matchScore: parseFloat(match['9. matchScore'])
  }));
}

/**
 * Search for stocks using Finnhub
 */
async function searchFinnhub(query) {
  const apiKey = API_KEYS.FINNHUB;
  if (!apiKey) {
    throw new Error('Finnhub API key not configured');
  }

  const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.result) {
    return [];
  }

  return data.result.map(item => ({
    symbol: item.symbol,
    name: item.description,
    type: item.type,
    region: 'US',
    currency: 'USD',
    matchScore: 1.0
  }));
}

/**
 * Search for stocks using Twelve Data
 */
async function searchTwelveData(query) {
  const apiKey = API_KEYS.TWELVE_DATA;
  if (!apiKey) {
    throw new Error('Twelve Data API key not configured');
  }

  const url = `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(query)}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.data) {
    return [];
  }

  return data.data.map(item => ({
    symbol: item.symbol,
    name: item.instrument_name,
    type: item.instrument_type,
    region: item.country,
    currency: item.currency,
    exchange: item.exchange,
    matchScore: 1.0
  }));
}

/**
 * Get real-time quote for a stock
 */
async function getQuote(symbol) {
  const cacheKey = `quote_${symbol}`;
  const cached = searchCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  let quote;

  switch (ACTIVE_PROVIDER) {
    case API_PROVIDERS.ALPHA_VANTAGE:
      quote = await getQuoteAlphaVantage(symbol);
      break;
    case API_PROVIDERS.FINNHUB:
      quote = await getQuoteFinnhub(symbol);
      break;
    case API_PROVIDERS.TWELVE_DATA:
      quote = await getQuoteTwelveData(symbol);
      break;
    default:
      throw new Error('Invalid API provider');
  }

  // Cache the result
  searchCache.set(cacheKey, {
    data: quote,
    timestamp: Date.now()
  });

  return quote;
}

/**
 * Get quote from Alpha Vantage
 */
async function getQuoteAlphaVantage(symbol) {
  const apiKey = API_KEYS.ALPHA_VANTAGE;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data['Global Quote']) {
    throw new Error('Stock not found');
  }

  const quote = data['Global Quote'];
  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    volume: parseInt(quote['06. volume']),
    previousClose: parseFloat(quote['08. previous close']),
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low'])
  };
}

/**
 * Get quote from Finnhub
 */
async function getQuoteFinnhub(symbol) {
  const apiKey = API_KEYS.FINNHUB;
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    symbol: symbol,
    price: data.c,
    change: data.d,
    changePercent: data.dp,
    previousClose: data.pc,
    open: data.o,
    high: data.h,
    low: data.l
  };
}

/**
 * Get quote from Twelve Data
 */
async function getQuoteTwelveData(symbol) {
  const apiKey = API_KEYS.TWELVE_DATA;
  const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    symbol: data.symbol,
    price: parseFloat(data.close),
    change: parseFloat(data.change),
    changePercent: parseFloat(data.percent_change),
    volume: parseInt(data.volume),
    previousClose: parseFloat(data.previous_close),
    open: parseFloat(data.open),
    high: parseFloat(data.high),
    low: parseFloat(data.low)
  };
}

/**
 * Search for stocks (with caching)
 */
export async function searchStocks(query) {
  if (!query || query.trim().length < 1) {
    return [];
  }

  const cacheKey = `search_${query.toLowerCase()}`;
  const cached = searchCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  let results;

  try {
    switch (ACTIVE_PROVIDER) {
      case API_PROVIDERS.ALPHA_VANTAGE:
        results = await searchAlphaVantage(query);
        break;
      case API_PROVIDERS.FINNHUB:
        results = await searchFinnhub(query);
        break;
      case API_PROVIDERS.TWELVE_DATA:
        results = await searchTwelveData(query);
        break;
      default:
        throw new Error('Invalid API provider');
    }

    // Cache the results
    searchCache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });

    return results;
  } catch (error) {
    console.error('Stock search error:', error);
    throw error;
  }
}

/**
 * Get stock quote with detailed information
 */
export async function getStockQuote(symbol) {
  try {
    return await getQuote(symbol);
  } catch (error) {
    console.error('Get quote error:', error);
    throw error;
  }
}

/**
 * Get company profile/info
 */
export async function getCompanyProfile(symbol) {
  const apiKey = API_KEYS.FINNHUB;
  if (!apiKey) {
    return null;
  }

  try {
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get company profile error:', error);
    return null;
  }
}

/**
 * Clear cache (useful for forcing fresh data)
 */
export function clearCache() {
  searchCache.clear();
}

export default {
  searchStocks,
  getStockQuote,
  getCompanyProfile,
  clearCache
};

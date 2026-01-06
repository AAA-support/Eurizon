# 📈 Stock Market API Setup Guide

Your platform now supports searching **any publicly traded stock** from global markets!

## 🔑 Get Your Free API Key

### Recommended: Alpha Vantage (Easiest to set up)

1. **Visit**: https://www.alphavantage.co/support/#api-key
2. **Fill the form** with your email
3. **Get instant API key** (no credit card required)
4. **Free tier**: 25 requests/day, 5 requests/minute

### Alternative Options:

#### Finnhub (Good for real-time data)
- **Visit**: https://finnhub.io/register
- **Free tier**: 60 calls/minute
- **Coverage**: US stocks, crypto, forex

#### Twelve Data (Best coverage)
- **Visit**: https://twelvedata.com/pricing
- **Free tier**: 800 requests/day
- **Coverage**: 10,000+ stocks, forex, crypto, ETFs

#### Polygon.io (Professional grade)
- **Visit**: https://polygon.io/pricing
- **Free tier**: 5 calls/minute
- **Coverage**: US markets, options, forex

---

## ⚙️ Configuration

### 1. Add API Key to .env

Create or update your `.env` file:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` and add your API key:

```bash
# Alpha Vantage (Recommended)
VITE_ALPHA_VANTAGE_API_KEY=YOUR_API_KEY_HERE

# OR use Finnhub
VITE_FINNHUB_API_KEY=YOUR_API_KEY_HERE

# OR use Twelve Data
VITE_TWELVE_DATA_API_KEY=YOUR_API_KEY_HERE
```

### 2. Choose Your Provider

Edit `/src/services/stockAPIService.js`:

```javascript
// Change this line to your preferred provider
const ACTIVE_PROVIDER = API_PROVIDERS.ALPHA_VANTAGE;

// Options:
// API_PROVIDERS.ALPHA_VANTAGE  (recommended for beginners)
// API_PROVIDERS.FINNHUB        (best for real-time)
// API_PROVIDERS.TWELVE_DATA    (best coverage)
// API_PROVIDERS.POLYGON        (professional)
```

### 3. Restart Development Server

```bash
npm run dev
```

---

## ✅ Features Now Available

### 🔍 **Global Stock Search**
- Search **any publicly traded stock** worldwide
- Real-time price updates
- Company information
- Stock quotes with live data

### 📊 **Supported Assets**
- **Stocks**: NYSE, NASDAQ, LSE, TSE, etc.
- **ETFs**: SPY, QQQ, VTI, etc.
- **Crypto**: BTC, ETH, and more
- **Forex**: EUR/USD, GBP/USD, etc.
- **Commodities**: Gold, Oil, Silver

### 🌐 **Global Markets**
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇯🇵 Japan
- 🇩🇪 Germany
- 🇨🇦 Canada
- 🇦🇺 Australia
- And many more...

---

## 🎯 How It Works

1. **User types** in search bar
2. **API searches** global markets (500ms debounce)
3. **Results appear** with real-time prices
4. **Caches data** for 5 minutes (reduces API calls)
5. **Fallback** to local 100-stock database if API fails

---

## 💡 Tips for Free Tier

### Alpha Vantage (25 requests/day)
- Caching reduces API calls
- Search is debounced (waits for you to stop typing)
- Perfect for demo and testing

### Upgrade Recommendations
- **Light usage** (< 100 searches/day): Stay on free tier
- **Medium usage** (100-1000/day): Finnhub Premium ($9/mo)
- **Heavy usage** (1000+/day): Twelve Data Pro ($29/mo)

---

## 🔧 Advanced Configuration

### Enable Multiple Providers (Failover)

Edit `stockAPIService.js` to add automatic failover:

```javascript
async function searchStocks(query) {
  try {
    return await searchAlphaVantage(query);
  } catch (error) {
    console.log('Alpha Vantage failed, trying Finnhub...');
    try {
      return await searchFinnhub(query);
    } catch (error2) {
      console.log('All APIs failed, using local database');
      return searchLocalDatabase(query);
    }
  }
}
```

### Adjust Cache Duration

```javascript
const CACHE_DURATION = 10 * 60 * 1000; // Change to 10 minutes
```

---

## 🚨 Troubleshooting

### "API key not configured" error
- Check your `.env` file has the correct key
- Restart your dev server (`npm run dev`)
- Make sure `.env` is in the project root

### "Rate limit reached" error
- You've hit the free tier limit
- Wait 24 hours or upgrade to paid tier
- Use local database mode temporarily

### No search results
- Check API key is valid
- Verify internet connection
- Check browser console for errors

---

## 📝 Local-Only Mode

If you want to use only the 100-stock local database without API:

```jsx
<StockSearch onStockSelect={handleSelect} useLocalOnly={true} />
```

---

## 🎓 Next Steps

1. ✅ Get API key from Alpha Vantage
2. ✅ Add to `.env` file
3. ✅ Restart server
4. ✅ Test search with "AAPL", "TSLA", "BTC"
5. 🎉 Search any stock in the world!

---

**Need help?** Check the API provider documentation:
- Alpha Vantage: https://www.alphavantage.co/documentation/
- Finnhub: https://finnhub.io/docs/api
- Twelve Data: https://twelvedata.com/docs

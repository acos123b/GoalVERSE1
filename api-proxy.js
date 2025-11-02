// GoalVERSE API Proxy - Netlify Serverless Function
// This keeps your API key hidden and handles rate limiting

// 🔑 PASTE YOUR API KEY HERE (replace 'your_api_key_here' with your actual key)
const API_KEY = process.env.FOOTBALL_API_KEY || 'demo_key';

const FOOTBALL_DATA_BASE = 'https://api.football-data.org/v4';

// Simple in-memory cache (resets when function restarts)
const cache = new Map();

// Rate limit tracker (10 calls per minute)
const rateLimiter = {
  calls: [],
  
  canMakeCall() {
    const now = Date.now();
    // Remove calls older than 60 seconds
    this.calls = this.calls.filter(timestamp => now - timestamp < 60000);
    
    // Check if we can make another call
    if (this.calls.length >= 10) {
      return false;
    }
    
    this.calls.push(now);
    return true;
  },
  
  getTimeUntilReset() {
    if (this.calls.length === 0) return 0;
    const oldestCall = Math.min(...this.calls);
    const timeElapsed = Date.now() - oldestCall;
    return Math.max(0, 60000 - timeElapsed);
  }
};

// Helper: Get cache key
function getCacheKey(endpoint, params) {
  const paramStr = params ? JSON.stringify(params) : '';
  return `${endpoint}:${paramStr}`;
}

// Helper: Get cache TTL based on endpoint
function getCacheTTL(endpoint) {
  // Live matches: 60 seconds
  if (endpoint.includes('/matches') && !endpoint.includes('/match/')) {
    return 60 * 1000;
  }
  
  // Specific match details: 30 seconds (might be live)
  if (endpoint.includes('/match/')) {
    return 30 * 1000;
  }
  
  // Teams/Squads: 24 hours
  if (endpoint.includes('/teams') || endpoint.includes('/squad')) {
    return 24 * 60 * 60 * 1000;
  }
  
  // Players: 7 days
  if (endpoint.includes('/persons')) {
    return 7 * 24 * 60 * 60 * 1000;
  }
  
  // Competitions/Standings: 6 hours
  if (endpoint.includes('/competitions') || endpoint.includes('/standings')) {
    return 6 * 60 * 60 * 1000;
  }
  
  // Default: 1 hour
  return 60 * 60 * 1000;
}

exports.handler = async (event, context) => {
  // Allow CORS (so your website can call this function)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Only GET requests are supported.' })
    };
  }
  
  try {
    // Get endpoint from query params
    const endpoint = event.queryStringParameters?.endpoint || '/competitions';
    
    // Basic security: prevent path traversal
    if (endpoint.includes('..') || endpoint.includes('//')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid endpoint format' })
      };
    }
    
    // Check cache first
    const cacheKey = getCacheKey(endpoint, null);
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < getCacheTTL(endpoint)) {
      console.log(`✅ Cache HIT for ${endpoint}`);
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'X-Cache-Status': 'HIT'
        },
        body: JSON.stringify({
          ...cached.data,
          _cached: true,
          _cachedAt: new Date(cached.timestamp).toISOString()
        })
      };
    }
    
    // Check rate limit
    if (!rateLimiter.canMakeCall()) {
      console.log(`⚠️ Rate limit reached. Returning stale cache if available.`);
      
      // If we have stale cache, return it with warning
      if (cached) {
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'X-Cache-Status': 'STALE'
          },
          body: JSON.stringify({
            ...cached.data,
            _cached: true,
            _stale: true,
            _cachedAt: new Date(cached.timestamp).toISOString(),
            _warning: 'Rate limit reached. Showing cached data.'
          })
        };
      }
      
      // No cache available
      const resetTime = Math.ceil(rateLimiter.getTimeUntilReset() / 1000);
      return {
        statusCode: 429,
        headers: {
          ...headers,
          'Retry-After': resetTime.toString()
        },
        body: JSON.stringify({
          error: 'Rate limit exceeded',
          message: `API call limit reached. Try again in ${resetTime} seconds.`,
          retryAfter: resetTime
        })
      };
    }
    
    // Make API call
    console.log(`📡 Fetching from API: ${endpoint}`);
    const url = `${FOOTBALL_DATA_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    console.log(`✅ Successfully fetched ${endpoint}`);
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'X-Cache-Status': 'MISS'
      },
      body: JSON.stringify({
        ...data,
        _cached: false
      })
    };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch data',
        message: error.message,
        hint: 'Check if your API key is correct and you have internet connection.'
      })
    };
  }
};

// For testing locally (optional - won't run on Netlify)
if (require.main === module) {
  console.log('🧪 Testing API proxy locally...');
  console.log('Note: This is just a test runner. Deploy to Netlify for actual use.');
}
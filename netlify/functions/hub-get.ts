import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch('http://ammrhubapi.inexteamhost.dpdns.org/index.php?action=get', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const text = await response.text();

    // Check for Anti-Bot protection (common in free hosting like ByetHost/InfinityFree)
    if (text.includes('__test') && text.includes('slowAES')) {
      return {
        statusCode: 503,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'API_BOT_PROTECTED',
          message: 'The Hub API host has bot protection enabled. It requires JavaScript to set a "__test" cookie, which prevents server-side access.',
          details: 'Please ensure your hosting provider (inexteamhost.dpdns.org) allows automated API requests.'
        }),
      };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON. Response body:', text);
      throw new Error(`Invalid JSON response from API. Start of body: ${text.substring(0, 100)}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error('Hub Get Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch hub posts',
        details: error.message
      }),
    };
  }
};

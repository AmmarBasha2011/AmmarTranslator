import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch('http://ammrhubapi.inexteamhost.dpdns.org/index.php?action=get', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AmmarTranslator-V2'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();

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

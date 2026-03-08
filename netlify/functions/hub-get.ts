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

    const text = await response.text();
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

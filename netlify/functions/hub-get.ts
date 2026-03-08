import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  try {
    const response = await fetch('http://ammrhubapi.inexteamhost.dpdns.org/index.php?action=get');
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Hub Get Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch hub posts' }),
    };
  }
};

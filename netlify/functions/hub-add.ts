import { Handler } from '@netlify/functions';
import { validateAmmarInput } from '../../src/services/validator';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text_am, text_ar } = JSON.parse(event.body || '{}');

    if (!text_am) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing text_am parameter.' }),
      };
    }

    // Server-side validation
    const errors = validateAmmarInput(text_am);
    // Note: We still allow posting if the user confirmed on the frontend,
    // but the API could enforce a stricter policy if needed.
    // For now, let's just log or include validation status.
    const isValid = errors.length === 0;

    const targetUrl = `http://ammrhubapi.inexteamhost.dpdns.org/index.php?action=add&text_ar=${encodeURIComponent(text_ar || 'From User')}&text_am=${encodeURIComponent(text_am)}`;

    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AmmarTranslator-V2'
      }
    });

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
      body: JSON.stringify({
        success: data.success || data.sucsess,
        ...data,
        validated: isValid,
        errors: errors.map(e => e.message)
      }),
    };
  } catch (error) {
    console.error('Hub Add Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

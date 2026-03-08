import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { validateAmmarInput } from '../../src/services/validator';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    let body = event.body || '{}';
    if (event.isBase64Encoded) {
      body = Buffer.from(body, 'base64').toString('utf8');
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_JSON',
          message: 'Failed to parse request body as JSON.',
          details: body.substring(0, 100)
        }),
      };
    }

    const { text_am, text_ar, force } = parsedBody;

    if (!text_am) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing text_am parameter.' }),
      };
    }

    // Server-side validation
    const errors = validateAmmarInput(text_am);
    const isValid = errors.length === 0;

    if (!isValid && !force) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'SYNTAX_ERROR',
          message: 'Ammar Language syntax validation failed.',
          errors: errors.map(e => e.message)
        }),
      };
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          text_am,
          text_ar: text_ar || 'From User',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        id: data[0]?.id,
        validated: isValid,
        errors: errors.map(e => e.message)
      }),
    };
  } catch (error: any) {
    console.error('Hub Add Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to add hub post to Supabase',
        details: error.message
      }),
    };
  }
};

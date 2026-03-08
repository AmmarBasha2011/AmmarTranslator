import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

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
        error: 'Failed to fetch hub posts from Supabase',
        details: error.message
      }),
    };
  }
};

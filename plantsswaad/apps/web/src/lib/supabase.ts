import { createTypedSupabaseClient } from '@plantsswaad/shared';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createTypedSupabaseClient(supabaseUrl, supabaseKey);

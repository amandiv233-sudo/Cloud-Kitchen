import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export const createTypedSupabaseClient = (
    supabaseUrl: string,
    supabaseKey: string
): SupabaseClient<Database> => {
    return createClient<Database>(supabaseUrl, supabaseKey);
};

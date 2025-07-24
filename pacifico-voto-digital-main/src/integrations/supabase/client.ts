import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabaseConfig } from '@/services/configService';

const config = getSupabaseConfig();

const SUPABASE_URL = config?.url || '';
const SUPABASE_PUBLISHABLE_KEY = config?.anonKey || '';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
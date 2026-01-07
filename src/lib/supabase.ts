import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if keys are missing to prevent a crash during initialization
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in .env file");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

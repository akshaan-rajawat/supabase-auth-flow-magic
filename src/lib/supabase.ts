
import { createClient } from '@supabase/supabase-js'

// Use the actual Supabase URL and anonymous key
const supabaseUrl = 'https://hgiwlcxjvforvylmtqfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaXdsY3hqdmZvcnZ5bG10cWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTMyMjAsImV4cCI6MjA2MDYyOTIyMH0.FZsv3QhEmKQUsXh5li5obkbnFRtmmOYmbuaWg149LMc';

// Create the Supabase client with proper options for auth persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

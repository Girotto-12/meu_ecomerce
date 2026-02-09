import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ktfcjrhijiiuhzwdbahr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZmNqcmhpamlpdWh6d2RiYWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTAxMTYsImV4cCI6MjA4NjE4NjExNn0.IQf91ciD3pUgRunew93PTR4_fIK_S-weZX74pDCwC0c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});


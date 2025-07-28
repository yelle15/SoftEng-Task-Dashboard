import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://anfpjhgedpadndtsnlcv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZnBqaGdlZHBhZG5kdHNubGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MzIyODUsImV4cCI6MjA2OTEwODI4NX0.cX30JVwRpqqNYcoMM0PUrDWJMYBGRuvVNugOnM7Nkwk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
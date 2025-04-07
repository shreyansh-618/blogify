import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase URL and anon key
// For development, you can use these placeholder values
const supabaseUrl = "https://gzyrlyixzudrurhwisrn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eXJseWl4enVkcnVyaHdpc3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTcwMzgsImV4cCI6MjA1ODU3MzAzOH0.RSG7cbZ0euMlgKMERGfgsTAH46c2Ako5YN93PxdoD_4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

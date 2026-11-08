import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase URL or Publishable Key is missing in environment variables (.env).",
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

export default supabase;

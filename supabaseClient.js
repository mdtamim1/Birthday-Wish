require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
let isSupabaseConfigured = false;

if (SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.startsWith('http')) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });
    isSupabaseConfigured = true;
    console.log('⚡ Supabase Cloud Client configured successfully (' + SUPABASE_URL + ')');
  } catch (err) {
    console.error('⚠️ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('📁 Supabase not configured in .env; using local SQLite & JSON persistence.');
}

// SQL Schema for user to run in Supabase SQL Editor
const SUPABASE_SCHEMA_SQL = `
-- 1. Create birthday_wishes table
CREATE TABLE IF NOT EXISTS public.birthday_wishes (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'Your Name',
  birthdate TEXT,
  special_text TEXT,
  birthday_note TEXT,
  wisher_name TEXT,
  show_wisher BOOLEAN DEFAULT true,
  gift_message TEXT,
  photo TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  gift_photo TEXT,
  voice_url TEXT,
  voice_title TEXT,
  show_voice_note BOOLEAN DEFAULT true,
  music_url TEXT,
  music_enabled BOOLEAN DEFAULT true,
  theme_id TEXT DEFAULT 'galaxy-violet',
  theme_color1 TEXT DEFAULT '#da5ec9',
  theme_color2 TEXT DEFAULT '#ec4899',
  theme_accent TEXT DEFAULT '#fd8ae0',
  show_birthdate BOOLEAN DEFAULT true,
  show_floating_memories BOOLEAN DEFAULT true,
  show_gift BOOLEAN DEFAULT true,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Read/Write Policies
ALTER TABLE public.birthday_wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read wishes" ON public.birthday_wishes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert wishes" ON public.birthday_wishes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update wishes" ON public.birthday_wishes
  FOR UPDATE USING (true);

-- 2. Create Storage Bucket for Uploads (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('birthday-uploads', 'birthday-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public uploads in birthday-uploads" ON storage.objects
  FOR ALL USING (bucket_id = 'birthday-uploads');
`;

module.exports = {
  supabase,
  isSupabaseConfigured: () => isSupabaseConfigured,
  SUPABASE_SCHEMA_SQL
};

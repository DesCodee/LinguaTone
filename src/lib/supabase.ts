import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://smfhybifabrbukxvklfy.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmh5YmlmYWJyYnVreHZrbGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODU3OTMsImV4cCI6MjEwMjM2MTc5M30.NwpcsQaHLUdaroZtPzgCho1KP4Zlrli183dMWbkbud8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type User = {
  id: string
  email: string
  username?: string
  avatar_url?: string
}

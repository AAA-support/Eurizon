import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://mfwzvryispkbozuycqtm.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1md3p2cnlpc3BrYm96dXljcXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MjM1NzUsImV4cCI6MjA3Mzk5OTU3NX0.v8c1DNhJ0TKCmvFCwTpmPeE8q-AjjeJWaHSEZflvZv8'

export const supabase = createClient(supabaseUrl, supabaseKey)
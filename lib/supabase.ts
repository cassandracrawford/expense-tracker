import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbnayglipavgedyzurhw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibmF5Z2xpcGF2Z2VkeXp1cmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODE0NjMsImV4cCI6MjA2NzY1NzQ2M30.O0c-dIOIDcSnGi0TMohTPaDx_WeU9j7H25UQ_gpLhL4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

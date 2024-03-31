import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

const _supabase = createClient(supabaseUrl, supabaseKey);
console.log(_supabase);

export {_supabase};

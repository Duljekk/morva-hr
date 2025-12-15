/**
 * Diagnostic script to check if user profile exists in database
 * Run with: npx ts-node scripts/check-user-profile.ts <email>
 */

import { createClient } from '@supabase/supabase-js';

async function checkUserProfile(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('🔍 Checking user profile for:', email);
  console.log('');

  // 1. Check if user exists in auth.users
  const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('❌ Error fetching auth users:', authError);
    process.exit(1);
  }

  const user = authUser.users.find(u => u.email === email);
  
  if (!user) {
    console.error('❌ User not found in auth.users table');
    process.exit(1);
  }

  console.log('✅ User found in auth.users:');
  console.log('   - ID:', user.id);
  console.log('   - Email:', user.email);
  console.log('   - Created:', user.created_at);
  console.log('   - Last sign in:', user.last_sign_in_at);
  console.log('');

  // 2. Check if user exists in public.users table
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('❌ Error fetching profile:', profileError);
    console.log('');
    console.log('💡 Possible issues:');
    console.log('   - RLS policies might be blocking access');
    console.log('   - The handle_new_user trigger might not have run');
    console.log('   - The users table might not exist');
    process.exit(1);
  }

  if (!profile) {
    console.error('❌ User profile NOT found in public.users table');
    console.log('');
    console.log('💡 This means the handle_new_user trigger did not create the profile.');
    console.log('   You can manually create it or check the trigger function.');
    console.log('');
    console.log('   To manually create the profile, run:');
    console.log(`   INSERT INTO public.users (id, email, role, is_active) VALUES ('${user.id}', '${email}', 'employee', true);`);
    process.exit(1);
  }

  console.log('✅ User profile found in public.users:');
  console.log('   - ID:', profile.id);
  console.log('   - Email:', profile.email);
  console.log('   - Username:', profile.username || '(not set)');
  console.log('   - Full name:', profile.full_name || '(not set)');
  console.log('   - Role:', profile.role);
  console.log('   - Is active:', profile.is_active);
  console.log('   - Employee ID:', profile.employee_id || '(not set)');
  console.log('');
  console.log('✅ Everything looks good!');
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error('❌ Usage: npx ts-node scripts/check-user-profile.ts <email>');
  process.exit(1);
}

checkUserProfile(email).catch(console.error);



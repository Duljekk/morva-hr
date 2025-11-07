# Environment Variables Setup

## Quick Setup Instructions

### Step 1: Get Your Supabase Anon Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/kvwmlhalbsiywjjzvoje
2. Navigate to: **Settings → API**
3. Copy the **anon** **public** key (it starts with `eyJ...`)

### Step 2: Create `.env.local` File

Create a file named `.env.local` in your project root with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kvwmlhalbsiywjjzvoje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

**Replace `paste_your_anon_key_here` with your actual anon key from Step 1.**

### Step 3: Verify Setup

After creating `.env.local`:

1. **Restart your dev server** if it's running:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Check the server starts without errors**

3. **Try logging in** - the app should now connect to Supabase

---

## Complete Example

Your `.env.local` should look like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kvwmlhalbsiywjjzvoje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2d21saGFsYnNpeXdqanp2b2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk0MzQ0ODUsImV4cCI6MjAxNTAwNDQ4NX0.XXXXX-YOUR-ACTUAL-KEY-HERE
```

---

## Security Notes

✅ **Safe to use on client-side** - The anon key is designed for public use  
✅ **Protected by RLS** - Your database policies prevent unauthorized access  
❌ **Never commit `.env.local`** - It's already in `.gitignore`  
✅ **Safe to share project URL** - The URL is public  
❌ **Don't share service_role key** - Keep that secret (only for server use)

---

## Troubleshooting

### Error: "supabaseUrl is required"
- You forgot to create `.env.local` file
- The file is in the wrong location (must be in project root)

### Error: "Invalid API key"
- You used the wrong key (use **anon** key, not service_role)
- There's a typo in the key

### Changes not taking effect
- Restart your dev server after creating/editing `.env.local`
- Clear browser cache and cookies

---

## Next Steps

Once `.env.local` is set up:

1. ✅ Run `npm run dev`
2. ✅ Go to http://localhost:3000/login
3. ✅ Try creating a test user via Supabase Dashboard
4. ✅ Log in with that user
5. ✅ Your app is now connected to the database! 🎉

---

## Getting Your Keys

### Anon Key (Public)
**Location:** Settings → API → Project API keys → `anon` `public`  
**Use:** Client-side (Next.js frontend)  
**Safe:** Yes, designed for public use

### Service Role Key (Secret)
**Location:** Settings → API → Project API keys → `service_role` `secret`  
**Use:** Server-side operations only (if needed later)  
**Safe:** No, keep it secret!

---

## File Locations

```
morvahr/
├── .env.local              ← Create this file (you)
├── .env.local.example      ← Template (created ✓)
├── .gitignore              ← Protects .env.local (already set ✓)
└── ENVIRONMENT_VARIABLES.md ← This file (created ✓)
```

---

Need help? Check:
- Supabase Dashboard: https://supabase.com/dashboard/project/kvwmlhalbsiywjjzvoje
- API Settings: https://supabase.com/dashboard/project/kvwmlhalbsiywjjzvoje/settings/api


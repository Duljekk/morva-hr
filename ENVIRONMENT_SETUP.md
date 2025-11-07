# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project dashboard (https://supabase.com/dashboard)

# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here

# Your Supabase anonymous/public API key (safe to expose in client)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## How to Get These Values

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** to `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the **anon public** key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Important Notes

- The `NEXT_PUBLIC_` prefix exposes these variables to the browser (required for client-side auth)
- The `anon` key is safe to expose as it has Row Level Security (RLS) policies protecting your data
- Never commit `.env.local` to version control (it's already in `.gitignore`)



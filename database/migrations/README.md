# Database Migrations

This directory contains database migration files for version control and deployment.

## Structure

Migrations are organized chronologically with the following naming convention:

```
YYYYMMDD_HHMMSS_description.sql
```

For example:
- `20250107_120000_initial_schema.sql`
- `20250107_120100_seed_leave_types.sql`
- `20250107_120200_rls_policies.sql`

## Migration Order

Migrations should be applied in the following order:

1. **Schema migrations** - Create tables, enums, and constraints
2. **Seed data migrations** - Insert initial reference data
3. **RLS policies** - Apply row-level security policies
4. **Function migrations** - Create or update database functions
5. **Trigger migrations** - Create or update triggers

## Running Migrations

### Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Initialize Supabase in your project
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# Or run specific migration
supabase db execute --file database/migrations/YYYYMMDD_HHMMSS_description.sql
```

### Manual Application

If not using Supabase CLI, apply migrations manually in order:

```sql
-- 1. Apply schema
\i database/schema.sql

-- 2. Apply seed data
\i database/seed.sql

-- 3. Apply RLS policies
\i database/rls_policies.sql
```

## Creating New Migrations

When creating a new migration:

1. Create a new file with timestamp and description
2. Add both UP and DOWN migrations if possible
3. Test the migration on a development database
4. Document any manual steps required
5. Update this README if needed

## Rollback

To rollback a migration, create a new migration that reverses the changes. Never modify existing migrations that have been applied to production.

## Best Practices

- Always test migrations on a development database first
- Keep migrations small and focused
- Include comments explaining complex changes
- Use transactions where appropriate
- Document any data transformations
- Back up production database before applying migrations





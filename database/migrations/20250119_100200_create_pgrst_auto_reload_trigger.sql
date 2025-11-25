-- Create event trigger to automatically notify PostgREST to reload schema on DDL changes
-- This prevents schema cache issues when new tables/functions are created
-- PostgREST will automatically reload its schema cache when it receives the NOTIFY signal

CREATE OR REPLACE FUNCTION pgrst_watch() RETURNS event_trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NOTIFY pgrst, 'reload schema';
END;
$$;

-- Drop existing trigger if it exists
DROP EVENT TRIGGER IF EXISTS pgrst_watch;

-- Create the event trigger
CREATE EVENT TRIGGER pgrst_watch
ON ddl_command_end
EXECUTE FUNCTION pgrst_watch();

-- Force PostgREST to reload schema cache now
NOTIFY pgrst, 'reload schema';












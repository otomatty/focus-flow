-- Remove scheduled job
SELECT cron.unschedule('cleanup-unused-profile-images');

-- Remove trigger
DROP TRIGGER IF EXISTS trigger_cleanup_old_profile_image ON public.user_profiles;

-- Remove functions
DROP FUNCTION IF EXISTS public.cleanup_old_profile_image();
DROP FUNCTION IF EXISTS public.delete_unused_profile_images();

-- Note: pg_cron extension is kept as it might be used by other parts of the application 
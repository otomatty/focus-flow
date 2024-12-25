-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA storage TO postgres;

-- Function to delete unused profile images
CREATE OR REPLACE FUNCTION public.delete_unused_profile_images()
RETURNS void AS $$
DECLARE
    storage_object RECORD;
BEGIN
    -- Loop through all objects in profile-images bucket
    FOR storage_object IN 
        SELECT * FROM storage.objects 
        WHERE bucket_id = 'profile-images'
        AND (created_at < NOW() - INTERVAL '1 day')  -- Only target files older than 1 day
    LOOP
        -- Check if this file is currently used as a profile image
        IF NOT EXISTS (
            SELECT 1 
            FROM public.user_profiles 
            WHERE profile_image LIKE '%' || storage_object.name || '%'
        ) THEN
            -- Delete if not used
            DELETE FROM storage.objects 
            WHERE id = storage_object.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old profile image after update
CREATE OR REPLACE FUNCTION public.cleanup_old_profile_image()
RETURNS TRIGGER AS $$
BEGIN
    -- Only when profile image is changed
    IF OLD.profile_image IS DISTINCT FROM NEW.profile_image THEN
        -- Delete old image if exists
        IF OLD.profile_image IS NOT NULL THEN
            -- Wait 5 minutes to ensure profile update transaction is complete
            PERFORM pg_sleep(300);
            DELETE FROM storage.objects 
            WHERE bucket_id = 'profile-images'
            AND name = (
                SELECT regexp_replace(
                    OLD.profile_image,
                    '.*/profile-images/([^?]+).*',
                    '\1'
                )
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Setup trigger for profile image cleanup
DROP TRIGGER IF EXISTS trigger_cleanup_old_profile_image ON public.user_profiles;
CREATE TRIGGER trigger_cleanup_old_profile_image
    AFTER UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_old_profile_image();

-- Schedule periodic cleanup job (runs at 3 AM daily)
SELECT cron.schedule(
    'cleanup-unused-profile-images',
    '0 3 * * *',
    $$SELECT public.delete_unused_profile_images()$$
); 
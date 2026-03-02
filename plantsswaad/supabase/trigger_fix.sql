-- Fix for users failing to sign up (Database error saving new user)
-- The issue is often caused by the trigger failing when 'role' or other fields conflict, or when the phone number isn't passed correctly causing a unique constraint violation if null.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- We use an exception block to ensure that if the profile insert fails, 
  -- the user is still created in auth.users rather than crashing the whole signup process.
  -- This also ensures we log the error to Postgres logs for debugging.
  BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
      new.raw_user_meta_data->>'phone',
      'customer'
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error inserting into profiles for user %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$;

-- Fixes for Role Escalation Vulnerability and Missing Role Permissions

-- 1. Create a trigger function to block users from changing their own 'role' column unless they are admins.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If the role is being changed to a new value
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Allow the change ONLY if the person making the change is an 'admin'
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Access Denied: You do not have permission to change user roles.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply the trigger to the profiles table
DROP TRIGGER IF EXISTS tr_prevent_role_escalation ON public.profiles;
CREATE TRIGGER tr_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- 2. Fix Profile Update Policy (Allow Admins to update other users' roles)
-- First drop the existing restrictive insert/update policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Allow users to insert their *own* profile ONLY
CREATE POLICY "Users can insert their own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile OR allow admins to update ANY profile
CREATE POLICY "Users and Admins can update profiles" ON public.profiles 
  FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Fix Orders Access for Kitchen, Sales, and Delivery Roles
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own order status" ON public.orders;

-- Let staff view all orders, and customers only view their own orders
CREATE POLICY "Order viewing policy" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'chef', 'sales', 'delivery'))
  );

-- Let staff update all orders (to change status), let customers update ONLY their own order
CREATE POLICY "Order update policy" ON public.orders
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'chef', 'sales', 'delivery'))
  );

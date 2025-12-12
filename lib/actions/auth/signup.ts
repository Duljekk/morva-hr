'use server';

import { SignupFormSchema, type SignupFormData } from '@/lib/validations/signup';
import { createClient } from '@/lib/supabase/server';

/**
 * Signup form state returned to the client
 */
export interface SignupFormState {
  errors?: {
    email?: string[];
    username?: string[];
    full_name?: string[];
    password?: string[];
    confirm_password?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
}

/**
 * Signup server action
 * 
 * This function:
 * 1. Validates the form data using Zod schema
 * 2. Verifies the invitation token
 * 3. Updates the user's password
 * 4. Creates/updates the user profile in the database
 * 5. Redirects to the login page
 * 
 * @param prevState - Previous form state (unused, required by useActionState)
 * @param formData - Form data from the signup form
 * @returns Form state with errors or success message
 */
export async function signup(
  prevState: SignupFormState | undefined,
  formData: FormData
): Promise<SignupFormState> {
  try {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
      email: formData.get('email'),
      username: formData.get('username'),
      full_name: formData.get('full_name'),
      password: formData.get('password'),
      confirm_password: formData.get('confirm_password'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      // Ensure all error values are properly serialized as string arrays
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      const serializedErrors: SignupFormState['errors'] = {};
      
      // Convert all error arrays to plain string arrays - handle each field type explicitly
      if (fieldErrors.email) serializedErrors.email = fieldErrors.email.map(String);
      if (fieldErrors.username) serializedErrors.username = fieldErrors.username.map(String);
      if (fieldErrors.full_name) serializedErrors.full_name = fieldErrors.full_name.map(String);
      if (fieldErrors.password) serializedErrors.password = fieldErrors.password.map(String);
      if (fieldErrors.confirm_password) serializedErrors.confirm_password = fieldErrors.confirm_password.map(String);
      
      const errorResponse: SignupFormState = {
        errors: serializedErrors,
      };
      return errorResponse;
    }

    const { email, username, full_name, password } = validatedFields.data;
    const tokenHash = formData.get('token_hash') as string;

    if (!tokenHash) {
      const errorResponse: SignupFormState = {
        errors: {
          _form: ['Invalid invitation token. Please use the link from your invitation email.'],
        },
      };
      return errorResponse;
    }

    const supabase = await createClient();

    // Verify invitation token to get session
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'invite',
    });

    if (verifyError || !verifyData.session) {
      console.error('[signup] Token verification error:', verifyError);
      const errorResponse: SignupFormState = {
        errors: {
          _form: ['Invalid or expired invitation token. Please request a new invitation.'],
        },
      };
      return errorResponse;
    }

    // Update user password
    console.log('[signup] Setting password for user:', verifyData.user?.email);
    console.log('[signup] Password length:', password.length);
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      console.error('[signup] Password update error:', updateError);
      const errorResponse: SignupFormState = {
        errors: {
          _form: [String(updateError.message || 'Failed to set password')],
        },
      };
      return errorResponse;
    }
    
    console.log('[signup] Password updated successfully');

    // Wait a moment to ensure password is fully committed to database
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('[signup] Get user error:', userError);
      const errorResponse: SignupFormState = {
        errors: {
          _form: ['Failed to get user information'],
        },
      };
      return errorResponse;
    }

    // Check if username is already taken
    const { data: existingUsername, error: usernameCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.trim())
      .neq('id', user.id)
      .maybeSingle();

    // If error is not "no rows found" (PGRST116), it's a real error
    if (usernameCheckError && usernameCheckError.code !== 'PGRST116') {
      console.error('[signup] Username check error:', usernameCheckError);
      const errorResponse: SignupFormState = {
        errors: {
          _form: ['Failed to verify username availability. Please try again.'],
        },
      };
      return errorResponse;
    }

    // If username exists, return error
    if (existingUsername) {
      const errorResponse: SignupFormState = {
        errors: {
          username: ['This username is already taken'],
        },
      };
      return errorResponse;
    }

    // Create or update user profile
    // Include all optional fields from user metadata if provided
    const profileData: any = {
      id: user.id,
      email: email,
      username: username.trim(),
      full_name: full_name.trim(),
      role: user.user_metadata?.role || 'employee',
      employee_id: user.user_metadata?.employee_id || null,
      shift_start_hour: user.user_metadata?.shift_start_hour || 11,
      shift_end_hour: user.user_metadata?.shift_end_hour || 19,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add optional profile fields from metadata if provided
    if (user.user_metadata?.employment_type) {
      profileData.employment_type = user.user_metadata.employment_type;
    }
    if (user.user_metadata?.birthdate) {
      profileData.birthdate = user.user_metadata.birthdate;
    }
    if (user.user_metadata?.salary) {
      profileData.salary = user.user_metadata.salary;
    }
    if (user.user_metadata?.contract_start_date) {
      profileData.contract_start_date = user.user_metadata.contract_start_date;
    }
    if (user.user_metadata?.contract_end_date) {
      profileData.contract_end_date = user.user_metadata.contract_end_date;
    }

    const { error: profileError } = await supabase
      .from('users')
      .upsert(profileData, {
        onConflict: 'id',
      });

    if (profileError) {
      console.error('[signup] Profile creation error:', profileError);
      const errorResponse: SignupFormState = {
        errors: {
          _form: ['Failed to create user profile. Please contact support.'],
        },
      };
      return errorResponse;
    }

    console.log('[signup] Successfully created user profile:', {
      userId: user.id,
      email: email,
      username: username,
    });

    // Return success message instead of redirecting
    // The client will handle sign out and redirect
    // Ensure response is serializable (plain object, no functions, dates, etc.)
    const successResponse: SignupFormState = {
      message: 'Account created successfully! Redirecting to login...',
      success: true,
    };
    return successResponse;
  } catch (error) {
    console.error('[signup] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    const errorResponse: SignupFormState = {
      errors: {
        _form: [errorMessage],
      },
    };
    return errorResponse;
  }
}

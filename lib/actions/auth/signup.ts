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
}

/**
 * Get invitation email from token
 * 
 * This verifies the invitation token and returns the email address
 * without requiring a password. This creates a temporary session
 * that will be used when the user completes signup.
 * 
 * @param tokenHash - The invitation token hash from URL
 * @returns Email address or error message
 */
export async function getInvitationEmail(
  tokenHash: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  if (!tokenHash) {
    return { success: false, error: 'Invalid invitation token' };
  }

  try {
    const supabase = await createClient();

    // Verify invitation token to get session and user email
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'invite',
    });

    if (verifyError || !verifyData.session || !verifyData.user) {
      console.error('[getInvitationEmail] Token verification error:', verifyError);
      return {
        success: false,
        error: 'Invalid or expired invitation token. Please request a new invitation.'
      };
    }

    return {
      success: true,
      email: verifyData.user.email || undefined
    };
  } catch (error) {
    console.error('[getInvitationEmail] Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
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
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, username, full_name, password } = validatedFields.data;
  const tokenHash = formData.get('token_hash') as string;

  if (!tokenHash) {
    return {
      errors: {
        _form: ['Invalid invitation token. Please use the link from your invitation email.'],
      },
    };
  }

  try {
    const supabase = await createClient();

    // Check if user is already authenticated (from getInvitationEmail)
    const { data: { user: existingUser }, error: existingUserError } = await supabase.auth.getUser();

    let user;
    let session;

    // If user is already authenticated, use existing session
    if (existingUser && !existingUserError) {
      user = existingUser;
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      session = existingSession;
    } else {
      // Otherwise, verify invitation token to get session
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'invite',
      });

      if (verifyError || !verifyData.session || !verifyData.user) {
        console.error('[signup] Token verification error:', verifyError);
        return {
          errors: {
            _form: ['Invalid or expired invitation token. Please request a new invitation.'],
          },
        };
      }

      user = verifyData.user;
      session = verifyData.session;
    }

    // Update user password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      console.error('[signup] Password update error:', updateError);
      return {
        errors: {
          _form: [updateError.message || 'Failed to set password'],
        },
      };
    }

    // Ensure we have user (should already be set above)
    if (!user) {
      console.error('[signup] No user available');
      return {
        errors: {
          _form: ['Failed to get user information'],
        },
      };
    }

    // Verify that the email in the form matches the invitation email
    if (user.email?.toLowerCase() !== email.toLowerCase()) {
      console.error('[signup] Email mismatch:', { formEmail: email, invitationEmail: user.email });
      return {
        errors: {
          _form: ['Email address does not match the invitation. Please use the email from your invitation.'],
        },
      };
    }

    // Check if username is already taken
    const { data: existingUsername, error: usernameCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.trim())
      .neq('id', user.id)
      .single();

    if (existingUsername) {
      return {
        errors: {
          username: ['This username is already taken'],
        },
      };
    }

    // Update user profile (profile was already created by inviteUserByEmail or trigger)
    // We upsert it with the user-provided username and full_name
    // Using upsert to handle edge cases where profile might not exist
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: email,
        username: username.trim(),
        full_name: full_name.trim(),
        role: user.user_metadata?.role || 'employee',
        employee_id: user.user_metadata?.employee_id || null,
        shift_start_hour: user.user_metadata?.shift_start_hour || 11,
        shift_end_hour: user.user_metadata?.shift_end_hour || 19,
        updated_at: new Date().toISOString(),
        is_active: true,
      } as any, {
        onConflict: 'id',
      });

    if (profileError) {
      console.error('[signup] Profile creation error:', profileError);
      return {
        errors: {
          _form: ['Failed to create user profile. Please contact support.'],
        },
      };
    }

    console.log('[signup] Successfully created user profile:', {
      userId: user.id,
      email: email,
      username: username,
    });

    // Success - return success message (client will handle redirect)
    return {
      message: 'Account created successfully. Please sign in.',
    };
  } catch (error) {
    console.error('[signup] Unexpected error:', error);
    return {
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    };
  }
}

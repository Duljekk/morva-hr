'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createClient } from '../supabase/client';
import type { Database } from '../supabase/types';
import { signOut as serverSignOut } from '../actions/auth';

// Extended user type with profile data
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'employee' | 'hr_admin';
  employee_id: string | null;
  shift_start_hour: number;
  shift_end_hour: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  // Sign out function
  const signOut = async () => {
    console.log('🔵 AuthContext: signOut called');
    try {
      // First, call server action to clear server-side cookies (critical for middleware)
      console.log('🔵 AuthContext: Calling server signOut to clear server-side cookies...');
      const serverResult = await serverSignOut();
      
      if (serverResult.error) {
        console.warn('🔵 AuthContext: Server signOut had error, but continuing:', serverResult.error);
      } else {
        console.log('🔵 AuthContext: Server signOut successful');
      }

      // Also clear client-side session and cookies
      console.log('🔵 AuthContext: Clearing client-side session...');
      
      // Create a promise that resolves when SIGNED_OUT event is received
      let signedOutResolver: (() => void) | null = null;
      const signedOutEventPromise = new Promise<void>((resolve) => {
        signedOutResolver = resolve;
      });

      // Set up a one-time listener for SIGNED_OUT event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          console.log('🔵 AuthContext: SIGNED_OUT event received');
          if (signedOutResolver) {
            signedOutResolver();
            subscription.unsubscribe();
          }
        }
      });

      // Create a timeout promise (3 seconds max wait for client-side cleanup)
      const timeoutPromise = new Promise<void>((_, reject) => 
        setTimeout(() => {
          subscription.unsubscribe();
          reject(new Error('Client signOut timeout'));
        }, 3000)
      );

      // Clear client-side session
      const clientSignOutPromise = supabase.auth.signOut();
      
      // Wait for client-side signOut and SIGNED_OUT event (with timeout)
      try {
        await Promise.race([
          Promise.all([
            clientSignOutPromise.catch(err => {
              console.warn('🔵 AuthContext: Client signOut API call had an error:', err);
            }),
            signedOutEventPromise
          ]),
          timeoutPromise
        ]).catch(err => {
          console.warn('🔵 AuthContext: Client signOut timed out or had error:', err);
        });
        
        console.log('🔵 AuthContext: Client signOut completed');
      } catch (error) {
        console.warn('🔵 AuthContext: Client signOut error, but continuing:', error);
      } finally {
        subscription.unsubscribe();
      }
      
      // Clear local state
      console.log('🔵 AuthContext: Clearing local state...');
      setUser(null);
      setProfile(null);
      setSession(null);
      console.log('🔵 AuthContext: State cleared successfully');
      
    } catch (error) {
      console.error('🔵 AuthContext: Exception during signOut:', error);
      // Clear state even on error
      setUser(null);
      setProfile(null);
      setSession(null);
      console.log('🔵 AuthContext: State cleared after error');
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔵 AuthContext: Auth state changed -', event, 'Session:', session ? 'EXISTS' : 'NULL');
      
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log('🔵 AuthContext: User logged in, fetching profile...');
        await fetchProfile(session.user.id);
      } else {
        console.log('🔵 AuthContext: No session, clearing profile');
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to require authentication
export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.loading && !auth.user) {
      window.location.href = '/login';
    }
  }, [auth.loading, auth.user]);

  return auth;
}



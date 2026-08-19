import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemoMode: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  enableDemoAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoLoggedIn, setDemoLoggedIn] = useState(() => {
    return localStorage.getItem('demo_auth_active') === 'true';
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      if (demoLoggedIn) {
        setUser({
          id: 'demo-admin-id',
          email: 'admin@pai-apps.edu',
          app_metadata: {},
          user_metadata: { name: 'Admin Demo PAI' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User);
      } else {
        setUser(null);
      }
      setIsLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [demoLoggedIn]);

  const signInWithEmail = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      // Demo credentials check
      if (email.trim() && pass.length >= 4) {
        localStorage.setItem('demo_auth_active', 'true');
        setDemoLoggedIn(true);
        return { error: null };
      }
      return { error: new Error('Gunakan password minimal 4 karakter untuk demo login.') };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('demo_auth_active');
      setDemoLoggedIn(false);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const enableDemoAuth = () => {
    localStorage.setItem('demo_auth_active', 'true');
    setDemoLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isDemoMode: !isSupabaseConfigured,
        signInWithEmail,
        signOut,
        enableDemoAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

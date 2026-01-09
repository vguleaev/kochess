import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes, type AuthUser } from 'aws-amplify/auth';
import { profileApi } from '@/lib/api';

export interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  hasProfile: boolean;
  userId: string | null;
  user: User | null;
  loadUser: () => Promise<void>;
  loadProfile: () => Promise<void>;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    try {
      const currentUser: AuthUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      const name = attributes.name || '';
      const email = attributes.email || '';

      setUserId(currentUser.userId);
      setIsSignedIn(true);
      setUser({
        id: currentUser.userId,
        name,
        email,
      });
    } catch {
      setUserId(null);
      setIsSignedIn(false);
      setUser(null);
    }
  };

  const loadProfile = async () => {
    try {
      const { profile } = await profileApi.get();
      setHasProfile(!!profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setHasProfile(false);
    }
  };

  const loadUserData = async () => {
    await loadUser();
    await loadProfile();
    setIsLoaded(true);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, hasProfile, userId, user, loadUser, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    hasProfile: context.hasProfile,
    userId: context.userId,
    user: context.user,
    loadUser: context.loadUser,
    loadProfile: context.loadProfile,
  };
}

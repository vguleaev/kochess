import { type ReactNode, useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes, type AuthUser } from 'aws-amplify/auth';
import { profileApi } from '@/lib/api';
import { AuthContext, type User } from './auth-context';

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

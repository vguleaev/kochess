import { createContext, useContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  hasProfile: boolean;
  userId: string | null;
  user: User | null;
  loadUser: () => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

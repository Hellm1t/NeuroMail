import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      setUser({
        email: session.user?.email,
        name: session.user?.name,
        image: session.user?.image,
        accessToken: session.accessToken,
      });
      setError(null);
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status]);

  const login = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      setError('Failed to sign in');
      console.error('Login error:', err);
    }
  };

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/auth' });
      setUser(null);
    } catch (err) {
      setError('Failed to sign out');
      console.error('Logout error:', err);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: status === 'loading',
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 
import { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const isLoading = status === 'loading';

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Ошибка входа:', error);
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/auth' });
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  if (session && session.user) {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <span className="flex items-center">
          Выйти ({session.user.email})
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading || isAuthenticating}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading || isAuthenticating ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Вход...
        </span>
      ) : (
        <span className="flex items-center">
          <FiLogIn className="mr-2" />
          Войти через Google
        </span>
      )}
    </button>
  );
} 
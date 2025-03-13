import Cookies from 'js-cookie';

// Cookie names
const TOKEN_COOKIE = 'neuromail_token';
const REFRESH_TOKEN_COOKIE = 'neuromail_refresh_token';
const USER_COOKIE = 'neuromail_user';

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

// Save access token to cookie
export const saveToken = (token: string): void => {
  Cookies.set(TOKEN_COOKIE, token, cookieOptions);
};

// Get access token from cookie
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE);
};

// Save refresh token to cookie
export const saveRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_COOKIE, token, {
    ...cookieOptions,
    expires: 30, // 30 days for refresh token
  });
};

// Get refresh token from cookie
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_COOKIE);
};

// Save user data to cookie
export const saveUser = (user: any): void => {
  Cookies.set(USER_COOKIE, JSON.stringify(user), cookieOptions);
};

// Get user data from cookie
export const getUser = (): any | null => {
  const userStr = Cookies.get(USER_COOKIE);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
};

// Clear all cookies
export const clearStorage = (): void => {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
  Cookies.remove(USER_COOKIE);
};

// Local storage functions (alternative to cookies)
export const saveToLocalStorage = (key: string, value: any): void => {
  if (typeof window === 'undefined') return;
  try {
    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key: string): any => {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}; 
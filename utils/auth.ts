import axios from 'axios';
import { saveToken, saveRefreshToken, getRefreshToken, clearStorage } from './storage';

// Google OAuth 2.0 endpoints
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Gmail API scopes
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/contacts.readonly',
];

// Generate Google OAuth URL
export const getGoogleAuthURL = (): string => {
  const rootUrl = GOOGLE_AUTH_URL;
  
  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: GMAIL_SCOPES.join(' '),
  };
  
  const queryString = new URLSearchParams(options).toString();
  
  return `${rootUrl}?${queryString}`;
};

// Exchange authorization code for tokens
export const getTokens = async (code: string): Promise<any> => {
  try {
    const { data } = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });
    
    // Save tokens
    saveToken(data.access_token);
    if (data.refresh_token) {
      saveRefreshToken(data.refresh_token);
    }
    
    return data;
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
};

// Refresh access token using refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    console.error('No refresh token available');
    return null;
  }
  
  try {
    const { data } = await axios.post(GOOGLE_TOKEN_URL, {
      refresh_token: refreshToken,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
    });
    
    saveToken(data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearStorage(); // Clear invalid tokens
    return null;
  }
}; 
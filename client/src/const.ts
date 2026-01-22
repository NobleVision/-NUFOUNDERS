export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// OAuth provider types
export type OAuthProvider = 'google' | 'github' | 'email';

// Generate OAuth login URLs for different providers
export const getLoginUrl = (provider: OAuthProvider = 'google') => {
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(JSON.stringify({ redirectUri, provider }));

  switch (provider) {
    case 'google': {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) return `/api/oauth/google?redirect=${encodeURIComponent(redirectUri)}`;
      
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'openid email profile');
      url.searchParams.set('state', state);
      url.searchParams.set('access_type', 'offline');
      url.searchParams.set('prompt', 'consent');
      return url.toString();
    }
    case 'github': {
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      if (!clientId) return `/api/oauth/github?redirect=${encodeURIComponent(redirectUri)}`;
      
      const url = new URL('https://github.com/login/oauth/authorize');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('scope', 'read:user user:email');
      url.searchParams.set('state', state);
      return url.toString();
    }
    case 'email':
    default:
      return '/login';
  }
};

// Convenience functions for each provider
export const getGoogleLoginUrl = () => getLoginUrl('google');
export const getGitHubLoginUrl = () => getLoginUrl('github');

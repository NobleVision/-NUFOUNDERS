import { SignJWT } from 'jose';
import { COOKIE_NAME, ONE_YEAR_MS } from '../../../shared/const';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return Response.redirect(new URL('/?error=oauth_denied', url.origin));
  }

  if (!code) {
    return new Response(JSON.stringify({ error: 'Missing authorization code' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get redirect URI from state if available
    let redirectUri = `${url.origin}/api/oauth/github/callback`;
    if (state) {
      try {
        const stateData = JSON.parse(atob(state));
        if (stateData.redirectUri) {
          redirectUri = stateData.redirectUri;
        }
      } catch {
        // Use default redirect URI
      }
    }

    const userInfo = await handleGitHubOAuth(code, redirectUri);

    // Create session token
    const sessionToken = await createSessionToken(userInfo.openId, userInfo.name);

    // Set cookie and redirect
    const cookieValue = [
      `${COOKIE_NAME}=${sessionToken}`,
      `Max-Age=${ONE_YEAR_MS / 1000}`,
      'Path=/',
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
    ].join('; ');

    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': cookieValue,
      },
    });
  } catch (err) {
    console.error('[GitHub OAuth] Callback failed:', err);
    return Response.redirect(new URL('/?error=oauth_failed', url.origin));
  }
}

async function handleGitHubOAuth(code: string, redirectUri: string) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth not configured');
  }

  // Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('GitHub token exchange failed');
  }

  const tokens = await tokenResponse.json();

  if (tokens.error) {
    throw new Error(`GitHub OAuth error: ${tokens.error_description}`);
  }

  // Get user info
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to get GitHub user info');
  }

  const githubUser = await userResponse.json();

  // Get primary email if not public
  let email = githubUser.email;
  if (!email) {
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (emailResponse.ok) {
      const emails = await emailResponse.json();
      const primaryEmail = emails.find((e: any) => e.primary);
      email = primaryEmail?.email || emails[0]?.email || null;
    }
  }

  return {
    openId: `github_${githubUser.id}`,
    name: githubUser.name || githubUser.login || 'User',
    email,
    loginMethod: 'github',
  };
}

async function createSessionToken(openId: string, name: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production');
  const expiresAt = Math.floor((Date.now() + ONE_YEAR_MS) / 1000);

  return new SignJWT({
    openId,
    appId: process.env.VITE_APP_ID || 'nufounders',
    name,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(expiresAt)
    .sign(secret);
}

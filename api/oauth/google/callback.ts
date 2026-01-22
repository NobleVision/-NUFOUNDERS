import { SignJWT } from 'jose';
import { COOKIE_NAME, ONE_YEAR_MS } from '../../../shared/const';
import { ENV } from '../../../server/_core/env';
import * as db from '../../../server/db';

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
    let redirectUri = `${url.origin}/api/oauth/google/callback`;
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

    const userInfo = await handleGoogleOAuth(code, redirectUri);

    // Save user to database
    await db.upsertUser({
      openId: userInfo.openId,
      name: userInfo.name,
      email: userInfo.email,
      loginMethod: userInfo.loginMethod,
      lastSignedIn: new Date(),
    });

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
        'Location': '/dashboard',
        'Set-Cookie': cookieValue,
      },
    });
  } catch (err) {
    console.error('[Google OAuth] Callback failed:', err);
    return Response.redirect(new URL('/?error=oauth_failed', url.origin));
  }
}

async function handleGoogleOAuth(code: string, redirectUri: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth not configured');
  }

  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Google token exchange failed: ${error}`);
  }

  const tokens = await tokenResponse.json();

  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to get Google user info');
  }

  const googleUser = await userResponse.json();

  return {
    openId: `google_${googleUser.id}`,
    name: googleUser.name || googleUser.email?.split('@')[0] || 'User',
    email: googleUser.email || null,
    loginMethod: 'google',
  };
}

async function createSessionToken(openId: string, name: string): Promise<string> {
  const secret = new TextEncoder().encode(ENV.cookieSecret);
  const expiresAt = Math.floor((Date.now() + ONE_YEAR_MS) / 1000);

  return new SignJWT({
    openId,
    appId: ENV.appId,
    name,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(expiresAt)
    .sign(secret);
}

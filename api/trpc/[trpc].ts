import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../server/routers';
import { createContext } from '../../server/_core/context';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async ({ req, resHeaders }) => {
      // Create a mock Express-like request/response for compatibility
      const mockReq = {
        headers: Object.fromEntries(req.headers.entries()),
        cookies: parseCookies(req.headers.get('cookie') || ''),
      } as any;
      
      const mockRes = {
        setHeader: (name: string, value: string) => resHeaders.set(name, value),
        cookie: (name: string, value: string, options: any) => {
          const cookieStr = serializeCookie(name, value, options);
          resHeaders.append('Set-Cookie', cookieStr);
        },
        clearCookie: (name: string, options: any) => {
          const cookieStr = serializeCookie(name, '', { ...options, maxAge: -1 });
          resHeaders.append('Set-Cookie', cookieStr);
        },
      } as any;
      
      return createContext({ req: mockReq, res: mockRes });
    },
  });
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    if (name) {
      cookies[name.trim()] = rest.join('=').trim();
    }
  });
  
  return cookies;
}

function serializeCookie(name: string, value: string, options: any = {}): string {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  
  if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options.path) cookie += `; Path=${options.path}`;
  if (options.domain) cookie += `; Domain=${options.domain}`;
  if (options.secure) cookie += '; Secure';
  if (options.httpOnly) cookie += '; HttpOnly';
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  
  return cookie;
}

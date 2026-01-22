import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export interface ContextOptions {
  req: any;
  res: any;
  info?: any;
}

export type TrpcContext = {
  req: any;
  res: any;
  user: User | null;
};

export async function createContext(
  opts: ContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

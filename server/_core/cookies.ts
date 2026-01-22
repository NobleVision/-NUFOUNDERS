interface CookieOptionsSubset {
  domain?: string;
  httpOnly?: boolean;
  path?: string;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
}

interface RequestLike {
  protocol?: string;
  headers?: Record<string, string | string[] | undefined>;
}

function isSecureRequest(req: RequestLike): boolean {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers?.["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some((proto: string) => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(req: RequestLike): CookieOptionsSubset {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req),
  };
}

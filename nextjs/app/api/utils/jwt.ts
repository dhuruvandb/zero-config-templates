import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";

interface TokenPayload {
  userId: string;
}

export function generateAccessToken(userId: string): string {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
  }
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export function verifyAccessToken(token: string): string | null {
  try {
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
    }
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    return payload.userId;
  } catch {
    return null;
  }
}

export function validateEnvironment(): void {
  if (!ACCESS_TOKEN_SECRET) {
    console.error("Missing required environment variable: ACCESS_TOKEN_SECRET");
    console.error('Generate a secret with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    throw new Error("ACCESS_TOKEN_SECRET environment variable is required");
  }
}

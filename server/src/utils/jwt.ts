import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  email: string;
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return secret;
};

export const signToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, getJwtSecret(), options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
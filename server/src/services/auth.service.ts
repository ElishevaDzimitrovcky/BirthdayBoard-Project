import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
import { signToken } from "../utils/jwt";

const sanitizeUser = (user: { id: number; email: string }) => {
  return {
    id: user.id,
    email: user.email,
  };
};

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    const error = new Error("User with this email already exists");
    (error as any).statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    (error as any).statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    (error as any).statusCode = 401;
    throw error;
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
};
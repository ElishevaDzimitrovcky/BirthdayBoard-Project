const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
  token: string;
}

export interface AuthInput {
  email: string;
  password: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
};

export const registerUser = async (
  input: AuthInput
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return handleResponse<AuthResponse>(response);
};

export const loginUser = async (input: AuthInput): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return handleResponse<AuthResponse>(response);
};
import {
  BirthdayInput,
  BirthdayPerson,
  BirthdaysResponse,
  TodayBirthdaysResponse,
} from "../types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
};

export const getTodayBirthdays = async (): Promise<TodayBirthdaysResponse> => {
  const response = await fetch(`${API_URL}/birthdays/today`, {
    headers: getAuthHeaders(),
  });

  return handleResponse<TodayBirthdaysResponse>(response);
};

export const getBirthdays = async (
  page: number,
  limit: number
): Promise<BirthdaysResponse> => {
  const response = await fetch(
    `${API_URL}/birthdays?page=${page}&limit=${limit}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<BirthdaysResponse>(response);
};

export const createBirthday = async (
  input: BirthdayInput
): Promise<{ message: string; person: BirthdayPerson }> => {
  const response = await fetch(`${API_URL}/birthdays`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });

  return handleResponse<{ message: string; person: BirthdayPerson }>(response);
};

export const updateBirthday = async (
  id: number,
  input: BirthdayInput
): Promise<{ message: string; person: BirthdayPerson }> => {
  const response = await fetch(`${API_URL}/birthdays/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });

  return handleResponse<{ message: string; person: BirthdayPerson }>(response);
};

export const deleteBirthday = async (
  id: number
): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/birthdays/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse<{ message: string }>(response);
};
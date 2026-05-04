import { api } from "./api";

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
};

export async function login(payload: AuthPayload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function signup(payload: AuthPayload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

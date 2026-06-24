import { api } from "./api";
import { AuthToken, User } from "@/types";

export const authService = {
  async register(email: string, password: string): Promise<AuthToken> {
    const { data } = await api.post<AuthToken>("/auth/register", { email, password });
    return data;
  },

  async login(email: string, password: string): Promise<AuthToken> {
    const { data } = await api.post<AuthToken>("/auth/login", { email, password });
    return data;
  },

  saveSession(token: AuthToken) {
    localStorage.setItem("access_token", token.access_token);
    localStorage.setItem("user", JSON.stringify(token.user));
  },

  clearSession() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },
};

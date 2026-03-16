// features/auth/services/authService.ts
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import type { LoginPayload, RegisterPayload, UserProfile, AuthResponse } from "../types/auth.types";
import apiClient from "@/core/api/client";

// ─── Register ────────────────────────────────────────────────────────────────

export const registerService = async (payload: RegisterPayload): Promise<UserProfile> => {
  const respose = await apiClient.post<AuthResponse>('/auth/register', {
    email: payload.email,
    password: payload.password,
    username: payload.username,
    name: payload.name,
  })

  const {accessToken, refreshToken, user} = respose.data

  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)

  return user
  
};

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginService = async (payload: LoginPayload): Promise<UserProfile> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    email: payload.email,
    password: payload.password,
  })

  const {accessToken, refreshToken, user} = response.data

  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)

  return user
};

// ─── Logout ──────────────────────────────────────────────────────────────────

export const logoutService = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')

    if(refreshToken) {
      await apiClient.post('auth/logout', {refreshToken})
    }
  } finally {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
};

// ─── Get Current User ────────────────────────────────────────────────────────
// Ambil data user yang sedang login dari Express

export const getCurrentUserService = async (): Promise<UserProfile> => {
  const response = await apiClient.get<{user: UserProfile}>('/auth/me')

  return response.data.user
};

// ─── Initialize Auth ─────────────────────────────────────────────────────────
// Pengganti onAuthStateChanged — dipanggil sekali saat app pertama load
// Cek apakah ada token di localStorage, kalau ada ambil data user dari server

export const initializeAuth = async (): Promise<UserProfile | null> => { 
  const accessToken = localStorage.getItem('accessToken')

  if(!accessToken) return null

  try {
    const user = await getCurrentUserService()

    return user
  } catch {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return null
  }
};

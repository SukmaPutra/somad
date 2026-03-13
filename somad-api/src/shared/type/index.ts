import { Request } from "express";

// Extend Request Express supaya bisa simpan data user setelah auth
export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    username: string
  }
}

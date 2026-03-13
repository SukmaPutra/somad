import { Request, Response } from 'express'
import * as authService from './auth.service'
import { AuthRequest } from '../../shared/type/index'

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body)
    res.status(201).json({ message: 'Registrasi berhasil', user })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token diperlukan' })
      return
    }
    const result = await authService.refreshAccessToken(refreshToken)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) await authService.logoutUser(refreshToken)
    res.status(200).json({ message: 'Logout berhasil' })
  } catch {
    res.status(200).json({ message: 'Logout berhasil' })
  }
}

export const me = async (req: AuthRequest, res: Response) => {
  try {
    res.status(200).json({ user: req.user })
  } catch {
    res.status(500).json({ message: 'Terjadi kesalahan' })
  }
}
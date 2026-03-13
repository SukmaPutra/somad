import { Response, NextFunction } from 'express'
import { verifyAccessToken } from '../config/jwt'
import { AuthRequest } from '../shared/type/index'

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token tidak ditemukan' })
      return
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    req.user = payload  // simpan data user di request
    next()              // lanjut ke controller

  } catch {
    res.status(401).json({ message: 'Token tidak valid atau sudah expired' })
  }
}
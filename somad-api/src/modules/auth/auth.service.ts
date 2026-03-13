import bcrypt from 'bcryptjs'
import { prisma } from '../../config/database'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../config/jwt'

export const registerUser = async (data: {
  email: string
  username: string
  name: string
  password: string
}) => {
  // Cek email & username sudah dipakai
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }]
    }
  })

  if (existing) {
    if (existing.email === data.email) throw new Error('Email sudah terdaftar')
    throw new Error('Username sudah dipakai')
  }

  // Hash password — JANGAN simpan plain text
  const hashedPassword = await bcrypt.hash(data.password, 12)

  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
    select: {
      id: true, email: true, username: true, name: true
      // password sengaja tidak di-select
    }
  })

  return user
}

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } })

  if (!user) throw new Error('Email atau password salah')

  const isMatch = await bcrypt.compare(data.password, user.password)
  if (!isMatch) throw new Error('Email atau password salah')

  // Buat kedua token
  const payload = { id: user.id, email: user.email, username: user.username }
  const accessToken  = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  // Simpan refresh token ke DB
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt }
  })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, username: user.username, name: user.name }
  }
}

export const refreshAccessToken = async (token: string) => {
  // Verifikasi token valid secara cryptographic
  const payload = verifyRefreshToken(token)

  // Cek token ada di DB dan belum expired
  const stored = await prisma.refreshToken.findUnique({ where: { token } })
  if (!stored || stored.expiresAt < new Date()) {
    throw new Error('Refresh token tidak valid')
  }

  // Buat access token baru
  const accessToken = generateAccessToken({
    id: payload.id, email: payload.email, username: payload.username
  })

  return { accessToken }
}

export const logoutUser = async (token: string) => {
  // Hapus refresh token dari DB — token tidak bisa dipakai lagi
  await prisma.refreshToken.deleteMany({ where: { token } })
}
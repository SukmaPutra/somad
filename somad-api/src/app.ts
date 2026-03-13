import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRouter from './modules/auth/auth.route'

const app = express()

// Middleware global
app.use(helmet())                          // security headers
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(morgan('dev'))                     // logging setiap request
app.use(express.json())                    // parse JSON body
app.use(express.urlencoded({ extended: true }))

// Health check — untuk test apakah server jalan
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes akan ditambah di sini nanti
app.use('/api/auth', authRouter) 
// app.use('/api/posts', postRouter)

export default app
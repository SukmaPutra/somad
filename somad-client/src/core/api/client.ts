import axios from 'axios'

// ── INSTANCE UTAMA ─────────────────────────────────────────────
// Semua request ke Express API pakai instance ini
// Tidak perlu tulis baseURL berulang di setiap request
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,           // batalkan request kalau lebih dari 10 detik
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── REQUEST INTERCEPTOR ────────────────────────────────────────
// Berjalan otomatis SEBELUM setiap request dikirim
// Tugasnya: ambil token dari localStorage, tempel ke header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config   // wajib return config agar request lanjut
  },
  (error) => Promise.reject(error)
)

// ── RESPONSE INTERCEPTOR ───────────────────────────────────────
// Berjalan otomatis SETELAH setiap response diterima
// Tugasnya: kalau dapat 401 (token expired) → minta token baru otomatis
let isRefreshing = false    // flag — mencegah banyak refresh sekaligus
let failedQueue: Array<{    // antrian request yang gagal karena 401
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

// Proses semua request yang antri setelah token baru didapat
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,   // response normal → langsung return
  async (error) => {
    const originalRequest = error.config

    // Kalau bukan 401 atau request ini sudah pernah diretry → lempar error
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Kalau sedang refresh → masukkan ke antrian, tunggu token baru
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      })
    }

    // Mulai proses refresh
    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) throw new Error('No refresh token')

      // Minta access token baru
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
        { refreshToken }
      )

      const { accessToken } = response.data

      // Simpan token baru
      localStorage.setItem('accessToken', accessToken)

      // Update header dan proses antrian
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      processQueue(null, accessToken)

      // Ulangi request yang gagal tadi
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)

    } catch (refreshError) {
      // Refresh gagal → paksa logout
      processQueue(refreshError, null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default apiClient
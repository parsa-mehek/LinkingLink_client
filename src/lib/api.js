import axios from 'axios'

/**
 * Centralized Axios service for LinkingLink frontend
 * - Base URL: http://127.0.0.1:5000/api
 * - Automatically includes JWT from localStorage in Authorization header
 * - Normalizes API errors and exposes generic GET/POST/PUT/DELETE helpers
 *
 * Usage:
 *   import { get, post, put, del, saveToken, clearToken } from '../lib/api'
 *   const { data, error } = await get('/auth/me')
 *   const { data, error } = await post('/auth/login', { userId, password })
 */

const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL)
  || (import.meta?.env?.REACT_APP_API_URL)
  || 'http://localhost:5000/api'

// Base API client
const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true })

// Local storage token helpers
export const TOKEN_KEY = 'll_jwt'
export const saveToken = (token) => { try { localStorage.setItem(TOKEN_KEY, token) } catch {} }
export const loadToken = () => { try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' } }
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY) } catch {} }

// Attach JWT automatically for every request
api.interceptors.request.use((config) => {
  const token = loadToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize API errors for consistent UI handling
export const toApiError = (err) => {
  const status = err?.response?.status
  const message = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Request failed'
  return { status, message, data: err?.response?.data }
}

// Wrapper to surface { data, error } without throwing in components
export const request = async (promise) => {
  try {
    const res = await promise
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: toApiError(err) }
  }
}

// Generic helpers used across the app
export const get = (url, config) => request(api.get(url, config))
export const post = (url, body, config) => request(api.post(url, body, config))
export const put = (url, body, config) => request(api.put(url, body, config))
export const del = (url, config) => request(api.delete(url, config))

// Optional: keep convenient auth helpers for existing pages
export const Auth = {
  register: (payload) => post('/auth/register', payload),
  login: (userId, password) => post('/auth/login', { userId, password }),
  me: () => get('/auth/me'),
  logout: () => post('/auth/logout'),
}

export default api

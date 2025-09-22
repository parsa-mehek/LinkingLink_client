import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth, saveToken, toApiError } from '../lib/api'

// Login page
// - Submits to POST /auth/login with { userId, password }
// - Stores JWT in localStorage and redirects to Home on success
// - Shows error messages on failure
export default function Login(){
  const [userId, setUserId] = useState('demo_user')
  const [password, setPassword] = useState('Passw0rd!demo')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setBusy(true)
    try {
      // API call via centralized client
      // Backend expects { userId, password }
      const { data, error } = await Auth.login(userId, password)
      if (error) throw new Error(error.message)
      const token = data?.accessToken || data?.token
      if (!token) throw new Error('No token in response')
      saveToken(token)
      setMsg('Logged in! Redirecting...')
      setTimeout(() => navigate('/'), 700)
    } catch (err) {
      const e = toApiError(err)
      setMsg(e.status === 401 ? 'Invalid credentials.' : `Login failed: ${e.message}`)
      console.error('Login error', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-brand-mint to-brand-teal flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-soft border-2 border-brand-indigo p-6">
        <div className="text-brand-navy font-bold text-xl mb-1">Login</div>
        <p className="text-slate-600 mb-4">Enter your credentials.</p>

  <label className="block font-semibold text-slate-800 mb-1">User ID</label>
  <input value={userId} onChange={e=>setUserId(e.target.value)} placeholder="demo_user" className="w-full rounded-2xl border border-brand-indigo/70 px-4 py-3 outline-none focus:ring-4 focus:ring-brand-indigo/20 mb-3" />

        <label className="block font-semibold text-slate-800 mb-1">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-brand-indigo/70 px-4 py-3 outline-none focus:ring-4 focus:ring-brand-indigo/20" />

        <button disabled={busy} className="mt-4 w-full rounded-2xl bg-brand-navy text-white font-semibold py-3 transition hover:bg-brand-indigo disabled:opacity-60">{busy ? 'Please wait...' : 'Login'}</button>
        {msg && <div className="text-sm text-slate-700 mt-3 text-center">{msg}</div>}
      </form>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth, toApiError, saveToken } from '../lib/api'

// Register page
// - Validates non-empty fields and matching passwords
// - Submits to POST /auth/register with { name, email, password, userId }
// - Shows success/error messages and redirects to /login on success
export default function Register(){
  const suffix = Math.random().toString(36).slice(2,7)
  const [name, setName] = useState('Demo User')
  const [userId, setUserId] = useState(`demo_${suffix}`)
  const [email, setEmail] = useState(`${suffix}@example.com`)
  const [password, setPassword] = useState('Passw0rd!demo')
  const [confirm, setConfirm] = useState('Passw0rd!demo')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')

    // Client-side validation
    if (!name || !userId || !email || !password || !confirm) {
      setMsg('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setMsg('Passwords do not match.')
      return
    }

    setBusy(true)
    try {
      // API call via centralized client
      // Backend expects { name, email, password, userId }
  const { data, error } = await Auth.register({ name, email, password, userId })
      if (error) throw new Error(error.message)
  const token = data?.accessToken || data?.token
  if (token) saveToken(token)
  setMsg('Registration successful. Redirecting...')
  setTimeout(() => navigate('/'), 700)
    } catch (err) {
  const e = toApiError(err)
  setMsg(e.status === 409 ? 'UserId or email already exists.' : `Registration failed: ${e.message}`)
  console.error('Register error', err?.response?.data || err?.message || err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-brand-mint to-brand-teal flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-soft border-2 border-brand-indigo p-6">
        <div className="text-brand-navy font-bold text-xl mb-1">Create Account</div>
        <p className="text-slate-600 mb-4">Join LinkingLink to connect and collaborate.</p>

  <label className="block font-semibold text-slate-800 mb-1">Full name</label>
  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Demo User" className="w-full rounded-2xl border border-brand-indigo/70 px-4 py-3 outline-none focus:ring-4 focus:ring-brand-indigo/20 mb-3" />

  <label className="block font-semibold text-slate-800 mb-1">User ID</label>
  <input value={userId} onChange={e=>setUserId(e.target.value)} placeholder="demo_user" className="w-full rounded-2xl border border-brand-indigo/70 px-4 py-3 outline-none focus:ring-4 focus:ring-brand-indigo/20 mb-3" />

        <label className="block font-semibold text-slate-800 mb-1">Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-brand-indigo/70 px-4 py-3 outline-none focus:ring-4 focus:ring-brand-indigo/20 mb-3" />

        <label className="block font-semibold text-slate-800 mb-1">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-brand-indigo/70 px-4 py-3 outline-none focus:ring-4 focus:ring-brand-indigo/20 mb-3" />

        <label className="block font-semibold text-slate-800 mb-1">Confirm Password</label>
        <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-brand-indigo/70 px-4 py-3 outline-none focus:ring-4 focus:ring-brand-indigo/20" />

        <button disabled={busy} className="mt-4 w-full rounded-2xl bg-brand-navy text-white font-semibold py-3 transition hover:bg-brand-indigo disabled:opacity-60">{busy ? 'Please wait...' : 'Register'}</button>
        {msg && <div className="text-sm text-slate-700 mt-3 text-center">{msg}</div>}
      </form>
    </div>
  )
}

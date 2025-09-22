import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { loadToken, clearToken } from '../lib/api'

// Home page with a small Profile widget
// - On mount, loads JWT from localStorage and sets Authorization header
// - Calls GET /api/auth/me to load the logged-in user info
// - Shows username/userId and a Logout button
export default function Home(){
  const [profile, setProfile] = useState(null)
  const [msg, setMsg] = useState('Loading profile...')
  const navigate = useNavigate()

  useEffect(() => {
    const token = loadToken()
    if (!token) {
      setMsg('Not logged in. Redirecting to Login...')
      const t = setTimeout(() => navigate('/login'), 900)
      return () => clearTimeout(t)
    }
    // Fetch profile
    ;(async () => {
      try {
        // API contract: { user: {...} }
        const res = await api.get('/auth/me')
        const data = res?.data
        const user = data?.user || data
        setProfile(user)
        setMsg('')
      } catch (err) {
        console.error('Profile error', err)
        setMsg('Session expired or invalid token. Redirecting to Login...')
        clearToken()
        setTimeout(() => navigate('/login'), 900)
      }
    })()
  }, [navigate])

  const onLogout = () => {
    clearToken()
    navigate('/login')
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Home</h1>

      {/* Profile widget */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-200 p-5 max-w-xl">
        <div className="font-semibold text-brand-navy mb-2">Profile</div>
        {msg && <div className="text-slate-600 mb-2">{msg}</div>}
        {profile && (
          <div className="space-y-1">
            <div className="text-slate-800">Username: <span className="font-semibold">{profile.username || profile.userId || profile.name}</span></div>
            {profile.email && <div className="text-slate-800">Email: <span className="font-semibold">{profile.email}</span></div>}
            <button onClick={onLogout} className="mt-3 rounded-xl bg-brand-indigo text-white px-4 py-2 hover:bg-brand-navy">Logout</button>
          </div>
        )}
      </div>
    </div>
  )
}

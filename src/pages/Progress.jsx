import { useEffect, useMemo, useState } from 'react'
import { Auth, get, post } from '../lib/api'
// Recharts imports; the package will be added to dependencies
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Progress(){
  const [subject, setSubject] = useState('General')
  const [minutes, setMinutes] = useState(30)
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = async () => {
    setLoading(true); setError('');
    const { data, error } = await get('/progress')
    if (error) { setError(error.message || 'Failed to load'); setLoading(false); return }
    setItems(data.items || []); setLoading(false)
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('')
    const minutesStudied = Number(minutes)
    if (!subject || !minutesStudied || minutesStudied <= 0) { setError('Subject and positive minutes are required'); return }
    const { data, error } = await post('/progress', { subject, minutesStudied, notes: notes || undefined })
    if (error) { setError(error.message || 'Failed to add'); return }
    setSuccess('Entry added'); setNotes(''); setMinutes(30)
    setItems(prev => [...prev, data.entry])
  }

  const chartData = useMemo(() => {
    return (items || []).map(x => ({
      date: new Date(x.date || x.createdAt).toLocaleDateString(),
      minutes: x.minutesStudied,
      subject: x.subject,
    }))
  }, [items])

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Progress Tracking</h1>

      <form onSubmit={onSubmit} className="bg-white rounded-xl border p-4 shadow-soft mb-6 grid gap-3 md:grid-cols-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input value={subject} onChange={e=>setSubject(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="e.g., Math" />
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Minutes</label>
          <input type="number" min={1} value={minutes} onChange={e=>setMinutes(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <input value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Optional notes" />
        </div>
        <div className="md:col-span-4 flex gap-3 items-center">
          <button className="bg-brand-navy text-white px-4 py-2 rounded hover:opacity-90" disabled={loading}>Add Entry</button>
          {loading && <span className="text-slate-500">Loading…</span>}
          {error && <span className="text-red-600">{error}</span>}
          {success && <span className="text-green-600">{success}</span>}
        </div>
      </form>

      <div className="bg-white rounded-xl border p-4 shadow-soft mb-6">
        <h2 className="font-semibold mb-3">Entries</h2>
        {items.length === 0 ? (
          <div className="text-slate-500">No entries yet.</div>
        ) : (
          <ul className="divide-y">
            {items.map(it => (
              <li key={it.id} className="py-2 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{it.subject}</div>
                  <div className="text-sm text-slate-600">{it.notes || '—'}</div>
                </div>
                <div className="text-sm text-slate-700">
                  <span className="font-semibold mr-2">{it.minutesStudied} min</span>
                  <span>{new Date(it.date || it.createdAt).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-xl border p-4 shadow-soft h-80">
        <h2 className="font-semibold mb-3">Study Minutes Over Time</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="minutes" stroke="#1d4ed8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

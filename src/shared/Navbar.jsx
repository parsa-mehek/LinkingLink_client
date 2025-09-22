import { Link, NavLink } from 'react-router-dom'

export default function Navbar(){
  const linkCls = ({ isActive }) => `px-3 py-2 rounded-xl hover:bg-slate-100 ${isActive ? 'font-semibold text-brand-navy' : 'text-slate-700'}`
  return (
    <nav className="w-full sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 shadow-soft">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-bold text-brand-navy">LinkingLink</Link>
        <div className="flex-1" />
        <NavLink to="/" className={linkCls}>Home</NavLink>
        <NavLink to="/login" className={linkCls}>Login</NavLink>
        <NavLink to="/register" className={linkCls}>Register</NavLink>
        <NavLink to="/progress" className={linkCls}>Progress</NavLink>
      </div>
    </nav>
  )
}

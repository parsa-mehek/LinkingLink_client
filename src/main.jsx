import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Navbar from './shared/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Progress from './pages/Progress.jsx'

function Layout({ children }){
  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] text-[#0f172a]">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

const router = createBrowserRouter([
  { path: '/', element: (<Layout><Home /></Layout>) },
  { path: '/login', element: (<Layout><Login /></Layout>) },
  { path: '/register', element: (<Layout><Register /></Layout>) },
  { path: '/progress', element: (<Layout><Progress /></Layout>) },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

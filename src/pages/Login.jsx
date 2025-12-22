import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {userData, setToken, isAuthenticated } from '../utilities/auth'

const API_URL = import.meta.env.VITE_API_BASE_URL

export default function Login() {
  const navigate = useNavigate()
  // Always redirect to /home after login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')



  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email, user_password: password }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Login failed: ${res.status}`)
      }
      const data = await res.json()
      const token = data?.token || data?.access_token || ''
      if (!token) throw new Error('Invalid login response')
      userData(data?.user);
      setToken(token);
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[url('/login_bg.png')] bg-no-repeat bg-center bg-cover ">
     <div className='bg-[#31221261] min-h-screen grid place-items-center p-4'>
      <form onSubmit={handleSubmit} className="w-full relative pb-20 max-w-[300px] max-h-[80vh] shadow-2xl rounded p-6 pb-2 space-y-4">
        <img src="/card-bg.png" className='absolute rounded-md inset-0 h-full w-full  z-0' alt="" />
          {/* Content (TOP) */}
  <div className="relative z-10 space-y-4">
    <img src="/icon.png" className="h-20 w-20 mx-auto" alt="icon" />
    {error && <div className="text-red-400 text-sm">{error}</div>}
    <div className="flex flex-col gap-1">
      <label className="text-sm text-white font-medium">Email</label>
      <input
        type="email"
        className="w-full bg-white rounded px-3 py-[5px] outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm text-white font-medium">Password</label>
      <input
        type="password"
        className="w-full bg-white rounded px-3 py-[5px] outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <button
      type="submit"
      className="w-full bg-[#1e5392] mt-4 font-medium text-sm text-white rounded py-2 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'LOGGING IN…' : 'LOG IN'}
    </button>
   </div>
      </form>
    </div>
    <img src="/man.png" className='absolute bottom-0 left-5 opacity-60' width="10%" alt="" />
    <img src="/nespaklogo.png" width="20%"  className='absolute bottom-5 right-5' alt="" />
     </div>
  )
}
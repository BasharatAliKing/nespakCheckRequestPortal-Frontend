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

const [showPassword, setShowPassword] = useState(false)

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
    <div className="flex mx-auto ml-5 w-full gap-2">
    <img src="/icon.png" className="h-20 w-20 mx-auto" alt="icon" />
    <h1 className='text-lg leading-tight text-white font-bold'><span className='text-2xl'>NESPAK</span> <br /> Check Request Portal</h1>
    </div>
    {error && <div className="text-red-400 text-sm">{error}</div>}
    <div className="flex flex-col gap-1">
      <label className="text-sm text-white font-medium">Email</label>
      <input
        type="email"
        className="w-full bg-white rounded px-3 py-[5px] outline-none focus:ring-2 focus:ring-[#1e5392]"
        value={email}
        name='email'
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
 <div className="flex flex-col gap-1">
  <label className="text-sm text-white font-medium">Password</label>

  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      className="w-full bg-white rounded px-3 pr-10 py-[5px] outline-none focus:ring-2 focus:ring-[#1e5392]"
      value={password}
      name='password'
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    {/* Eye Icon */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1e5392]"
    >
      {showPassword ? (
        /* Eye Off */
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.658.402-3.222 1.125-4.6M6.1 6.1A9.955 9.955 0 0112 5c5.523 0 10 4.477 10 10 0 1.657-.402 3.221-1.124 4.6M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) : (
        /* Eye */
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  </div>
</div>
    <button
      type="submit"
      className="w-full bg-[#1e5392] mt-4 font-medium cursor-pointer text-sm text-white rounded py-2 disabled:opacity-50"
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


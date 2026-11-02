import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const redirectTo = location.state?.from || '/app/dashboard'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const value = identifier.trim()
    if (!value || !password) {
      setError('Enter your email address or phone number and password.')
      return
    }
    setLoading(true)
    try {
      const result = await login({ identifier: value, password })
      if (!result.ok) {
        setError(result.error || 'Login failed. Check your credentials and try again.')
        return
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Unable to log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen ambient-bg font-body text-slate">
      <PublicHeader />
      <main className="mx-auto flex max-w-[500px] flex-col px-4 pb-20 pt-12 sm:px-6 sm:pt-14">
        <div className="mb-6 border-b border-[#263653] pb-5 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-gold sm:justify-start"><span className="inline-block h-px w-[24px] bg-gold" />Security &amp; Identity Portal</div>
          <h1 className="mt-2.5 font-display text-[2.1rem] font-bold tracking-tight text-white">Log in to Edu<span className="text-gold">Sentry</span></h1>
          <p className="mt-1.5 text-[0.88rem] leading-relaxed text-slate-300">Use your registered email address or phone number with your password.</p>
        </div>
        {location.state?.message && <div className="mb-5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 p-4 text-[0.86rem] text-emerald-300">✓ {location.state.message}</div>}
        <div className="rounded-2xl border border-[#263653] bg-[#0e1626]/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="login-identifier" className="text-[0.86rem] font-medium text-white">Email address or phone number <span className="text-gold">*</span></label>
              <input id="login-identifier" name="identifier" autoComplete="username" value={identifier} onChange={e => setIdentifier(e.target.value)} required placeholder="name@gmail.com or +91 98765 43210" className="h-[50px] w-full rounded-xl border border-[#263653] bg-[#162238] px-4 text-[0.92rem] text-white placeholder:text-slate-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3"><label htmlFor="login-password" className="text-[0.86rem] font-medium text-white">Password <span className="text-gold">*</span></label><Link to="/forgot-password" className="text-[0.78rem] font-semibold text-gold hover:underline">Forgot password?</Link></div>
              <input id="login-password" name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className="h-[50px] w-full rounded-xl border border-[#263653] bg-[#162238] px-4 text-[0.92rem] text-white placeholder:text-slate-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" />
            </div>
            {error && <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-[0.84rem] leading-relaxed text-red-300">{error}</div>}
            <button type="submit" disabled={loading} className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 text-[0.92rem] font-bold text-[#111827] transition hover:bg-[#f4c12e] disabled:cursor-wait disabled:opacity-60">{loading ? 'Signing in…' : 'Log In →'}</button>
          </form>
          <p className="mt-6 text-center text-[0.86rem] text-slate-300">New to EduSentry? <Link to="/register" className="font-semibold text-gold hover:underline">Create an account</Link></p>
          <p className="mt-3 text-center text-[0.72rem] leading-relaxed text-slate-500">Password recovery is available only through verification sent to your registered email address.</p>
        </div>
      </main>
    </div>
  )
}

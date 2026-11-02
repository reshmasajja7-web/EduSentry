import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader.jsx'
import Btn from '../components/Btn.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const email = form.email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailPattern.test(email)) {
      setError('Enter a valid email address, for example name@gmail.com.')
      return
    }
    const passwordRules = [
      [form.password.length >= 8, 'at least 8 characters'],
      [/[A-Z]/.test(form.password), 'an uppercase letter'],
      [/[a-z]/.test(form.password), 'a lowercase letter'],
      [/[0-9]/.test(form.password), 'a number'],
      [/[^A-Za-z0-9]/.test(form.password), 'a special character'],
    ]
    const missingRule = passwordRules.find(([valid]) => !valid)
    if (missingRule) {
      setError(`Password must contain ${missingRule[1]}.`)
      return
    }
    const phone = (form.phone || '').trim()
    if (phone) {
      const digits = phone.replace(/\D/g, '')
      const validIndian = /^(?:\+?91|0)?[6-9]\d{9}$/.test(phone.replace(/[\s()-]/g, '')) ||
        (/^\+?91/.test(phone.replace(/[\s()-]/g, '')) && digits.length === 12 && /^[6-9]\d{9}$/.test(digits.slice(-10)))
      if (!validIndian) {
        setError('Enter a valid Indian mobile number, for example +91 98765 43210.')
        return
      }
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const result = await register(form)
      if (!result.ok) {
        setError(result.error || 'Registration failed. Please try again.')
        return
      }
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen ambient-bg font-body text-slate">
      <PublicHeader />
      <div className="mx-auto flex max-w-[440px] flex-col px-6 pb-20 pt-20 sm:pt-14">
        <div className="mb-8 border-b border-line pb-6">
          <div className="flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold">
            <span className="inline-block h-px w-[20px] bg-gold" />
            Get started
          </div>
          <h1 className="mt-3 font-display text-[1.9rem] font-semibold tracking-tight text-gold">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="block">
            <span className="mb-1.5 block text-[0.86rem] font-medium text-white">Full name</span>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-[0.92rem] text-ink focus:border-navy focus:outline-none"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.86rem] font-medium text-white">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-[0.92rem] text-ink focus:border-navy focus:outline-none"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-[0.86rem] font-medium text-white">
              <span>Phone number <span className="text-gold">*</span></span>
            </span>
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              value={form.phone || ''}
              onChange={handleChange}
              className="w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-[0.92rem] text-ink focus:border-navy focus:outline-none"
              placeholder="+91 98765 43210"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.86rem] font-medium text-white">Password</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-[0.92rem] text-ink focus:border-navy focus:outline-none"
              placeholder="8+ chars, uppercase, lowercase, number & symbol"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.86rem] font-medium text-white">Confirm password</span>
            <input
              type="password"
              name="confirm"
              required
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              className="w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-[0.92rem] text-ink focus:border-navy focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-sm border border-rust bg-rustTint px-3.5 py-2.5 text-[0.85rem] text-rust">{error}</p>
          )}

          <Btn type="submit" disabled={loading} className="mt-1 w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </Btn>
        </form>

        <p className="mt-6 text-center text-[0.88rem] text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

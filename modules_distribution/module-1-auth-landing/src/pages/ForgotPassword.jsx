import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader.jsx'
import Btn from '../components/Btn.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ForgotPassword() {
  const {
    requestPasswordReset,
    verifyPasswordOtp,
    resetPassword,
  } = useAuth()

  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    email: '',
    otp: '',
    resetToken: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [emailDelivered, setEmailDelivered] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'otp') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 6)
      setForm((prev) => ({
        ...prev,
        otp: digitsOnly,
      }))
      setError('')
      return
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  async function sendCode(e) {
    if (e) e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const cleanEmail = form.email.trim().toLowerCase()
      const result = await requestPasswordReset(cleanEmail)

      if (result?.ok === false) {
        setError(result.error || 'Failed to send verification code.')
        return
      }

      setStep(2)
      setResendCooldown(45)
      setEmailDelivered(Boolean(result?.emailDelivered))

      setSuccess(
        'A 6-digit verification code has been dispatched. Please check your inbox and enter the code below.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function verifyCode(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const cleanOtp = form.otp.trim()
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.')
      return
    }

    setLoading(true)

    try {
      const result = await verifyPasswordOtp({
        email: form.email.trim().toLowerCase(),
        otp: cleanOtp,
      })

      if (result?.ok === false) {
        setError(result.error || 'Incorrect verification code. Please check and try again.')
        return
      }

      if (!result?.resetToken) {
        setError('Verification failed. Please request a fresh code.')
        return
      }

      setForm((prev) => ({
        ...prev,
        resetToken: result.resetToken,
      }))

      setStep(3)
      setSuccess('Code verified successfully. Now choose your new password.')
    } finally {
      setLoading(false)
    }
  }

  async function changePassword(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (
      form.newPassword.length < 8 ||
      !/[A-Z]/.test(form.newPassword) ||
      !/[a-z]/.test(form.newPassword) ||
      !/[0-9]/.test(form.newPassword) ||
      !/[^A-Za-z0-9]/.test(form.newPassword)
    ) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match. Please verify both fields.')
      return
    }

    setLoading(true)

    try {
      const result = await resetPassword({
        resetToken: form.resetToken,
        newPassword: form.newPassword,
      })

      if (!result.ok) {
        setError(result.error || 'Failed to update password.')
        return
      }

      setSuccess('Your password has been reset successfully! Redirecting to login...')

      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Password updated successfully! Please log in with your new credentials.' },
        })
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen ambient-bg font-body text-slate flex flex-col">
      <PublicHeader />

      <main className="mx-auto flex max-w-[480px] w-full flex-col px-6 pb-20 pt-16 sm:pt-12">
        {/* Header & Category Tracker */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-gold">
            <span>🛡️ Account Recovery</span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
            Reset Password
          </h1>

          <p className="mt-2 text-[0.88rem] leading-relaxed text-slate-300">
            Verify your account identity with a 6-digit code to securely regain access.
          </p>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="mb-8 grid grid-cols-3 gap-2 font-mono text-[0.72rem]">
          <div
            className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-center transition-all ${
              step >= 1
                ? 'border-gold bg-gold/15 font-semibold text-gold'
                : 'border-[#263653] bg-[#111a2b]/60 text-slate-400'
            }`}
          >
            <span>1.</span>
            <span>Email</span>
          </div>

          <div
            className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-center transition-all ${
              step >= 2
                ? 'border-gold bg-gold/15 font-semibold text-gold'
                : 'border-[#263653] bg-[#111a2b]/60 text-slate-400'
            }`}
          >
            <span>2.</span>
            <span>Verify</span>
          </div>

          <div
            className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-center transition-all ${
              step >= 3
                ? 'border-gold bg-gold/15 font-semibold text-gold'
                : 'border-[#263653] bg-[#111a2b]/60 text-slate-400'
            }`}
          >
            <span>3.</span>
            <span>Password</span>
          </div>
        </div>

        {/* Main Interactive Recovery Card */}
        <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
          {/* Global Alert Banners */}
          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/50 bg-rose-500/10 p-3.5 text-[0.85rem] leading-relaxed text-rose-300">
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && step !== 3 && (
            <div className="mb-5 rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-3.5 text-[0.85rem] leading-relaxed text-emerald-300">
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">✓</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 1: EMAIL ADDRESS INPUT                                   */}
          {/* ============================================================ */}
          {step === 1 && (
            <form onSubmit={sendCode} className="grid gap-5">
              <div>
                <label className="mb-1.5 block font-mono text-[0.74rem] uppercase tracking-wider text-slate-300 font-semibold">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    autoFocus
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-4 py-3 text-[0.92rem] text-white placeholder:text-slate-500 outline-none transition-colors focus:border-gold"
                    placeholder="student@university.edu"
                  />
                </div>
                <p className="mt-1.5 text-[0.76rem] text-slate-400">
                  Enter the email associated with your EduSentry student account.
                </p>
              </div>

              <Btn
                type="submit"
                disabled={loading || !form.email}
                className="w-full mt-2"
              >
                {loading ? 'Generating verification code...' : 'Send Verification Code →'}
              </Btn>
            </form>
          )}

          {/* ============================================================ */}
          {/* STEP 2: VERIFICATION CODE ENTRY                              */}
          {/* ============================================================ */}
          {step === 2 && (
            <form onSubmit={verifyCode} className="grid gap-5">
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
                <div className="flex items-center justify-center gap-2 font-mono text-xs font-semibold text-emerald-300">
                  <span>✉️</span> Verification Email Dispatched
                </div>
                <p className="mt-1.5 text-[0.84rem] leading-relaxed text-slate-300">
                  A 6-digit verification code has been dispatched for{' '}
                  <strong className="text-white">{form.email}</strong>. Please check your inbox and enter the code below.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[0.74rem] uppercase tracking-wider text-slate-300 font-semibold">
                    6-Digit Verification Code
                  </label>
                  {form.otp.length === 6 && (
                    <span className="font-mono text-[0.72rem] text-emerald-400">
                      ✓ 6 digits entered
                    </span>
                  )}
                </div>

                <input
                  name="otp"
                  required
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={form.otp}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.35em] text-white placeholder:text-slate-600 outline-none transition-colors focus:border-gold"
                  placeholder="000000"
                />
                <p className="mt-1.5 text-center text-[0.74rem] text-slate-400">
                  The code is valid for 15 minutes.
                </p>
              </div>

              <Btn
                type="submit"
                disabled={loading || form.otp.length !== 6}
                className="w-full"
              >
                {loading ? 'Verifying code...' : 'Verify Code & Proceed →'}
              </Btn>

              <div className="flex items-center justify-between pt-1 font-mono text-[0.78rem]">
                <button
                  type="button"
                  onClick={() => sendCode()}
                  disabled={loading || resendCooldown > 0}
                  className="text-gold hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  {resendCooldown > 0
                    ? `Resend code (${resendCooldown}s)`
                    : '↻ Resend code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setForm((prev) => ({ ...prev, otp: '', resetToken: '' }))
                    setError('')
                    setSuccess('')
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  ← Change email
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* STEP 3: CHOOSE NEW PASSWORD                                  */}
          {/* ============================================================ */}
          {step === 3 && (
            <form onSubmit={changePassword} className="grid gap-5">
              {success && (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/15 p-4 text-center text-[0.88rem] font-medium text-emerald-300">
                  <div className="text-2xl mb-1">🎉</div>
                  <div>{success}</div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block font-mono text-[0.74rem] uppercase tracking-wider text-slate-300 font-semibold">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    required
                    autoFocus
                    minLength={6}
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-4 py-3 pr-11 text-[0.92rem] text-white placeholder:text-slate-500 outline-none transition-colors focus:border-gold"
                    placeholder="8+ characters with uppercase, lowercase, number and symbol"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[0.74rem] uppercase tracking-wider text-slate-300 font-semibold">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-4 py-3 pr-11 text-[0.92rem] text-white placeholder:text-slate-500 outline-none transition-colors focus:border-gold"
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Password checks */}
              <div className="space-y-1 rounded-lg bg-[#111a2b]/60 p-3 font-mono text-[0.72rem]">
                {[
                  [form.newPassword.length >= 8, 'At least 8 characters'],
                  [/[A-Z]/.test(form.newPassword), 'One uppercase letter'],
                  [/[a-z]/.test(form.newPassword), 'One lowercase letter'],
                  [/[0-9]/.test(form.newPassword), 'One number'],
                  [/[^A-Za-z0-9]/.test(form.newPassword), 'One special character'],
                  [Boolean(form.newPassword) && form.newPassword === form.confirmPassword, 'Passwords match'],
                ].map(([valid, label]) => (
                  <div key={label} className={`flex items-center gap-1.5 ${valid ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <span>{valid ? '✓' : '○'}</span><span>{label}</span>
                  </div>
                ))}
              </div>

              <Btn
                type="submit"
                disabled={
                  loading ||
                  form.newPassword.length < 8 ||
                  !/[A-Z]/.test(form.newPassword) ||
                  !/[a-z]/.test(form.newPassword) ||
                  !/[0-9]/.test(form.newPassword) ||
                  !/[^A-Za-z0-9]/.test(form.newPassword) ||
                  form.newPassword !== form.confirmPassword
                }
                className="w-full mt-2"
              >
                {loading ? 'Saving new password...' : 'Save New Password & Log In'}
              </Btn>
            </form>
          )}
        </div>

        {/* Back to Login Footer */}
        <p className="mt-8 text-center text-[0.88rem] text-slate-400">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-gold hover:underline"
          >
            Back to Log In
          </Link>
        </p>
      </main>
    </div>
  )
}

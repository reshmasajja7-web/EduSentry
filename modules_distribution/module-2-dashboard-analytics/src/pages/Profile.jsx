import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ModuleHeader from '../components/ModuleHeader.jsx'
import Block from '../components/Block.jsx'
import Btn from '../components/Btn.jsx'

import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { clearActivityLog } from '../lib/activityLog.js'
import { api } from '../lib/api.js'

export default function Profile() {
  const {
    user,
    updateProfile,
    changePassword,
    deleteAccount,
  } = useAuth()

  const navigate = useNavigate()
  const { themeMode, setThemeMode, resolvedTheme, themeOptions } = useTheme()

  // --------------------------------------------------
  // PROFILE STATE
  // --------------------------------------------------
  const [name, setName] = useState(user?.name || '')
  const [course, setCourse] = useState(user?.course || '')
  const [saved, setSaved] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    setName(user?.name || '')
    setCourse(user?.course || '')
  }, [user])

  // --------------------------------------------------
  // CHANGE PASSWORD STATE
  // --------------------------------------------------
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // --------------------------------------------------
  // DATA MANAGEMENT STATE
  // --------------------------------------------------
  const [historyCleared, setHistoryCleared] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)

  // Save personal details
  async function handleSubmit(e) {
    e.preventDefault()
    setProfileError('')
    setSaved(false)
    setSavingProfile(true)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setProfileError('Name cannot be blank.')
      setSavingProfile(false)
      return
    }

    try {
      const result = await updateProfile({
        name: trimmedName,
        course: course.trim(),
      })

      if (!result?.ok) {
        setProfileError(result?.error || 'Could not update profile.')
        return
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setProfileError(err.message || 'An error occurred.')
    } finally {
      setSavingProfile(false)
    }
  }

  // Change password
  async function handleChangePassword(e) {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)

    if (!currentPassword) {
      setPwError('Please enter your current password.')
      return
    }

    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      setPwError('New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }

    setChangingPassword(true)

    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
      })

      if (!result?.ok) {
        setPwError(result?.error || 'Could not update password.')
        return
      }

      setPwSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPwSuccess(false), 4000)
    } catch (err) {
      setPwError(err.message || 'Failed to update password.')
    } finally {
      setChangingPassword(false)
    }
  }

  // Export data
  async function handleExportData() {
    try {
      const profileData = await api.auth.profile().catch(() => ({ profile: {} }))
      const payload = {
        exportedAt: new Date().toISOString(),
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
          course: user?.course,
        },
        profile: profileData?.profile || {},
      }

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `edusentry-student-data-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Data export failed:', error)
    }
  }

  // Clear learning history
  async function handleClearHistory() {
    if (!window.confirm('Are you sure you want to clear your learning history log?')) {
      return
    }

    try {
      await api.activity.deleteAll().catch(() => {})
      clearActivityLog()
      setHistoryCleared(true)
      setTimeout(() => setHistoryCleared(false), 3000)
    } catch (error) {
      console.error('Could not clear history:', error)
    }
  }

  // Delete account
  async function handleDeleteAccount(e) {
    e.preventDefault()
    setDeleteError('')

    if (deleteConfirmText.trim().toLowerCase() !== (user?.email || '').toLowerCase()) {
      setDeleteError(`Please type your exact email address (${user?.email}) to confirm.`)
      return
    }

    if (!window.confirm('Final warning: This will permanently delete your EduSentry account and cannot be undone. Continue?')) {
      return
    }

    setDeletingAccount(true)

    try {
      await deleteAccount()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account.')
      setDeletingAccount(false)
    }
  }

  const initials = (user?.name || 'Student')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-6 pb-16 sm:px-6 sm:pt-8">
      <ModuleHeader
        kicker="Student Account"
        title="Profile & Settings"
        description="Manage your student credentials, academic enrollment details, and security preferences."
      />

      {/* User Identity Hero Card */}
      <div className="mt-8 mb-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-[#263653] bg-[#0e1626] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold font-display text-2xl font-bold text-[#0b1020] shadow-md">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-white">
                {user?.name || 'Student User'}
              </h2>
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-gold">
                {user?.role || 'Student'}
              </span>
            </div>
            <p className="mt-1 font-mono text-[0.84rem] text-slate-300">
              {user?.email}
            </p>
            {user?.course && (
              <p className="mt-0.5 text-[0.82rem] text-slate-400">
                Enrolled: <span className="text-white font-medium">{user.course}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#1c2a44] bg-[#111a2b] px-4 py-2 text-right">
            <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-muted">Account Status</span>
            <span className="font-mono text-[0.82rem] font-semibold text-emerald-400">● Active & Guarded</span>
          </div>
        </div>
      </div>

      {/* BLOCK 01: PERSONAL & ACADEMIC INFORMATION */}
      <Block
        idx="01"
        title="Personal & Academic Information"
        hint="Update your primary student identity and program enrollment."
      >
        <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-6 sm:p-7 shadow-md">
          <form onSubmit={handleSubmit} className="grid max-w-xl gap-5">
            <div>
              <label className="mb-1.5 block text-[0.84rem] font-medium text-slate-200">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-4 py-2.5 text-[0.92rem] text-white outline-none transition-colors focus:border-gold"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[0.84rem] font-medium text-slate-200">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-[#1c2a44] bg-[#0b1020] px-4 py-2.5 text-[0.92rem] text-slate-400"
              />
              <span className="mt-1 block font-mono text-[0.7rem] text-slate-500">
                Email address is tied to your primary institutional login.
              </span>
            </div>

            <div>
              <label className="mb-1.5 block text-[0.84rem] font-medium text-slate-200">
                Course / Degree Major
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-4 py-2.5 text-[0.92rem] text-white placeholder:text-slate-500 outline-none transition-colors focus:border-gold"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="rounded-xl border border-gold bg-gold px-5 py-2.5 text-[0.88rem] font-semibold text-[#0b1020] transition-colors hover:bg-[#f4c12e] disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>

              {saved && (
                <span className="font-mono text-[0.84rem] font-semibold text-emerald-400">
                  ✓ Profile updated successfully.
                </span>
              )}

              {profileError && (
                <span className="font-mono text-[0.84rem] text-rust">
                  ✕ {profileError}
                </span>
              )}
            </div>
          </form>
        </div>
      </Block>

      {/* BLOCK 02: COLOR THEME (MIDNIGHT DARK STANDARD) */}
      <div className="mt-10">
        <Block
          idx="02"
          title="Color Theme Appearance"
          hint="EduSentry operates exclusively in the official Midnight Dark theme for visual excellence."
        >
          <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-6 sm:p-7 shadow-md">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#263653] pb-4">
              <div>
                <h4 className="text-[1rem] font-semibold text-white">
                  Midnight Dark Theme
                </h4>
                <p className="mt-0.5 text-[0.8rem] text-slate-400">
                  Curated midnight ambient dark theme with radiant gold accents and optimal contrast.
                </p>
              </div>
              <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-gold">
                Active: Midnight Dark
              </span>
            </div>

            <div className="rounded-2xl border border-gold/40 bg-[#141f33] p-5 shadow-[0_0_22px_rgba(245,158,11,0.15)] ring-1 ring-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-2xl text-gold border border-gold/30">
                  🌙
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[1.05rem] font-bold text-white">Official Midnight Theme</span>
                    <span className="rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[0.66rem] font-bold text-emerald-400">
                      ✓ ENFORCED STANDARD
                    </span>
                  </div>
                  <p className="mt-1 text-[0.82rem] text-slate-300">
                    High-contrast dark midnight aesthetic with radiant golden accents. Optimized for reduced eye strain and distraction-free study.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Block>
      </div>

      {/* BLOCK 03: SECURITY & DATA MANAGEMENT */}
      <div className="mt-10">
        <Block
          idx="03"
          title="Security & Account Management"
          hint="Control your login credentials, data portability, and account deletion."
        >
          <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-6 sm:p-7 shadow-md space-y-8">
            {/* Change Password */}
            <div>
              <h4 className="text-[1rem] font-semibold text-white">
                Change Password
              </h4>
              <p className="mt-0.5 text-[0.8rem] text-slate-400">
                Use at least 8 characters with uppercase, lowercase, a number, and a special character.
              </p>

              <form onSubmit={handleChangePassword} className="mt-4 grid max-w-xl gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-slate-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-3.5 py-2 text-[0.9rem] text-white outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[0.8rem] font-medium text-slate-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-3.5 py-2 text-[0.9rem] text-white outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[0.8rem] font-medium text-slate-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-[#263653] bg-[#111a2b] px-3.5 py-2 text-[0.9rem] text-white outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="rounded-xl border border-[#263653] bg-[#162238] px-4 py-2 text-[0.84rem] font-semibold text-white transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
                  >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>

                  {pwSuccess && (
                    <span className="font-mono text-[0.84rem] text-emerald-400">
                      ✓ Password updated successfully.
                    </span>
                  )}

                  {pwError && (
                    <span className="font-mono text-[0.84rem] text-rust">
                      ✕ {pwError}
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Data Export & Clear History */}
            <div className="grid grid-cols-1 gap-6 border-t border-[#1c2a44] pt-6 sm:grid-cols-2">
              <div className="rounded-xl border border-[#1c2a44] bg-[#111a2b] p-5">
                <h5 className="font-semibold text-white">Data Portability (Export JSON)</h5>
                <p className="mt-1 text-[0.78rem] text-slate-400 leading-relaxed">
                  Download a complete backup of your student profile, account metadata, and history.
                </p>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="mt-4 rounded-lg border border-[#263653] bg-[#162238] px-3.5 py-2 text-[0.8rem] font-semibold text-slate-200 hover:border-gold hover:text-white"
                >
                  Download Student Data
                </button>
              </div>

              <div className="rounded-xl border border-[#1c2a44] bg-[#111a2b] p-5">
                <h5 className="font-semibold text-white">Reset Activity Feed</h5>
                <p className="mt-1 text-[0.78rem] text-slate-400 leading-relaxed">
                  Clears the recent activity event log. Your uploaded files and saved risk checks are preserved.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="rounded-lg border border-[#263653] bg-[#162238] px-3.5 py-2 text-[0.8rem] font-semibold text-slate-200 hover:border-gold hover:text-white"
                  >
                    Clear Activity Feed
                  </button>
                  {historyCleared && (
                    <span className="font-mono text-xs text-emerald-400">✓ Cleared</span>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="border-t border-red-950/60 pt-6">
              <h4 className="text-[0.95rem] font-semibold text-red-400">
                Delete Account (Permanent Action)
              </h4>
              <p className="mt-1 text-[0.8rem] text-slate-400 leading-relaxed">
                Permanently deletes your account, personal data, and all indexed notes. This action cannot be reversed.
              </p>

              <form onSubmit={handleDeleteAccount} className="mt-4 grid max-w-xl gap-3">
                <label className="block">
                  <span className="mb-1 block text-[0.78rem] font-medium text-slate-300">
                    Type your email (<span className="font-mono text-gold">{user?.email}</span>) to confirm:
                  </span>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={user?.email}
                    className="w-full rounded-xl border border-red-950/80 bg-[#16121a] px-3.5 py-2 font-mono text-[0.88rem] text-red-200 outline-none focus:border-red-500"
                  />
                </label>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={deletingAccount}
                    className="rounded-xl border border-red-600 bg-red-950/40 px-5 py-2 text-[0.84rem] font-semibold text-red-400 transition-colors hover:bg-red-900/60 disabled:opacity-50"
                  >
                    {deletingAccount ? 'Deleting...' : 'Delete My Account'}
                  </button>

                  {deleteError && (
                    <span className="font-mono text-[0.82rem] text-red-400">
                      ✕ {deleteError}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Block>
      </div>
    </div>
  )
}

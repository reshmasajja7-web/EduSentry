import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    api.auth.me()
      .then(({ user }) => { if (active) setUser(user) })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setReady(true) })
    return () => { active = false }
  }, [])

  const register = useCallback(async ({ name, email, phone, password, role }) => {
    try {
      const data = await api.auth.register({ name, email, phone, password, role: role || 'student' })
      setUser(data.user)
      return { ok: true, user: data.user }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const login = useCallback(async (payload) => {
    try {
      const data = await api.auth.login(payload)
      setUser(data.user)
      return { ok: true, user: data.user }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const sendPhoneOtp = useCallback(async (phone) => {
    try {
      const data = await api.auth.sendPhoneOtp(phone)
      return { ok: true, ...data }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const logout = useCallback(async () => {
    try { await api.auth.logout() } finally { setUser(null) }
  }, [])

  const updateProfile = useCallback(async (updates) => {
    try {
      const data = await api.auth.updateProfile(updates)
      setUser(data.user)
      return { ok: true, user: data.user }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const changePassword = useCallback(async (payload) => {
    try {
      await api.auth.changePassword(payload)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const requestPasswordReset = useCallback(async (email) => {
    try {
      return await api.auth.forgotPassword({ email })
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const verifyPasswordOtp = useCallback(async (payload) => {
    try {
      return await api.auth.verifyOtp(payload)
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const resetPassword = useCallback(async (payload) => {
    try {
      await api.auth.resetPassword(payload)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }, [])

  const deleteAccount = useCallback(async () => {
    try {
      await api.auth.deleteAccount()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    ready,
    login,
    sendPhoneOtp,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    verifyPasswordOtp,
    resetPassword,
    deleteAccount,
  }), [user, ready, login, sendPhoneOtp, register, logout, updateProfile, changePassword, requestPasswordReset, verifyPasswordOtp, resetPassword, deleteAccount])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

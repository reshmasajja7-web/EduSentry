export function validateEmailSyntax(email) {
  const normalized = String(email || '').trim().toLowerCase()
  const match = normalized.match(/^[^\s@]+@([^\s@]+\.[^\s@]{2,})$/)
  return match ? { valid: true, normalized, domain: match[1] } : { valid: false, normalized: '', domain: '' }
}

export function passwordValidationError(password) {
  const value = String(password || '')
  const checks = [
    [value.length >= 8, 'at least 8 characters'],
    [/[A-Z]/.test(value), 'an uppercase letter'],
    [/[a-z]/.test(value), 'a lowercase letter'],
    [/[0-9]/.test(value), 'a number'],
    [/[^A-Za-z0-9]/.test(value), 'a special character'],
  ]
  const missing = checks.find(([valid]) => !valid)
  return missing ? `Password must contain ${missing[1]}.` : null
}

export function normalizeIndianPhone(phone) {
  if (phone == null || String(phone).trim() === '') return { valid: true, phone: null }
  const compact = String(phone).trim().replace(/[\s()-]/g, '')
  if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(compact)) {
    return { valid: false, phone: null }
  }
  const digits = compact.replace(/\D/g, '')
  return { valid: true, phone: `+91${digits.slice(-10)}` }
}

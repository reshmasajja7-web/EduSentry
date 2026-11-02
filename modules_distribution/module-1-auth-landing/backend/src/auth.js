import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'edusentry_token'

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ error: 'Authentication required.' })
    req.auth = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Your session is invalid or expired.' })
  }
}

export function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (token) {
      req.auth = jwt.verify(token, process.env.JWT_SECRET)
    }
  } catch {
    // Ignore invalid cookie for optional auth
  }
  next()
}


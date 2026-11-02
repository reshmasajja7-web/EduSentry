const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? '' : 'http://localhost:5000')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    )
  }

  return data
}

export const api = {
  // =========================================================
  // AUTH
  // =========================================================

  auth: {
    register(data) {
      return request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    login(data) {
      return request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    sendPhoneOtp(phone) {
      return request('/api/auth/phone-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      })
    },

    logout() {
      return request('/api/auth/logout', {
        method: 'POST',
      })
    },

    me() {
      return request('/api/auth/me')
    },

    profile() {
      return request('/api/profile')
    },

    updateProfile(data) {
      return request('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    changePassword(data) {
      return request('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    forgotPassword(data) {
      return request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    verifyOtp(data) {
      return request('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    resetPassword(data) {
      return request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    deleteAccount() {
      return request('/api/auth/account', {
        method: 'DELETE',
      })
    },
  },

  // =========================================================
  // ACTIVITY
  // =========================================================

  activity: {
    list() {
      return request('/api/activity')
    },

    create(data) {
      return request('/api/activity', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    deleteAll() {
      return request('/api/activity', {
        method: 'DELETE',
      })
    },

    // Backward-compatible alias for older components.
    clear() {
      return this.deleteAll()
    },
  },

  // =========================================================
  // DOCUMENTS
  // =========================================================

  documents: {
    list() {
      return request('/api/documents')
    },

    create(data) {
      return request('/api/documents', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    delete(id) {
      return request(`/api/documents/${id}`, {
        method: 'DELETE',
      })
    },

    deleteAll() {
      return request('/api/documents', {
        method: 'DELETE',
      })
    },

    // Backward-compatible aliases for older components.
    remove(id) {
      return this.delete(id)
    },

    clear() {
      return this.deleteAll()
    },
  },

  // =========================================================
  // QUIZ
  // =========================================================

  quiz: {
    results() {
      return request('/api/quiz/results')
    },

    createResult(data) {
      return request('/api/quiz/results', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  // =========================================================
  // STUDY SESSIONS
  // =========================================================

  studySessions: {
    create(data) {
      return request('/api/study-sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  // =========================================================
  // EARLYRISK
  // =========================================================

  risk: {
    engagement() {
      return request('/api/engagement')
    },

    predict(data) {
      return request('/api/earlyrisk/predict', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    history() {
      return request('/api/earlyrisk/history')
    },
  },

  // =========================================================
  // CAREER GUIDANCE
  // =========================================================

  career: {
    saveResult(data) {
      return request('/api/career/results', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    latestResult() {
      return request('/api/career/results/latest')
    },

    progress() {
      return request('/api/career/progress')
    },

    saveProgress(data) {
      return request('/api/career/progress', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },

  // =========================================================
  // TUTOR & RAG
  // =========================================================

  tutor: {
    messages() {
      return request('/api/tutor/messages')
    },

    createMessage(data) {
      return request('/api/tutor/messages', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  rag: {
    models() {
      return request('/api/rag/models')
    },

    generate(data) {
      return request('/api/rag/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    chat(data) {
      return request('/api/rag/chat', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },


  // =========================================================
  // DASHBOARD
  // =========================================================

  dashboard: {
    summary() {
      return request('/api/dashboard/summary')
    },
  },

  // =========================================================
  // HEALTH
  // =========================================================

  health() {
    return request('/api/health')
  },
}

export default api
const API_BASE_URL = 'http://localhost:5000'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  let data = {}

  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.')
  }

  return data
}

export const api = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================

  register: ({
    name,
    email,
    password,
    role = 'student',
  }) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    }),

  login: ({ email, password }) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    request('/api/auth/me'),

  updateProfile: ({
    name,
    course,
    careerGoal,
  }) =>
    request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name,
        course,
        careerGoal,
      }),
    }),

  changePassword: ({
    currentPassword,
    newPassword,
  }) =>
    request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }),

  forgotPassword: (email) =>
    request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    }),

  resetPassword: (token, newPassword) =>
    request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        newPassword,
      }),
    }),

  deleteAccount: () =>
    request('/api/auth/account', {
      method: 'DELETE',
    }),

  // ==========================================
  // DOCUMENTS
  // ==========================================

  documents: {
    list: () =>
      request('/api/documents'),

    create: ({
      name,
      size,
      text = '',
    }) =>
      request('/api/documents', {
        method: 'POST',
        body: JSON.stringify({
          name,
          size,
          text,
        }),
      }),

    remove: (id) =>
      request(`/api/documents/${id}`, {
        method: 'DELETE',
      }),

    clear: () =>
      request('/api/documents', {
        method: 'DELETE',
      }),
  },

  // ==========================================
  // ACTIVITY
  // ==========================================

  activity: {
    list: () =>
      request('/api/activity'),

    create: ({
      type,
      meta = {},
    }) =>
      request('/api/activity', {
        method: 'POST',
        body: JSON.stringify({
          type,
          meta,
        }),
      }),

    clear: () =>
      request('/api/activity', {
        method: 'DELETE',
      }),
  },

  // ==========================================
  // QUIZ
  // ==========================================

  quiz: {
    saveResult: ({
      score,
      total,
      topic = 'Uploaded Material',
    }) =>
      request('/api/quiz/results', {
        method: 'POST',
        body: JSON.stringify({
          score,
          total,
          topic,
        }),
      }),

    createResult: ({
      score,
      total,
      topic = 'Uploaded Material',
    }) =>
      request('/api/quiz/results', {
        method: 'POST',
        body: JSON.stringify({
          score,
          total,
          topic,
        }),
      }),

    listResults: () =>
      request('/api/quiz/results'),
  },

  // ==========================================
  // ENGAGEMENT
  // ==========================================

  engagement: {
    get: () =>
      request('/api/engagement'),
  },

  // ==========================================
  // EARLY RISK
  // ==========================================

  earlyRisk: {
    predict: ({
      userType,
      academicData = {},
      engagementData = null,
    }) =>
      request('/api/earlyrisk/predict', {
        method: 'POST',
        body: JSON.stringify({
          userType,
          academicData,
          engagementData,
        }),
      }),

    history: () =>
      request('/api/earlyrisk/history'),
  },

  // ==========================================
  // CAREER GUIDANCE
  // ==========================================

  career: {
    saveResult: ({
      selectedInterests = [],
      inputText = '',
      career,
      matchPercent,
    }) =>
      request('/api/career/results', {
        method: 'POST',
        body: JSON.stringify({
          selectedInterests,
          inputText,
          career,
          matchPercent,
        }),
      }),

    latest: () =>
      request('/api/career/results/latest'),
  },

  // ==========================================
  // AI TUTOR
  // ==========================================

  tutor: {
    saveMessage: ({
      question,
      answer,
      citation = null,
    }) =>
      request('/api/tutor/messages', {
        method: 'POST',
        body: JSON.stringify({
          question,
          answer,
          citation,
        }),
      }),

    messages: () =>
      request('/api/tutor/messages'),
  },
}

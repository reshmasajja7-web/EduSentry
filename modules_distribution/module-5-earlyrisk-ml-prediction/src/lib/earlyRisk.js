// ============================================================
// EarlyRisk Frontend Helpers
// ============================================================
// IMPORTANT:
// The REAL prediction should come from:
// POST /api/earlyrisk/predict
//
// This file contains:
// - normalization helpers
// - Risk Simulator calculations
// - breakdown/reason generation
// - UI recommendations
// - study plan helpers
// - fallback/default engagement structure
// ============================================================

export const clamp = (v, min = 0, max = 100) => {
  const number = Number(v)

  if (Number.isNaN(number)) {
    return min
  }

  return Math.min(max, Math.max(min, number))
}

// ============================================================
// DEFAULT ENGAGEMENT STRUCTURE
// ============================================================

export function getDefaultEngagement() {
  return {
    quizAverage: 0,
    studyHours: 0,
    topicsCompleted: 0,
    studyConsistency: 0,
    revisionFrequency: 0,
    studyStreak: 0,
    aiTutorInteractions: 0,
  }
}

// Keep this alias for compatibility with older components.
export function getPlatformEngagement() {
  return getDefaultEngagement()
}

// ============================================================
// WEIGHTS
// ============================================================

const WEIGHTS_SELF_PACED = {
  quizPerformance: 0.28,
  studyConsistency: 0.24,
  revisionFrequency: 0.18,
  topicsCompleted: 0.20,
  studyHours: 0.10,
}

const WEIGHTS_COLLEGE = {
  quizPerformance: 0.15,
  studyConsistency: 0.13,
  revisionFrequency: 0.10,
  topicsCompleted: 0.11,
  studyHours: 0.06,
  attendance: 0.15,
  internalMarks: 0.15,
  cgpa: 0.15,
}

// ============================================================
// NORMALIZATION
// ============================================================

export const normalizeStudyHours = (hrs) =>
  clamp((Number(hrs || 0) / 4) * 100)

export const normalizeCgpa = (cgpa) =>
  clamp((Number(cgpa || 0) / 10) * 100)

// ============================================================
// SIMULATOR
// ============================================================

export function simulateRisk(
  factors = {},
  userType,
  academicData = {}
) {
  const weights =
    userType === 'college'
      ? WEIGHTS_COLLEGE
      : WEIGHTS_SELF_PACED

  const normalized = {
    quizPerformance: clamp(factors.quizPerformance),
    studyConsistency: clamp(factors.studyConsistency),
    revisionFrequency: clamp(factors.revisionFrequency),
    topicsCompleted: clamp(factors.topicsCompleted),
    studyHours: normalizeStudyHours(factors.studyHours),
  }

  if (userType === 'college') {
    normalized.attendance = clamp(factors.attendance)

    normalized.internalMarks = clamp(
      factors.internalMarks
    )

    normalized.cgpa = normalizeCgpa(
      academicData?.cgpa ?? 0
    )
  }

  let health = 0

  Object.keys(weights).forEach((key) => {
    health +=
      (normalized[key] || 0) * weights[key]
  })

  const backlogs =
    userType === 'college'
      ? Number(academicData?.backlogs || 0)
      : 0

  const backlogPenalty = clamp(
    backlogs * 4,
    0,
    20
  )

  const riskScore = Math.round(
    clamp(100 - health + backlogPenalty)
  )

  let riskLevel = 'Low Risk'

  if (riskScore >= 70) {
    riskLevel = 'High Risk'
  } else if (riskScore >= 40) {
    riskLevel = 'Medium Risk'
  }

  return {
    riskScore,
    riskLevel,
  }
}

// ============================================================
// BREAKDOWN
// ============================================================

export function buildBreakdown(
  factors = {},
  userType,
  academicData = {}
) {
  const items = [
    {
      key: 'quizPerformance',
      name: 'Quiz Performance',
      value: clamp(factors.quizPerformance),
    },

    {
      key: 'studyConsistency',
      name: 'Study Consistency',
      value: clamp(factors.studyConsistency),
    },

    {
      key: 'revisionFrequency',
      name: 'Revision Frequency',
      value: clamp(factors.revisionFrequency),
    },

    {
      key: 'topicsCompleted',
      name: 'Topic Completion',
      value: clamp(factors.topicsCompleted),
    },

    {
      key: 'studyHours',
      name: 'Study Hours',
      value: Math.round(
        normalizeStudyHours(factors.studyHours)
      ),
    },
  ]

  if (userType === 'college') {
    items.unshift(
      {
        key: 'academicPerformance',
        name: 'Academic Performance',
        value: Math.round(
          normalizeCgpa(
            academicData?.cgpa || 0
          )
        ),
      },

      {
        key: 'attendance',
        name: 'Attendance',
        value: clamp(factors.attendance),
      },

      {
        key: 'internalMarks',
        name: 'Internal Marks',
        value: clamp(factors.internalMarks),
      },

      {
        key: 'backlogs',
        name: 'Backlogs',
        value: clamp(
          100 -
            Number(academicData?.backlogs || 0) *
              20
        ),
      }
    )
  } else {
    items.push({
      key: 'platformEngagement',
      name: 'Platform Engagement',
      value: clamp(
        Number(factors.studyConsistency || 0) * 0.5 +
          Number(factors.topicsCompleted || 0) * 0.5
      ),
    })
  }

  return items
}

// ============================================================
// REASONS
// ============================================================

export function buildReasons(
  factors = {},
  userType,
  academicData = {}
) {
  const reasons = []

  reasons.push(
    Number(factors.quizPerformance || 0) < 75
      ? {
          type: 'warning',
          text:
            'Quiz performance is below recommended level',
        }
      : {
          type: 'positive',
          text:
            'Quiz performance is strong',
        }
  )

  reasons.push(
    Number(factors.studyConsistency || 0) < 70
      ? {
          type: 'warning',
          text:
            'Study consistency needs improvement',
        }
      : {
          type: 'positive',
          text:
            'Study consistency is on track',
        }
  )

  if (
    Number(factors.revisionFrequency || 0) < 70
  ) {
    reasons.push({
      type: 'warning',
      text: 'Revision frequency is low',
    })
  }

  reasons.push(
    Number(factors.topicsCompleted || 0) >= 60
      ? {
          type: 'positive',
          text:
            'Topic completion is progressing well',
        }
      : {
          type: 'warning',
          text:
            'Topic completion is behind pace',
        }
  )

  if (userType === 'college') {
    if (
      Number(academicData?.attendance || 0) < 75
    ) {
      reasons.push({
        type: 'warning',
        text: 'Attendance is low',
      })
    }

    if (
      Number(academicData?.cgpa || 0) < 6.5
    ) {
      reasons.push({
        type: 'warning',
        text: 'CGPA needs improvement',
      })
    }

    const backlogs = Number(
      academicData?.backlogs || 0
    )

    if (backlogs > 0) {
      reasons.push({
        type: 'warning',
        text: `${backlogs} backlog(s) increase academic risk`,
      })
    }
  }

  return reasons.slice(0, 5)
}

// ============================================================
// PRIORITY
// ============================================================

export function priorityForValue(value) {
  if (value < 60) return 'HIGH'
  if (value < 70) return 'MEDIUM'
  return 'LOW'
}

// ============================================================
// ENRICH BACKEND RESULT
// ============================================================
// This is useful if backend returns only:
// riskScore, riskLevel, confidence...
//
// The missing UI fields are calculated here.

// ============================================================

export function enrichPrediction(
  backendResult = {},
  {
    userType,
    academicData = {},
    engagementData = {},
  }
) {
  const result =
    backendResult?.result ||
    backendResult?.data ||
    backendResult?.prediction ||
    backendResult

  const factors = {
    quizPerformance:
      Number(
        result.baseFactors?.quizPerformance ??
          engagementData.quizAverage ??
          0
      ),

    studyConsistency:
      Number(
        result.baseFactors?.studyConsistency ??
          engagementData.studyConsistency ??
          0
      ),

    revisionFrequency:
      Number(
        result.baseFactors?.revisionFrequency ??
          engagementData.revisionFrequency ??
          0
      ),

    topicsCompleted:
      Number(
        result.baseFactors?.topicsCompleted ??
          engagementData.topicsCompleted ??
          0
      ),

    studyHours:
      Number(
        result.baseFactors?.studyHours ??
          engagementData.studyHours ??
          0
      ),
  }

  if (userType === 'college') {
    factors.attendance = Number(
      result.baseFactors?.attendance ??
        academicData?.attendance ??
        0
    )

    factors.internalMarks = Number(
      result.baseFactors?.internalMarks ??
        academicData?.internalMarks ??
        0
    )
  }

  const breakdown =
    result.breakdown ||
    buildBreakdown(
      factors,
      userType,
      academicData
    )

  const reasons =
    result.reasons ||
    buildReasons(
      factors,
      userType,
      academicData
    )

  const strongAreas =
    result.strongAreas ||
    breakdown
      .filter((item) => item.value >= 75)
      .sort((a, b) => b.value - a.value)

  const improvementAreas =
    result.improvementAreas ||
    breakdown
      .filter((item) => item.value < 75)
      .map((item) => ({
        ...item,
        priority: priorityForValue(item.value),
      }))
      .sort((a, b) => a.value - b.value)

  const calculatedSimulation =
    simulateRisk(
      factors,
      userType,
      academicData
    )

  const riskScore =
    result.riskScore ??
    calculatedSimulation.riskScore

  const riskLevel =
    result.riskLevel ??
    calculatedSimulation.riskLevel

  const confidence =
    result.confidence ??
    Math.round(
      clamp(
        88 -
          improvementAreas.length * 1.5 -
          Number(academicData?.backlogs || 0) *
            1.5,
        60,
        96
      )
    )

  return {
    ...result,

    riskScore: Number(riskScore),

    riskLevel,

    confidence: Number(confidence),

    reasons,

    dataSources:
      result.dataSources ||
      (userType === 'college'
        ? 'Academic Data + Platform Engagement'
        : 'Platform Engagement'),

    breakdown,

    baseFactors: factors,

    strongAreas,

    improvementAreas,

    priorityList:
      result.priorityList ||
      improvementAreas.slice(0, 5),

    userType,

    academicData,
  }
}

// ============================================================
// RECOMMENDATIONS
// ============================================================

export function getMockRecommendations(
  userType,
  prediction = null
) {
  const recommendations = []

  const factors =
    prediction?.baseFactors || {}

  if (
    Number(factors.studyConsistency || 0) < 70
  ) {
    recommendations.push(
      'Study consistently for at least 2–3 hours daily'
    )
  }

  if (
    Number(factors.revisionFrequency || 0) < 70
  ) {
    recommendations.push(
      'Revise weak topics twice per week'
    )
  }

  if (
    Number(factors.quizPerformance || 0) < 75
  ) {
    recommendations.push(
      'Complete one practice quiz every day'
    )
  }

  if (
    Number(factors.topicsCompleted || 0) < 60
  ) {
    recommendations.push(
      'Increase topic completion pace'
    )
  }

  if (
    Number(factors.studyConsistency || 0) >= 70
  ) {
    recommendations.push(
      'Maintain your current learning consistency'
    )
  }

  if (userType === 'college') {
    if (
      Number(factors.attendance || 0) < 75
    ) {
      recommendations.push(
        'Improve attendance to stay above the safe threshold'
      )
    }

    if (
      Number(factors.internalMarks || 0) < 70
    ) {
      recommendations.push(
        'Focus on subjects with low internal marks'
      )
    }

    if (
      Number(prediction?.academicData?.backlogs || 0) > 0
    ) {
      recommendations.push(
        'Work on clearing backlog subjects first'
      )
    }
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Keep maintaining your current learning habits'
    )
  }

  return recommendations.slice(0, 8)
}

// ============================================================
// STUDY PLAN
// ============================================================

export function getStudyPlan(prediction = null) {
  const highPriority =
    prediction?.priorityList?.[0]?.name

  return {
    goal: highPriority
      ? `Improve ${highPriority}`
      : 'Complete 2 topics',

    topicsToRevise: [
      'Operating Systems',
      'DBMS',
    ],

    suggestedQuiz:
      'Operating Systems Quiz',

    recommendedTime: '2.5 hours',
  }
}

// ============================================================
// HISTORY NORMALIZER
// ============================================================

export function normalizeHistory(response) {
  const history =
    response?.history ||
    response?.data ||
    response

  return {
    riskTrend:
      history?.riskTrend ||
      history?.riskHistory ||
      [],

    quizTrend:
      history?.quizTrend ||
      [],

    studyHoursTrend:
      history?.studyHoursTrend ||
      [],
  }
}

// ============================================================
// UI CONSTANTS
// ============================================================

export const CORE_SLIDERS = [
  {
    key: 'studyConsistency',
    label: 'Study Consistency',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },

  {
    key: 'quizPerformance',
    label: 'Quiz Performance',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },

  {
    key: 'revisionFrequency',
    label: 'Revision Frequency',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },

  {
    key: 'studyHours',
    label: 'Study Hours',
    min: 0,
    max: 6,
    step: 0.1,
    unit: ' hrs/day',
  },

  {
    key: 'topicsCompleted',
    label: 'Topic Completion',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
]

export const COLLEGE_SLIDERS = [
  {
    key: 'attendance',
    label: 'Attendance',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },

  {
    key: 'internalMarks',
    label: 'Internal Marks',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
]

export function formatSliderValue(
  value,
  unit
) {
  if (unit === ' hrs/day') {
    return Number(value).toFixed(1) + unit
  }

  return Math.round(value) + unit
}

export const ACADEMIC_FIELDS = [
  {
    key: 'cgpa',
    label: 'CGPA',
    hint: 'Range: 0–10',
    min: 0,
    max: 10,
    step: '0.1',
    placeholder: 'e.g. 7.4',
  },

  {
    key: 'attendance',
    label: 'Attendance (%)',
    hint: 'Range: 0–100',
    min: 0,
    max: 100,
    step: '1',
    placeholder: 'e.g. 82',
  },

  {
    key: 'internalMarks',
    label: 'Internal Marks (%)',
    hint: 'Range: 0–100',
    min: 0,
    max: 100,
    step: '1',
    placeholder: 'e.g. 68',
  },

  {
    key: 'backlogs',
    label: 'Number of Backlogs',
    hint: 'Minimum: 0',
    min: 0,
    max: 99,
    step: '1',
    placeholder: 'e.g. 1',
  },
]

export const LEVEL_COLOR = {
  'Low Risk': '#5C8770',
  'Medium Risk': '#E8A33D',
  'High Risk': '#C1573F',
}

export function colorForValue(value) {
  if (value >= 75) return '#5C8770'
  if (value >= 55) return '#E8A33D'
  return '#C1573F'
}

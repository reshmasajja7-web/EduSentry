export const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, Number(v) || 0))

const WEIGHTS_SELF_PACED = {
  quizPerformance: 0.28,
  studyConsistency: 0.24,
  revisionFrequency: 0.18,
  topicsCompleted: 0.2,
  studyHours: 0.1,
}

const WEIGHTS_COLLEGE = {
  quizPerformance: 0.15,
  studyConsistency: 0.13,
  revisionFrequency: 0.1,
  topicsCompleted: 0.11,
  studyHours: 0.06,
  attendance: 0.15,
  internalMarks: 0.15,
  cgpa: 0.15,
}

const normalizeStudyHours = (hrs) => clamp((Number(hrs) / 4) * 100)
const normalizeCgpa = (cgpa) => clamp((Number(cgpa) / 10) * 100)

export function getDefaultEngagement() {
  // No fabricated engagement values. Real values are calculated by
  // /api/engagement from PostgreSQL. These zeros only provide a safe
  // fallback for direct callers that omit engagement data.
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

export function simulateRisk(factors, userType, academicData = {}) {
  const weights = userType === 'college' ? WEIGHTS_COLLEGE : WEIGHTS_SELF_PACED
  const normalized = {
    quizPerformance: clamp(factors.quizPerformance),
    studyConsistency: clamp(factors.studyConsistency),
    revisionFrequency: clamp(factors.revisionFrequency),
    topicsCompleted: clamp(factors.topicsCompleted),
    studyHours: normalizeStudyHours(factors.studyHours),
  }
  if (userType === 'college') {
    normalized.attendance = clamp(factors.attendance)
    normalized.internalMarks = clamp(factors.internalMarks)
    normalized.cgpa = normalizeCgpa(academicData.cgpa ?? 7)
  }
  let health = 0
  for (const key of Object.keys(weights)) health += (normalized[key] || 0) * weights[key]
  const backlogs = userType === 'college' ? Number(academicData.backlogs || 0) : 0
  const backlogPenalty = clamp(backlogs * 4, 0, 20)
  const riskScore = Math.round(clamp(100 - health + backlogPenalty))
  const riskLevel = riskScore >= 70 ? 'High Risk' : riskScore >= 40 ? 'Medium Risk' : 'Low Risk'
  return { riskScore, riskLevel }
}

function priorityForValue(value) {
  if (value < 60) return 'HIGH'
  if (value < 70) return 'MEDIUM'
  return 'LOW'
}

export function predictRisk({ userType, academicData = {}, engagementData = getDefaultEngagement() }) {
  const baseFactors = {
    quizPerformance: Number(engagementData.quizAverage ?? 0),
    studyConsistency: Number(engagementData.studyConsistency ?? 0),
    revisionFrequency: Number(engagementData.revisionFrequency ?? 0),
    topicsCompleted: Number(engagementData.topicsCompleted ?? 0),
    studyHours: Number(engagementData.studyHours ?? 0),
  }
  if (userType === 'college') {
    baseFactors.attendance = Number(academicData.attendance ?? 75)
    baseFactors.internalMarks = Number(academicData.internalMarks ?? 70)
  }

  const { riskScore, riskLevel } = simulateRisk(baseFactors, userType, academicData)
  const breakdown = [
    { key: 'quizPerformance', name: 'Quiz Performance', value: clamp(baseFactors.quizPerformance) },
    { key: 'studyConsistency', name: 'Study Consistency', value: clamp(baseFactors.studyConsistency) },
    { key: 'revisionFrequency', name: 'Revision Frequency', value: clamp(baseFactors.revisionFrequency) },
    { key: 'topicsCompleted', name: 'Topic Completion', value: clamp(baseFactors.topicsCompleted) },
    { key: 'studyHours', name: 'Study Hours', value: Math.round(normalizeStudyHours(baseFactors.studyHours)) },
  ]

  if (userType === 'college') {
    breakdown.unshift(
      { key: 'academicPerformance', name: 'Academic Performance', value: Math.round(normalizeCgpa(academicData.cgpa ?? 7)) },
      { key: 'attendance', name: 'Attendance', value: clamp(baseFactors.attendance) },
      { key: 'internalMarks', name: 'Internal Marks', value: clamp(baseFactors.internalMarks) },
      { key: 'backlogs', name: 'Backlogs', value: clamp(100 - Number(academicData.backlogs || 0) * 20) },
    )
  } else {
    breakdown.push({ key: 'platformEngagement', name: 'Platform Engagement', value: clamp(baseFactors.studyConsistency * 0.5 + baseFactors.topicsCompleted * 0.5) })
  }

  const reasons = [
    baseFactors.quizPerformance < 75 ? { type: 'warning', text: 'Quiz performance is below recommended level' } : { type: 'positive', text: 'Quiz performance is strong' },
    baseFactors.studyConsistency < 70 ? { type: 'warning', text: 'Study consistency needs improvement' } : { type: 'positive', text: 'Study consistency is on track' },
  ]
  if (baseFactors.revisionFrequency < 70) reasons.push({ type: 'warning', text: 'Revision frequency is low' })
  reasons.push(baseFactors.topicsCompleted >= 60 ? { type: 'positive', text: 'Topic completion is progressing well' } : { type: 'warning', text: 'Topic completion is behind pace' })
  if (userType === 'college') {
    if (baseFactors.attendance < 75) reasons.push({ type: 'warning', text: 'Attendance is low' })
    if (Number(academicData.cgpa) < 6.5) reasons.push({ type: 'warning', text: 'CGPA needs improvement' })
    if (Number(academicData.backlogs) > 0) reasons.push({ type: 'warning', text: `${academicData.backlogs} backlog(s) increase academic risk` })
  }

  const strongAreas = breakdown.filter((f) => f.value >= 75).sort((a, b) => b.value - a.value)
  const improvementAreas = breakdown.filter((f) => f.value < 75).map((f) => ({ ...f, priority: priorityForValue(f.value) })).sort((a, b) => a.value - b.value)
  const confidence = Math.round(clamp(88 - improvementAreas.length * 1.5 - Number(academicData.backlogs || 0) * 1.5, 60, 96))

  return {
    riskScore,
    riskLevel,
    confidence,
    reasons: reasons.slice(0, 5),
    dataSources: userType === 'college' ? 'Academic Data + Platform Engagement' : 'Platform Engagement',
    breakdown,
    baseFactors,
    strongAreas,
    improvementAreas,
    priorityList: improvementAreas.slice(0, 5),
    userType,
    academicData,
  }
}

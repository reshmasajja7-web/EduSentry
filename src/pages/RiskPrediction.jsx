import { useEffect, useMemo, useState } from 'react'
import Block from '../components/Block.jsx'
import Btn from '../components/Btn.jsx'
import RiskGauge from '../components/risk/RiskGauge.jsx'
import AcademicModal from '../components/risk/AcademicModal.jsx'
import TrendChart from '../components/risk/TrendChart.jsx'
import {
  simulateRisk,
  getMockRecommendations,
  getStudyPlan,
  CORE_SLIDERS,
  COLLEGE_SLIDERS,
  formatSliderValue,
} from '../lib/earlyRisk.js'
import { api } from '../lib/api.js'

const RESULT_KEY = 'edusentry-risk-result-v1'

const LEVEL_TO_DASHBOARD = {
  'Low Risk': 'Low',
  'Medium Risk': 'Moderate',
  'High Risk': 'High',
}

const USER_TYPE_OPTIONS = [
  {
    id: 'college',
    icon: '🎓',
    title: 'College Student',
    description: 'I am currently studying in a college or university.',
  },
  {
    id: 'self-paced',
    icon: '📚',
    title: 'Self-Paced Learner',
    description:
      'I learn independently without traditional college academic records.',
  },
]

const PRIORITY_META = {
  HIGH: {
    dot: 'bg-rust',
    text: 'text-rust',
    label: 'HIGH',
  },
  MEDIUM: {
    dot: 'bg-gold',
    text: 'text-gold',
    label: 'MEDIUM',
  },
  LOW: {
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    label: 'LOW',
  },
}

/* =========================================================
   USER TYPE SELECTOR
   ========================================================= */

function UserTypeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {USER_TYPE_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id

        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(opt.id)}
            className={`min-h-[195px] rounded-xl border p-6 text-left transition-all duration-200 ${
              isSelected
                ? 'border-[#E8A33D] bg-[#111c30] shadow-[0_0_18px_rgba(232,163,61,0.15)]'
                : 'border-[#263754] bg-[#111c30] hover:border-[#E8A33D]/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[2rem]" aria-hidden="true">
                {opt.icon}
              </span>

              {isSelected && (
                <span className="rounded-full border border-[#E8A33D] px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-[#E8A33D]">
                  Selected
                </span>
              )}
            </div>

            <h3 className="mt-5 mb-2 font-display text-[1.15rem] font-semibold text-white">
              {opt.title}
            </h3>

            <p className="text-[0.9rem] leading-relaxed text-slate-300">
              {opt.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}

/* =========================================================
   ENGAGEMENT CARDS
   ========================================================= */

function EngagementCards({ data }) {
  if (!data) return null

  const metrics = [
    {
      label: 'Quiz Average',
      value: `${data.quizAverage}%`,
      icon: '📝',
    },
    {
      label: 'Study Hours',
      value: `${data.studyHours} hrs/day`,
      icon: '⏱',
    },
    {
      label: 'Learning Coverage',
      value: `${data.topicsCompleted}%`,
      icon: '📘',
    },
    {
      label: 'Study Consistency',
      value: `${data.studyConsistency}%`,
      icon: '📈',
    },
    {
      label: 'Revision Frequency',
      value: `${data.revisionFrequency}%`,
      icon: '🔁',
    },
    {
      label: 'Study Streak',
      value: `${data.studyStreak} days`,
      icon: '🔥',
    },
    {
      label: 'AI Tutor Interactions',
      value: String(data.aiTutorInteractions),
      icon: '🤖',
    },
  ]

  return (
    <div>
      <h2 className="font-display text-[1.25rem] font-semibold text-white">
        Your Platform Engagement
      </h2>

      <p className="mt-1 text-[0.9rem] text-slate-300">
        Calculated from your real EduSentry learning activity stored in PostgreSQL.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="min-h-[135px] rounded-xl border border-[#263754] bg-[#111c30] px-4 py-5"
          >
            <div className="text-[1.4rem]" aria-hidden="true">
              {m.icon}
            </div>

            <p className="mt-2 font-display text-[1.25rem] font-bold text-[#E8A33D]">
              {m.value}
            </p>

            <p className="mt-1 text-[0.78rem] text-slate-300">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.76rem] italic text-slate-400">
        These metrics are calculated from your recorded learning activity and study sessions.
      </p>
    </div>
  )
}

/* =========================================================
   RISK SIMULATOR
   ========================================================= */

   function RiskSimulator({ userType, academicData, originalRiskScore, values, onChange }) {
    const sliders =
      userType === 'college'
        ? CORE_SLIDERS.concat(COLLEGE_SLIDERS)
        : CORE_SLIDERS
  
    const simulated = useMemo(
      () => simulateRisk(values, userType, academicData),
      [values, userType, academicData]
    )
  
    const delta = originalRiskScore - simulated.riskScore
    const improved = delta > 0
  
    const handleSlide = (key, raw, step) => {
      const num = step < 1 ? parseFloat(raw) : parseInt(raw, 10)
      onChange({ ...values, [key]: num })
    }
  
    return (
      <div className="rounded-xl border border-[#293a59] bg-[#111c31] p-6 sm:p-7">
  
        {/* Simulator Heading */}
        <h3 className="font-display text-[1.25rem] font-semibold text-gold">
          Risk Improvement Simulator
        </h3>
  
        <p className="mt-1 text-[0.88rem] leading-relaxed text-[#aeb9ca]">
          See how your estimated risk could change if you improve specific learning factors.
        </p>
  
        {/* Simulator Content */}
        <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_220px]">
  
          {/* Sliders */}
          <div className="grid gap-6">
  
            {sliders.map((s) => {
              const value = values[s.key] != null ? values[s.key] : s.min
  
              return (
                <div key={s.key}>
  
                  {/* Label + Value */}
                  <div className="mb-2 flex items-baseline justify-between gap-4">
  
                    <label
                      htmlFor={`slider-${s.key}`}
                      className="text-[0.9rem] font-semibold text-white"
                    >
                      {s.label}
                    </label>
  
                    <span className="shrink-0 font-mono text-[0.82rem] font-semibold text-[#f4c12e]">
                      {formatSliderValue(value, s.unit)}
                    </span>
  
                  </div>
  
                  {/* Slider */}
                  <div className="flex items-center gap-3">
  
                    <span className="text-[0.72rem] font-mono uppercase text-slate-300">
                      Low
                    </span>
  
                    <input
                      id={`slider-${s.key}`}
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={value}
                      onChange={(e) =>
                        handleSlide(s.key, e.target.value, s.step)
                      }
                      className="w-full accent-[#f4c12e]"
                      aria-valuetext={formatSliderValue(value, s.unit)}
                    />
  
                    <span className="text-[0.72rem] font-mono uppercase text-slate-300">
                      High
                    </span>
  
                  </div>
  
                </div>
              )
            })}
  
          </div>
  
          {/* Simulated Risk */}
          <div className="flex flex-col items-center justify-center gap-4">
  
            <RiskGauge
              score={simulated.riskScore}
              level={simulated.riskLevel}
              size={160}
              label="Simulated Risk"
            />
  
            <div className="text-center">
  
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-slate-300">
                Current Risk
              </p>
  
              <p className="mt-1 font-display text-[1.35rem] font-semibold text-white">
                {originalRiskScore}%
              </p>
  
              <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-slate-300">
                After Improvement
              </p>
  
              <p
                className={`font-display text-[1.35rem] font-semibold ${
                  improved ? 'text-[#45df83]' : 'text-[#ef6b5b]'
                }`}
              >
                {simulated.riskScore}%
              </p>
  
              <p
                className={`mt-1.5 text-[0.82rem] ${
                  delta === 0
                    ? 'text-slate-300'
                    : improved
                      ? 'text-[#45df83]'
                      : 'text-[#ef6b5b]'
                }`}
              >
                {delta === 0
                  ? 'No change yet — try moving a slider'
                  : improved
                    ? `↓ ${delta}% estimated improvement`
                    : `↑ ${Math.abs(delta)}% increase`}
              </p>
  
            </div>
  
          </div>
        </div>
  
        {/* Disclaimer */}
        <p className="mt-6 text-[0.75rem] italic leading-relaxed text-slate-300">
          This is a simulation based on a simplified mock calculation and does not
          guarantee your actual future risk. It will be connected to the real
          EarlyRisk ML model in a future update.
        </p>
  
      </div>
    )
  }
  
  {/*Improvement analyzer */}

  function ImprovementAnalyzer({
    prediction,
    userType,
    academicData,
    simulationValues,
    onSimulationChange,
  }) {
    if (!prediction) return null
  
    const { strongAreas, improvementAreas, riskScore } = prediction
  
    return (
      <section>
  
        {/* Heading */}
        <h2 className="font-display text-[1.3rem] font-semibold text-gold">
          🔍 Improvement Analyzer
        </h2>
  
        <p className="mt-1 text-[0.9rem] text-slate-200">
          See what you can improve and how it could affect your estimated risk.
        </p>
  
        {/* Strong Areas + Areas to Improve */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
  
          {/* Strong Areas */}
          <div>
  
            <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-slate-300">
              Strong Areas
            </h3>
  
            <div className="mt-2.5 grid gap-2">
  
              {strongAreas.length === 0 && (
                <p className="text-[0.85rem] italic text-slate-300">
                  No standout strong areas yet — keep building momentum.
                </p>
              )}
  
              {strongAreas.map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between rounded-lg border border-[#267957] bg-[#10272b] px-3.5 py-3"
                >
                  <span className="flex items-center gap-2 text-[0.88rem] text-white">
                    <span className="h-3.5 w-3.5 rounded-full bg-[#72c043]" />
                    {f.name}
                  </span>
  
                  <span className="font-mono text-[0.82rem] font-semibold text-[#45df83]">
                    {f.value}%
                  </span>
                </div>
              ))}
  
            </div>
          </div>
  
  
          {/* Areas To Improve */}
          <div>
  
            <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-slate-300">
              Areas to Improve
            </h3>
  
            <div className="mt-2.5 grid gap-2">
  
              {improvementAreas.length === 0 && (
                <p className="text-[0.85rem] italic text-slate-300">
                  Nothing urgent — you're on track across the board.
                </p>
              )}
  
              {improvementAreas.map((f) => {
                const meta = PRIORITY_META[f.priority]
  
                return (
                  <div
                    key={f.key}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#5b4a20] bg-[#211f1a] px-3.5 py-3"
                  >
  
                    <span className="flex items-center gap-2 text-[0.88rem] text-white">
  
                      <span
                        className={`h-3.5 w-3.5 shrink-0 rounded-full ${
                          f.priority === 'HIGH'
                            ? 'bg-[#ef6b5b]'
                            : f.priority === 'MEDIUM'
                              ? 'bg-[#ff9914]'
                              : 'bg-[#ffc21c]'
                        }`}
                      />
  
                      {f.name} — {f.value}%
  
                    </span>
  
                    <span
                      className={`shrink-0 font-mono text-[0.68rem] font-semibold uppercase ${
                        f.priority === 'HIGH'
                          ? 'text-[#ef6b5b]'
                          : f.priority === 'MEDIUM'
                            ? 'text-[#ffb52e]'
                            : 'text-[#ffc21c]'
                      }`}
                    >
                      Priority: {meta.label}
                    </span>
  
                  </div>
                )
              })}
  
            </div>
          </div>
  
        </div>
  
  
        {/* Risk Simulator */}
        <div className="mt-9">
  
          <RiskSimulator
            userType={userType}
            academicData={academicData}
            originalRiskScore={riskScore}
            values={simulationValues}
            onChange={onSimulationChange}
          />
  
        </div>
  
      </section>
    )
  }

/* =========================================================
   RECOMMENDATIONS
   ========================================================= */

function Recommendations({ items }) {
  if (!items || !items.length) return null

  return (
    <section>
      <h3 className="font-display text-[1.1rem] font-semibold text-gold">
        Personalized Recommendations
      </h3>

      <ul className="mt-3 grid gap-2.5">
        {items.map((text) => (
          <li
            key={text}
            className="flex gap-2.5 text-[0.9rem] leading-relaxed text-ink"
          >
            <span className="text-sage" aria-hidden="true">
              ✓
            </span>

            <span>{text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* =========================================================
   STUDY PLAN
   ========================================================= */

function StudyPlan({ plan }) {
  if (!plan) return null

  return (
    <section className="rounded-sm border border-gold/40 bg-surface p-6">
      <h3 className="font-display text-[1.1rem] font-semibold text-gold">
        Recommended Study Plan
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
            Today's Goal
          </p>

          <p className="mt-1 font-medium text-white">{plan.goal}</p>
        </div>

        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
            Recommended Study Time
          </p>

          <p className="mt-1 font-semibold text-white">
            {plan.recommendedTime}
          </p>
        </div>

        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
            Topics to Revise
          </p>

          {plan.topicsToRevise.map((t) => (
            <p key={t} className="mt-1 text-[0.87rem] text-slate">
              • {t}
            </p>
          ))}
        </div>

        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
            Suggested Quiz
          </p>

          <p className="mt-1 text-[0.87rem] text-slate">
            {plan.suggestedQuiz}
          </p>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   ANALYTICS
   ========================================================= */

function AnalyticsCharts({ history }) {
  if (!history) return null

  return (
    <section>
      <h3 className="mb-3.5 font-display text-[1.1rem] font-semibold text-gold">
        Analytics
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TrendChart
          title="Risk Trend Over Time"
          data={history.riskTrend}
          dataKey="risk"
          color="#C1573F"
        />

        <TrendChart
          title="Quiz Performance Trend"
          data={history.quizTrend}
          dataKey="score"
          color="#E8A33D"
        />

        <TrendChart
          title="Study Hours Trend"
          data={history.studyHoursTrend}
          dataKey="hours"
          color="#5C8770"
        />
      </div>
    </section>
  )
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function RiskPrediction() {
  const [screen, setScreen] = useState('input')
  const [userType, setUserType] = useState(null)
  const [academicData, setAcademicData] = useState(null)
  const [engagementData, setEngagementData] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [simulationValues, setSimulationValues] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingEngagement, setLoadingEngagement] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState(null)

  const showEngagement =
    userType === 'self-paced' ||
    (userType === 'college' && Boolean(academicData))

  useEffect(() => {
    let cancelled = false

    async function loadEngagement() {
      if (!showEngagement) {
        setEngagementData(null)
        return
      }

      setLoadingEngagement(true)
      setError('')

      try {
        const response = await api.risk.engagement()
        if (cancelled) return

        setEngagementData(
          response?.engagement || response?.data || response || null
        )
      } catch (err) {
        if (cancelled) return
        console.error('Could not load EarlyRisk engagement:', err)
        setEngagementData(null)
        setError(err.message || 'Could not load your platform engagement.')
      } finally {
        if (!cancelled) setLoadingEngagement(false)
      }
    }

    loadEngagement()

    return () => {
      cancelled = true
    }
  }, [showEngagement])

  const handleSelectType = (type) => {
    setError('')
    setPrediction(null)
    setHistory(null)
    setUserType(type)

    if (type === 'self-paced') {
      setAcademicData(null)
    }

    if (type === 'college') {
      setModalOpen(true)
    }
  }

  const handleModalContinue = (data) => {
    setAcademicData(data)
    setModalOpen(false)
    setError('')
  }

  const handlePredict = async () => {
    if (!userType) {
      setError('Please select your learner type first.')
      return
    }

    if (!engagementData) {
      setError('Your platform engagement data is not available yet.')
      return
    }

    setPredicting(true)
    setError('')

    try {
      const response = await api.risk.predict({
        userType,
        academicData: academicData || {},
        engagementData,
      })

      const result =
        response?.prediction || response?.result || response?.data || response

      if (!result?.riskScore && result?.riskScore !== 0) {
        throw new Error('The backend returned an invalid EarlyRisk result.')
      }

      setPrediction(result)
      setSimulationValues(result.baseFactors || {})
      setScreen('result')

      try {
        localStorage.setItem(
          RESULT_KEY,
          JSON.stringify({
            level: LEVEL_TO_DASHBOARD[result.riskLevel] || 'Moderate',
            score: result.riskScore,
            at: new Date().toISOString(),
          })
        )
      } catch {
        // localStorage is optional; the database is the source of truth.
      }

      await loadHistory()
    } catch (err) {
      console.error('EarlyRisk prediction failed:', err)
      setError(err.message || 'Could not calculate your EarlyRisk prediction.')
    } finally {
      setPredicting(false)
    }
  }

  async function loadHistory() {
    setLoadingHistory(true)
    try {
      const response = await api.risk.history()
      const rows = response?.history || response?.data || []
      const chronological = [...rows].reverse()

      setHistory(
        chronological.reduce(
          (acc, item, index) => {
            const savedResult = item?.result || {}
            const factors = savedResult?.baseFactors || {}
            const label = `P${index + 1}`

            if (Number.isFinite(Number(item?.score))) {
              acc.riskTrend.push({ week: label, risk: Number(item.score) })
            }

            if (Number.isFinite(Number(factors.quizPerformance))) {
              acc.quizTrend.push({
                week: label,
                score: Number(factors.quizPerformance),
              })
            }

            if (Number.isFinite(Number(factors.studyHours))) {
              acc.studyHoursTrend.push({
                week: label,
                hours: Number(factors.studyHours),
              })
            }

            return acc
          },
          { riskTrend: [], quizTrend: [], studyHoursTrend: [] }
        )
      )
    } catch (err) {
      console.warn('Could not load EarlyRisk history:', err)
      setHistory({ riskTrend: [], quizTrend: [], studyHoursTrend: [] })
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleRecalculate = () => {
    setUserType(null)
    setAcademicData(null)
    setEngagementData(null)
    setPrediction(null)
    setSimulationValues(null)
    setHistory(null)
    setError('')
    setScreen('input')
  }

  const recommendations = useMemo(
    () => (prediction ? getMockRecommendations(userType) : []),
    [prediction, userType]
  )

  const studyPlan = useMemo(
    () => (prediction ? getStudyPlan() : null),
    [prediction]
  )


  /* =========================================================
   RESULT SCREEN
   ========================================================= */

if (screen === 'result' && prediction) {
  return (
    <div className="mx-auto max-w-[1360px] px-4 pt-6 pb-16 sm:px-6 sm:pt-8">

      {/* Back button */}
      <button
        type="button"
        onClick={() => setScreen('input')}
        className="mb-4 text-[0.85rem] font-medium text-slate-300 hover:text-white"
      >
        ← Back to EarlyRisk
      </button>

      {/* Page Header */}
      <div className="mb-7">
        <h1 className="font-display text-[2.2rem] font-semibold tracking-tight text-white">
          EarlyRisk Result
        </h1>

        <p className="mt-2 text-[0.95rem] text-slate-300">
          Your personalized learning risk analysis.
        </p>
      </div>

      {/* RESULT CARD */}
      <div
        className="
          rounded-xl
          border
          border-[#E8A33D]
          bg-[#111c30]
          p-6
          shadow-[0_0_22px_rgba(232,163,61,0.12)]
        "
      >

        {/* Card heading */}
        <h2 className="font-display text-[1.25rem] font-semibold text-gold">
          Your EarlyRisk Result
        </h2>

        {/* Result content */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-12">

          {/* Gauge */}
          <div className="flex justify-center">
            <RiskGauge
              score={prediction.riskScore}
              level={prediction.riskLevel}
              size={200}
              label="Risk Score"
            />
          </div>

          {/* Confidence */}
          <div className="min-w-[210px]">

            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-slate-400">
                Prediction Confidence
              </p>

              <p className="mt-2 font-display text-[1.55rem] font-semibold text-[#E8A33D]">
                {prediction.confidence}%
              </p>
            </div>

            <div className="mt-6">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-slate-400">
                Prediction Based On
              </p>

              <p className="mt-2 font-display text-[1rem] font-semibold text-white">
                {prediction.dataSources}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* WHY THIS RISK */}
      <div className="mt-6 rounded-xl border border-[#263754] bg-[#111c30] p-6">

        <h2 className="font-display text-[1.25rem] font-semibold text-gold">
          Why this risk?
        </h2>

        <ul className="mt-4 grid gap-2.5">
          {prediction.reasons.map((r) => (
            <li
              key={r.text}
              className="flex gap-2.5 text-[0.9rem] leading-relaxed text-slate-200"
            >
              <span
                className={
                  r.type === 'warning'
                    ? 'text-[#C1573F]'
                    : 'text-[#4ADE80]'
                }
                aria-hidden="true"
              >
                {r.type === 'warning' ? '⚠' : '✓'}
              </span>

              <span>{r.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* IMPROVEMENT ANALYZER */}
      <div className="mt-6 rounded-xl border border-[#263754] bg-[#111c30] p-6">
        <ImprovementAnalyzer
          prediction={prediction}
          userType={userType}
          academicData={academicData}
          simulationValues={simulationValues}
          onSimulationChange={setSimulationValues}
        />
      </div>

      {/* RECOMMENDATIONS */}
      <div className="mt-6 rounded-xl border border-[#263754] bg-[#111c30] p-6">
        <Recommendations items={recommendations} />
      </div>

      {/* STUDY PLAN */}
      <div className="mt-6">
        <StudyPlan plan={studyPlan} />
      </div>

      {/* ANALYTICS */}
      <div className="mt-8">
        <AnalyticsCharts history={history} />
      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-[#263754] pt-6">

        <Btn
          variant="outline"
          onClick={() => setScreen('input')}
        >
          ← Back to EarlyRisk
        </Btn>

        <Btn onClick={handleRecalculate}>
          Recalculate Risk
        </Btn>

      </div>
    </div>
  )
}

  /* =========================================================
     INPUT SCREEN
     ========================================================= */

  return (
    <div className="mx-auto max-w-[1360px] px-4 pt-6 pb-16 sm:px-6 sm:pt-8">

      {/* EARLY RISK HEADER */}
      <div className="mb-10">
        <h1 className="font-display text-[2rem] font-semibold tracking-tight text-white">
          Early<span className="text-[#E8A33D]">Risk</span>
        </h1>

        <p className="mt-2 text-[0.95rem] text-slate-300">
          Identify learning risks early and receive personalized recommendations.
        </p>
      </div>

      {/* WHO ARE YOU? */}
      <section>
        <h1 className="font-display text-[1.35rem] font-semibold text-white">
          Who are you?
        </h1>

        <div className="mt-5">
          <UserTypeSelector
            selected={userType}
            onSelect={handleSelectType}
          />
        </div>
      </section>

      {/* ACADEMIC MODAL */}
      <AcademicModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onContinue={handleModalContinue}
      />

      {/* COLLEGE ACADEMIC DETAILS */}
      {userType === 'college' && academicData && (
        <div className="mt-5 rounded-xl border border-[#263754] bg-[#111c30] p-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.87rem] text-slate-300">
            <span className="text-slate-400">
              Academic details saved:
            </span>

            <span>
              CGPA{' '}
              <b className="text-[#E8A33D]">
                {academicData.cgpa}
              </b>
            </span>

            <span>
              Attendance{' '}
              <b className="text-[#E8A33D]">
                {academicData.attendance}%
              </b>
            </span>

            <span>
              Internal Marks{' '}
              <b className="text-[#E8A33D]">
                {academicData.internalMarks}%
              </b>
            </span>

            <span>
              Backlogs{' '}
              <b className="text-[#E8A33D]">
                {academicData.backlogs}
              </b>
            </span>
          </div>
        </div>
      )}

      {/* PLATFORM ENGAGEMENT */}
      {error && (
        <div className="mb-6 rounded-xl border border-[#C1573F] bg-[#2a1715] px-5 py-4 text-[0.88rem] leading-relaxed text-[#ffb4a9]">
          {error}
        </div>
      )}

      {showEngagement && (
        <section className="mt-9">
          {loadingEngagement ? (
            <div className="rounded-xl border border-[#263754] bg-[#111c30] p-6 text-center text-[0.9rem] text-slate-400">
              Loading your platform engagement from the database...
            </div>
          ) : (
            <EngagementCards data={engagementData} />
          )}
        </section>
      )}

      {/* PREDICT BUTTON */}
      {showEngagement && engagementData && (
        <div className="mt-8 flex justify-center">
          <Btn
            onClick={handlePredict}
            disabled={predicting || loadingEngagement}
            className="px-9 py-3.5 text-[1rem]"
          >
            {predicting ? '🔮 Saving Risk Prediction...' : '🔮 Predict My Risk'}
          </Btn>
        </div>
      )}
    </div>
  )
}
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { INTEREST_TAGS, CAREERS } from '../data/careers.js'
import { getCareerRoadmap } from '../data/careerRoadmaps.js'
import { logActivity } from '../lib/activityLog.js'
import { api } from '../lib/api.js'
import { SUPPORTED_MODELS } from '../lib/ragEngine.js'
import GlassCard from '../components/GlassCard.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import AchievementBadge from '../components/AchievementBadge.jsx'
import AIMascot from '../components/AIMascot.jsx'
import './career-guidance.css'

/* ───────── constants & data ───────── */
const STRENGTHS = [
  { icon: '💻', label: 'Programming', level: 85 },
  { icon: '🧩', label: 'Problem Solving', level: 78 },
  { icon: '📊', label: 'Analytics', level: 72 },
  { icon: '🎨', label: 'Creativity', level: 68 },
]

const AI_MESSAGES = [
  "Your coding skills are cooking 🔥👨‍💻",
  "SQL is giving you side-eye. Time to practice 😭",
  "You're only 3 skills away from your target career 🚀",
  "Future you will thank you for today's 30 minutes. Probably. 😌",
  "Your Python game is getting stronger every day 💪🐍",
  "Data Structures? More like Data Adventures 🗺️",
  "You're outperforming 73% of learners this week 📈",
  "Your roadmap is progressing — keep that momentum going 🏃",
  "Every commit is a step closer to your dream job ⭐",
  "Debugging builds character. And also patience. Lots of patience 😅",
]

const SKILL_MAP = {
  'Data Structures & Algorithms': { level: 75, required: 92 },
  'System Design': { level: 55, required: 80 },
  'Python': { level: 88, required: 95 },
  'Machine Learning': { level: 42, required: 85 },
  'SQL': { level: 70, required: 88 },
  'Git': { level: 80, required: 90 },
  'OOP': { level: 78, required: 88 },
  'Docker': { level: 35, required: 70 },
  'Cloud (AWS/GCP)': { level: 30, required: 75 },
  'TypeScript': { level: 60, required: 82 },
  'React / Frontend': { level: 65, required: 78 },
  'REST APIs': { level: 72, required: 85 },
  'Testing': { level: 45, required: 72 },
  'CI/CD': { level: 28, required: 68 },
  'Agile / Scrum': { level: 50, required: 70 },
  'Communication': { level: 70, required: 80 },
}

const SKILL_LABELS = { 90: 'Strong', 70: 'Good', 50: 'Improving', 30: 'Needs Practice', 0: 'Locked' }
function skillLabel(lv) {
  if (lv >= 90) return SKILL_LABELS[90]
  if (lv >= 70) return SKILL_LABELS[70]
  if (lv >= 50) return SKILL_LABELS[50]
  if (lv >= 30) return SKILL_LABELS[30]
  return SKILL_LABELS[0]
}
const SKILL_ICONS = { 'Strong': '🔥', 'Good': '✅', 'Improving': '⚡', 'Needs Practice': '🧠', 'Locked': '🔒' }
const SKILL_COLORS = { 'Strong': '#22c55e', 'Good': 'var(--accent)', 'Improving': '#f59e0b', 'Needs Practice': '#f97316', 'Locked': '#ef4444' }

const XP_THRESHOLDS = [
  { level: 1, xp: 0 }, { level: 2, xp: 300 }, { level: 3, xp: 700 },
  { level: 4, xp: 1200 }, { level: 5, xp: 1800 }, { level: 6, xp: 2500 },
  { level: 7, xp: 3300 }, { level: 8, xp: 4200 }, { level: 9, xp: 5300 }, { level: 10, xp: 6600 },
]

function levelForXP(xp) {
  let lv = 1
  for (const t of XP_THRESHOLDS) { if (xp >= t.xp) lv = t.level; else break }
  return lv
}

const ACHIEVEMENTS = [
  { icon: '🏆', title: 'First Career Match', desc: 'Got your first AI career recommendation', xp: 100, key: 'first_match' },
  { icon: '🚀', title: 'Roadmap Starter', desc: 'Started your first career roadmap', xp: 150, key: 'roadmap_starter' },
  { icon: '🎯', title: 'Milestone Master', desc: 'Completed a career roadmap milestone', xp: 250, key: 'milestone_master' },
  { icon: '💡', title: 'Fast Learner', desc: 'Improved 2+ skills in one session', xp: 200, key: 'fast_learner' },
  { icon: '🔥', title: 'Skill Streak', desc: 'Practiced skills 3 days in a row', xp: 150, key: 'streak_3' },
  { icon: '👑', title: 'Career Ready', desc: 'Completed all roadmap milestones', xp: 500, key: 'career_ready' },
]

/* ───────── matching helpers ───────── */
function topMatches(tags, text, n = 4) {
  const scores = CAREERS.map(c => {
    const tagOverlap = c.tags.filter(t => tags.has(t)).length
    let written = 0
    if (text) {
      const lower = text.toLowerCase()
      c.tags.forEach(t => { if (lower.includes(t.toLowerCase())) written++ })
      ;(c.keywords || []).forEach(k => { if (lower.includes(k)) written++ })
    }
    const raw = tagOverlap + written
    const ceiling = c.tags.length + (c.keywords ? c.keywords.length : 0) + c.tags.length
    return { career: c, pct: Math.min(100, Math.round((raw / ceiling) * 220)), raw }
  })
  scores.sort((a, b) => b.pct - a.pct || b.raw - a.raw)
  return scores.slice(0, n)
}

function skillLevelForCareer(career) {
  if (!career || !career.skills) return 75
  const skills = career.skills.slice(0, 4)
  let total = 0
  skills.forEach(s => {
    const map = SKILL_MAP[s]
    total += map ? map.level : 65
  })
  return Math.min(100, Math.round(total / (skills.length || 1)))
}

/* ───────── sub-component: SkillBar ───────── */
function SkillBar({ name, level, required, delay = 0 }) {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80 + delay); return () => clearTimeout(t) }, [delay])
  const lbl = skillLabel(level)

  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[0.82rem] font-medium" style={{ color: 'var(--text-primary)' }}>{name}</span>
        <span className="flex items-center gap-1.5">
          <span className="rounded-full px-2 py-0.5 text-[0.65rem] font-bold"
            style={{ background: `${SKILL_COLORS[lbl]}22`, color: SKILL_COLORS[lbl] }}>
            {SKILL_ICONS[lbl]} {lbl}
          </span>
          <span className="font-mono text-[0.72rem]" style={{ color: 'var(--text-muted)' }}>{level}%</span>
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
        <div ref={ref}
          className="cg-bar absolute inset-y-0 left-0 rounded-full"
          style={{ '--bar-pct': `${level}%`, background: `linear-gradient(90deg, ${SKILL_COLORS[lbl]}, ${SKILL_COLORS[lbl]}88)` }}
          data-animated={mounted ? '1' : '0'}
        />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="font-mono text-[0.62rem]" style={{ color: 'var(--text-muted)' }}>Required: {required}%</span>
        <div className="h-px flex-1 mx-3" style={{ background: 'var(--border-primary)' }} />
        <span className="font-mono text-[0.62rem]" style={{ color: level >= required ? '#22c55e' : '#f59e0b' }}>
          {level >= required ? '✓ Meets requirement' : `${required - level}% gap`}
        </span>
      </div>
    </div>
  )
}

/* ───────── MAIN COMPONENT ───────── */
export default function CareerGuidance() {
  /* user selection state */
  const [selected, setSelected] = useState(new Set())
  const [text, setText] = useState('')
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [isRoadmapVisible, setIsRoadmapVisible] = useState(false)

  /* roadmap & gamification state */
  const [activeRoadmapStep, setActiveRoadmapStep] = useState(0)
  const [viewingMilestone, setViewingMilestone] = useState(1)
  const [completedTasks, setCompletedTasks] = useState(new Set())
  const [careerXP, setCareerXP] = useState(2550)
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set(['first_match']))
  const [aiMsgIdx, setAiMsgIdx] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [taskFeedback, setTaskFeedback] = useState(null)

  /* refs for smooth navigation */
  const matchesSectionRef = useRef(null)
  const careerPathRef = useRef(null)
  const roadmapSectionRef = useRef(null)
  const mentorSectionRef = useRef(null)

  /* AI Career Mentor state */
  const [mentorModel, setMentorModel] = useState('groq-llama-3.3-70b')
  const [mentorMode, setMentorMode] = useState('sprint') // 'sprint' | 'interview' | 'projects' | 'custom'
  const [mentorCustomQuery, setMentorCustomQuery] = useState('')
  const [mentorAdvice, setMentorAdvice] = useState('')
  const [mentorLoading, setMentorLoading] = useState(false)
  const [mentorCopied, setMentorCopied] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  /* derived matches */
  const hasSignal = selected.size > 0 || text.trim().length > 0
  const matches = useMemo(() => topMatches(selected, text, 4), [selected, text])

  const expandedCareer = useMemo(() => {
    if (!selectedCareer) {
      if (hasGenerated && matches[0]) return matches[0]
      return null
    }
    const found = matches.find(m => m.career.name === selectedCareer)
    if (found) return found
    const c = CAREERS.find(c => c.name === selectedCareer)
    if (c) return { career: c, pct: 92, raw: 5 }
    return null
  }, [selectedCareer, matches, hasGenerated])

  const currentLevel = useMemo(() => levelForXP(careerXP), [careerXP])

  /* Full Career Roadmap Data */
  const roadmapMilestones = useMemo(() => {
    return getCareerRoadmap(expandedCareer?.career)
  }, [expandedCareer])

  const activeMilestoneData = useMemo(() => {
    const safeIdx = Math.max(1, Math.min(viewingMilestone, roadmapMilestones.length))
    return roadmapMilestones.find(m => m.id === safeIdx) || roadmapMilestones[0]
  }, [roadmapMilestones, viewingMilestone])

  /* Overall Roadmap completion percentage */
  const roadmapProgressPct = useMemo(() => {
    if (activeRoadmapStep === 0) return 0
    if (activeRoadmapStep >= 5) {
      // Check if all tasks in phase 5 are checked
      const allTasks = roadmapMilestones.flatMap(m => m.tasks)
      const finished = allTasks.filter(t => completedTasks.has(t.id)).length
      return Math.min(100, Math.max(85, Math.round((finished / allTasks.length) * 100)))
    }
    const baseStepPct = (activeRoadmapStep - 1) * 20
    const currentTasks = activeMilestoneData?.tasks || []
    const completedCurrent = currentTasks.filter(t => completedTasks.has(t.id)).length
    const taskBonus = currentTasks.length ? Math.round((completedCurrent / currentTasks.length) * 20) : 0
    return Math.min(100, baseStepPct + taskBonus)
  }, [activeRoadmapStep, activeMilestoneData, completedTasks, roadmapMilestones])

  /* Load persisted state from PostgreSQL and localStorage */
  useEffect(() => {
    let cancelled = false

    async function loadCareerState() {
      try {
        const [latest, progress] = await Promise.all([
          api.career.latestResult().catch(() => null),
          api.career.progress().catch(() => null),
        ])

        if (cancelled) return

        let loadedCareer = null
        if (progress?.progress) {
          setCareerXP(Number(progress.progress.xp ?? 2550))
          const step = Number(progress.progress.roadmapStep ?? 0)
          setActiveRoadmapStep(step)
          if (step > 0) {
            setViewingMilestone(Math.min(5, step))
          }
          if (Array.isArray(progress.progress.achievements) && progress.progress.achievements.length > 0) {
            setUnlockedAchievements(new Set(progress.progress.achievements))
          }
          if (progress.progress.selectedCareer) {
            loadedCareer = progress.progress.selectedCareer
            setSelectedCareer(loadedCareer)
            setHasGenerated(true)
          }
        }

        if (latest?.result?.career?.name) {
          setHasGenerated(true)
          if (!loadedCareer) {
            setSelectedCareer(latest.result.career.name)
            loadedCareer = latest.result.career.name
          }
        }

        // Restore task checkboxes from localStorage
        const careerKey = loadedCareer || selectedCareer || 'default'
        try {
          const savedTasks = localStorage.getItem(`edusentry_cg_tasks_${careerKey}`)
          if (savedTasks) {
            const parsed = JSON.parse(savedTasks)
            if (Array.isArray(parsed)) {
              setCompletedTasks(new Set(parsed))
            }
          }
        } catch (e) {
          console.warn('Could not read saved task state:', e)
        }
      } catch (error) {
        console.warn('Could not load Career Guidance state:', error)
      }
    }

    loadCareerState()
    return () => { cancelled = true }
  }, [])

  /* rotate AI mascot tips */
  useEffect(() => {
    const iv = setInterval(() => setAiMsgIdx(i => (i + 1) % AI_MESSAGES.length), 6000)
    return () => clearInterval(iv)
  }, [])

  /* trigger CSS animated skill-bars */
  useEffect(() => {
    document.querySelectorAll('.cg-bar[data-animated="1"]').forEach(el => el.classList.add('animated'))
  })

  /* handlers */
  const toggleTag = useCallback((tag) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
    setHasGenerated(false)
    setIsRoadmapVisible(false)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!hasSignal || !matches[0]) return

    const top = matches[0]
    setHasGenerated(true)
    setIsRoadmapVisible(false) // Initially keep roadmap hidden when AI match is generated
    setSelectedCareer(top.career.name)

    const nextAchievements = new Set(unlockedAchievements)
    nextAchievements.add('first_match')
    setUnlockedAchievements(nextAchievements)

    const nextXP = Math.max(careerXP, 2650)
    setCareerXP(nextXP)

    // Smooth scroll down to matched options
    setTimeout(() => {
      const target = matchesSectionRef.current || document.getElementById('career-matches-section')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 120)

    try {
      await api.career.saveResult({
        selectedInterests: Array.from(selected),
        inputText: text.trim(),
        career: top.career,
        matchPercent: top.pct,
      })

      await api.career.saveProgress({
        xp: nextXP,
        roadmapStep: activeRoadmapStep,
        selectedCareer: top.career.name,
        achievements: Array.from(nextAchievements),
      })

      await logActivity('career', {
        matches: matches.map(m => ({ name: m.career.name, pct: m.pct })),
      })
    } catch (error) {
      console.error('Career Guidance save failed:', error)
    }
  }, [hasSignal, matches, unlockedAchievements, careerXP, selected, text, activeRoadmapStep])

  const handleSelectCareer = useCallback((name) => {
    setSelectedCareer(name)
    setIsRoadmapVisible(false) // Keep hidden until user explicitly clicks Start My Roadmap for this career

    // Smooth scroll down to the deep dive section
    setTimeout(() => {
      const target = careerPathRef.current || document.getElementById('career-path-section')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 120)

    const foundMatch = matches.find(m => m.career?.name === name)
    const foundCareer = foundMatch?.career || CAREERS.find(c => c.name === name) || { name, skills: [], desc: '' }
    const pct = foundMatch?.pct || 94

    api.career.saveProgress({
      xp: careerXP,
      roadmapStep: activeRoadmapStep,
      selectedCareer: name,
      achievements: Array.from(unlockedAchievements),
    }).catch(error => console.warn('Could not save career progress:', error))

    api.career.saveResult({
      selectedInterests: Array.from(selected),
      inputText: text.trim(),
      career: foundCareer,
      matchPercent: pct,
    }).catch(error => console.warn('Could not save career result:', error))
  }, [matches, careerXP, activeRoadmapStep, unlockedAchievements, selected, text])

  /* ═══════════════════════════════════════════════════════
     ROADMAP ACTIONS: Start, Check tasks, Advance, Reset
     ═══════════════════════════════════════════════════════ */

  const handleStartRoadmap = useCallback(() => {
    setIsRoadmapVisible(true) // Display the roadmap when clicked
    const nextAchievements = new Set(unlockedAchievements)
    nextAchievements.add('roadmap_starter')
    const nextStep = activeRoadmapStep === 0 ? 1 : activeRoadmapStep
    setActiveRoadmapStep(nextStep)
    setViewingMilestone(nextStep)
    setUnlockedAchievements(nextAchievements)

    const nextXP = Math.max(careerXP, 2800)
    setCareerXP(nextXP)

    // Smooth scroll down to the newly displayed roadmap section
    setTimeout(() => {
      const roadmapEl = roadmapSectionRef.current || document.getElementById('interactive-roadmap-section')
      if (roadmapEl) {
        roadmapEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 150)

    const targetName = selectedCareer || expandedCareer?.career?.name || matches[0]?.career?.name || 'Software Engineer'

    api.career.saveProgress({
      xp: nextXP,
      roadmapStep: nextStep,
      selectedCareer: targetName,
      achievements: Array.from(nextAchievements),
    }).catch(error => console.warn('Could not save roadmap state:', error))

    if (expandedCareer?.career) {
      api.career.saveResult({
        selectedInterests: Array.from(selected),
        inputText: text.trim(),
        career: expandedCareer.career,
        matchPercent: expandedCareer.pct || 94,
      }).catch(error => console.warn('Could not save career result:', error))
    }
  }, [unlockedAchievements, activeRoadmapStep, careerXP, selectedCareer, expandedCareer, matches, selected, text])

  const handleToggleTask = useCallback((taskId) => {
    setCompletedTasks(prev => {
      const next = new Set(prev)
      const isChecking = !next.has(taskId)
      if (isChecking) {
        next.add(taskId)
        const bonusXP = 25
        setCareerXP(xp => {
          const updated = xp + bonusXP
          api.career.saveProgress({
            xp: updated,
            roadmapStep: activeRoadmapStep || 1,
            selectedCareer,
            achievements: Array.from(unlockedAchievements),
          }).catch(console.warn)
          return updated
        })
        setTaskFeedback(`+25 XP! Task completed!`)
        setTimeout(() => setTaskFeedback(null), 2400)
      } else {
        next.delete(taskId)
      }

      // Save to localStorage
      try {
        const cKey = selectedCareer || 'default'
        localStorage.setItem(`edusentry_cg_tasks_${cKey}`, JSON.stringify(Array.from(next)))
      } catch (e) {
        console.warn(e)
      }

      return next
    })
  }, [activeRoadmapStep, selectedCareer, unlockedAchievements])

  const handleAdvanceMilestone = useCallback((milestoneId) => {
    const nextStep = Math.min(milestoneId + 1, 5)
    setActiveRoadmapStep(nextStep)
    setViewingMilestone(Math.min(nextStep, 5))

    const nextAchievements = new Set(unlockedAchievements)
    nextAchievements.add('roadmap_starter')
    nextAchievements.add('milestone_master')
    if (milestoneId >= 4) {
      nextAchievements.add('career_ready')
    }
    setUnlockedAchievements(nextAchievements)

    const nextXP = careerXP + 150
    setCareerXP(nextXP)
    setTaskFeedback(`🎉 Phase ${milestoneId} Complete! +150 XP!`)
    setTimeout(() => setTaskFeedback(null), 3000)

    api.career.saveProgress({
      xp: nextXP,
      roadmapStep: nextStep,
      selectedCareer,
      achievements: Array.from(nextAchievements),
    }).catch(error => console.warn('Could not advance roadmap milestone:', error))
  }, [unlockedAchievements, careerXP, selectedCareer])

  const handleResetRoadmap = useCallback(() => {
    if (!window.confirm('Are you sure you want to restart your roadmap progression for this career?')) return
    setActiveRoadmapStep(1)
    setViewingMilestone(1)
    setCompletedTasks(new Set())
    try {
      const cKey = selectedCareer || 'default'
      localStorage.removeItem(`edusentry_cg_tasks_${cKey}`)
    } catch (e) {}

    api.career.saveProgress({
      xp: careerXP,
      roadmapStep: 1,
      selectedCareer,
      achievements: Array.from(unlockedAchievements),
    }).catch(console.warn)
  }, [careerXP, selectedCareer, unlockedAchievements])

  /* ═══════════════════════════════════════════════════════
     AI CAREER MENTOR DISPATCHER
     ═══════════════════════════════════════════════════════ */

  async function generateMentorAdvice(overrideMode, overrideCustom, specificMilestoneTitle) {
    const activeMode = overrideMode || mentorMode
    const customQ = overrideCustom !== undefined ? overrideCustom : mentorCustomQuery
    const targetCareer = expandedCareer?.career?.name || selectedCareer || matches[0]?.career?.name || 'Full Stack Engineer'
    const skillsList = expandedCareer?.career?.skills?.join(', ') || 'Modern Web, DSA, System Design, Cloud'

    let queryPrompt = ''
    if (specificMilestoneTitle) {
      queryPrompt = `As an elite AI Career Mentor in technology, formulate a high-yield 7-Day Intensive Action Plan for a student pursuing ${targetCareer} who is currently working on: "${specificMilestoneTitle}". Provide day-by-day actionable study goals, concrete code/portfolio tasks, and recommended practice drills.`
    } else if (activeMode === 'custom' && customQ) {
      queryPrompt = `As an elite AI Career Mentor, answer this career and tech learning question specifically tailored for an aspiring ${targetCareer} (Key target skills: ${skillsList}): "${customQ}". Provide concrete, actionable, industry-tested guidance with portfolio and technical interview tips.`
    } else if (activeMode === 'sprint') {
      queryPrompt = `As an elite AI Career Mentor, formulate a high-yield 30-Day Intensive Skill Sprint plan for a student targeting the role of ${targetCareer}.
Break it down into 4 actionable weekly milestones:
- Week 1: Foundational Competencies & Core Tooling
- Week 2: Hands-on Technical Implementation & Algorithmic Drills
- Week 3: End-to-End System Integration & Real-World Projects
- Week 4: Capstone Portfolio Polish, GitHub Documentation & Technical Interview Readiness.
Target industry skills: ${skillsList}. Provide crisp bullet points with measurable weekly outputs.`
    } else if (activeMode === 'interview') {
      queryPrompt = `As an elite tech hiring manager and AI Career Mentor, provide the Top 5 technical interview questions for a ${targetCareer} role (Target skills: ${skillsList}).
For each question:
1. Exact interview question stem
2. What hiring managers are really evaluating
3. High-yield model answer & architectural principles to emphasize.`
    } else if (activeMode === 'projects') {
      queryPrompt = `As a principal engineer and AI Career Mentor, propose 3 standout, resume-defining portfolio projects for an aspiring ${targetCareer}.
For each project:
1. Project title & 1-sentence value proposition
2. Recommended production tech stack (incorporating: ${skillsList})
3. Key engineering challenge that will impress technical recruiters during interviews.`
    }

    setMentorLoading(true)
    setMentorAdvice('')

    // Smooth scroll down to mentor section if triggered from roadmap
    if (specificMilestoneTitle && mentorSectionRef.current) {
      mentorSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    try {
      // First attempt backend Multi-LLM provider
      const response = await api.rag.generate({
        question: queryPrompt,
        modelId: mentorModel,
        mode: 'pedagogical',
        docs: [],
      })
      if (response?.text) {
        setMentorAdvice(response.text)
      } else {
        throw new Error('Empty response from model')
      }
    } catch (err) {
      // High-yield tailored fallback advice if cloud model endpoint is unavailable
      const fallbackAdvice = `### 🚀 AI Career Mentor: Action Plan for ${targetCareer}
**Target Milestone:** ${specificMilestoneTitle || 'High-Yield Career Progression'}
**Key Competencies:** ${skillsList}

---
#### 📅 7-Day High-Impact Execution Sprint:
- **Day 1 (Foundations & Tooling):** Configure your local environment with strict linting, Git branching, and create a dedicated project repository. Review foundational documentation for **${expandedCareer?.career?.skills?.[0] || 'core languages'}**.
- **Day 2 (Core Architecture):** Implement basic procedural routines and unit tests. Verify error handling and edge cases.
- **Day 3 (Data Structures & State):** Integrate relational persistence or state management. Benchmark computational complexity.
- **Day 4 (Integration & APIs):** Build verified interface endpoints or interactive modules connecting your backend to UI components.
- **Day 5 (Robustness & Security):** Audit input validation, add structured error boundaries, and write integration tests.
- **Day 6 (Portfolio Polish & README):** Write an architectural README with a high-level system diagram, deployment steps, and quantified impact.
- **Day 7 (Mock Interview & Retrospective):** Practice explaining your engineering design decisions out loud using the STAR method.

*(AI Mentor note: Generated in offline synthesis mode. Select Gemini or Groq in the model picker for live multi-turn LLM reasoning.)*`

      setMentorAdvice(fallbackAdvice)
    } finally {
      setMentorLoading(false)
    }
  }

  function handleCopyMentorAdvice() {
    if (!mentorAdvice) return
    navigator.clipboard.writeText(mentorAdvice)
    setMentorCopied(true)
    setTimeout(() => setMentorCopied(false), 2000)
  }

  return (
    <div className="career-guidance-root mx-auto max-w-[1360px] px-4 pt-6 pb-16 sm:px-6 sm:pt-8">

      {/* Floating Task / XP Feedback Toast */}
      {taskFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-2xl cg-slide-up"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent)', color: 'var(--text-primary)' }}>
          <span className="text-lg">⭐</span>
          <span className="font-display text-[0.88rem] font-semibold">{taskFeedback}</span>
        </div>
      )}

      {/* ─── PAGE HEADER ─── */}
      <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border-primary)' }}>
        <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>
          <span className="inline-block h-px w-[26px]" style={{ background: 'var(--accent)' }} />
          Career Compass & Milestone Roadmap
        </div>
        <h2 className="mt-4 mb-3 font-display text-[clamp(1.8rem,3.4vw,2.4rem)] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Your AI Career Companion
        </h2>
        <p className="max-w-[650px] text-[0.94rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Discover your ideal career path with AI-powered matching, then follow an interactive step-by-step roadmap to acquire skills and build job-ready portfolio projects.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — YOUR CAREER COMPASS & INTEREST MATCHING
          ═══════════════════════════════════════════════════ */}
      <div className="mb-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-5 cg-compass-grid">
        {/* Compass visualization — left 3 cols */}
        <div className="lg:col-span-3 h-full">
          <GlassCard className={`relative h-full overflow-hidden ${mounted ? 'cg-slide-up' : ''}`} style={{ animationDelay: '100ms' }}>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cg-float-dot absolute h-1.5 w-1.5 rounded-full"
                  style={{
                    background: 'var(--accent)', left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`,
                    '--d': `${3 + i * 0.7}s`, '--dd': `${i * 0.4}s`,
                  }} />
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-4">
              <div className="relative mb-6">
                <svg width="190" height="190" viewBox="0 0 160 160" className="cg-compass-pulse">
                  <circle cx="80" cy="80" r="72" fill="none" stroke="var(--border-primary)" strokeWidth="2" />
                  <circle cx="80" cy="80" r="60" fill="none" stroke="var(--accent-dim)" strokeWidth="1" strokeDasharray="4 8" />
                  <circle cx="80" cy="80" r="48" fill="none" stroke="var(--accent-glow)" strokeWidth="0.5" strokeDasharray="2 6" />
                  <circle cx="80" cy="80" r="72" fill="none" stroke="var(--accent)" strokeWidth="2.5"
                    strokeDasharray={`${2 * Math.PI * 72}`} strokeDashoffset={`${2 * Math.PI * 72 * (1 - 0.82)}`}
                    strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px', filter: 'drop-shadow(0 0 6px var(--accent-glow))', transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[3rem] font-bold font-display leading-none" style={{ color: 'var(--text-primary)' }}>
                    <AnimatedCounter value={82} duration={1800} />
                  </div>
                  <div className="font-mono text-[0.6rem] uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                    Career Readiness
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-[340px]">
                {STRENGTHS.map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                    <span className="text-[1.1rem]">{s.icon}</span>
                    <div>
                      <div className="text-[0.82rem] font-medium" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
                      <div className="h-1 w-16 overflow-hidden rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${s.level}%`, background: 'var(--accent)', transition: 'width 1s ease-out 0.5s' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Interest selection — right 2 cols */}
        <div className="lg:col-span-2 h-full">
          <GlassCard className={`h-full ${mounted ? 'cg-slide-up' : ''}`} style={{ animationDelay: '200ms' }}>
            <h4 className="mb-1 font-display text-[1.05rem] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Tag your interests
            </h4>
            <p className="mb-5 text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>
              Select one or more areas to guide the recommendation engine.
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {INTEREST_TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className="select-none rounded-xl border px-3 py-2 text-[0.78rem] font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: selected.has(tag) ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: selected.has(tag) ? 'white' : 'var(--text-secondary)',
                    border: selected.has(tag) ? '1px solid transparent' : '1px solid var(--border-primary)',
                    boxShadow: selected.has(tag) ? '0 0 12px var(--accent-glow)' : 'none',
                  }}>
                  {tag}
                </button>
              ))}
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--border-primary), transparent)' }} />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>Or describe yourself</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--border-primary), transparent)' }} />
            </div>

            <textarea className="input-base min-h-[80px] resize-y" maxLength={280}
              placeholder="e.g. I enjoy coding web applications, analyzing algorithms, and working with Python..."
              value={text}
              onChange={e => { setText(e.target.value); setHasGenerated(false) }} />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="font-mono text-[0.68rem]" style={{ color: 'var(--text-muted)' }}>{text.length} / 280</span>
              <span className="font-mono text-[0.68rem]" style={{ color: 'var(--text-muted)' }}>{selected.size} selected</span>
            </div>

            <button type="button" onClick={handleGenerate} disabled={!hasSignal}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-[0.87rem] font-semibold tracking-wide transition-all duration-250 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: 'var(--accent)', color: 'white', border: '1px solid transparent', boxShadow: '0 0 12px var(--accent-glow)' }}>
              🤖 Generate AI Matches
            </button>
          </GlassCard>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — AI CAREER MATCHES & DEEP DIVE PANEL
          ═══════════════════════════════════════════════════ */}
      {hasGenerated && (
        <div ref={matchesSectionRef} id="career-matches-section" className="mb-10 cg-slide-up scroll-mt-20" style={{ animationDelay: '100ms' }}>
          <GlassCard className="mb-6">
            <div className="flex items-center gap-4">
              <AIMascot size={52} />
              <div>
                <div className="font-mono text-[0.68rem] uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--accent)' }}>
                  AI Career Guardian
                </div>
                <p className="text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Based on your interests and strengths, we recommend the following target roles. Select any career to inspect required skills and launch your personalized roadmap:
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {matches.map((m, i) => {
              const isSelected = selectedCareer === m.career.name
              const readiness = skillLevelForCareer(m.career)
              return (
                <div key={m.career.name} className={`cg-card-glow cg-card-enter rounded-2xl border p-5 transition-all duration-300 cursor-pointer`}
                  style={{
                    animationDelay: `${200 + i * 100}ms`,
                    background: isSelected ? 'var(--bg-card-hover)' : 'var(--glass-bg)',
                    backdropFilter: 'blur(20px) saturate(1.5)',
                    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--glass-border)'}`,
                    boxShadow: isSelected ? '0 0 24px var(--accent-glow)' : '0 8px 32px var(--shadow-color)',
                  }}
                  onClick={() => handleSelectCareer(m.career.name)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-display text-[1.08rem] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {m.career.name}
                      </h4>
                      <p className="text-[0.78rem] leading-relaxed max-w-[240px]" style={{ color: 'var(--text-muted)' }}>
                        {m.career.desc}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="font-display text-[1.6rem] font-bold" style={{ color: 'var(--accent)' }}>
                        <AnimatedCounter value={m.pct} duration={1200 + i * 200} suffix="%" />
                      </div>
                      <div className="font-mono text-[0.6rem] uppercase tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>Match</div>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full mb-3" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-light))', transition: 'width 1s ease-out' }} />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {m.career.skills.slice(0, 3).map(s => (
                      <span key={s} className="rounded-lg px-2.5 py-1 font-mono text-[0.68rem]"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                        {s}
                      </span>
                    ))}
                    {m.career.skills.length > 3 && (
                      <span className="rounded-lg px-2.5 py-1 font-mono text-[0.68rem]"
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                        +{m.career.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-[0.66rem]" style={{ color: 'var(--text-muted)' }}>
                      Readiness: {readiness}%
                    </span>
                    <span className="font-mono text-[0.66rem] font-semibold" style={{ color: 'var(--accent)' }}>
                      {isSelected ? '✓ Path Active (View Deep Dive ↓)' : '▸ Select Career Path ↓'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ─── EXPANDED CAREER DETAIL PANEL ─── */}
          {expandedCareer && (
            <div ref={careerPathRef} id="career-path-section" className="mt-6 cg-detail-enter scroll-mt-20">
              <GlassCard glow className="overflow-hidden">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-[1.3rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                      {expandedCareer.career.name} — Career Deep Dive & Roadmap Setup
                    </h3>
                    <p className="mt-1 text-[0.82rem]" style={{ color: 'var(--text-muted)' }}>
                      Here is why this role matches you, required competencies, and your structured path to job readiness.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-dim)' }}>
                    <span className="font-display text-[1.5rem] font-bold" style={{ color: 'var(--accent)' }}>
                      <AnimatedCounter value={expandedCareer.pct} duration={1000} suffix="%" />
                    </span>
                    <span className="font-mono text-[0.62rem] uppercase" style={{ color: 'var(--accent)' }}>Match</span>
                  </div>
                </div>

                {/* Grid: Why match + Required skills */}
                <div className="grid grid-cols-1 gap-4 mb-5 sm:grid-cols-2">
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                    <h5 className="mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>
                      Why this matches you
                    </h5>
                    <p className="text-[0.84rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Your interests in {expandedCareer.career.tags.join(', ')} align with this trajectory. The AI detected matching keywords in your profile that map directly to industry expectations for {expandedCareer.career.name}.
                    </p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                    <h5 className="mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>
                      Required skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {expandedCareer.career.skills.map(s => {
                        const map = SKILL_MAP[s]
                        const lv = map ? map.level : 55
                        const lbl = skillLabel(lv)
                        return (
                          <span key={s} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[0.74rem]"
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}>
                            <span>{SKILL_ICONS[lbl]}</span> {s}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Skills to improve */}
                <div className="rounded-xl p-4 mb-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                  <h5 className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>
                    Skills to acquire for {expandedCareer.career.name}
                  </h5>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {expandedCareer.career.skills.slice(0, 4).map((s, i) => {
                      const map = SKILL_MAP[s]
                      return <SkillBar key={s} name={s} level={map ? map.level : 45} required={map ? map.required : 85} delay={i * 120} />
                    })}
                  </div>
                </div>

                {/* Readiness score gauge */}
                <div className="mb-6 flex items-center gap-4 rounded-xl p-4"
                  style={{ background: 'linear-gradient(135deg, var(--accent-bg), var(--bg-secondary))', border: '1px solid var(--accent-dim)' }}>
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                    <svg width="64" height="64" className="ring-progress">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border-primary)" strokeWidth="4" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * (1 - skillLevelForCareer(expandedCareer.career) / 100)}
                        style={{ filter: 'drop-shadow(0 0 4px var(--accent-glow))' }} />
                    </svg>
                    <span className="absolute font-display text-[0.95rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                      <AnimatedCounter value={skillLevelForCareer(expandedCareer.career)} duration={1200} />
                    </span>
                  </div>
                  <div>
                    <div className="font-display text-[0.95rem] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Career Readiness Index: {skillLevelForCareer(expandedCareer.career)}%
                    </div>
                    <p className="text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>
                      {activeRoadmapStep >= 1
                        ? `Roadmap is actively in progress. Milestone ${activeRoadmapStep} of 5 is active.`
                        : 'Launch your interactive milestone roadmap below to start tracking your learning progress.'}
                    </p>
                  </div>
                </div>

                {/* START MY ROADMAP BUTTON */}
                <button
                  type="button"
                  onClick={handleStartRoadmap}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-[0.95rem] font-semibold tracking-wide transition-all duration-300 cursor-pointer"
                  style={{
                    background: isRoadmapVisible ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'var(--accent)',
                    color: 'white',
                    border: '1px solid transparent',
                    boxShadow: '0 0 20px var(--accent-glow)'
                  }}
                >
                  {isRoadmapVisible ? (
                    <>
                      <span>🚀 Roadmap Active • Phase {activeRoadmapStep || 1} of 5</span>
                      <span className="font-mono text-xs opacity-90 transition-transform group-hover:translate-y-0.5">
                        (Jump to Roadmap ↓)
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Start My Roadmap 🚀</span>
                      <span className="font-mono text-xs opacity-80">(Display 5-Phase Plan)</span>
                    </>
                  )}
                </button>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — REAL INTERACTIVE CAREER ROADMAP
          ═══════════════════════════════════════════════════ */}
      {hasGenerated && isRoadmapVisible && (
        <div
          ref={roadmapSectionRef}
          id="interactive-roadmap-section"
          className="mb-10 cg-slide-up scroll-mt-20"
          style={{ animationDelay: '150ms' }}
        >
          <GlassCard glow className="overflow-hidden">
            {/* Header: Roadmap overview & controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-5" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded-lg px-2.5 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-dim)' }}>
                    📍 Interactive Career Roadmap
                  </span>
                  <span className="rounded-lg px-2.5 py-0.5 font-mono text-[0.68rem] font-bold"
                    style={{
                      background: activeRoadmapStep >= 5 ? '#22c55e22' : 'var(--bg-tertiary)',
                      color: activeRoadmapStep >= 5 ? '#22c55e' : 'var(--accent)',
                      border: '1px solid var(--border-primary)'
                    }}>
                    {activeRoadmapStep === 0 ? 'Ready to Start' : activeRoadmapStep >= 5 ? '✓ Capstone Phase' : `Phase ${activeRoadmapStep} of 5 Active`}
                  </span>
                </div>
                <h3 className="font-display text-[1.4rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Personalized Roadmap: {expandedCareer?.career?.name || selectedCareer || 'Your Matched Role'}
                </h3>
                <p className="text-[0.84rem] text-muted max-w-[680px]">
                  5 structured milestones taking you from fundamental principles to production projects, system architecture, and technical interview readiness.
                </p>
              </div>

              {/* Progress Summary Metrics & Controls */}
              <div className="flex items-center gap-3">
                <div className="text-right mr-1">
                  <div className="font-display text-[1.25rem] font-bold" style={{ color: 'var(--accent)' }}>
                    {roadmapProgressPct}%
                  </div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-wider text-muted">
                    Total Progress
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRoadmapVisible(false)}
                  title="Hide roadmap section"
                  className="rounded-xl px-3 py-2 text-[0.74rem] font-mono text-muted hover:text-white transition-all cursor-pointer"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                >
                  ✕ Hide
                </button>
                <button
                  type="button"
                  onClick={handleResetRoadmap}
                  title="Reset roadmap milestones"
                  className="rounded-xl px-3 py-2 text-[0.74rem] font-mono text-muted hover:text-white transition-all cursor-pointer"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                >
                  ↺ Reset
                </button>
              </div>
            </div>

            {/* Stepper Timeline: 5 Milestones */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {roadmapMilestones.map((step, idx) => {
                  const isCompleted = activeRoadmapStep > step.id
                  const isCurrent = activeRoadmapStep === step.id || (activeRoadmapStep === 0 && step.id === 1)
                  const isViewing = viewingMilestone === step.id
                  const stepTasks = step.tasks || []
                  const finishedTasksInStep = stepTasks.filter(t => completedTasks.has(t.id)).length

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setViewingMilestone(step.id)}
                      className="group relative flex flex-col text-left rounded-xl p-3.5 transition-all duration-200 cursor-pointer"
                      style={{
                        background: isViewing ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
                        border: `1px solid ${isViewing ? 'var(--accent)' : isCurrent ? 'var(--accent-dim)' : 'var(--border-primary)'}`,
                        boxShadow: isViewing ? '0 0 16px var(--accent-glow)' : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                            isCurrent ? 'cg-node-pulse' : ''
                          }`}
                          style={{
                            background: isCompleted ? '#22c55e' : isCurrent ? 'var(--accent)' : 'var(--bg-tertiary)',
                            color: isCompleted || isCurrent ? 'white' : 'var(--text-muted)',
                            boxShadow: isCurrent ? '0 0 10px var(--accent-glow)' : 'none',
                          }}
                        >
                          {isCompleted ? '✓' : step.id}
                        </div>
                        <span className="font-mono text-[0.62rem]" style={{ color: isCompleted ? '#22c55e' : isCurrent ? 'var(--accent)' : 'var(--text-muted)' }}>
                          {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Upcoming'}
                        </span>
                      </div>

                      <div className="font-display text-[0.82rem] font-semibold line-clamp-1 mb-1" style={{ color: isViewing ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {step.title.split(':')[0]}
                      </div>
                      <div className="font-mono text-[0.64rem] text-muted truncate">
                        {step.timeEstimate.split('•')[0]}
                      </div>

                      {/* Small task completion indicator */}
                      <div className="mt-2.5 flex items-center justify-between text-[0.64rem] font-mono text-muted">
                        <span>Tasks:</span>
                        <span style={{ color: finishedTasksInStep === stepTasks.length && stepTasks.length > 0 ? '#22c55e' : 'inherit' }}>
                          {finishedTasksInStep}/{stepTasks.length}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Milestone Deep Dive Card */}
            {activeMilestoneData && (
              <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                {/* Milestone Title & Banner */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[0.7rem] uppercase font-bold tracking-wider" style={{ color: 'var(--accent)' }}>
                        {activeMilestoneData.phase}
                      </span>
                      <span className="text-muted">•</span>
                      <span className="font-mono text-[0.7rem] text-muted">
                        {activeMilestoneData.timeEstimate}
                      </span>
                    </div>
                    <h4 className="font-display text-[1.28rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                      {activeMilestoneData.title}
                    </h4>
                    <p className="mt-1.5 text-[0.86rem] leading-relaxed text-secondary max-w-[760px]">
                      {activeMilestoneData.desc}
                    </p>
                  </div>

                  {/* Milestone Action Button */}
                  <div className="shrink-0">
                    {activeRoadmapStep > activeMilestoneData.id ? (
                      <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-[0.78rem] font-semibold"
                        style={{ background: '#22c55e18', color: '#22c55e', border: '1px solid #22c55e44' }}>
                        <span>✓</span> Milestone Completed
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdvanceMilestone(activeMilestoneData.id)}
                        className="flex items-center gap-2 rounded-xl px-5 py-3 text-[0.85rem] font-semibold tracking-wide transition-all cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                          color: 'white',
                          boxShadow: '0 0 16px var(--accent-glow)'
                        }}
                      >
                        <span>Complete Phase & Advance ➔</span>
                        <span className="font-mono text-xs opacity-90">(+150 XP)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Two-Column Grid: Checklist + Projects & Resources */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Left Column (7 cols): Checklist & Target Competencies */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Competencies Chips */}
                    <div>
                      <h5 className="mb-2 font-mono text-[0.68rem] uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                        Target Competencies
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {activeMilestoneData.competencies?.map((c) => (
                          <span
                            key={c}
                            className="rounded-lg px-2.5 py-1 font-mono text-[0.72rem]"
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                          >
                            ⚡ {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actionable Checklists */}
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <h5 className="font-mono text-[0.68rem] uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                          Action Checklist (Click to complete)
                        </h5>
                        <span className="font-mono text-[0.68rem] text-muted">
                          +25 XP per task
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {activeMilestoneData.tasks?.map((task) => {
                          const isDone = completedTasks.has(task.id)
                          return (
                            <div
                              key={task.id}
                              onClick={() => handleToggleTask(task.id)}
                              className="cg-task-item flex items-start gap-3 rounded-xl p-3.5 transition-all cursor-pointer select-none"
                              style={{
                                background: isDone ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-tertiary)',
                                border: `1px solid ${isDone ? '#22c55e55' : 'var(--border-primary)'}`,
                              }}
                            >
                              <div
                                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition-all"
                                style={{
                                  background: isDone ? '#22c55e' : 'transparent',
                                  borderColor: isDone ? '#22c55e' : 'var(--border-primary)',
                                  color: 'white',
                                }}
                              >
                                {isDone ? '✓' : ''}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div
                                  className={`text-[0.84rem] font-medium leading-snug transition-all ${
                                    isDone ? 'line-through opacity-70' : ''
                                  }`}
                                  style={{ color: isDone ? '#22c55e' : 'var(--text-primary)' }}
                                >
                                  {task.text}
                                </div>
                                {task.tip && (
                                  <div className="mt-1 font-mono text-[0.68rem]" style={{ color: 'var(--text-muted)' }}>
                                    💡 Tip: {task.tip}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (5 cols): Milestone Project, Resources & AI Sprint */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Portfolio Project */}
                    {activeMilestoneData.project && (
                      <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                        <div className="flex items-center gap-2 mb-2 font-mono text-[0.68rem] uppercase" style={{ color: 'var(--accent)' }}>
                          <span>🛠️</span> Recommended Milestone Project
                        </div>
                        <h6 className="font-display text-[0.95rem] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {activeMilestoneData.project.title}
                        </h6>
                        <p className="text-[0.78rem] leading-relaxed text-muted mb-3">
                          {activeMilestoneData.project.desc}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {activeMilestoneData.project.stack?.map(tech => (
                            <span key={tech} className="rounded px-2 py-0.5 font-mono text-[0.62rem]"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', border: '1px solid var(--border-primary)' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Resources */}
                    {activeMilestoneData.resources && activeMilestoneData.resources.length > 0 && (
                      <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                        <div className="flex items-center gap-2 mb-2 font-mono text-[0.68rem] uppercase" style={{ color: 'var(--accent)' }}>
                          <span>📚</span> Curated Study Resources
                        </div>
                        <div className="space-y-2">
                          {activeMilestoneData.resources.map(res => (
                            <div key={res.title} className="flex items-center justify-between gap-2 text-[0.78rem]">
                              <span className="font-medium truncate text-primary">
                                • {res.title}
                              </span>
                              <span className="shrink-0 font-mono text-[0.64rem] px-2 py-0.5 rounded"
                                style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                                {res.plat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Mentor 7-Day Sprint Trigger */}
                    <button
                      type="button"
                      onClick={() => generateMentorAdvice('sprint', undefined, `${activeMilestoneData.title} (${expandedCareer?.career?.name || selectedCareer})`)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl p-3 font-semibold text-[0.82rem] transition-all cursor-pointer"
                      style={{
                        background: 'var(--accent-bg)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-dim)',
                      }}
                    >
                      <span>⚡ Ask AI Mentor to Plan This Milestone</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — SKILL GAP ANALYZER
          ═══════════════════════════════════════════════════ */}
      {hasGenerated && (
        <div className="mb-10 cg-slide-up" style={{ animationDelay: '200ms' }}>
          <GlassCard>
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-lg px-2.5 py-1 font-mono text-[0.68rem] font-semibold tracking-wider uppercase"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-dim)' }}>
                📈
              </span>
              <h3 className="font-display text-[1.15rem] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Skill Gap Analyzer
              </h3>
            </div>

            <p className="mb-6 text-[0.84rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Side-by-side breakdown of your estimated competencies versus real-world requirements for {expandedCareer ? expandedCareer.career.name : 'your target career'}.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h5 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>
                  Your Current Skills
                </h5>
                {(expandedCareer ? expandedCareer.career.skills.slice(0, 4) : Object.keys(SKILL_MAP).slice(0, 4)).map((s, i) => {
                  const map = SKILL_MAP[s]
                  return <SkillBar key={s} name={s} level={map ? map.level : 50} required={map ? map.required : 85} delay={i * 100} />
                })}
              </div>
              <div>
                <h5 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>
                  Required for {expandedCareer ? expandedCareer.career.name : 'Target Match'}
                </h5>
                {(expandedCareer ? expandedCareer.career.skills.slice(0, 4) : Object.keys(SKILL_MAP).slice(0, 4)).map((s) => {
                  const map = SKILL_MAP[s]
                  const req = map ? map.required : 85
                  return (
                    <div key={s} className="mb-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[0.82rem] font-medium" style={{ color: 'var(--text-primary)' }}>{s}</span>
                        <span className="font-mono text-[0.72rem]" style={{ color: 'var(--accent)' }}>{req}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${req}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-dim))', transition: 'width 1s ease-out' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 rounded-xl px-4 py-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <span className="text-[0.72rem] font-medium" style={{ color: 'var(--text-muted)' }}>Proficiency Tiers:</span>
              {Object.entries(SKILL_ICONS).map(([lbl, icon]) => (
                <span key={lbl} className="flex items-center gap-1 text-[0.72rem]" style={{ color: SKILL_COLORS[lbl] }}>
                  {icon} {lbl}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — CAREER XP & ACHIEVEMENTS
          ═══════════════════════════════════════════════════ */}
      <div className="mb-10 cg-slide-up" style={{ animationDelay: '250ms' }}>
        <GlassCard>
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-lg px-2.5 py-1 font-mono text-[0.68rem] font-semibold tracking-wider uppercase"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-dim)' }}>
              🎮
            </span>
            <h3 className="font-display text-[1.15rem] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Career XP & Achievements
            </h3>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <span className="text-[1.8rem]">⭐</span>
              <div>
                <div className="font-mono text-[0.62rem] uppercase tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>Career XP</div>
                <div className="font-display text-[1.4rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                  <AnimatedCounter value={careerXP} duration={1500} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <span className="text-[1.8rem]">🚀</span>
              <div>
                <div className="font-mono text-[0.62rem] uppercase tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>Level</div>
                <div className="font-display text-[1.4rem] font-bold" style={{ color: 'var(--accent)' }}>
                  <AnimatedCounter value={currentLevel} duration={1000} /> — Future Builder
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <span className="text-[1.8rem]">🏆</span>
              <div>
                <div className="font-mono text-[0.62rem] uppercase tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>Achievements</div>
                <div className="font-display text-[1.4rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                  <AnimatedCounter value={unlockedAchievements.size} duration={800} /> / {ACHIEVEMENTS.length}
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-6 rounded-xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.72rem] font-medium" style={{ color: 'var(--text-secondary)' }}>
                Level {currentLevel} → Level {Math.min(currentLevel + 1, 10)}
              </span>
              <span className="font-mono text-[0.72rem]" style={{ color: 'var(--text-muted)' }}>
                {careerXP} / {XP_THRESHOLDS[Math.min(currentLevel, 9)]?.xp || 6600} XP
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="cg-xp-bar animated h-full rounded-full"
                style={{
                  '--xp-pct': `${Math.min(100, Math.max(10, ((careerXP - (XP_THRESHOLDS[currentLevel - 1]?.xp || 0)) / ((XP_THRESHOLDS[Math.min(currentLevel, 9)]?.xp || 6600) - (XP_THRESHOLDS[currentLevel - 1]?.xp || 0))) * 100))}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
                }} />
            </div>
          </div>

          <div>
            <h5 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>
              Unlocked Milestones & Badges
            </h5>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {ACHIEVEMENTS.map(a => (
                <AchievementBadge key={a.key} icon={a.icon} title={a.title} description={a.desc}
                  unlocked={unlockedAchievements.has(a.key)} xp={a.xp} />
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — AI CAREER MENTOR & MULTI-MODEL ADVICE
          ═══════════════════════════════════════════════════ */}
      <div ref={mentorSectionRef} className="mb-10 cg-slide-up scroll-mt-20" style={{ animationDelay: '300ms' }}>
        <GlassCard glow>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-lg px-2.5 py-1 font-mono text-[0.68rem] font-semibold tracking-wider uppercase"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-dim)' }}>
                🤖
              </span>
              <div>
                <h3 className="font-display text-[1.2rem] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  AI Career Mentor
                </h3>
                <p className="text-[0.8rem] text-muted">
                  Get personalized study sprints, top technical interview questions, or portfolio project recommendations.
                </p>
              </div>
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.7rem] text-muted">Model:</span>
              <select
                value={mentorModel}
                onChange={e => setMentorModel(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-xs font-mono select-base"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              >
                {SUPPORTED_MODELS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.icon || '✨'} {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="mb-5 flex flex-wrap gap-2">
            {[
              { id: 'sprint', label: '🚀 30-Day Sprint', title: 'Intensive 30-Day execution roadmap' },
              { id: 'interview', label: '💼 Top Interview Questions', title: 'Top 5 technical questions with model answers' },
              { id: 'projects', label: '🛠️ Standout Projects', title: '3 resume-defining portfolio systems' },
              { id: 'custom', label: '💬 Custom Question', title: 'Ask any specific career or tech question' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMentorMode(tab.id)}
                className="rounded-xl px-4 py-2 text-[0.82rem] font-medium transition-all cursor-pointer"
                style={{
                  background: mentorMode === tab.id ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: mentorMode === tab.id ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${mentorMode === tab.id ? 'transparent' : 'var(--border-primary)'}`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Custom Question input */}
          {mentorMode === 'custom' && (
            <div className="mb-4">
              <input
                type="text"
                value={mentorCustomQuery}
                onChange={e => setMentorCustomQuery(e.target.value)}
                placeholder="e.g. How should I prepare for a junior backend take-home assignment?"
                className="input-base w-full"
              />
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            onClick={() => generateMentorAdvice()}
            disabled={mentorLoading}
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[0.88rem] font-semibold transition-all cursor-pointer disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'white', border: '1px solid transparent', boxShadow: '0 0 12px var(--accent-glow)' }}
          >
            {mentorLoading ? 'Thinking with AI Mentor...' : '✨ Generate Mentor Guidance'}
          </button>

          {/* Response Box */}
          {mentorAdvice && (
            <div className="mt-6 rounded-xl p-5 cg-slide-up" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <span className="font-mono text-[0.68rem] uppercase" style={{ color: 'var(--accent)' }}>
                  Mentor Guidance Output
                </span>
                <button
                  type="button"
                  onClick={handleCopyMentorAdvice}
                  className="font-mono text-xs px-3 py-1 rounded-lg transition-all cursor-pointer"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
                >
                  {mentorCopied ? '✓ Copied' : '📋 Copy Advice'}
                </button>
              </div>
              <div className="whitespace-pre-wrap font-sans text-[0.88rem] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {mentorAdvice}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 7 — AI ASSISTANT ROTATING MESSAGE
          ═══════════════════════════════════════════════════ */}
      <div className="mb-8 cg-slide-up" style={{ animationDelay: '350ms' }}>
        <GlassCard className="flex items-center gap-5 overflow-hidden">
          <AIMascot size={56} />
          <div className="flex-1 min-w-0">
            <div className="mb-1 font-mono text-[0.62rem] uppercase tracking-[0.1em]" style={{ color: 'var(--accent)' }}>
              AI Career Tip
            </div>
            <div key={aiMsgIdx} className="cg-msg-enter font-display text-[1rem] font-medium" style={{ color: 'var(--text-primary)' }}>
              {AI_MESSAGES[aiMsgIdx]}
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {AI_MESSAGES.slice(0, 5).map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                style={{
                  background: i === aiMsgIdx % 5 ? 'var(--accent)' : 'var(--border-primary)',
                  transform: i === aiMsgIdx % 5 ? 'scale(1.3)' : 'scale(1)',
                }} />
            ))}
          </div>
        </GlassCard>
      </div>

    </div>
  )
}

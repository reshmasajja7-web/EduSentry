import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { api } from '../lib/api.js'
import ModuleHeader from './ModuleHeader.jsx'
import Tag from './Tag.jsx'

const tabs = [
  { to: 'upload', label: 'Upload Notes' },
  { to: 'tutor', label: 'AI Tutor Chat' },
  { to: 'summaries', label: 'Summaries' },
  { to: 'flashcards', label: 'Flashcards' },
  { to: 'quiz', label: 'Quiz' },
]

export default function WorkspaceLayout() {
  const sessionStartRef = useRef(Date.now())
  const lastFlushRef = useRef(sessionStartRef.current)

  useEffect(() => {
    const flushSession = async () => {
      const now = Date.now()
      const durationSeconds = Math.floor((now - lastFlushRef.current) / 1000)

      if (durationSeconds < 10) return

      const started = new Date(lastFlushRef.current)
      const ended = new Date(now)
      lastFlushRef.current = now

      try {
        await api.studySessions.create({
          startedAt: started.toISOString(),
          endedAt: ended.toISOString(),
          durationSeconds,
        })
      } catch (error) {
        console.warn('Could not save study session:', error)
      }
    }

    const heartbeat = window.setInterval(flushSession, 60 * 1000)

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flushSession()
      } else {
        lastFlushRef.current = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.clearInterval(heartbeat)
      document.removeEventListener('visibilitychange', handleVisibility)
      flushSession()
    }
  }, [])

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 sm:py-10">
      <ModuleHeader
        kicker="Learning Workspace · Module 03"
        title="Learning Workspace"
        description="LearnPilot's tutoring and content tools — grounded in your own uploaded material, from indexing to practice."
      />

      <div className="mb-8 flex flex-wrap gap-2.5">
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to}>
            {({ isActive }) => <Tag active={isActive}>{tab.label}</Tag>}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  )
}

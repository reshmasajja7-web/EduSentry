import { Link } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader.jsx'
import AITutorChat from './AITutorChat.jsx'
import UploadNotes from './UploadNotes.jsx'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function PublicAITutor() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('tutor') // 'tutor' | 'upload'

  return (
    <div className="min-h-screen ambient-bg text-primary">
      <PublicHeader />

      <main className="mx-auto max-w-[1360px] px-4 pt-6 pb-16 sm:px-6">
        {/* Banner */}
        <div className="mb-8 rounded-2xl border border-[#263653] bg-gradient-to-r from-[#111a2b] via-[#162238] to-[#0e1626] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-wider text-gold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Interactive AI Study Tutor
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                Personalized AI Tutoring Grounded in Your Notes
              </h1>
              <p className="mt-1.5 max-w-2xl text-[0.9rem] leading-relaxed text-slate-300">
                Ask questions and receive clear, instant explanations directly grounded in your lecture notes and course materials.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              {isAuthenticated ? (
                <Link
                  to="/app/dashboard"
                  className="rounded-xl border border-gold bg-gold px-5 py-2.5 font-semibold text-[#0b1020] transition-colors hover:bg-[#f4c12e]"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/register"
                    className="rounded-xl border border-gold bg-gold px-4 py-2 text-[0.85rem] font-semibold text-[#0b1020] transition-colors hover:bg-[#f4c12e]"
                  >
                    Save Progress (Register)
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl border border-[#263653] bg-[#111a2b] px-4 py-2 text-[0.85rem] font-medium text-slate-300 hover:text-white"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sub-nav Tabs */}
          <div className="mt-6 flex gap-2 border-t border-[#263653] pt-4">
            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-[0.82rem] font-semibold transition-all ${
                activeTab === 'tutor'
                  ? 'bg-gold text-[#0b1020]'
                  : 'bg-[#111a2b] text-slate-300 hover:text-white'
              }`}
            >
              <span>⚡ AI Tutor & RAG Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-[0.82rem] font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-gold text-[#0b1020]'
                  : 'bg-[#111a2b] text-slate-300 hover:text-white'
              }`}
            >
              <span>📁 Upload Your Notes</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {activeTab === 'tutor' ? <AITutorChat /> : <UploadNotes />}
      </main>
    </div>
  )
}

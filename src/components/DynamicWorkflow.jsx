import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const STAGES = [
  {
    id: 'extract',
    number: '01',
    title: 'Drop & Parse Notes',
    tagline: 'Zero-Leakage Ingestion',
    summary: 'Drop lecture PDFs, Word documents, or PPT slides. In-browser client extraction parses raw text into semantic 180-word windows with zero external leakage.',
    icon: '📄',
    ctaText: 'Try Uploading Notes',
    ctaLink: '/ai-tutor',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'rag',
    number: '02',
    title: 'Multi-LLM RAG Tutor',
    tagline: 'Grounded Retrieval & Synthesis',
    summary: 'Hybrid BM25 vector ranking retrieves the exact paragraphs matching your query. Ask Gemini, GPT-4o, Claude, DeepSeek, or our built-in Neural RAG engine.',
    icon: '⚡',
    ctaText: 'Test RAG AI Tutor',
    ctaLink: '/ai-tutor',
    badgeColor: 'text-gold border-gold/30 bg-gold/10',
  },
  {
    id: 'risk',
    number: '03',
    title: 'EarlyRisk Guardian',
    tagline: 'Proactive Early Warning Radar',
    summary: 'Tracks study velocity, quiz frequency, and attendance. Flags setback risks weeks before exams with an interactive What-If simulator.',
    icon: '🛡️',
    ctaText: 'Simulate Risk Score',
    ctaLink: '/risk-prediction',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: 'practice',
    number: '04',
    title: 'Adaptive Practice Suite',
    tagline: 'Cloze Quizzes & Active Recall',
    summary: 'Automatically transforms lecture text into active recall flashcards, extractive summaries, and cloze-style quizzes with distractor generation.',
    icon: '📝',
    ctaText: 'Explore Practice Tools',
    ctaLink: '/features',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  {
    id: 'career',
    number: '05',
    title: 'Career & Skill Pathways',
    tagline: 'Industry Alignment',
    summary: 'Connects your coursework with 35+ industry careers. Identifies skill gaps and provides curated learning pathways to bridge them.',
    icon: '🎯',
    ctaText: 'Match Your Career',
    ctaLink: '/career-guidance',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
]

export default function DynamicWorkflow() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [demoQuizAnswer, setDemoQuizAnswer] = useState(null)
  const [flashcardFlipped, setFlashcardFlipped] = useState(false)

  // Auto-cycling timer every 6 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STAGES.length)
      setDemoQuizAnswer(null)
      setFlashcardFlipped(false)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused])

  const stage = STAGES[activeIdx]

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0e1626]/75 backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      {/* Top Header & Interactive Pipeline Stepper */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1c2a44] pb-6">
        <div>
          <span className="font-mono text-[0.72rem] uppercase tracking-wider text-gold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Interactive Dynamic Learning Loop
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
            How EduSentry Guards Your Learning
          </h3>
        </div>

        {/* Stepper Dots / Nav */}
        <div className="flex items-center gap-2">
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveIdx(idx)
                setDemoQuizAnswer(null)
                setFlashcardFlipped(false)
              }}
              className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeIdx === idx
                  ? 'border border-gold bg-gold text-[#0b1020] shadow-lg shadow-gold/20 scale-105'
                  : 'border border-[#263653] bg-[#111a2b] text-slate-300 hover:border-gold hover:text-white'
              }`}
            >
              <span>{s.number}</span>
              <span className="hidden sm:inline-block">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar (Visual Timer) */}
      <div className="h-1 w-full bg-[#162238]">
        <div
          key={activeIdx}
          className="h-full bg-gradient-to-r from-[#E8A33D] to-[#F6C667] transition-all duration-300"
          style={{ width: `${((activeIdx + 1) / STAGES.length) * 100}%` }}
        />
      </div>

      {/* Interactive Main Stage Showcase Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left: Stage Information & Pitch */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{stage.icon}</span>
            <span className={`rounded-full border px-3 py-1 font-mono text-[0.72rem] uppercase tracking-wider font-semibold ${stage.badgeColor}`}>
              Stage {stage.number} · {stage.tagline}
            </span>
          </div>

          <h4 className="font-display text-2xl font-bold text-white sm:text-3xl leading-snug">
            {stage.title}
          </h4>

          <p className="text-[0.92rem] leading-relaxed text-slate-300">
            {stage.summary}
          </p>

          <div className="pt-3 flex items-center gap-4">
            <Link
              to={stage.ctaLink}
              className="inline-flex items-center gap-2 rounded-xl border border-gold bg-gold px-5 py-2.5 font-semibold text-[0.88rem] text-[#0b1020] transition-transform hover:scale-105 hover:bg-[#f4c12e]"
            >
              <span>{stage.ctaText}</span>
              <span>→</span>
            </Link>

            <span className="font-mono text-[0.7rem] text-slate-400">
              {isPaused ? '(Hovered — Paused)' : '(Auto-advancing)'}
            </span>
          </div>
        </div>

        {/* Right: Dynamic Interactive Simulation Window */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111c30]/85 backdrop-blur-md p-6 shadow-xl min-h-[320px] flex flex-col justify-center">
            {/* STAGE 1 SIMULATOR: Document Ingestion Scanner */}
            {stage.id === 'extract' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1c2a44] pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span>Client-Side Neural Ingestion Engine</span>
                  </div>
                  <span className="rounded bg-[#162238] px-2 py-0.5 font-mono text-[0.68rem] text-gold">
                    PDF · DOCX · PPTX
                  </span>
                </div>

                <div className="relative rounded-xl border border-dashed border-[#2d4263] bg-[#0b1020] p-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="rounded-lg bg-[#162238] p-3 text-2xl">📑</div>
                    <div className="text-left">
                      <div className="font-semibold text-white text-sm">Deep_Learning_Lecture_04.pdf</div>
                      <div className="font-mono text-[0.72rem] text-slate-400">3.4 MB · 28 Pages · 100% Client-Side</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <span className="rounded-md bg-[#162238] px-2 py-1 font-mono text-[0.7rem] text-amber-300">
                      ✓ 42 Chunks Indexed
                    </span>
                    <span className="rounded-md bg-[#162238] px-2 py-1 font-mono text-[0.7rem] text-emerald-400">
                      ✓ BM25 Vectors Computed
                    </span>
                    <span className="rounded-md bg-[#162238] px-2 py-1 font-mono text-[0.7rem] text-blue-300">
                      ✓ Zero Cloud Uploads
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2 SIMULATOR: Multi-LLM RAG Tutor */}
            {stage.id === 'rag' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c2a44] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#1b263b] px-2 py-0.5 font-mono text-[0.7rem] text-gold">
                      ⚡ EduSentry Neural RAG
                    </span>
                    <span className="font-mono text-[0.7rem] text-slate-400">+ Gemini 2.0 Flash</span>
                  </div>
                  <span className="font-mono text-[0.7rem] text-emerald-400">● Live Retrieval</span>
                </div>

                <div className="rounded-lg bg-[#0b1020] p-3 text-[0.84rem] text-slate-200 border border-[#1f2e47]">
                  <span className="font-mono text-xs text-gold">Student: </span>
                  <span>How does gradient descent minimize cost functions?</span>
                </div>

                <div className="rounded-lg bg-[#162238] p-3.5 text-[0.82rem] text-[#f5f1e8] border border-gold/30">
                  <p className="leading-relaxed">
                    According to your notes in <strong>Lecture_04.pdf</strong>, gradient descent iteratively computes partial derivatives: <code className="text-gold font-mono">θ := θ - α∇J(θ)</code> to reach the optimal loss minimum.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between border-t border-[#233552] pt-2 font-mono text-[0.68rem] text-slate-400">
                    <span className="text-gold">📚 Source: Lecture_04.pdf (Chunk #7)</span>
                    <span className="rounded bg-[#0b1020] px-1.5 py-0.5 text-emerald-400">Relevance: 0.94</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3 SIMULATOR: EarlyRisk Guardian */}
            {stage.id === 'risk' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1c2a44] pb-2">
                  <span className="font-mono text-xs text-slate-300">Early Warning Signal Dial</span>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[0.7rem] font-bold text-emerald-400">
                    LOW RISK (OPTIMAL)
                  </span>
                </div>

                <div className="flex items-center justify-around gap-4">
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold text-emerald-400">
                      18<span className="text-sm font-normal text-slate-400">/100</span>
                    </div>
                    <div className="font-mono text-[0.72rem] text-slate-400 mt-1">Weighted Risk Index</div>
                  </div>

                  <div className="space-y-2 flex-1 max-w-xs">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                        <span>Attendance</span>
                        <span className="text-emerald-400">95%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#0b1020]">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                        <span>Quiz Consistency</span>
                        <span className="text-gold">91%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#0b1020]">
                        <div className="h-full rounded-full bg-gold" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4 SIMULATOR: Adaptive Practice */}
            {stage.id === 'practice' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c2a44] pb-2">
                  <span className="font-mono text-xs text-slate-300">Active Recall Cloze Challenge</span>
                  <span className="font-mono text-[0.7rem] text-gold">Instant Verification</span>
                </div>

                <p className="text-sm text-slate-200">
                  "In deep learning, ________ prevents neural networks from overfitting by randomly deactivating neurons."
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {['Dropout', 'Backprop', 'Batch Norm', 'Softmax'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDemoQuizAnswer(opt)}
                      className={`rounded-lg border p-2 text-xs font-mono transition-all ${
                        demoQuizAnswer === opt
                          ? opt === 'Dropout'
                            ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold'
                            : 'border-red-500 bg-red-950/60 text-red-200'
                          : 'border-[#263653] bg-[#0b1020] text-slate-300 hover:border-gold'
                      }`}
                    >
                      {opt} {demoQuizAnswer === opt && (opt === 'Dropout' ? '✓ Correct!' : '✕ Try Again')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 5 SIMULATOR: Career Alignment */}
            {stage.id === 'career' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c2a44] pb-2">
                  <span className="font-mono text-xs text-slate-300">Target Role Match</span>
                  <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 font-mono text-[0.7rem] font-bold text-purple-300">
                    94% ALIGNMENT
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-purple-950/40 border border-purple-500/30 p-3 text-3xl">🤖</div>
                  <div>
                    <h5 className="font-display text-lg font-bold text-white">AI & Machine Learning Engineer</h5>
                    <p className="font-mono text-[0.74rem] text-slate-400">High Demand · Average Salary: $135k</p>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {['PyTorch', 'Vector Databases', 'Transformer Architecture', 'Model Optimization'].map((s) => (
                    <span key={s} className="rounded-md border border-[#263653] bg-[#0b1020] px-2 py-0.5 font-mono text-[0.7rem] text-slate-300">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

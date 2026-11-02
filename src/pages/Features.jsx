import { Link } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Features() {
  const { isAuthenticated } = useAuth()

  const pillars = [
    {
      idx: '01',
      title: 'Multi-LLM RAG Learning Workspace',
      badge: 'Zero-Hallucination Retrieval',
      desc: 'Combines local client-side extraction for PDF, DOCX, and PPTX notes with hybrid BM25 and vector-augmented retrieval. Choose between Google Gemini, OpenAI GPT-4o, Claude 3.5 Sonnet, DeepSeek R1, or EduSentry’s offline Neural RAG engine.',
      bullets: [
        'Document Chunking with 180-word semantic windows and metadata indexing',
        'Direct citation inspection showing exact source paragraphs and relevance scores',
        'Pedagogical modes: Strict Grounding, Deep Explanations, and Socratic Exploration',
        'Automatic extractive summarization and cloze-style adaptive quiz generation',
      ],
      linkText: 'Try AI Tutor & RAG →',
      linkTo: '/ai-tutor',
      icon: '🧠',
    },
    {
      idx: '02',
      title: 'EarlyRisk Predictive Early Warning System',
      badge: 'Proactive Academic Intervention',
      desc: 'Dual-path telemetry engine designed for both traditional college students and independent self-paced learners. Evaluates attendance, study velocity, and quiz consistency to flag dropout risk weeks before exams.',
      bullets: [
        'Multi-factor weighted risk score with real-time radial gauge visualization',
        'Interactive What-If Improvement Simulator to model risk score reduction',
        'Strengths vs. vulnerabilities breakdown across academic and platform metrics',
        'Personalized study plans with prioritized action items and milestone targets',
      ],
      linkText: 'Check Academic Risk →',
      linkTo: '/risk-prediction',
      icon: '🛡️',
    },
    {
      idx: '03',
      title: 'Intelligent Career Guidance & Skill Mapping',
      badge: 'Tag-Based & NLP Matching',
      desc: 'Discover aligned career trajectories across 35 technical and professional domains. Matches student passions and natural strengths against dynamic industry competencies.',
      bullets: [
        'Tag-based interest cloud combined with free-form semantic aspiration matching',
        'Comprehensive curriculum roadmaps with curated foundational resources',
        'Experience point (XP) gamification with milestone badges and achievements',
        'Seamless portfolio synchronization with your central student profile',
      ],
      linkText: 'Explore Careers →',
      linkTo: '/career-guidance',
      icon: '🎯',
    },
    {
      idx: '04',
      title: 'Real-Time Student Analytics & Telemetry',
      badge: 'PostgreSQL-Backed Mastery Tracking',
      desc: 'An authentic learning log that records every document parsed, quiz taken, and flashcard mastered. No vanity numbers or canned states — every chart is powered by your actual learning footprint.',
      bullets: [
        'Interactive SVG progression curves tracking study hours, retention, and quiz scores',
        'Dynamic multi-interval telemetry (7 Days, 14 Days, 30 Days, Semester)',
        '7-day consistency calendar and active study day streak counter',
        'Dynamic shrinking sidebar for unobstructed document review on scroll',
      ],
      linkText: 'View Dashboard Analytics →',
      linkTo: isAuthenticated ? '/app/dashboard' : '/login',
      icon: '📈',
    },
  ]

  return (
    <div className="min-h-screen ambient-bg text-primary">
      <PublicHeader />

      <main className="mx-auto max-w-[1360px] px-4 pt-8 pb-20 sm:px-6">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 font-mono text-[0.74rem] uppercase tracking-wider text-gold">
            <span>✨ Complete Feature Architecture</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            A Unified Platform for <span className="text-gold italic">Guarded Learning</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            EduSentry brings together real extractive NLP, frontier generative LLMs, proactive risk heuristics, and career mapping into a seamless academic operating system.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.idx}
              className="flex flex-col justify-between rounded-2xl border border-[#263653] bg-[#0e1626] p-7 shadow-xl transition-all duration-300 hover:border-gold/80 hover:bg-[#121c30]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-gold">
                    Pillar [{p.idx}]
                  </span>
                  <span className="rounded-full border border-[#263653] bg-[#162238] px-3 py-1 font-mono text-[0.68rem] text-slate-300">
                    {p.badge}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">{p.icon}</span>
                  <h3 className="font-display text-xl font-bold text-white">
                    {p.title}
                  </h3>
                </div>

                <p className="mt-3 text-[0.88rem] leading-relaxed text-slate-300">
                  {p.desc}
                </p>

                <div className="mt-5 space-y-2 border-t border-[#1c2a44] pt-4">
                  <h4 className="font-mono text-[0.72rem] uppercase tracking-wider text-muted">
                    Core Capabilities
                  </h4>
                  {p.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-[0.82rem] text-slate-300">
                      <span className="mt-1 text-gold">▸</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-[#1c2a44] pt-4">
                <Link
                  to={p.linkTo}
                  className="inline-flex items-center gap-2 font-mono text-[0.84rem] font-semibold text-gold transition-colors hover:text-white"
                >
                  <span>{p.linkText}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-2xl border border-gold/40 bg-gradient-to-r from-[#1b263b] via-[#162238] to-[#0e1626] p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to experience guarded learning?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[0.9rem] text-slate-300">
            Start uploading notes in seconds or test the AI Tutor right now. No credit card required.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/ai-tutor"
              className="rounded-xl border border-gold bg-gold px-6 py-3 font-semibold text-[#0b1020] transition-colors hover:bg-[#f4c12e]"
            >
              Launch AI Tutor Sandbox
            </Link>
            <Link
              to={isAuthenticated ? "/app/dashboard" : "/register"}
              className="rounded-xl border border-[#263653] bg-[#0b1020] px-6 py-3 font-semibold text-white transition-colors hover:border-gold hover:text-gold"
            >
              {isAuthenticated ? "Open Dashboard" : "Create Free Account"}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

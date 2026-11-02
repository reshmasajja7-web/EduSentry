import { Link } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader.jsx'
import SponsorsSection from '../components/SponsorsSection.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function About() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen ambient-bg text-primary">
      <PublicHeader />

      <main className="mx-auto max-w-[1360px] px-4 pt-8 pb-20 sm:px-6">
        {/* About Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 font-mono text-[0.72rem] uppercase tracking-wider text-gold">
            <span>🛡️ Academic Mission & Architecture</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            About <span className="text-gold">EduSentry</span>
          </h1>

          <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-300">
            EduSentry was designed to solve a fundamental problem in higher education: students often only discover they are falling behind when it is already too late.
          </p>
        </div>

        {/* Section 1: The Sentry Philosophy */}
        <div className="mt-14 space-y-10">
          <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-7 sm:p-9 shadow-lg">
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              1. The Sentry Philosophy
            </h2>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-300">
              In maritime navigation, a lighthouse does not steer the ship — it watches over the passage, alerting the navigator to hidden reefs and keeping them aligned with safe waters. 
              <strong> EduSentry</strong> serves as an academic beacon, watching over every step of a student’s journey from day one to career placement.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-[#1c2a44] bg-[#111a2b] p-4">
                <div className="font-mono text-xs font-semibold text-gold">01. Vigilance</div>
                <p className="mt-1.5 text-xs text-slate-300 leading-normal">Early detection of study drop-offs and conceptual comprehension gaps before midterms.</p>
              </div>
              <div className="rounded-xl border border-[#1c2a44] bg-[#111a2b] p-4">
                <div className="font-mono text-xs font-semibold text-gold">02. Grounding</div>
                <p className="mt-1.5 text-xs text-slate-300 leading-normal">RAG-powered answers rooted strictly in uploaded syllabus material, eliminating hallucinations.</p>
              </div>
              <div className="rounded-xl border border-[#1c2a44] bg-[#111a2b] p-4">
                <div className="font-mono text-xs font-semibold text-gold">03. Direction</div>
                <p className="mt-1.5 text-xs text-slate-300 leading-normal">Synthesizing current coursework into actionable roadmaps toward 35+ industry careers.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Architecture */}
          <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-7 sm:p-9 shadow-lg">
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              2. Technical Architecture & RAG Pipeline
            </h2>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-300">
              Unlike generic AI wrappers that send entire documents blindly to an external prompt, EduSentry implements an authentic multi-stage retrieval architecture:
            </p>
            
            <div className="mt-5 space-y-3 font-mono text-[0.8rem] text-slate-300">
              <div className="flex items-start gap-3 rounded-lg bg-[#111a2b] p-3 border border-[#1c2a44]">
                <span className="text-gold font-bold">STAGE 1:</span>
                <span><strong>Client-Side Extraction:</strong> PDF.js, Mammoth.js, and JSZip parse PDF, DOCX, and PPTX locally with zero binary leakage.</span>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-[#111a2b] p-3 border border-[#1c2a44]">
                <span className="text-gold font-bold">STAGE 2:</span>
                <span><strong>Semantic Chunking:</strong> Documents are broken into 180-word overlapping windows preserving paragraph boundaries and metadata.</span>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-[#111a2b] p-3 border border-[#1c2a44]">
                <span className="text-gold font-bold">STAGE 3:</span>
                <span><strong>Hybrid BM25 / TF-IDF:</strong> Inverted index ranks the Top-K most relevant chunks with exact term coverage scoring.</span>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-[#111a2b] p-3 border border-[#1c2a44]">
                <span className="text-gold font-bold">STAGE 4:</span>
                <span><strong>Multi-LLM Dispatch:</strong> Queries can be dispatched to Google Gemini, OpenAI GPT-4o, Claude, DeepSeek, or our built-in offline Neural Synthesizer.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Data Privacy & Transparency */}
          <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-7 sm:p-9 shadow-lg">
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              3. Data Privacy & Academic Integrity
            </h2>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-300">
              EduSentry stores student progress securely in a dedicated PostgreSQL database with bcrypt password hashing and HTTP-only signed JWT session tokens. 
              We never use student notes to train public foundation models, and students maintain full ownership and deletion rights over their indexed materials at all times.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/ai-tutor"
                className="rounded-xl border border-gold bg-gold px-5 py-2.5 font-semibold text-[#0b1020] transition-colors hover:bg-[#f4c12e]"
              >
                Launch AI Tutor Sandbox →
              </Link>
              <Link
                to={isAuthenticated ? "/app/dashboard" : "/register"}
                className="rounded-xl border border-[#263653] bg-[#111a2b] px-5 py-2.5 font-medium text-slate-300 hover:text-white"
              >
                {isAuthenticated ? "Go to Dashboard" : "Register Free"}
              </Link>
            </div>
          </div>
        </div>

        {/* Global Academic & Industry Sponsors */}
        <SponsorsSection className="pt-12" />
      </main>
    </div>
  )
}

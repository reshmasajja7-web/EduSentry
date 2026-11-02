export default function SponsorsSection({ className = '' }) {
  const sponsors = [
    {
      id: 'google-cloud',
      name: 'Google Cloud',
      division: 'Google for Education',
      badge: 'Diamond Partner',
      badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      description: 'Powering high-throughput TPU clusters for EduSentry AI tutoring and real-time student indexing.',
      grant: 'TPU & Vertex AI Infrastructure Grant',
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#4285F4"/>
          <path d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" fill="#EA4335"/>
          <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm0 6a2 2 0 110-4 2 2 0 010 4z" fill="#FBBC05"/>
          <circle cx="12" cy="12" r="2" fill="#34A853"/>
        </svg>
      ),
    },
    {
      id: 'openai',
      name: 'OpenAI Academic',
      division: 'Research & Education',
      badge: 'Principal AI Partner',
      badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      description: 'Advancing personalized RAG embeddings and multi-modal pedagogical tutoring models.',
      grant: 'LLM Academic Inference Fellowship',
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z"/>
          <path d="M12 6v12M6 12h12M7.76 7.76l8.48 8.48M7.76 16.24l8.48-8.48"/>
        </svg>
      ),
    },
    {
      id: 'aws',
      name: 'AWS Educate',
      division: 'Cloud Innovation Center',
      badge: 'Platinum Sponsor',
      badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
      description: 'Distributed vector database scaling and high-availability container hosting for EduSentry services.',
      grant: 'High-Performance Cloud Credits',
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 14.5c2.5 2 6.5 3 10.5 1.5 2.5-.9 4.5-2.5 5.5-4" strokeLinecap="round"/>
          <path d="M18 14l2-2-1-2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 8l2.5 5L13 8l2.5 5L18 8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'github',
      name: 'GitHub Education',
      division: 'Campus Developer Program',
      badge: 'Ecosystem Partner',
      badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
      description: 'Equipping student teams with CI/CD automation, cloud workstations, and collaboration tools.',
      grant: 'Campus Program & Developer Grants',
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'intel',
      name: 'Intel AI Academy',
      division: 'Neuromorphic & oneAPI',
      badge: 'Hardware Sponsor',
      badgeColor: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
      description: 'Accelerating early academic risk prediction inference with optimized neural vector calculations.',
      grant: 'Intel Neural Accelerator Research Grant',
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeLinecap="round"/>
          <path d="M9 9h6v6H9z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>
        </svg>
      ),
    },
    {
      id: 'stanford',
      name: 'Stanford AI Lab',
      division: 'Academic Benchmark Consortium',
      badge: 'Academic Fellow',
      badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      description: 'Validation datasets for academic risk prediction and formative pedagogical assessment strategies.',
      grant: 'Curriculum & Benchmark Research Partner',
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

  return (
    <div className={`w-full py-16 ${className}`} id="sponsors">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">

        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 font-mono text-[0.74rem] uppercase tracking-wider text-gold">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            Global Academic & Industry Backing
          </div>

          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-bold tracking-tight text-white">
            Our Official <span className="text-gold">Sponsors & Partners</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-slate-300">
            EduSentry is proudly empowered by world-class technology pioneers, AI researchers, and academic institutions dedicated to leveling the playing field for every learner.
          </p>
        </div>

        {/* Sponsors Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#263653] bg-[#0e1626]/90 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_12px_32px_rgba(245,158,11,0.14)]"
            >
              {/* Subtle Ambient Radial Highlight */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gold/5 blur-2xl transition-all duration-300 group-hover:bg-gold/15" />

              <div>
                {/* Header: Icon & Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#162238]/80 shadow-sm transition-transform duration-200 group-hover:scale-105">
                    {s.icon}
                  </div>

                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>

                {/* Name & Division */}
                <h3 className="font-display text-[1.18rem] font-bold text-white transition-colors group-hover:text-gold">
                  {s.name}
                </h3>
                <div className="font-mono text-[0.72rem] text-slate-400">
                  {s.division}
                </div>

                {/* Description */}
                <p className="mt-3 text-[0.84rem] leading-relaxed text-slate-300">
                  {s.description}
                </p>
              </div>

              {/* Grant / Support Tag Footer */}
              <div className="mt-5 border-t border-[#263653]/60 pt-3 flex items-center gap-2 text-[0.76rem] font-medium text-slate-400">
                <span className="text-gold">✦</span>
                <span className="truncate">{s.grant}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sponsor Banner CTA / Partnership Note */}
        <div className="mt-10 rounded-2xl border border-gold/30 bg-gradient-to-r from-[#111a2b] via-[#1b263b] to-[#0e1626] p-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <div className="mb-4 sm:mb-0">
            <h4 className="font-display text-[1.05rem] font-semibold text-white">
              Interested in sponsoring or piloting EduSentry?
            </h4>
            <p className="mt-1 text-[0.82rem] text-slate-300">
              We partner with university departments, research labs, and foundation grants worldwide.
            </p>
          </div>

          <a
            href="mailto:sponsors@edusentry.edu"
            className="inline-flex items-center gap-2 rounded-xl border border-gold bg-gold px-5 py-2.5 text-[0.85rem] font-semibold text-[#0b1020] transition-colors hover:bg-[#f4c12e]"
          >
            <span>Partner with Us</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </div>
  )
}

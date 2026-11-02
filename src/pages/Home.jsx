import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import DynamicWorkflow from '../components/DynamicWorkflow.jsx'
import SponsorsSection from '../components/SponsorsSection.jsx'
import Logo from '../components/Logo.jsx'
import './Home.css'

// The public landing page (edusentry_cover.html), ported into a real
// route so its buttons and "Four Pillars" cards perform genuine
// client-side navigation into the app (Register/Login, then Dashboard,
// Learning Workspace, Risk Prediction, Career Guidance, Profile).
// In-page anchors (#home, #workspace, #risk, #career, #about, #how)
// stay as plain scroll links since those sections live on this page.
// It also doubles as the "Home" a signed-in user reaches from the
// sidebar — an abstract overview of what the site does — so its
// account CTAs adapt for someone who's already logged in.
export default function Home() {
  const { isAuthenticated } = useAuth()

  // In-page nav items scroll to their own section instead of following a
  // raw #hash href, so a click never falls through to a full navigation
  // (and never lands the user back on the home hero unless "Home" was the
  // one they actually clicked).
  const scrollToSection = (event, id) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand hover:opacity-90 transition-opacity">
            <Logo size={36} compact={true} />
          </Link>
          <nav className="links">
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/ai-tutor">AI Tutor</Link>
            <Link to="/risk-prediction">Risk Prediction</Link>
            <Link to="/career-guidance">Career Guidance</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="nav-actions">
            {isAuthenticated ? (
              <Link className="btn btn-primary" to="/app/dashboard">Go to Dashboard</Link>
            ) : (
              <>
                <Link className="btn btn-ghost" to="/login">Log In</Link>
                <Link className="btn btn-primary" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="hero hero-v2" id="home">
        <div className="hero-layout wrap">
          <div className="hero-copy">
            <div className="eyebrow-paren">(AI-Powered Academic Guardian)</div>
            <div className="hero-brand-name">
              Edu<span>Sentry</span>
            </div>
            <h1 className="hero-tagline">
              Watching over every step. Built for your <em>learning journey</em>.
            </h1>
            <p className="lede">
              EduSentry follows a student's progress from the first uploaded note to the first career choice — flagging risk early, tutoring in the moment, and pointing toward what comes next.
            </p>
            <div className="hero-cta">
              {isAuthenticated ? (
                <Link className="btn-hero-primary" to="/app/dashboard">
                  Go to Dashboard
                </Link>
              ) : (
                <Link className="btn-hero-primary" to="/register">
                  Create Account
                </Link>
              )}
              <Link className="btn-hero-ghost" to="/ai-tutor">
                Try AI Tutor (RAG Sandbox)
              </Link>
            </div>
          </div>

          <div className="hero-emblem-container">
            <div className="hero-emblem-glow"></div>
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hero-shield-svg"
              aria-label="EduSentry Shield Emblem"
            >
              <defs>
                <linearGradient id="heroShieldGrad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#151f32" />
                  <stop offset="50%" stopColor="#0d1424" />
                  <stop offset="100%" stopColor="#060a12" />
                </linearGradient>
                <linearGradient id="heroGoldBorder" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="heroCapGrad" x1="13" y1="13" x2="35" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <radialGradient id="heroCoreGlow" cx="24" cy="34" r="7" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
                <filter id="heroAura" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Outer Guardian Shield Body */}
              <path
                d="M24 4L40 10V22C40 32.5 33 40.5 24 44C15 40.5 8 32.5 8 22V10L24 4Z"
                fill="url(#heroShieldGrad)"
                stroke="url(#heroGoldBorder)"
                strokeWidth="2.2"
                strokeLinejoin="round"
                filter="url(#heroAura)"
              />

              {/* Inner Shield Accent Contour */}
              <path
                d="M24 8L36 13V22C36 30 30.5 36.5 24 39.5C17.5 36.5 12 30 12 22V13L24 8Z"
                stroke="#F59E0B"
                strokeWidth="1.1"
                strokeDasharray="2 2"
                opacity="0.85"
              />

              {/* Educational Mortarboard Diamond */}
              <polygon
                points="24,13 35,18.5 24,24 13,18.5"
                fill="url(#heroCapGrad)"
                stroke="#FDE68A"
                strokeWidth="1.1"
              />
              {/* Mortarboard Under-arch & Tassel */}
              <path
                d="M17 21V24.5C17 26.8 20.1 28.2 24 28.2C27.9 28.2 31 26.8 31 24.5V21"
                stroke="#F59E0B"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M33 19V25"
                stroke="#FDE68A"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="33" cy="25.5" r="1.1" fill="#FDE68A" />

              {/* Central Radiant Guardian Beacon (AI Sentinel Core) */}
              <circle cx="24" cy="34" r="5" fill="url(#heroCoreGlow)" />
              <path
                d="M24 30.5L25.2 33.2L28 34L25.2 34.8L24 37.5L22.8 34.8L20 34L22.8 33.2Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        </div>

        {/* Four Bottom Feature Cards Row - Same as Reference */}
        <div className="hero-bottom-cards wrap">
          <Link className="hero-feature-card" to="/app/learning-workspace">
            <div className="card-diamond">
              <div className="card-diamond-dot"></div>
            </div>
            <div className="card-title">Learning Workspace</div>
            <div className="card-sub">Notes, Flashcards & RAG AI Tutor</div>
          </Link>

          <Link className="hero-feature-card" to="/app/risk-prediction">
            <div className="card-diamond">
              <div className="card-diamond-dot"></div>
            </div>
            <div className="card-title">Risk Prediction</div>
            <div className="card-sub">Early academic setback warning</div>
          </Link>

          <Link className="hero-feature-card" to="/app/career-guidance">
            <div className="card-diamond">
              <div className="card-diamond-dot"></div>
            </div>
            <div className="card-title">Career Guidance</div>
            <div className="card-sub">Interest-based path mapping</div>
          </Link>

          <Link className="hero-feature-card" to="/app/profile">
            <div className="card-diamond">
              <div className="card-diamond-dot"></div>
            </div>
            <div className="card-title">Profile & Progress</div>
            <div className="card-sub">Continuous student history</div>
          </Link>
        </div>


        <div className="hero-marquee">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="marquee-set" key={i} aria-hidden={i === 1}>
                <span>Five Stations, One Path</span><span className="dot">●</span>
                <span>AI Tutor, Always On</span><span className="dot">●</span>
                <span>Risk Flagged Early</span><span className="dot">●</span>
                <span>Career Guidance Built In</span><span className="dot">●</span>
                <span>One Profile, Full History</span><span className="dot">●</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="wrap">
          <DynamicWorkflow />
        </div>
      </section>

      <section className="section pillars">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow"><span className="rule"></span>Four Pillars</div>
            <h2>What EduSentry keeps watch over.</h2>
            <p>Each pillar maps to a place in the product — nothing here is decorative.</p>
          </div>
          <div className="pillar-grid">
            <Link className="pillar" to="/app/learning-workspace">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="1.4"><path d="M4 4h16v16H4z" opacity="0"/><path d="M6 4h9l3 3v13H6z"/><path d="M15 4v3h3"/><path d="M9 12h6M9 15h6M9 9h3"/></svg>
              <div>
                <h3>Learning Workspace</h3>
                <p>Upload notes, chat with an AI tutor, and turn material into summaries, flashcards and quizzes.</p>
                <div className="sub"><span>Upload Notes</span><span>AI Tutor Chat</span><span>Summaries</span><span>Flashcards</span><span>Quiz</span></div>
              </div>
            </Link>
            <Link className="pillar" to="/app/risk-prediction">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#C1573F" strokeWidth="1.4"><path d="M12 2 3 6v6c0 5.4 3.9 9.4 9 10 5.1-.6 9-4.6 9-10V6l-9-4Z"/><path d="M9 12l2 2 4-4"/></svg>
              <div>
                <h3>Risk Prediction</h3>
                <p>Enter academic details and let the model predict risk level before it turns into a setback.</p>
                <div className="sub"><span>Academic Details</span><span>Predict Risk</span><span>View Results</span></div>
              </div>
            </Link>
            <Link className="pillar" to="/app/career-guidance">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#5C8770" strokeWidth="1.4"><path d="M4 20V10M12 20V4M20 20v-7"/><circle cx="4" cy="8" r="1.6"/><circle cx="12" cy="2.5" r="1.6"/><circle cx="20" cy="11" r="1.6"/></svg>
              <div>
                <h3>Career Guidance</h3>
                <p>Select an interest and get a career recommendation, plus the skills and resources to reach it.</p>
                <div className="sub"><span>Select Interest</span><span>Recommendation</span><span>Skills Resources</span></div>
              </div>
            </Link>
            <Link className="pillar" to="/app/profile">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#F4C878" strokeWidth="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>
              <div>
                <h3>Profile &amp; Progress</h3>
                <p>Personal details, activity, and progress over time, all kept in one place you own.</p>
                <div className="sub"><span>Personal Details</span><span>Progress</span><span>Dashboard</span></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="workspace">
        <div className="wrap">
          <div className="preview-grid">
            <div className="preview-copy">
              <div className="eyebrow"><span className="rule" style={{background: 'var(--sage)'}}></span>Learning Workspace</div>
              <h2 style={{marginTop: '16px', fontSize: '34px'}}>Your notes, doing more work than you gave them.</h2>
              <p style={{marginTop: '16px', fontSize: '15px', color: 'var(--text-lo)', lineHeight: '1.65'}}>Drop in a lecture PDF or handwritten scan, ask the tutor a question about it, and walk away with a summary, a flashcard deck, and a quiz — generated from what you actually studied.</p>
              <div className="checklist">
                <div><span className="chk"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#070B14" strokeWidth="1.8"/></svg></span>Upload notes in any common format</div>
                <div><span className="chk"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#070B14" strokeWidth="1.8"/></svg></span>Ask the AI tutor questions in plain language</div>
                <div><span className="chk"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#070B14" strokeWidth="1.8"/></svg></span>Get summaries, flashcards and quizzes automatically</div>
              </div>
              <Link className="btn btn-primary" style={{marginTop: '30px'}} to="/app/learning-workspace">Open the Workspace</Link>
            </div>
            <div className="panel">
              <div className="panel-top">
                <div className="dots"><span></span><span></span><span></span></div>
                <div className="title">LEARNING WORKSPACE — RECENT ACTIVITY</div>
              </div>
              <div className="panel-body">
                <div className="panel-card">
                  <div className="k">Notes Uploaded</div>
                  <div className="v">14</div>
                </div>
                <div className="panel-card">
                  <div className="k">Flashcards Made</div>
                  <div className="v">128</div>
                </div>
                <div className="panel-card wide">
                  <div className="k">Quiz Average — Cell Biology</div>
                  <div className="v">78%</div>
                  <div className="bar"><i style={{width: '78%'}}></i></div>
                </div>
                <div className="panel-card wide">
                  <div className="k">Tutor Chat — Last Question</div>
                  <div style={{fontSize: '13px', marginTop: '8px', color: 'var(--text-lo)', lineHeight: '1.5'}}>"Can you explain mitosis using my uploaded diagram from Tuesday?"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section risk-section" id="risk">
        <div className="wrap">
          <div className="risk-grid">
            <div className="gauge-card">
              <div className="gauge-top">
                <div>
                  <div className="eyebrow" style={{color: 'var(--text-lo)'}}>Risk Prediction Result</div>
                  <div className="gauge-num">72%</div>
                </div>
                <span className="tag-risk">Medium – High Risk</span>
              </div>
              <div className="gauge-bar"><i></i></div>
              <div className="gauge-row"><span>LOW</span><span>MODERATE</span><span>HIGH</span></div>
              <div className="gauge-list">
                <div><span className="label">Attendance</span><span className="val text-white">81%</span></div>
                <div><span className="label">Assignment Completion</span><span className="val text-white">69%</span></div>
                <div><span className="label">Quiz Performance</span><span className="val text-white">58%</span></div>
                <div><span className="label">Suggested Action</span><span className="val" style={{color: 'var(--beacon-soft)'}}>Extra Practice</span></div>
              </div>
            </div>
            <div className="risk-copy">
              <div className="eyebrow"><span className="rule" style={{background: 'var(--coral)'}}></span>Risk Prediction</div>
              <h2 style={{marginTop: '16px', fontSize: '34px'}}>Three steps between not-knowing and knowing.</h2>
              <div className="flow">
                <div className="flow-step">
                  <div className="fnum">01</div>
                  <div><h4>Enter academic details</h4><p>Attendance, assignments and recent scores — the same numbers already sitting in your records.</p></div>
                </div>
                <div className="flow-step">
                  <div className="fnum">02</div>
                  <div><h4>Predict risk</h4><p>The model reads the pattern behind the numbers, not just the numbers themselves.</p></div>
                </div>
                <div className="flow-step">
                  <div className="fnum">03</div>
                  <div><h4>View results</h4><p>A clear risk score, the reasons behind it, and a next action — not a black box.</p></div>
                </div>
              </div>
              <Link className="btn btn-primary" style={{marginTop: '30px'}} to="/app/risk-prediction">Try Risk Prediction</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="career">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow"><span className="rule"></span>Career Guidance</div>
            <h2>From "what am I interested in" to "what's the plan."</h2>
            <p>Three short steps turn a vague interest into a concrete direction and a resource list.</p>
          </div>
          <div className="career-grid">
            <div className="career-card">
              <span className="step-tag">Step 01</span>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
              <h3>Select Interest</h3>
              <p>Pick from subjects and activities you already gravitate toward — no forced categories.</p>
            </div>
            <div className="career-card">
              <span className="step-tag">Step 02</span>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.6"><path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9 13l2 2 4-4"/></svg>
              <h3>Career Recommendation</h3>
              <p>See a short list of career paths that genuinely line up with those interests and your risk profile.</p>
            </div>
            <div className="career-card">
              <span className="step-tag">Step 03</span>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.6"><path d="M4 19.5V6a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0-2 2Z"/><path d="M8 8h8M8 11h6"/></svg>
              <h3>Skills Resources</h3>
              <p>Get the specific skills to build and where to start building them, linked directly to the path chosen.</p>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '36px'}}>
            <Link className="btn btn-primary" to="/app/career-guidance">Explore Career Guidance</Link>
          </div>
        </div>
      </section>


      <section className="section" id="about" style={{paddingTop: '0'}}>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow"><span className="rule"></span>Made For Every Stakeholder</div>
            <h2>Better outcomes, from every seat.</h2>
          </div>
          <div className="stake-grid">
            <div className="stake-card"><h4>For Students</h4><p>A workspace that studies with you and a plan when things start slipping.</p></div>
            <div className="stake-card"><h4>For Teachers</h4><p>See who's at risk before the report card does, with a reason attached.</p></div>
            <div className="stake-card"><h4>For Institutions</h4><p>Data-driven insight into where academic programs are working and where they aren't.</p></div>
            <div className="stake-card"><h4>For Parents</h4><p>A clear, honest view into a child's learning journey — no guesswork.</p></div>
          </div>
        </div>
      </section>

      {/* SPONSORS & PARTNERS SECTION */}
      <SponsorsSection />

      <section className="section" style={{paddingTop: '0'}}>
        <div className="cta">
          <h2>Every student deserves someone watching for the moment they need help.</h2>
          <div className="cta-actions">
            {isAuthenticated ? (
              <Link className="btn btn-beacon" to="/app/dashboard">Go to Dashboard</Link>
            ) : (
              <>
                <Link className="btn btn-beacon" to="/register">Get Started Now</Link>
                <Link className="btn btn-outline-light" to="/login">Log In</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer id="login" >
        <div className="wrap">
          <div className="footer-inner">
            <Link to="/" className="brand hover:opacity-90 transition-opacity">
              <Logo size={34} tagline="Learning, watched over" />
            </Link>
            <div className="cols">
              <div className="col">
                <h5>Product</h5>
                <Link to="/app/learning-workspace">Learning Workspace</Link>
                <Link to="/app/risk-prediction">Risk Prediction</Link>
                <Link to="/app/career-guidance">Career Guidance</Link>
              </div>
              <div className="col">
                <h5>Account</h5>
                {isAuthenticated ? (
                  <Link to="/app/dashboard">Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login">Log In</Link>
                    <Link to="/register">Register</Link>
                  </>
                )}
                <Link to="/app/profile">Profile</Link>
              </div>
              <div className="col">
                <h5>Ecosystem</h5>
                <Link to="/about">About Us</Link>
                <Link to="/features">Features</Link>
                <Link to="/ai-tutor">AI Tutor (RAG)</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 EduSentry — Team 2</span>
            <span>WATCHING · LEARNING · GUIDING</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

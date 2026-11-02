import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function PublicHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="border-b border-[#263653] bg-[#0b1020]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo tagline="AI Learning Guardian" />
        </Link>

        {/* Public Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-[0.86rem] text-slate-300">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <Link to="/features" className="hover:text-gold transition-colors">Features</Link>
          <Link to="/ai-tutor" className="hover:text-gold transition-colors text-gold flex items-center gap-1">
            <span>⚡</span>
            <span>AI Tutor & RAG</span>
          </Link>
          <Link to="/risk-prediction" className="hover:text-gold transition-colors">Risk Prediction</Link>
          <Link to="/career-guidance" className="hover:text-gold transition-colors">Career Guidance</Link>
          <Link to="/about" className="hover:text-gold transition-colors">About</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/app/dashboard"
              className="rounded-xl border border-gold bg-gold px-4 py-2 text-[0.84rem] font-semibold text-[#0b1020] transition-colors hover:bg-[#f4c12e]"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3.5 py-2 text-[0.84rem] font-medium text-slate-300 transition-colors hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-gold bg-gold px-4 py-2 text-[0.84rem] font-semibold text-[#0b1020] transition-colors hover:bg-[#f4c12e]"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

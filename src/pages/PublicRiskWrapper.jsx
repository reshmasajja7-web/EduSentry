import PublicHeader from '../components/PublicHeader.jsx'
import RiskPrediction from './RiskPrediction.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function PublicRiskWrapper() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen ambient-bg text-primary">
      <PublicHeader />
      
      {!isAuthenticated && (
        <div className="border-b border-[#263653] bg-[#111a2b] px-4 py-2.5 text-center text-[0.82rem] text-slate-300">
          <span>Viewing in Public Preview. </span>
          <Link to="/register" className="font-semibold text-gold underline hover:text-white">
            Create a student account
          </Link>
          <span> to save your risk history and study plans permanently.</span>
        </div>
      )}

      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">
        <RiskPrediction />
      </div>
    </div>
  )
}

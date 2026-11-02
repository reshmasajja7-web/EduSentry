import { Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext.jsx'
import { WorkspaceDataProvider } from './context/WorkspaceDataContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppShell from './components/AppShell.jsx'
import WorkspaceLayout from './components/WorkspaceLayout.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Features from './pages/Features.jsx'
import PublicAITutor from './pages/PublicAITutor.jsx'
import About from './pages/About.jsx'
import PublicRiskWrapper from './pages/PublicRiskWrapper.jsx'
import PublicCareerWrapper from './pages/PublicCareerWrapper.jsx'

import Dashboard from './pages/Dashboard.jsx'
import RiskPrediction from './pages/RiskPrediction.jsx'
import CareerGuidance from './pages/CareerGuidance.jsx'
import Profile from './pages/Profile.jsx'
import UploadNotes from './pages/UploadNotes.jsx'
import AITutorChat from './pages/AITutorChat.jsx'
import Summaries from './pages/Summaries.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Quiz from './pages/Quiz.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkspaceDataProvider>
          <Routes>
            {/* Public Landing & Showcase */}
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/ai-tutor" element={<PublicAITutor />} />
            <Route path="/about" element={<About />} />
            <Route path="/risk-prediction" element={<PublicRiskWrapper />} />
            <Route path="/career-guidance" element={<PublicCareerWrapper />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Authenticated application */}
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<AppShell />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="learning-workspace" element={<WorkspaceLayout />}>
                  <Route index element={<Navigate to="upload" replace />} />
                  <Route path="upload" element={<UploadNotes />} />
                  <Route path="tutor" element={<AITutorChat />} />
                  <Route path="summaries" element={<Summaries />} />
                  <Route path="flashcards" element={<Flashcards />} />
                  <Route path="quiz" element={<Quiz />} />
                </Route>

                <Route path="risk-prediction" element={<RiskPrediction />} />
                <Route path="career-guidance" element={<CareerGuidance />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Unknown route fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WorkspaceDataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
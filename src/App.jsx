import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './contexts/AppContext.jsx'

import AppLayout from './layouts/AppLayout.jsx'
import FocusLayout from './layouts/FocusLayout.jsx'

import EntryPage from './pages/EntryPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ReflectPage from './pages/ReflectPage.jsx'
import DevelopPage from './pages/DevelopPage.jsx'
import PublishPage from './pages/PublishPage.jsx'
import LinkedInFlowPage from './pages/LinkedInFlowPage.jsx'
import TwitterFlowPage from './pages/TwitterFlowPage.jsx'
import WriteFlowPage from './pages/WriteFlowPage.jsx'
import DraftOutputPage from './pages/DraftOutputPage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function ProtectedRoute({ children }) {
  const { user } = useApp()
  if (!user.name) return <Navigate to="/login" replace />
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<FocusLayout />}>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reflect" element={<ReflectPage />} />
        <Route path="/develop" element={<DevelopPage />} />
        <Route path="/publish" element={<PublishPage />} />
        <Route path="/publish/linkedin" element={<LinkedInFlowPage />} />
        <Route path="/publish/twitter" element={<TwitterFlowPage />} />
        <Route path="/publish/write" element={<WriteFlowPage />} />
        <Route path="/publish/draft/:id" element={<DraftOutputPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}

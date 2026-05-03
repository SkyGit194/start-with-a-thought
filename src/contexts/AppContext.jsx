import React, { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { getDailyPrompt } from '../utils/mockAI.js'

const AppContext = createContext(null)

const defaultUser = {
  name: '',
  email: '',
  role: '',
  industry: '',
  audience: '',
  platforms: [],
  contentPillars: [],
  knownFor: '',
  writingTypes: [],
  writingStruggles: [],
  currentLearning: { type: '', title: '', active: false },
  tonePreference: '',
  onboardingComplete: false,
}

const defaultSession = {
  mode: null,
  format: null,
  questions: [],
  insights: [],
  draft: null,
  status: 'idle',
}

export function AppProvider({ children }) {
  const [user, setUser] = useLocalStorage('swat_user', defaultUser)
  const [library, setLibrary] = useLocalStorage('swat_library', [])
  const [currentSession, setCurrentSession] = useLocalStorage('swat_session', defaultSession)
  const dailyPrompt = getDailyPrompt()

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }))

  const updateSession = (updates) => setCurrentSession(prev => ({ ...prev, ...updates }))

  const resetSession = () => setCurrentSession(defaultSession)

  const saveToLibrary = (item) => {
    const newItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item,
    }
    setLibrary(prev => [newItem, ...prev])
    return newItem.id
  }

  const deleteFromLibrary = (id) => {
    setLibrary(prev => prev.filter(item => item.id !== id))
  }

  return (
    <AppContext.Provider value={{
      user,
      updateUser,
      library,
      saveToLibrary,
      deleteFromLibrary,
      currentSession,
      updateSession,
      resetSession,
      dailyPrompt,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

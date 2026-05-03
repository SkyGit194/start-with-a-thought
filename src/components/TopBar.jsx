import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext.jsx'

const breadcrumbs = {
  '/dashboard': ['Dashboard'],
  '/reflect': ['Reflect', 'Workspace'],
  '/develop': ['Develop', 'Workspace'],
  '/publish': ['Publish', 'Format'],
  '/publish/linkedin': ['Publish', 'LinkedIn'],
  '/publish/twitter': ['Publish', 'Twitter/X'],
  '/publish/write': ['Publish', 'Write'],
  '/library': ['Library'],
  '/profile': ['Profile'],
}

export default function TopBar({ onMenuToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useApp()

  const crumbs = breadcrumbs[location.pathname] || ['Workspace']

  return (
    <header className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-[#2A2A2A] bg-[#131413]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden text-zinc-500 hover:text-zinc-200 transition-colors p-1"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <nav className="flex items-center gap-1.5">
          {crumbs.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && <span className="text-zinc-700 text-xs">/</span>}
              <span className={`text-[11px] uppercase tracking-widest font-semibold ${
                i === crumbs.length - 1 ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-zinc-600 hover:text-zinc-300 transition-colors p-1.5 rounded-sm hover:bg-[#1A1A1A]"
        >
          <span className="material-symbols-outlined text-lg">home</span>
        </button>
      </div>
    </header>
  )
}

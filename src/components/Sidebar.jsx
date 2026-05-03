import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'

const navItems = [
  { to: '/reflect', icon: 'psychology', label: 'Reflect' },
  { to: '/develop', icon: 'auto_awesome', label: 'Develop' },
  { to: '/publish', icon: 'auto_stories', label: 'Publish' },
  { to: '/library', icon: 'archive', label: 'Library' },
]

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { user } = useApp()
  const navigate = useNavigate()

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[200px] flex-shrink-0 flex-col bg-[#131413] border-r border-[#2A2A2A] h-full">
        <SidebarContent initials={initials} navigate={navigate} onClose={null} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          <aside className="relative w-[200px] flex flex-col bg-[#131413] border-r border-[#2A2A2A] h-full z-10">
            <SidebarContent initials={initials} navigate={navigate} onClose={onMobileClose} />
          </aside>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#131413] border-t border-[#2A2A2A] flex">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 gap-1 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                isActive ? 'text-[#8DA399]' : 'text-zinc-600'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

function SidebarContent({ initials, navigate, onClose }) {
  return (
    <>
      <div className="px-5 py-6 border-b border-[#2A2A2A]">
        <button
          onClick={() => { navigate('/dashboard'); onClose?.() }}
          className="text-left"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Start With A</div>
          <div className="text-sm font-bold tracking-tight text-[#e4e2e0]">Thought.</div>
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 px-2">Workspace</span>
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 relative ${
                isActive
                  ? 'text-[#8DA399] bg-[#1A1A1A] border-r-2 border-[#8DA399]'
                  : 'text-zinc-600 hover:bg-[#1A1A1A] hover:text-zinc-200'
              }`
            }
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2A2A]">
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${
              isActive ? 'text-[#8DA399]' : 'text-zinc-600 hover:text-zinc-200'
            }`
          }
        >
          <div className="w-7 h-7 rounded-full bg-[#2d4f4f] flex items-center justify-center text-[#8DA399] text-[10px] font-bold flex-shrink-0">
            {initials}
          </div>
          <span className="truncate">Profile</span>
        </NavLink>
      </div>
    </>
  )
}

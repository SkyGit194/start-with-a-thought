import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'
import LibraryCard from '../components/LibraryCard.jsx'
import FilterBar from '../components/FilterBar.jsx'

const filters = [
  { value: 'all', label: 'All Saved' },
  { value: 'reflect', label: 'Reflect' },
  { value: 'develop', label: 'Develop' },
  { value: 'publish', label: 'Publish' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'journal', label: 'Journal' },
  { value: 'reflection', label: 'Reflections' },
  { value: 'idea', label: 'Ideas' },
  { value: 'draft', label: 'Drafts' },
  { value: 'post', label: 'Posts' },
]

export default function LibraryPage() {
  const { library, deleteFromLibrary } = useApp()
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = library.filter(item => {
    const matchesFilter = activeFilter === 'all' ||
      item.mode === activeFilter ||
      item.format === activeFilter ||
      item.type === activeFilter
    const matchesSearch = !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.content?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#e4e2e0] tracking-tight">Intellectual Archive</h1>
            <p className="text-xs text-zinc-500 mt-1">{library.length} item{library.length !== 1 ? 's' : ''} saved</p>
          </div>
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-base">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your archive..."
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#8DA399] rounded-lg pl-9 pr-4 h-10 text-sm text-[#e4e2e0] outline-none placeholder:text-zinc-700 transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar filters={filters} active={activeFilter} onChange={setActiveFilter} />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-dashed border-[#2A2A2A] rounded-xl p-16 text-center"
          >
            <span className="material-symbols-outlined text-4xl text-zinc-700 mb-3 block">archive</span>
            <p className="text-zinc-600 text-sm">
              {search || activeFilter !== 'all'
                ? 'No items match your filter.'
                : 'Nothing saved yet. Start with a reflection.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <LibraryCard item={item} onDelete={deleteFromLibrary} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

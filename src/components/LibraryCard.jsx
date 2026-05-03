import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const typeColors = {
  reflection: 'text-[#8DA399] bg-[#8DA399]/10',
  idea: 'text-[#a9cdcd] bg-[#a9cdcd]/10',
  draft: 'text-[#e4beba] bg-[#e4beba]/10',
  post: 'text-[#b5ccc1] bg-[#b5ccc1]/10',
}

export default function LibraryCard({ item, onDelete }) {
  const navigate = useNavigate()
  const colorClass = typeColors[item.type] || 'text-zinc-400 bg-zinc-800'

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8DA399]/50 rounded-xl p-5 flex flex-col gap-3 group transition-colors cursor-pointer"
      onClick={() => navigate(`/publish/draft/${item.id}`)}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${colorClass}`}>
          {item.type}
        </span>
        <span className="text-[10px] text-zinc-600">{timeAgo(item.updatedAt)}</span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#e4e2e0] mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{item.content?.slice(0, 120)}...</p>
      </div>

      {item.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-[#2A2A2A] text-zinc-400 text-[10px] uppercase font-bold rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-[#2A2A2A]">
        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">{item.mode || item.format}</span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="text-zinc-500 hover:text-[#8DA399] transition-colors"
            onClick={e => { e.stopPropagation(); navigate(`/publish/draft/${item.id}`) }}
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
          {onDelete && (
            <button
              className="text-zinc-500 hover:text-red-400 transition-colors"
              onClick={e => { e.stopPropagation(); onDelete(item.id) }}
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

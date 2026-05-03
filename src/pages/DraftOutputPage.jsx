import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext.jsx'
import { transformDraft } from '../utils/mockAI.js'
import CopyButton from '../components/CopyButton.jsx'

export default function DraftOutputPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { library, saveToLibrary, deleteFromLibrary } = useApp()
  const item = library.find(i => i.id === id)

  const [editMode, setEditMode] = useState(false)
  const [content, setContent] = useState(item?.content || '')
  const [transforming, setTransforming] = useState(false)
  const [savedCopy, setSavedCopy] = useState(false)

  if (!item) {
    return (
      <div className="p-10 text-center">
        <p className="text-zinc-500 mb-4">This draft no longer exists.</p>
        <button onClick={() => navigate('/library')} className="text-[#8DA399] text-sm font-semibold">
          Back to Library
        </button>
      </div>
    )
  }

  const handleTransform = async (type) => {
    setTransforming(true)
    const result = await transformDraft(content, type)
    setContent(result)
    setTransforming(false)
  }

  const handleSaveCopy = () => {
    saveToLibrary({ ...item, id: undefined, title: `${item.title} (copy)`, content })
    setSavedCopy(true)
  }

  return (
    <div className="p-6 md:p-12 max-w-[720px] mx-auto pb-24 md:pb-12">
      {/* Action toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-[#2A2A2A]">
        <CopyButton text={content} label="Copy" />

        <motion.button whileTap={{ scale: 0.98 }} onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-2 border px-4 h-10 rounded-lg font-semibold text-sm transition-colors ${
            editMode ? 'border-[#8DA399] text-[#8DA399]' : 'border-[#2A2A2A] text-zinc-300 hover:border-zinc-600'
          }`}>
          <span className="material-symbols-outlined text-base">edit</span>
          {editMode ? 'Done' : 'Edit'}
        </motion.button>

        <motion.button whileTap={{ scale: 0.98 }} onClick={handleSaveCopy} disabled={savedCopy}
          className="flex items-center gap-2 border border-[#2A2A2A] hover:border-zinc-600 text-zinc-300 px-4 h-10 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60">
          <span className="material-symbols-outlined text-base">{savedCopy ? 'check' : 'archive'}</span>
          {savedCopy ? 'Archived.' : 'Save copy'}
        </motion.button>

        <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate('/publish')}
          className="flex items-center gap-2 border border-[#2A2A2A] hover:border-zinc-600 text-zinc-300 px-4 h-10 rounded-lg font-semibold text-sm transition-colors">
          <span className="material-symbols-outlined text-base">swap_horiz</span>
          Reformat
        </motion.button>

        <motion.button whileTap={{ scale: 0.98 }} onClick={() => {
          if (window.confirm('Delete this draft?')) {
            deleteFromLibrary(id)
            navigate('/library')
          }
        }}
          className="flex items-center gap-2 border border-[#2A2A2A] hover:border-red-900 text-zinc-600 hover:text-red-400 px-4 h-10 rounded-lg font-semibold text-sm transition-colors ml-auto">
          <span className="material-symbols-outlined text-base">delete</span>
        </motion.button>
      </div>

      {/* Article */}
      <div className="mb-3 flex items-center gap-2">
        <span className="px-2 py-1 bg-[#2A2A2A] text-zinc-400 text-[10px] uppercase font-bold tracking-widest rounded">
          {item.type}
        </span>
        <span className="px-2 py-1 bg-[#2A2A2A] text-zinc-500 text-[10px] uppercase font-bold tracking-widest rounded">
          {item.format}
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-[#e4e2e0] tracking-tight leading-tight mb-4">
        {item.title}
      </h1>

      <p className="text-[11px] uppercase tracking-widest text-zinc-600 mb-8">
        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      {editMode ? (
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full min-h-[400px] bg-transparent text-[#e4e2e0] text-lg leading-relaxed outline-none resize-none border border-[#2A2A2A] rounded-xl p-4 focus:border-[#8DA399] transition-colors"
        />
      ) : (
        <div className="text-[#e4e2e0] text-lg leading-relaxed whitespace-pre-wrap">{content}</div>
      )}

      {item.insights?.length > 0 && (
        <div className="mt-10 pt-6 border-t border-[#2A2A2A]">
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-4">Insights from this session</div>
          <div className="flex flex-col gap-2">
            {item.insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-[#8DA399] capitalize font-medium min-w-[100px]">{ins.type?.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-zinc-400">{ins.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transforms */}
      <div className="mt-10 pt-6 border-t border-[#2A2A2A]">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">Transform</div>
        <div className="flex flex-wrap gap-2">
          {['shorter', 'deeper', 'personal', 'professional', 'storytelling', 'hooks'].map(t => (
            <button key={t} onClick={() => handleTransform(t)} disabled={transforming}
              className="px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-zinc-600 text-zinc-400 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors disabled:opacity-40 capitalize">
              {t === 'personal' ? 'More personal' : t === 'professional' ? 'More professional' : t === 'storytelling' ? 'Add storytelling' : t === 'hooks' ? 'Regenerate hook' : `Make ${t}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

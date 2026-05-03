import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function CopyButton({ text, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.95 }}
      className={`bg-[#8DA399] text-[#0F0F0F] px-5 h-10 flex items-center gap-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 ${className}`}
    >
      <span className="material-symbols-outlined text-lg">
        {copied ? 'check' : 'content_copy'}
      </span>
      {copied ? 'Copied. It\'s yours now.' : label}
    </motion.button>
  )
}

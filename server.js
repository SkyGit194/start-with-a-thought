import 'dotenv/config'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'
const apiKey = process.env.VITE_ANTHROPIC_API_KEY

const app = express()
app.use(express.json())

// ── /api/research ──────────────────────────────────────────────────────────────
app.post('/api/research', async (req, res) => {
  const { topic } = req.body

  if (!topic) {
    return res.status(400).json({ error: 'topic is required' })
  }

  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(503).json({ error: 'VITE_ANTHROPIC_API_KEY not configured' })
  }

  try {
    const client = new Anthropic({ apiKey })

    const response = await client.beta.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system: `You are a LinkedIn content research assistant. When given a topic, use web search to find what's currently being discussed. Return ONLY a valid JSON object — no markdown, no prose — with exactly these four keys:
- commonTakes: string[] (2-3 items — what most people are already saying about this topic)
- recentData: string[] (2-3 items — fresh stats, studies, or developments from the past 12 months)
- underrepresentedAngles: string[] (2-3 items — contrarian or overlooked perspectives the conversation is missing)
- gapInConversation: string (1 item — the single most important thing nobody is talking about yet)

Each string should be a complete, specific sentence — not a vague label.`,
      messages: [
        {
          role: 'user',
          content: `Research this LinkedIn topic: "${topic}"`,
        },
      ],
    })

    const textBlocks = response.content.filter(b => b.type === 'text')
    const lastText = textBlocks[textBlocks.length - 1]?.text || ''
    const cleaned = lastText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()

    let result
    try {
      result = JSON.parse(cleaned)
    } catch {
      console.error('[/api/research] JSON parse failed:', lastText)
      return res.status(500).json({ error: 'Failed to parse AI response as JSON' })
    }

    res.json(result)
  } catch (err) {
    console.error('[/api/research]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── Static (production) / Dev proxy ───────────────────────────────────────────
if (isProd) {
  const distPath = join(__dirname, 'dist')
  if (!existsSync(distPath)) {
    console.error('dist/ not found. Run `npm run build` first.')
    process.exit(1)
  }
  app.use(express.static(distPath))
  // SPA fallback
  app.use((_req, res) => res.sendFile(join(distPath, 'index.html')))
} else {
  // Dev: Vite handles the frontend — this server only needs to be started
  // when you want to test the Express layer separately. Normally use `npm run dev`.
  console.log('Dev mode: frontend is served by Vite at http://localhost:5173')
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  if (isProd) console.log('Serving built app from dist/')
})

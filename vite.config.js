import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Anthropic from '@anthropic-ai/sdk'

function researchApiPlugin(apiKey) {
  return {
    name: 'research-api',
    configureServer(server) {
      server.middlewares.use('/api/research', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let rawBody = ''
        req.on('data', chunk => { rawBody += chunk.toString() })
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')

          if (!apiKey || apiKey === 'your_api_key_here') {
            res.statusCode = 503
            res.end(JSON.stringify({ error: 'VITE_ANTHROPIC_API_KEY not configured in .env' }))
            return
          }

          try {
            const { topic } = JSON.parse(rawBody)
            if (!topic) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'topic is required' }))
              return
            }

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

            // Extract the last text block — that's the final answer after any search rounds
            const textBlocks = response.content.filter(b => b.type === 'text')
            const lastText = textBlocks[textBlocks.length - 1]?.text || ''

            // Strip markdown code fences if the model wrapped it
            const cleaned = lastText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()

            let result
            try {
              result = JSON.parse(cleaned)
            } catch {
              // JSON parse failed — extract what we can with a fallback shape
              console.error('[research-api] JSON parse failed. Raw text:', lastText)
              result = {
                commonTakes: ['Could not parse response. Try again.'],
                recentData: [],
                underrepresentedAngles: [],
                gapInConversation: lastText.slice(0, 200),
              }
            }

            res.end(JSON.stringify(result))
          } catch (err) {
            console.error('[research-api] Error:', err.message)
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load all env vars (empty prefix = load everything, not just VITE_)
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.VITE_ANTHROPIC_API_KEY

  return {
    plugins: [react(), tailwindcss(), researchApiPlugin(apiKey)],
  }
})

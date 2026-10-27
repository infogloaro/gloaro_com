import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendWhatsApp } from './api/notify-whatsapp.js'

// Serves /api/notify-whatsapp during `npm run dev`; Vercel runs api/ itself in production.
function whatsappDevApi(env) {
  return {
    name: 'whatsapp-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/notify-whatsapp', async (req, res) => {
        const reply = (status, body) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(body))
        }
        if (req.method !== 'POST') return reply(405, { ok: false, error: 'Method not allowed' })
        let raw = ''
        for await (const chunk of req) raw += chunk
        try {
          const { status, body } = await sendWhatsApp(JSON.parse(raw || '{}'), env)
          reply(status, body)
        } catch {
          reply(500, { ok: false, error: 'Could not send WhatsApp message' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), whatsappDevApi(loadEnv(mode, process.cwd(), 'ULTRAMSG_'))],
}))

// Sends a form submission to the GloAro team's WhatsApp through UltraMsg.
// Runs server-side (Vercel function in production, Vite middleware in dev) so
// the UltraMsg token never reaches the browser bundle.
//
// Env: ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN, ULTRAMSG_TO (e.g. +917094176551)
import process from 'node:process'

const MAX_FIELDS = 30
const MAX_VALUE = 1000

const clean = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

export function buildMessage({ form, fields }) {
  const lines = Object.entries(fields || {})
    .slice(0, MAX_FIELDS)
    .map(([label, value]) => [clean(label, 60), clean(value, MAX_VALUE)])
    .filter(([label, value]) => label && value)
    .map(([label, value]) => `*${label}:* ${value}`)
  return [`*New ${clean(form, 80) || 'website'} submission*`, '', ...lines].join('\n')
}

export async function sendWhatsApp(payload, env = process.env) {
  const { ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN, ULTRAMSG_TO } = env
  if (!ULTRAMSG_INSTANCE || !ULTRAMSG_TOKEN || !ULTRAMSG_TO) {
    return { status: 500, body: { ok: false, error: 'WhatsApp notifications are not configured' } }
  }
  if (!payload || typeof payload.fields !== 'object') {
    return { status: 400, body: { ok: false, error: 'Missing form fields' } }
  }
  if (payload.website_hp) return { status: 200, body: { ok: true } } // honeypot: drop bots quietly

  const response = await fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token: ULTRAMSG_TOKEN, to: ULTRAMSG_TO, body: buildMessage(payload) }),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.error || result.sent === 'false') {
    return { status: 502, body: { ok: false, error: 'WhatsApp provider rejected the message' } }
  }
  return { status: 200, body: { ok: true } }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { status, body } = await sendWhatsApp(payload)
    return res.status(status).json(body)
  } catch {
    return res.status(500).json({ ok: false, error: 'Could not send WhatsApp message' })
  }
}

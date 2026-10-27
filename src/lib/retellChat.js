// Retell text chat for the GLOARO AI Assistant, using the two documented
// endpoints the official widget itself calls:
//   POST /create-chat            → { chat_id, ... }
//   POST /create-chat-completion → { messages: [{ role, content, ... }] }
// Auth is the *public* key (built for browsers; allowed only from gloaro.com
// origins). Never put a Retell secret key here.
const API_BASE = 'https://api.retellai.com'
export const RETELL_AGENT_ID = 'agent_b10d33313fa6c75e32928896f3'
const RETELL_PUBLIC_KEY = 'public_key_0266dc1a7ca16626cb03f'

export class RetellError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'RetellError'
    this.status = status
  }
}

async function post(path, body) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { authorization: `Bearer ${RETELL_PUBLIC_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new RetellError('network', 0)
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new RetellError(data.message || `HTTP ${response.status}`, response.status)
  return data
}

// Starts a chat session with the agent. Resolves to the chat_id.
export async function createChat() {
  const data = await post('/create-chat', { agent_id: RETELL_AGENT_ID })
  if (!data.chat_id) throw new RetellError('No chat_id in response', 500)
  return data.chat_id
}

// Sends one user message; resolves to the agent's reply text(s), in order.
// Tool-call / transition entries in the response are not user-facing and are skipped.
export async function sendMessage(chatId, content) {
  const data = await post('/create-chat-completion', { chat_id: chatId, content })
  return (data.messages || []).filter((m) => m.role === 'agent' && m.content).map((m) => m.content)
}

// Turns an error into the short, honest line shown in the chat.
export function describeError(error) {
  if (error?.message === 'network') return "We couldn't reach the AI service. Check your connection and try again."
  if (error?.status === 401) return "The AI assistant isn't authorised for this web address yet."
  if (error?.status === 429) return 'The assistant is busy right now. Please try again in a moment.'
  return "Something went wrong while sending your message. Please try again."
}

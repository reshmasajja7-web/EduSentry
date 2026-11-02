// EduSentry provider catalogue. Cloud models are only exposed when their API key
// is configured; Ollama is local and needs no cloud API key. Free-tier limits vary.
export const RAG_MODEL_CONFIG = {
  
'gemini-flash': {
  provider: 'gemini',
  envKey: 'GEMINI_API_KEY',
  defaultModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash'
},

'gemini-flash-lite': {
  provider: 'gemini',
  envKey: 'GEMINI_API_KEY',
  defaultModel: process.env.GEMINI_LITE_MODEL || 'gemini-3.5-flash-lite'
},

  'groq-llama-3.3-70b': { provider: 'groq', envKey: 'GROQ_API_KEY', defaultModel: 'llama-3.3-70b-versatile' },
  'groq-gpt-oss-20b': { provider: 'groq', envKey: 'GROQ_API_KEY', defaultModel: 'openai/gpt-oss-20b' },
  'openrouter-free-auto': { provider: 'openrouter', envKey: 'OPENROUTER_API_KEY', defaultModel: 'openrouter/free' },
  'openrouter-qwen-free': { provider: 'openrouter', envKey: 'OPENROUTER_API_KEY', defaultModel: 'qwen/qwen3-4b:free' },
  'mistral-small-free': { provider: 'mistral', envKey: 'MISTRAL_API_KEY', defaultModel: process.env.MISTRAL_MODEL || 'mistral-small-latest' },
  'nvidia-nim-llama': { provider: 'nvidia', envKey: 'NVIDIA_NIM_API_KEY', defaultModel: process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.1-8b-instruct' },
  'cloudflare-llama': { provider: 'cloudflare', envKey: 'CLOUDFLARE_API_TOKEN', defaultModel: process.env.CLOUDFLARE_MODEL || '@cf/meta/llama-3.1-8b-instruct' },
  'ollama-local': { provider: 'ollama', envKey: null, defaultModel: process.env.OLLAMA_MODEL || 'llama3.2' },
}

export const SUPPORTED_RAG_MODELS = [
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google Gemini', requiresKey: true, envKey: 'GEMINI_API_KEY', badge: 'Free tier · quota limited' },
  { id: 'gemini-flash-lite', name: 'Gemini Flash-Lite', provider: 'Google Gemini', requiresKey: true, envKey: 'GEMINI_API_KEY', badge: 'Free tier · quota limited' },
  { id: 'groq-llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Groq', requiresKey: true, envKey: 'GROQ_API_KEY', badge: 'Free tier · account limits apply' },
  { id: 'groq-gpt-oss-20b', name: 'GPT-OSS 20B', provider: 'Groq', requiresKey: true, envKey: 'GROQ_API_KEY', badge: 'Free tier · account limits apply' },
  { id: 'openrouter-free-auto', name: 'OpenRouter Free Auto', provider: 'OpenRouter', requiresKey: true, envKey: 'OPENROUTER_API_KEY', badge: 'Free endpoints only · rate limited' },
  { id: 'openrouter-qwen-free', name: 'Qwen 3 4B (free endpoint)', provider: 'OpenRouter', requiresKey: true, envKey: 'OPENROUTER_API_KEY', badge: 'Free endpoint · availability can change' },
  { id: 'mistral-small-free', name: 'Mistral Small', provider: 'Mistral', requiresKey: true, envKey: 'MISTRAL_API_KEY', badge: 'Use only if account confirms free access' },
  { id: 'nvidia-nim-llama', name: 'NVIDIA NIM Llama', provider: 'NVIDIA NIM', requiresKey: true, envKey: 'NVIDIA_NIM_API_KEY', badge: 'Developer quota/eligibility applies' },
  { id: 'cloudflare-llama', name: 'Cloudflare Workers AI Llama', provider: 'Cloudflare Workers AI', requiresKey: true, envKey: 'CLOUDFLARE_API_TOKEN', badge: 'Free daily allowance · account limits apply' },
  { id: 'ollama-local', name: 'Ollama (local)', provider: 'Ollama', requiresKey: false, envKey: null, badge: 'Local · no per-request API fee' },
]

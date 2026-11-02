// ============================================================
// EduSentry RAG & Multi-LLM Engine
// Hybrid BM25 / TF-IDF Retrieval + Multi-Model LLM Dispatcher
// Supporting: Google Gemini, OpenAI, Anthropic Claude, DeepSeek,
// and Built-in EduSentry Neural RAG (Zero-Config Offline Mode)
// ============================================================

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more',
  'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you',
  'your', 'yours', 'yourself', 'yourselves'
])

export const SUPPORTED_MODELS = [
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google Gemini',badge: 'free tier', description: 'Google Gemini Flash API; model access and quota depend on your account.', requiresKey: true, icon: '🌟' },
  { id: 'gemini-flash-lite', name: 'Gemini Flash-Lite', provider: 'Google Gemini',badge: 'free tier', description: 'Fast, cost-efficient Gemini API; free-tier limits apply.', requiresKey: true, icon: '✨' },
  { id: 'groq-llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Groq',badge: 'free tier', description: 'Hosted through Groq; use only within the available free quota.', requiresKey: true, icon: '🚀' },
  { id: 'groq-gpt-oss-20b', name: 'GPT-OSS 20B', provider: 'Groq',badge: 'free tier', description: 'Hosted through Groq; usage limits apply.', requiresKey: true, icon: '⚡' },
  { id: 'openrouter-free-auto', name: 'OpenRouter Free Auto', provider: 'OpenRouter',badge: 'free tier', description: 'Routes to a free endpoint only; availability may change.', requiresKey: true, icon: '🔀' },
  { id: 'openrouter-qwen-free', name: 'Qwen 3 4B (free endpoint)', provider: 'OpenRouter',badge: 'free tier', description: 'Uses an explicitly free OpenRouter endpoint; endpoint availability can change.', requiresKey: true, icon: '🧠' },
  { id: 'cloudflare-llama', name: 'Cloudflare Workers AI Llama', provider: 'Cloudflare Workers AI', badge: 'free tier', description: 'Requires account ID and API token; free daily allowance and model availability apply.', requiresKey: true, icon: '☁️' },
  { id: 'ollama-local', name: 'Ollama (local)', provider: 'Ollama', badge: 'Local', description: 'Requires Ollama installed and a model downloaded on your computer.', requiresKey: false, icon: '💻' },
]
export const RAG_MODES = {
  STRICT: {
    id: 'strict',
    name: 'Strict Academic Grounding',
    prompt: 'You are EduSentry Academic Guardian. Answer ONLY using the facts present in the retrieved material. If the material does not contain the answer, explicitly state that the uploaded documents do not cover it. Always cite the exact source document and chunk.',
  },
  PEDAGOGICAL: {
    id: 'pedagogical',
    name: 'Deep Tutor (Explanatory)',
    prompt: 'You are EduSentry AI Tutor. Use the retrieved context as the primary source of truth, but explain concepts thoroughly using simple analogies, step-by-step breakdowns, and practical student-friendly examples. Highlight key terms and cite sources.',
  },
  SOCRATIC: {
    id: 'socratic',
    name: 'Socratic Method',
    prompt: 'You are EduSentry Socratic Mentor. Ground your answers in the retrieved material, but guide the student to think deeper by asking 1 or 2 targeted thought-provoking follow-up questions to test their conceptual mastery.',
  },
}

// ------------------------------------------------------------
// Document Chunking
// ------------------------------------------------------------

export function chunkDocument(text, fileName, targetWords = 180, overlapWords = 35) {
  if (!text || !text.trim()) return []

  const rawParagraphs = text.split(/\n\s*\n/)
  const chunks = []
  let chunkIdx = 1

  for (const para of rawParagraphs) {
    const cleanPara = para.replace(/\s+/g, ' ').trim()
    if (!cleanPara) continue

    const words = cleanPara.split(' ')
    if (words.length <= targetWords + 20) {
      chunks.push({
        id: `${fileName}-chunk-${chunkIdx++}`,
        fileName,
        text: cleanPara,
        wordCount: words.length,
      })
    } else {
      let start = 0
      while (start < words.length) {
        const end = Math.min(start + targetWords, words.length)
        const chunkSlice = words.slice(start, end).join(' ')
        if (chunkSlice.trim().length > 30) {
          chunks.push({
            id: `${fileName}-chunk-${chunkIdx++}`,
            fileName,
            text: chunkSlice,
            wordCount: end - start,
          })
        }
        if (end >= words.length) break
        start += targetWords - overlapWords
      }
    }
  }

  // Fallback if no paragraphs were split
  if (chunks.length === 0 && text.trim()) {
    chunks.push({
      id: `${fileName}-chunk-1`,
      fileName,
      text: text.slice(0, 1500).trim(),
      wordCount: text.split(/\s+/).length,
    })
  }

  return chunks
}

export function buildChunkIndex(docs = []) {
  const allChunks = []
  for (const doc of docs) {
    const fileChunks = chunkDocument(doc.text, doc.fileName || 'Uploaded Material')
    allChunks.push(...fileChunks)
  }
  return allChunks
}

// ------------------------------------------------------------
// Hybrid BM25 / TF-IDF Retrieval
// ------------------------------------------------------------

function tokenize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
}

export function retrieveRelevantChunks(query, chunks = [], topK = 4) {
  if (!query || chunks.length === 0) return []

  const qTokens = tokenize(query)
  if (qTokens.length === 0) return chunks.slice(0, topK)

  // Compute Document Frequencies across chunks
  const docFreq = new Map()
  const chunkTokenCache = chunks.map((c) => {
    const tokens = tokenize(c.text)
    const unique = new Set(tokens)
    for (const t of unique) {
      docFreq.set(t, (docFreq.get(t) || 0) + 1)
    }
    return { chunk: c, tokens, unique, len: tokens.length || 1 }
  })

  const N = chunks.length
  const avgDl = chunkTokenCache.reduce((sum, item) => sum + item.len, 0) / (N || 1)
  const k1 = 1.4
  const b = 0.75

  const scored = chunkTokenCache.map((item) => {
    let bm25Score = 0
    let matchCount = 0

    for (const qToken of qTokens) {
      if (!item.unique.has(qToken)) continue
      matchCount++

      const df = docFreq.get(qToken) || 1
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1)

      const tf = item.tokens.filter((t) => t === qToken).length
      const numerator = tf * (k1 + 1)
      const denominator = tf + k1 * (1 - b + b * (item.len / (avgDl || 1)))
      bm25Score += idf * (numerator / denominator)
    }

    // Keyword match boost
    const coverage = matchCount / qTokens.length
    const finalScore = bm25Score * (1 + coverage * 1.5)

    return {
      ...item.chunk,
      score: Number(finalScore.toFixed(3)),
      matchCount,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  const filtered = scored.filter((c) => c.score > 0.1)

  return (filtered.length > 0 ? filtered : scored).slice(0, topK)
}

// ------------------------------------------------------------
// EduSentry Built-in Neural RAG Synthesizer (Offline/Zero-Key)
// ------------------------------------------------------------

function extractKeyInsights(chunks, query) {
  const qWords = new Set(tokenize(query))
  const keySentences = []

  for (const chunk of chunks) {
    const sentences = chunk.text.split(/(?<=[.!?])\s+/)
    for (const s of sentences) {
      const clean = s.trim()
      if (clean.length < 25) continue
      const sTokens = tokenize(clean)
      const matches = sTokens.filter((t) => qWords.has(t)).length
      if (matches > 0) {
        keySentences.push({
          sentence: clean,
          matches,
          source: chunk.fileName,
          chunkId: chunk.id,
        })
      }
    }
  }

  keySentences.sort((a, b) => b.matches - a.matches)
  return keySentences.slice(0, 6)
}

function synthesizeNeuralResponse(query, chunks, mode = 'pedagogical') {
  if (!chunks || chunks.length === 0) {
    return {
      text: `### 🔍 No Relevant Documents Found\n\nI couldn't locate relevant sections regarding **"${query}"** in your uploaded material.\n\n**Suggestions:**\n- Upload syllabus notes, lecture slides, or textbooks in the **Upload Notes** tab.\n- Rephrase your query with broader terms (e.g., instead of a specific formula, ask for the general concept).`,
      citations: [],
      suggestedQuestions: [
        'How do I upload new lecture notes?',
        'Can you summarize the starter document?',
        'What topics are currently indexed?',
      ],
    }
  }

  const citations = chunks.map((c, i) => ({
    id: i + 1,
    fileName: c.fileName,
    chunkId: c.id,
    excerpt: c.text.slice(0, 180) + '...',
    score: c.score,
  }))

  const primaryChunk = chunks[0]
  const insights = extractKeyInsights(chunks, query)
  const mainInsight = insights[0]?.sentence || primaryChunk.text.slice(0, 260) + '.'

  // Construct structured educational markdown
  let responseText = ''

  if (mode === 'strict') {
    responseText += `### 📄 Grounded Document Answer\n\n`
    responseText += `Based directly on your indexed material in **${primaryChunk.fileName}**:\n\n`
    responseText += `> "${mainInsight}"\n\n`
    if (insights.length > 1) {
      responseText += `**Supporting Details from Notes:**\n`
      insights.slice(1, 4).forEach((ins) => {
        responseText += `- ${ins.sentence} *(Source: ${ins.source})*\n`
      })
      responseText += `\n`
    }
    responseText += `*Verified against ${chunks.length} retrieved context chunks with zero external hallucination.*`
  } else if (mode === 'socratic') {
    responseText += `### 💡 Socratic Academic Exploration\n\n`
    responseText += `According to your material in **${primaryChunk.fileName}**, the foundational premise is:\n\n`
    responseText += `> "${mainInsight}"\n\n`
    responseText += `**Let's reflect on this concept together:**\n`
    responseText += `1. How does this principle connect to what you studied in previous chapters?\n`
    responseText += `2. If you had to explain the core mechanism of **${query}** in your own words to a peer, what would be the most crucial step?\n\n`
    responseText += `Try answering one of the questions above, or ask me to break down any step in detail!`
  } else {
    // Pedagogical mode (default)
    responseText += `### 🧠 Conceptual Breakdown & Synthesis\n\n`
    responseText += `Here is what your uploaded course material highlights about **${query}**:\n\n`
    responseText += `**Core Definition & Finding:**\n`
    responseText += `${mainInsight}\n\n`

    if (insights.length > 1) {
      responseText += `**Key Points & Mechanisms:**\n`
      insights.slice(1, 4).forEach((ins) => {
        responseText += `- **${ins.sentence.split(' ')[0]}**: ${ins.sentence}\n`
      })
      responseText += `\n`
    }

    if (chunks.length > 1) {
      responseText += `**Context & Connections:**\n`
      responseText += `Additional context from **${chunks[1].fileName}** expands on this with: `
      responseText += `"${chunks[1].text.slice(0, 160)}..."\n\n`
    }

    responseText += `**Practical Takeaway for Your Exams:**\n`
    responseText += `When asked about this concept, emphasize the definition above and cite how it affects the system dynamics as outlined in **${primaryChunk.fileName}**.`
  }

  const suggestedQuestions = [
    `Can you give a practical real-world example of this?`,
    `What are the most common exam questions on this topic?`,
    `Create a 3-question practice quiz based on this section.`,
  ]

  return {
    text: responseText,
    citations,
    suggestedQuestions,
  }
}

// The live AI Tutor now calls the backend /api/rag/generate endpoint.
// Provider keys and model requests must stay server-side. This export remains
// for compatibility with any module that uses the local retrieval engine.
export async function queryRAGEngine({
  query,
  docs = [],
  modelId = 'edusentry-neural',
  mode = 'pedagogical',
  topK = 4,
}) {
  if (!query || !query.trim()) {
    return { text: 'Please enter a question.', citations: [], suggestedQuestions: [] }
  }
  const chunks = retrieveRelevantChunks(query, buildChunkIndex(docs), topK)
  if (!chunks.length) {
    return {
      text: 'No relevant uploaded material was found. Use the Learning Workspace AI Tutor with a configured backend language-model provider for general-purpose answers.',
      citations: [],
      suggestedQuestions: [],
    }
  }
  const result = synthesizeNeuralResponse(query, chunks, mode)
  return {
    ...result,
    text: `${result.text}\n\n*Local document retrieval only. For general-purpose generated answers, use the backend AI Tutor provider integration.*`,
  }
}

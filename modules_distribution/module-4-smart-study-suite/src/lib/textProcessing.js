// Real, deterministic extractive NLP — runs entirely client-side.
// No LLM, no API key. Summaries, flashcards, and quiz questions are
// generated FROM the actual uploaded text, not hardcoded.

const STOPWORDS = new Set(
  (
    'a about above after again against all am an and any are aren as at ' +
    'be because been before being below between both but by can cannot ' +
    'could did do does doing down during each few for from further had ' +
    'has have having he her here hers herself him himself his how i if ' +
    'in into is it its itself just me more most my myself no nor not now ' +
    'of off on once only or other our ours ourselves out over own same ' +
    'she should so some such than that the their theirs them themselves ' +
    'then there these they this those through to too under until up very ' +
    'was we were what when where which while who whom why will with would ' +
    'you your yours yourself yourselves this these those been being also ' +
    'used using use like one two three within upon' 
  ).split(' ')
)

export function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.split(' ').length > 3 && s.length < 320)
}

export function tokenize(text) {
  return text.toLowerCase().match(/[a-z0-9']+/g) || []
}

export function keywordFrequencies(text) {
  const freq = new Map()
  for (const word of tokenize(text)) {
    if (word.length < 4 || STOPWORDS.has(word)) continue
    freq.set(word, (freq.get(word) || 0) + 1)
  }
  return freq
}

export function topKeywords(text, n = 12) {
  const freq = keywordFrequencies(text)
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w)
}

// Score each sentence by the combined frequency of its keywords
// (normalized by length so long sentences don't always win), then
// keep the top N in their original order.
export function summarize(text, n = 5) {
  const sentences = splitSentences(text)
  if (sentences.length === 0) return []
  if (sentences.length <= n) return sentences

  const freq = keywordFrequencies(text)
  const scored = sentences.map((s, i) => {
    const words = tokenize(s)
    const score = words.reduce((sum, w) => sum + (freq.get(w) || 0), 0) / Math.sqrt(words.length || 1)
    return { s, i, score }
  })
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .sort((a, b) => a.i - b.i)
    .map((t) => t.s)
}

const DEFINITION_PATTERNS = [
  /^(.{2,45}?)\s+(?:is|are)\s+(?:defined as|known as|a type of|a mechanism that|a form of)?\s*(.+)$/i,
  /^(.{2,45}?)\s+refers to\s+(.+)$/i,
  /^(.{2,45}?)\s+means\s+(.+)$/i,
  /^(.{2,45}?)\s+represents\s+(.+)$/i,
  /^(.{2,45}?)\s+consists of\s+(.+)$/i,
  /^(.{2,45}?)\s*:\s+(.+)$/i,
  /^In\s+[a-zA-Z\s]+,\s*(.{2,40}?)\s+(?:is|are)\s+(.+)$/i,
  /^(.{2,45}?)\s+(?:can|operates by|serves to|functions to)\s+(.+)$/i,
]

export function capitalize(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function cleanTerm(t) {
  return t
    .replace(/^(the|a|an|another|furthermore|essentially|in general|overall|note that)\s+/i, '')
    .replace(/^(for|in)\s+[a-zA-Z\s]+,\s*/i, '')
    .trim()
}

function cleanDefinition(d) {
  let def = d.trim().replace(/[.\s]+$/, '')
  if (/^that\s+/i.test(def)) def = 'States ' + def
  if (/^where\s+/i.test(def)) def = 'Structures ' + def
  return def.charAt(0).toUpperCase() + def.slice(1) + '.'
}

function inferCategory(term, def) {
  const combined = (term + ' ' + def).toLowerCase()
  if (combined.includes('tree') || combined.includes('structure') || combined.includes('array') || combined.includes('queue') || combined.includes('stack') || combined.includes('graph')) return 'Data Structure'
  if (combined.includes('rotation') || combined.includes('operation') || combined.includes('search') || combined.includes('insert') || combined.includes('delete') || combined.includes('traversal')) return 'Core Operation'
  if (combined.includes('property') || combined.includes('factor') || combined.includes('rule') || combined.includes('theorem') || combined.includes('law')) return 'Rule & Metric'
  if (combined.includes('time') || combined.includes('complexity') || combined.includes('logarithm') || combined.includes('worst case') || combined.includes('efficiency')) return 'Performance'
  return 'Core Concept'
}

function pseudoShuffle(items, nonce = 0) {
  const arr = [...items]
  const seed = ((Number(nonce) + 1) * 9301 + 49297) % 233280
  for (let i = arr.length - 1; i > 0; i--) {
    const pseudo = Math.abs(Math.sin(seed + i * 79.19)) * 10000
    const j = Math.floor((pseudo - Math.floor(pseudo)) * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function dedupeByTerm(cards) {
  const seen = new Set()
  return cards.filter((c) => {
    const key = c.term.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Generates rich, understandable flashcards from uploaded text.
// Supports `nonce` so clicking "Regenerate" rotates through the document
// and draws a genuinely new, distinct set of cards each time.
export function generateFlashcards(text, n = 9, nonce = 0) {
  if (!text || typeof text !== 'string') return []
  const sentences = splitSentences(text)
  let candidates = []

  for (const s of sentences) {
    for (const pattern of DEFINITION_PATTERNS) {
      const m = s.match(pattern)
      if (m) {
        const rawTerm = cleanTerm(m[1])
        const def = cleanDefinition(m[2])
        if (rawTerm.length >= 3 && rawTerm.split(' ').length <= 6 && def.length >= 18) {
          const capTerm = capitalize(rawTerm)
          candidates.push({
            term: capTerm,
            definition: def,
            category: inferCategory(capTerm, def),
            sourceSentence: s,
          })
          break
        }
      }
    }
  }
  candidates = dedupeByTerm(candidates)

  // If too few strict definitions, extract keyword concept cards
  if (candidates.length < Math.min(4, n)) {
    const keywords = topKeywords(text, 36)
    for (const kw of keywords) {
      if (candidates.length >= n * 2) break
      const sentence = sentences.find(
        (s) => s.toLowerCase().includes(kw) && !candidates.some((c) => c.sourceSentence === s)
      )
      if (sentence) {
        const term = capitalize(kw)
        candidates.push({
          term,
          definition: cleanDefinition(sentence),
          category: 'Key Terminology',
          sourceSentence: sentence,
        })
      }
    }
    candidates = dedupeByTerm(candidates)
  }

  if (candidates.length === 0) return []

  // Seeded shuffle ensures different nonces produce newly drawn cards
  const shuffled = pseudoShuffle(candidates, nonce)
  return shuffled.slice(0, Math.min(n, shuffled.length))
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Cloze-style quiz: pick sentences that contain a top keyword, blank
// that word out, and build 4 answer choices from other keywords in
// the same document as distractors.
export function generateQuiz(text, n = 5) {
  const sentences = shuffle(splitSentences(text).filter((s) => s.length < 220))
  const keywords = topKeywords(text, 30)
  const keywordSet = new Set(keywords)
  const questions = []
  const usedKeywords = new Set()

  for (const s of sentences) {
    if (questions.length >= n) break
    const words = tokenize(s)
    const candidate = words.find((w) => keywordSet.has(w) && !usedKeywords.has(w))
    if (!candidate) continue

    const re = new RegExp(`\\b${escapeRegExp(candidate)}\\b`, 'i')
    if (!re.test(s)) continue

    const distractorPool = keywords.filter((k) => k !== candidate)
    if (distractorPool.length < 3) continue

    usedKeywords.add(candidate)
    const questionText = s.replace(re, '_____')
    const distractors = shuffle(distractorPool).slice(0, 3)
    const options = shuffle([candidate, ...distractors])

    questions.push({
      id: `q-${questions.length}-${candidate}`,
      question: questionText,
      options: options.map(capitalize),
      correctIndex: options.indexOf(candidate),
    })
  }
  return questions
}

import { queryRAGEngine, buildChunkIndex, retrieveRelevantChunks } from './ragEngine.js'

// Extractive Q&A: scores sentences across all indexed documents by keyword overlap
export function answerQuestion(question, docs) {
  const qWords = tokenize(question).filter((w) => w.length > 2 && !STOPWORDS.has(w))
  if (qWords.length === 0) {
    return {
      text: "Try asking a fuller question — I need a few real words to search your material for.",
      cite: null,
    }
  }

  const chunks = buildChunkIndex(docs)
  const retrieved = retrieveRelevantChunks(question, chunks, 2)
  if (retrieved.length > 0 && retrieved[0].score > 0.1) {
    const topChunk = retrieved[0]
    return {
      text: topChunk.text,
      cite: topChunk.fileName,
      score: topChunk.score,
    }
  }

  let best = null
  for (const doc of docs) {
    const sentences = splitSentences(doc.text)
    for (const s of sentences) {
      const sWords = new Set(tokenize(s))
      const score = qWords.reduce((sum, w) => sum + (sWords.has(w) ? 1 : 0), 0)
      if (score > 0 && (!best || score > best.score)) {
        best = { score, sentence: s, fileName: doc.fileName }
      }
    }
  }

  if (!best) {
    return {
      text: "I couldn't find anything about that in your uploaded material. Try uploading a document that covers it, or rephrase your question.",
      cite: null,
    }
  }
  return { text: best.sentence, cite: best.fileName }
}

// Multi-LLM & Hybrid RAG Answer Generation
export async function answerQuestionRAG({
  question,
  docs,
  modelId = 'edusentry-neural',
  mode = 'pedagogical',
  topK = 4,
}) {
  return await queryRAGEngine({
    query: question,
    docs,
    modelId,
    mode,
    topK,
  })
}


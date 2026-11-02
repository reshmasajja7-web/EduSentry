import test from 'node:test'
import assert from 'node:assert/strict'
import { generateWithProvider } from '../src/aiProvider.js'
import { RAG_MODEL_CONFIG } from '../src/ragModels.js'

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}
const shared = {
  apiKey: 'test-key-not-real',
  systemPrompt: 'You are a helpful tutor.',
  history: [{ role: 'user', content: 'Explain arrays.' }, { role: 'assistant', content: 'An array stores elements.' }],
  question: 'Give me a simple example.',
  contextText: '[Excerpt 1] Arrays are indexed.',
}

test('Gemini adapter sends system instruction and parses generated text', async () => {
  const originalFetch = globalThis.fetch
  let captured
  globalThis.fetch = async (url, options) => {
    captured = { url: String(url), body: JSON.parse(options.body) }
    return jsonResponse({ candidates: [{ content: { parts: [{ text: 'Gemini answer' }] } }] })
  }
  try {
    const config = RAG_MODEL_CONFIG['gemini-flash']
    const result = await generateWithProvider(config, shared.apiKey, config.defaultModel, shared.systemPrompt, shared.history, shared.question, shared.contextText)
    assert.equal(result.text, 'Gemini answer')
    assert.match(captured.url, /generativelanguage\.googleapis\.com/)
    assert.equal(captured.body.systemInstruction.parts[0].text, shared.systemPrompt)
  } finally { globalThis.fetch = originalFetch }
})

test('OpenRouter adapter sends selected free model and parses chat completion', async () => {
  const originalFetch = globalThis.fetch
  let captured
  globalThis.fetch = async (url, options) => {
    captured = { url: String(url), options, body: JSON.parse(options.body) }
    return jsonResponse({ choices: [{ message: { content: 'OpenRouter answer' } }] })
  }
  try {
    const config = RAG_MODEL_CONFIG['openrouter-qwen-free']
    const result = await generateWithProvider(config, shared.apiKey, config.defaultModel, shared.systemPrompt, shared.history, shared.question, shared.contextText)
    assert.equal(result.text, 'OpenRouter answer')
    assert.equal(captured.url, 'https://openrouter.ai/api/v1/chat/completions')
    assert.equal(captured.body.model, 'qwen/qwen3-4b:free')
    assert.equal(captured.options.headers.Authorization, `Bearer ${shared.apiKey}`)
  } finally { globalThis.fetch = originalFetch }
})

test('Groq adapter parses chat completion', async () => {
  const originalFetch = globalThis.fetch
  let captured
  globalThis.fetch = async (url, options) => {
    captured = { url: String(url), body: JSON.parse(options.body) }
    return jsonResponse({ choices: [{ message: { content: 'Groq answer' } }] })
  }
  try {
    const config = RAG_MODEL_CONFIG['groq-gpt-oss-20b']
    const result = await generateWithProvider(config, shared.apiKey, config.defaultModel, shared.systemPrompt, shared.history, shared.question, '')
    assert.equal(result.text, 'Groq answer')
    assert.equal(captured.url, 'https://api.groq.com/openai/v1/chat/completions')
  } finally { globalThis.fetch = originalFetch }
})

test('provider errors are surfaced instead of fabricating answers', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => jsonResponse({ error: { message: 'quota exhausted' } }, 429)
  try {
    const config = RAG_MODEL_CONFIG['openrouter-free-auto']
    await assert.rejects(generateWithProvider(config, shared.apiKey, config.defaultModel, shared.systemPrompt, shared.history, shared.question, ''), /quota exhausted/)
  } finally { globalThis.fetch = originalFetch }
})

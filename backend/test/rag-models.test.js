import test from 'node:test'
import assert from 'node:assert/strict'
import { RAG_MODEL_CONFIG, SUPPORTED_RAG_MODELS } from '../src/ragModels.js'

test('every external model in the selector has a backend provider adapter', () => {
  const selectorIds = SUPPORTED_RAG_MODELS.filter((model) => model.id !== 'edusentry-neural').map((model) => model.id).sort()
  assert.deepEqual(selectorIds, Object.keys(RAG_MODEL_CONFIG).sort())
})

test('all configured model IDs have provider keys and default model IDs', () => {
  for (const [id, config] of Object.entries(RAG_MODEL_CONFIG)) {
    assert.ok(['gemini', 'groq', 'openrouter', 'mistral', 'nvidia', 'cloudflare', 'ollama'].includes(config.provider), `${id} provider`)
    if (config.envKey) assert.ok(config.envKey.endsWith('_API_KEY') || config.envKey.endsWith('_TOKEN'), `${id} credential env var`)
    assert.ok(config.defaultModel, `${id} default provider model`)
  }
})

test('built-in neural mode is clearly separate from external model integrations', () => {
  const local = SUPPORTED_RAG_MODELS.find((model) => model.id === 'ollama-local')
  assert.ok(local)
  assert.equal(local.requiresKey, false)
  assert.equal(RAG_MODEL_CONFIG['ollama-local'].provider, 'ollama')
  assert.equal(RAG_MODEL_CONFIG['edusentry-neural'], undefined)
})

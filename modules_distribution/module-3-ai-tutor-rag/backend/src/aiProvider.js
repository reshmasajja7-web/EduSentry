async function fetchWithTimeout(url, options, timeoutMs = 20000) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
      const transient = response.status === 429 || response.status >= 500
      if (transient && attempt === 0) {
        const retryHeader = Number(response.headers.get('retry-after') || 0)
        const waitMs = retryHeader > 0 ? Math.min(retryHeader * 1000, 2000) : 500
        await new Promise((resolve) => setTimeout(resolve, waitMs))
        continue
      }
      return response
    } catch (error) {
      if (error?.name === 'AbortError' || attempt === 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 300))
    } finally {
      clearTimeout(timer)
    }
  }
  throw new Error('AI provider request failed after a retry.')
}

export async function generateWithProvider(config, apiKey, modelId, systemPrompt, history, question, contextText) {
  const model = config.defaultModel
  const conversation = [
    ...history.slice(-12).map((message) => ({
      role: message.role === 'assistant' || message.from === 'bot' ? 'assistant' : 'user',
      content: String(message.content ?? message.text ?? '').slice(0, 6000),
    })).filter((message) => message.content.trim()),
    { role: 'user', content: contextText ? `Relevant excerpts from the user's uploaded documents (use only if relevant):\n${contextText}\n\nQuestion:\n${question}` : question },
  ]

  let response
  let payload
  if (config.provider === 'gemini') {
    const contents = conversation.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }))
    // Gemini accepts systemInstruction separately and conversation contents alternate user/model.
    response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.5, maxOutputTokens: 2048 },
        }),
      }
    )
    payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload?.error?.message || `Google AI request failed (${response.status}).`)
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
    if (!text) throw new Error('Google AI returned an empty response.')
    return { text, model: `${model} (Google AI)` }
  }

  if (config.provider === 'openrouter') {
    response = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'EduSentry Learning Workspace',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...conversation],
        temperature: 0.5,
        max_tokens: 2048,
      }),
    }, 25000)
    payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload?.error?.message || `OpenRouter request failed (${response.status}).`)
    const text = payload?.choices?.[0]?.message?.content
    if (typeof text !== 'string' || !text.trim()) throw new Error('OpenRouter returned an empty response.')
    return { text: text.trim(), model: `${model} (OpenRouter)` }
  }

  if (config.provider === 'groq') {
    response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...conversation],
        temperature: 0.5,
        max_tokens: 2048,
      }),
    }, 25000)
    payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload?.error?.message || `Groq request failed (${response.status}).`)
    const text = payload?.choices?.[0]?.message?.content
    if (typeof text !== 'string' || !text.trim()) throw new Error('Groq returned an empty response.')
    return { text: text.trim(), model: `${model} (Groq)` }
  }


  // OpenAI-compatible APIs with distinct base URLs. These providers use the
  // same chat-completions payload but are never silently routed to a paid API.
  const compatible = {
    mistral: 'https://api.mistral.ai/v1/chat/completions',
    nvidia: 'https://integrate.api.nvidia.com/v1/chat/completions',
  }
  if (compatible[config.provider]) {
    response = await fetchWithTimeout(compatible[config.provider], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, ...conversation], temperature: 0.5, max_tokens: 2048 }),
    }, 30000)
    payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload?.message || payload?.error?.message || `${config.provider} request failed (${response.status}).`)
    const text = payload?.choices?.[0]?.message?.content
    if (typeof text !== 'string' || !text.trim()) throw new Error(`${config.provider} returned an empty response.`)
    return { text: text.trim(), model: `${model} (${config.provider})` }
  }

  if (config.provider === 'cloudflare') {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    if (!accountId) throw new Error('CLOUDFLARE_ACCOUNT_ID is required for Workers AI.')
    response = await fetchWithTimeout(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${encodeURIComponent(model)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ messages: [{ role: 'system', content: systemPrompt }, ...conversation], max_tokens: 2048 }),
    }, 30000)
    payload = await response.json().catch(() => ({}))
    if (!response.ok || payload?.success === false) throw new Error(payload?.errors?.[0]?.message || `Cloudflare Workers AI request failed (${response.status}).`)
    const text = payload?.result?.response || payload?.result?.choices?.[0]?.message?.content
    if (typeof text !== 'string' || !text.trim()) throw new Error('Cloudflare Workers AI returned an empty response.')
    return { text: text.trim(), model: `${model} (Cloudflare Workers AI)` }
  }

  if (config.provider === 'ollama') {
    const base = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '')
    response = await fetchWithTimeout(`${base}/api/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, stream: false, messages: [{ role: 'system', content: systemPrompt }, ...conversation], options: { temperature: 0.5 } }),
    }, 90000)
    payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload?.error || `Ollama request failed (${response.status}). Is Ollama running and the model pulled?`)
    const text = payload?.message?.content
    if (typeof text !== 'string' || !text.trim()) throw new Error('Ollama returned an empty response.')
    return { text: text.trim(), model: `${model} (Ollama local)` }
  }

  if (config.provider === 'openai' || config.provider === 'deepseek') {
    const endpoint = config.provider === 'deepseek'
      ? 'https://api.deepseek.com/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(config.provider === 'openai'
        ? {
            model,
            messages: [{ role: 'system', content: systemPrompt }, ...conversation],
            temperature: 0.5,
            max_completion_tokens: 2048,
            reasoning_effort: 'medium',
          }
        : {
            model,
            messages: [{ role: 'system', content: systemPrompt }, ...conversation],
            temperature: 0.5,
            max_tokens: 2048,
          }),
    })
    payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload?.error?.message || `${config.provider} request failed (${response.status}).`)
    const text = payload?.choices?.[0]?.message?.content
    if (typeof text !== 'string' || !text.trim()) throw new Error(`${config.provider} returned an empty response.`)
    return { text: text.trim(), model: `${model} (${config.provider})` }
  }

  if (config.provider === 'anthropic') {
    response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages: conversation.map(({ role, content }) => ({ role, content })),
        max_tokens: 2048,
        temperature: 0.5,
      }),
    })
    payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload?.error?.message || `Anthropic request failed (${response.status}).`)
    const text = (payload?.content || []).filter((part) => part.type === 'text').map((part) => part.text).join('\n').trim()
    if (!text) throw new Error('Anthropic returned an empty response.')
    return { text, model: `${model} (Anthropic)` }
  }

  throw new Error('This model provider is not supported by the backend.')
}


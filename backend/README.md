# EduSentry Backend

Manual Node.js + Express + PostgreSQL REST backend for the existing EduSentry React/Vite project.

## Stack
- Node.js
- Express
- PostgreSQL
- pg
- bcryptjs
- JWT stored in an HttpOnly cookie
- CORS

## Setup

1. Install PostgreSQL and create a database named `edusentry`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
3. From this directory run:

```bash
npm install
```

4. Run `sql/schema.sql` against the `edusentry` database.
5. Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## Main API routes

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `POST /api/auth/change-password`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `DELETE /api/auth/account`

### Application data
- `GET/POST/DELETE /api/documents`
- `GET/POST/DELETE /api/activity`
- `GET/POST /api/quiz/results`
- `GET /api/engagement`
- `POST/GET /api/earlyrisk/predict` and `/history`
- `POST/GET /api/career/results`
- `POST/GET /api/tutor/messages`

The frontend helper is `src/lib/api.js`. It uses `fetch()` with `credentials: 'include'` so the HttpOnly auth cookie is sent automatically.


## AI tutor providers (free-tier-first)

The tutor supports Groq (`GROQ_API_KEY`) and Google Gemini (`GEMINI_API_KEY`). Configure one or both in `backend/.env`, then restart the backend. Free-tier quotas and model access can change; no provider is guaranteed to be unlimited or always available. Do not enable billing if you need to keep usage free. OpenAI, Anthropic and DeepSeek are not offered in the tutor model selector in this build.

Recommended starting point: create a Groq key at https://console.groq.com/ if the account offers access without payment, then set `GROQ_API_KEY=...`. If Groq asks for payment, do not proceed; use Gemini's free tier instead. Keep the `.env` file private.


Free AI model configuration: set `GEMINI_API_KEY` for Gemini free-tier models, `OPENROUTER_API_KEY` for the explicitly free OpenRouter model choices, and optionally `GROQ_API_KEY` if your Groq account provides free-tier access. Do not enable billing or add credits if you require zero cost. Free endpoints are rate-limited and may be temporarily unavailable.

## Free-tier-first AI providers

Configure only providers you intend to use in `backend/.env`. Keep API keys server-side; never use `VITE_` prefixes for secrets. Free tiers, eligible model IDs, quotas, and availability can change, so confirm each provider dashboard says the selected endpoint is free before use. The application does not intentionally route requests to OpenAI, Anthropic, or DeepSeek.

- Gemini: `GEMINI_API_KEY`; optional `GEMINI_MODEL` and `GEMINI_LITE_MODEL`.
- Groq: `GROQ_API_KEY`.
- OpenRouter: `OPENROUTER_API_KEY`; use free endpoints only.
- Mistral: `MISTRAL_API_KEY`; use only if your account/API access has free quota.
- NVIDIA NIM: `NVIDIA_NIM_API_KEY`; use only within any free developer quota available to your account.
- Cloudflare Workers AI: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- Ollama: install Ollama locally, run `ollama pull llama3.2`, then set `OLLAMA_BASE_URL=http://127.0.0.1:11434` and `OLLAMA_MODEL=llama3.2`. Ollama has no per-request API fee, but uses local CPU/RAM/GPU resources.

Restart the backend after editing `.env`. A configured key only proves the setting exists; it does not guarantee provider quota, access, or live availability. Cloud-provider free quotas are not unlimited.

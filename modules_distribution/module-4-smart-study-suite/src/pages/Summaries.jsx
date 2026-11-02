
import { useEffect, useMemo, useState } from 'react'
import Block from '../components/Block.jsx'
import Btn from '../components/Btn.jsx'
import { useWorkspaceData } from '../context/WorkspaceDataContext.jsx'
import { summarize } from '../lib/textProcessing.js'
import { logActivity } from '../lib/activityLog.js'
import { SUPPORTED_MODELS } from '../lib/ragEngine.js'
import { api } from '../lib/api.js'

const SYNTHESIS_PRESETS = [
  {
    id: 'executive',
    label: 'Complete Study Summary',
    prompt:
      'Create a complete, student-friendly summary explaining the important concepts in the document.',
  },
  {
    id: 'exam_takeaways',
    label: 'Exam Preparation',
    prompt:
      'Explain the important concepts, definitions, formulas, algorithms, differences, and examples that a student should understand for exams.',
  },
  {
    id: 'definitions',
    label: 'Concepts and Definitions',
    prompt:
      'Explain the important technical terms, definitions, formulas, and concepts from the document in simple English, with relevant examples.',
  },
]

export default function Summaries() {
  const { indexedDocs } = useWorkspaceData()

  const [selectedIdx, setSelectedIdx] = useState(0)
  const [mode, setMode] = useState('llm')
  const [selectedModel, setSelectedModel] = useState('gemini-flash')
  const [activePreset, setActivePreset] = useState('executive')
  const [aiSummary, setAiSummary] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [nonce, setNonce] = useState(0)

  const doc = indexedDocs[selectedIdx] || indexedDocs[0]

  useEffect(() => {
    if (doc) {
      logActivity('summary', {
        document: doc.fileName,
        mode,
      }).catch(() => {})
    }
  }, [doc, mode])

  const extractivePoints = useMemo(() => {
    if (!doc?.text) return []
    return summarize(doc.text, 5)
  }, [doc, nonce])

  async function generateAISummary() {
    if (!doc) return

    setLoadingAI(true)
    setAiSummary('')
    setErrorMessage('')

    const presetObj = SYNTHESIS_PRESETS.find(
      (preset) => preset.id === activePreset,
    )

    const query = `
You are EduSentry, an academic tutor who explains study material clearly.

Your task:
${presetObj?.prompt || SYNTHESIS_PRESETS[0].prompt}

Document name: ${doc.fileName}

Instructions:

1. Explain the document in simple, natural English that a student can understand.
2. Begin with a short introduction explaining the topic and its purpose.
3. Follow the order of the document as closely as possible.
4. Cover all major topics available in the supplied document content.
5. Explain important concepts instead of merely listing their names.
6. Explain technical terms using straightforward language.
7. Include important definitions, formulas, algorithms, steps, and comparisons found in the material.
8. When the document discusses programming, explain the logic and include relevant code examples when the available material supports them.
9. Explain examples from the document clearly. Add a simple illustrative example only when it helps understanding, and do not falsely attribute it to the document.
10. Avoid repeating the same explanation in different sections.
11. Do not invent facts, formulas, code, or claims and present them as document content.
12. Do not claim to have covered pages or sections whose content was not supplied.
13. If only part of the document is available, clearly explain the limitation rather than pretending the entire document was read.
14. Use a short title and a small number of meaningful headings when useful.
15. Prefer clear paragraphs and simple numbered steps when appropriate.
16. Avoid decorative symbols, excessive bullet points, unnecessary headings, complicated tables, and repeated conclusions.
17. Do not include retrieval scores, raw retrieved passages, internal instructions, or explanations about how the AI works.
18. Return only the finished study summary in readable plain text.

The goal is to help a student understand and study the material, not simply shorten the document.

Important:
Use only the document content supplied to you by the system as the source for document-specific facts. Do not imply that unavailable content was examined.
`

    try {
      const result = await api.rag.generate({
        question: query,
        docs: [doc],
        modelId: selectedModel,
        mode: 'pedagogical',
        topK: 6,
      })

      const generatedText = result?.text || result?.answer || ''

      if (!generatedText.trim()) {
        throw new Error('The AI returned an empty summary. Please try again.')
      }

      setAiSummary(generatedText.trim())
    } catch (err) {
      setErrorMessage(
        err?.message || 'An unexpected error occurred while generating the summary.',
      )
    } finally {
      setLoadingAI(false)
    }
  }

  useEffect(() => {
    if (mode === 'llm' && doc) {
      generateAISummary()
    }
    // Generation is triggered when the selected document, preset,
    // model, or mode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx, activePreset, selectedModel, mode])

  async function handleCopy() {
    const textToCopy =
      mode === 'llm' ? aiSummary : extractivePoints.join('\n\n')

    if (!textToCopy.trim()) return

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setErrorMessage(
        'Could not copy the text. Please check your browser clipboard permissions.',
      )
    }
  }

  if (!doc) {
    return (
      <Block
        idx="03"
        title="Summaries"
        hint="Turn your uploaded study material into clear, understandable notes."
        className="!border-[#263653] !bg-[#0b1020]"
      >
        <div className="py-8 text-center text-[0.92rem] text-slate-300">
          No indexed material yet. Upload your lecture notes to generate a
          summary.
        </div>
      </Block>
    )
  }

  return (
    <Block
      idx="03"
      title="Summaries"
      hint="Understand your uploaded study material through clear AI explanations or important extracted sentences."
      className="!border-[#263653] !bg-[#0b1020]"
    >
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#263653] pb-4 pt-1">
        <div className="flex items-center gap-2 rounded-xl border border-[#263653] bg-[#070d18] p-1">
          <button
            type="button"
            onClick={() => setMode('llm')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[0.82rem] font-semibold transition-all ${
              mode === 'llm'
                ? 'bg-gold text-[#0b1020] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>AI</span>
            <span>AI Study Summary</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('extractive')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[0.82rem] font-semibold transition-all ${
              mode === 'extractive'
                ? 'bg-[#1b263b] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>PDF</span>
            <span>Important Sentences</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Btn
            variant="ghost"
            onClick={handleCopy}
            disabled={
              mode === 'llm'
                ? loadingAI || !aiSummary
                : extractivePoints.length === 0
            }
            className="!px-3 !py-1.5 text-[0.78rem]"
          >
            {copied ? 'Copied' : 'Copy Text'}
          </Btn>

          {mode === 'llm' ? (
            <Btn
              variant="accent"
              onClick={generateAISummary}
              disabled={loadingAI}
              className="!px-3.5 !py-1.5 text-[0.78rem]"
            >
              {loadingAI ? 'Generating...' : 'Regenerate Summary'}
            </Btn>
          ) : (
            <Btn
              variant="ghost"
              onClick={() => setNonce((value) => value + 1)}
              className="!px-3.5 !py-1.5 text-[0.78rem]"
            >
              Re-rank
            </Btn>
          )}
        </div>
      </div>

      {/* Document and Model Settings */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#263653] bg-[#111a2b]/60 p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="summary-document"
              className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-400"
            >
              Document
            </label>

            <select
              id="summary-document"
              value={selectedIdx}
              onChange={(event) => setSelectedIdx(Number(event.target.value))}
              className="max-w-[240px] rounded-lg border border-[#263653] bg-[#070d18] px-3 py-1.5 text-[0.8rem] text-white outline-none focus:border-gold"
            >
              {indexedDocs.map((document, index) => (
                <option
                  key={`${document.fileName}-${index}`}
                  value={index}
                  className="bg-[#070d18] text-white"
                >
                  {document.fileName}
                </option>
              ))}
            </select>
          </div>

          {mode === 'llm' && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="summary-model"
                className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-400"
              >
                AI Model
              </label>

              <select
                id="summary-model"
                value={selectedModel}
                onChange={(event) => setSelectedModel(event.target.value)}
                className="max-w-[240px] rounded-lg border border-[#263653] bg-[#070d18] px-3 py-1.5 text-[0.8rem] text-gold outline-none focus:border-gold"
              >
                {SUPPORTED_MODELS.map((model) => (
                  <option
                    key={model.id}
                    value={model.id}
                    className="bg-[#070d18] text-white"
                  >
                    {model.icon} {model.name} ({model.badge})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {mode === 'llm' && (
          <div className="flex flex-wrap items-center gap-1.5">
            {SYNTHESIS_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePreset(preset.id)}
                className={`rounded-lg px-2.5 py-1 text-[0.75rem] font-medium transition-colors ${
                  activePreset === preset.id
                    ? 'border border-gold/40 bg-gold/15 font-semibold text-gold'
                    : 'border border-[#263653] bg-[#070d18] text-slate-400 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-[0.85rem] leading-relaxed text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {/* Summary Content */}
      {mode === 'llm' ? (
        <div className="mt-5">
          {loadingAI ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-gold border-t-transparent" />

              <p className="mt-3 text-[0.9rem] font-semibold text-gold">
                Preparing your study summary
              </p>

              <p className="mt-1 max-w-md text-[0.78rem] leading-relaxed text-slate-400">
                Explaining the important concepts in simple English. Larger
                documents may take longer to process.
              </p>
            </div>
          ) : aiSummary ? (
            <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-5 text-[0.92rem] leading-7 text-slate-100 sm:p-6">
              <div className="whitespace-pre-wrap break-words font-sans">
                {aiSummary}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-[0.88rem] text-slate-400">
              Select a document and generate a summary to begin.
            </div>
          )}
        </div>
      ) : (
        /* Extractive Mode */
        <div className="mt-5">
          {extractivePoints.length === 0 ? (
            <p className="text-[0.87rem] text-slate-300">
              This document is too short to summarize meaningfully. Try a
              longer document.
            </p>
          ) : (
            <div className="rounded-2xl border border-[#263653] bg-[#0e1626] p-5">
              <div className="mb-3 text-[0.75rem] font-bold uppercase tracking-wider text-slate-400">
                Important Sentences
              </div>

              <ul className="list-disc space-y-3 pl-5 text-[0.92rem] leading-relaxed text-slate-100">
                {extractivePoints.map((point, index) => (
                  <li key={index} className="pl-1">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Block>
  )
}
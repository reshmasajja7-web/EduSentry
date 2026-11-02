import { useMemo, useState, useEffect } from 'react'
import Block from '../components/Block.jsx'
import Btn from '../components/Btn.jsx'
import { useWorkspaceData } from '../context/WorkspaceDataContext.jsx'
import { generateQuiz } from '../lib/textProcessing.js'
import { queryRAGEngine, SUPPORTED_MODELS } from '../lib/ragEngine.js'
import { api } from '../lib/api.js'

export default function Quiz() {
  const { combinedText, indexedDocs } = useWorkspaceData()

  const [mode, setMode] = useState('llm') // 'llm' | 'cloze'
  const [selectedModel, setSelectedModel] = useState('edusentry-neural')
  const [nonce, setNonce] = useState(0)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // AI Generated Questions State
  const [aiQuestions, setAiQuestions] = useState([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiError, setAiError] = useState('')

  // Classic Cloze questions
  const clozeQuestions = useMemo(
    () => generateQuiz(combinedText, 5),
    [combinedText, nonce]
  )

  // Generate AI Conceptual Questions using Multi-LLM
  async function generateAIQuestions() {
    if (!combinedText || combinedText.trim().length < 30) return
    setLoadingAI(true)
    setAiError('')
    setStep(0)
    setPicked(null)
    setScore(0)
    setFinished(false)

    const prompt = `Based strictly on the following course material, create 5 rigorous conceptual multiple-choice diagnostic questions to test student mastery.
For each question, provide:
1. A clear conceptual question stem
2. Exactly 4 distinct options labeled A, B, C, D
3. The correct answer letter
4. A pedagogical rationale explaining why the correct choice is right and explaining common pitfalls of the distractors.

Format strictly as valid JSON array of 5 objects with keys:
"question": string,
"options": array of 4 strings,
"correctIndex": integer (0 for A, 1 for B, 2 for C, 3 for D),
"rationale": string

COURSE MATERIAL:
${combinedText.slice(0, 4500)}`

    try {
      const response = await queryRAGEngine({
        query: prompt,
        docs: indexedDocs,
        modelId: selectedModel,
        mode: 'pedagogical',
        topK: 5,
      })

      // Try to parse JSON from LLM output
      let parsed = null
      const jsonMatch = response.text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0])
        } catch (e) {
          console.warn('JSON parsing from LLM failed, using fallback parser', e)
        }
      }

      if (Array.isArray(parsed) && parsed.length >= 3 && parsed[0].question && parsed[0].options) {
        setAiQuestions(parsed.slice(0, 5))
      } else {
        // Fallback: Generate smart conceptual questions from doc terms
        const fallbackQuestions = generateFallbackConceptualQuiz(indexedDocs, combinedText)
        setAiQuestions(fallbackQuestions)
      }
    } catch (err) {
      console.warn('AI Quiz generation error, falling back to heuristic engine:', err)
      setAiQuestions(generateFallbackConceptualQuiz(indexedDocs, combinedText))
    } finally {
      setLoadingAI(false)
    }
  }

  // Fallback conceptual generator if external API returns free text
  function generateFallbackConceptualQuiz(docs, text) {
    const rawCloze = generateQuiz(text, 5)
    return rawCloze.map((q) => {
      const targetTerm = q.options[q.correctIndex]
      return {
        question: `In the context of the study material, which of the following best fulfills the statement:\n\n"${q.question.replace('__________', '______')}"?`,
        options: q.options,
        correctIndex: q.correctIndex,
        rationale: `"${targetTerm}" is the fundamental principle established in your indexed notes. The alternate options represent related architectural concepts or adjacent vocabulary that do not satisfy the governing definition.`,
      }
    })
  }

  // Fetch AI questions on initial mount or model change if in LLM mode
  useEffect(() => {
    if (mode === 'llm' && combinedText && aiQuestions.length === 0) {
      generateAIQuestions()
    }
  }, [mode, selectedModel, combinedText])

  const questions = mode === 'llm' ? aiQuestions : clozeQuestions
  const q = questions[step]
  const isLast = step === questions.length - 1

  function pick(index) {
    if (picked !== null) return
    setPicked(index)
    if (index === q.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  async function next() {
    if (picked === null || saving) return

    if (isLast) {
      const finalScore = score + (picked === q.correctIndex ? 1 : 0)
      setSaving(true)
      setSaveError('')

      try {
        await api.quiz.createResult({
          score: finalScore,
          total: questions.length,
          topic: mode === 'llm' ? `AI Diagnostic (${selectedModel})` : 'Vocabulary Cloze',
        })
      } catch (error) {
        console.warn('Could not save quiz result to backend (continuing in local mode):', error)
      } finally {
        setScore(finalScore)
        setFinished(true)
        setSaving(false)
      }
      return
    }

    setStep((s) => s + 1)
    setPicked(null)
  }

  function restart(regenerate) {
    setStep(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    setSaveError('')

    if (regenerate) {
      if (mode === 'llm') {
        generateAIQuestions()
      } else {
        setNonce((n) => n + 1)
      }
    }
  }

  // NO CONTENT
  if (!combinedText || combinedText.trim().length === 0) {
    return (
      <Block
        idx="05"
        title="Quiz & Diagnostic Assessment"
        hint="Test yourself using questions generated from your uploaded material."
        className="!border-[#263653] !bg-[#0b1020]"
      >
        <p className="text-[0.9rem] leading-relaxed text-slate-300">
          No indexed material found yet — upload your lecture notes or syllabus in the Upload module to begin.
        </p>
      </Block>
    )
  }

  return (
    <Block
      idx="05"
      title="Quiz & Diagnostic Assessment"
      hint="Multi-LLM conceptual exam generation with instant pedagogical rationale and Cloze vocabulary testing."
      className="!border-[#263653] !bg-[#0b1020]"
    >
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#263653] pb-4">
        <div className="flex items-center gap-2 rounded-xl border border-[#263653] bg-[#070d18] p-1">
          <button
            type="button"
            onClick={() => {
              setMode('llm')
              restart(false)
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[0.82rem] font-semibold transition-all ${
              mode === 'llm'
                ? 'bg-gold text-[#0b1020] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>✨</span>
            <span>AI Diagnostic Exam (Multi-LLM)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('cloze')
              restart(false)
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[0.82rem] font-semibold transition-all ${
              mode === 'cloze'
                ? 'bg-[#1b263b] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📝</span>
            <span>Cloze Vocabulary Test (NLP)</span>
          </button>
        </div>

        {mode === 'llm' && (
          <div className="flex items-center gap-2">
            <span className="text-[0.75rem] font-bold uppercase tracking-wider text-slate-400">
              Model:
            </span>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value)
                restart(true)
              }}
              className="rounded-lg border border-[#263653] bg-[#070d18] px-3 py-1.5 font-mono text-[0.8rem] text-gold outline-none focus:border-gold"
            >
              {SUPPORTED_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#070d18] text-white">
                  {m.icon} {m.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Loading state for LLM */}
      {loadingAI ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="mt-4 font-mono text-[0.86rem] text-gold">
            Generating conceptual exam with {selectedModel}...
          </p>
          <p className="mt-1 text-[0.76rem] text-slate-400">
            Formulating challenging distractors and pedagogical rationale from your notes.
          </p>
        </div>
      ) : finished ? (
        /* FINISHED STATE */
        <div className="flex flex-col items-center py-10 text-center">
          <div className="text-[1.5rem] font-semibold text-white">
            Assessment Complete!
          </div>

          <div className="mt-4 text-[3.2rem] font-bold text-gold">
            {score} / {questions.length}
          </div>

          <p className="mt-2 text-[0.9rem] text-slate-300">
            {score === questions.length
              ? '🎉 Outstanding mastery! You answered every question correctly.'
              : score >= Math.ceil(questions.length / 2)
                ? '👍 Solid conceptual retention. Review the rationale items for deeper mastery.'
                : '📚 Good effort. Revisit your course notes or ask AI Tutor to clarify tough areas.'}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Btn variant="ghost" onClick={() => restart(false)}>
              Retry Same Set
            </Btn>
            <Btn variant="accent" onClick={() => restart(true)}>
              Generate New Exam
            </Btn>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-12 text-center text-[0.9rem] text-slate-300">
          Not enough distinct terms found to build a quiz yet — try uploading a longer document.
        </div>
      ) : (
        /* ACTIVE QUESTION */
        <div className="mt-5">
          <div className="flex items-center justify-between border-b border-[#263653] pb-3 text-[0.74rem] uppercase tracking-wider text-slate-400">
            <span className="font-mono">
              Question {step + 1} of {questions.length}
            </span>
            <span className="font-mono text-gold">
              Current Score: {score}
            </span>
          </div>

          <div className="mb-6 mt-4 text-[1.05rem] font-medium leading-relaxed text-white">
            {q.question}
          </div>

          <div className="flex flex-col gap-2.5">
            {q.options.map((opt, i) => {
              let style =
                'border-[#263653] bg-[#111a2b] text-white hover:border-gold hover:bg-[#162238]'

              if (picked !== null) {
                if (i === q.correctIndex) {
                  style =
                    'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold shadow-[0_0_14px_rgba(16,185,129,0.25)]'
                } else if (i === picked) {
                  style =
                    'border-rose-500 bg-rose-500/20 text-rose-300 font-semibold'
                } else {
                  style =
                    'border-[#1c2a44] bg-[#0b1020]/60 text-slate-400 opacity-60'
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(i)}
                  disabled={picked !== null || saving}
                  className={`rounded-xl border px-4 py-3.5 text-left text-[0.9rem] transition-all ${style}`}
                >
                  <span className="mr-2.5 font-mono text-[0.8rem] text-slate-400">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* AI Pedagogical Rationale Box */}
          {picked !== null && (
            <div className="mt-4 rounded-xl border border-[#263653] bg-[#070d18] p-4 text-[0.88rem] leading-relaxed">
              <div className="mb-1.5 flex items-center gap-2 font-mono text-[0.78rem] font-bold uppercase tracking-wider">
                {picked === q.correctIndex ? (
                  <span className="text-emerald-400">✓ Correct Choice</span>
                ) : (
                  <span className="text-rose-400">
                    ✕ Incorrect (Right answer: {String.fromCharCode(65 + q.correctIndex)})
                  </span>
                )}
              </div>

              {q.rationale ? (
                <div className="text-slate-300">
                  <span className="font-semibold text-gold">AI Rationale: </span>
                  {q.rationale}
                </div>
              ) : (
                <div className="text-slate-300">
                  The correct answer is <span className="text-gold font-semibold">"{q.options[q.correctIndex]}"</span> based on your uploaded source material.
                </div>
              )}
            </div>
          )}

          {saveError && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-[0.84rem] text-rose-200">
              {saveError}
            </div>
          )}

          {picked !== null && (
            <div className="mt-5 flex justify-end">
              <Btn onClick={next} disabled={saving} variant="accent">
                {saving
                  ? 'Saving Result...'
                  : isLast
                    ? 'View Assessment Summary →'
                    : 'Next Question →'}
              </Btn>
            </div>
          )}
        </div>
      )}
    </Block>
  )
}

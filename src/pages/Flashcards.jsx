import { useEffect, useMemo, useState, useCallback } from 'react'
import Block from '../components/Block.jsx'
import Btn from '../components/Btn.jsx'
import { useWorkspaceData } from '../context/WorkspaceDataContext.jsx'
import { generateFlashcards } from '../lib/textProcessing.js'
import { logActivity } from '../lib/activityLog.js'

const CATEGORY_STYLES = {
  'Data Structure': 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  'Core Operation': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  'Rule & Metric': 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  'Performance': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  'Core Concept': 'border-gold/30 bg-gold/10 text-gold',
  'Key Terminology': 'border-slate-500/30 bg-slate-500/10 text-slate-200',
}

export default function Flashcards() {
  const { combinedText, indexedDocs, files } = useWorkspaceData()

  const [selectedDocId, setSelectedDocId] = useState('all')
  const [flipped, setFlipped] = useState(new Set())
  const [mastered, setMastered] = useState(new Set())
  const [needsReview, setNeedsReview] = useState(new Set())
  const [nonce, setNonce] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const [logged, setLogged] = useState(false)

  // Determine active text source (all or specific note)
  const activeText = useMemo(() => {
    if (selectedDocId === 'all') return combinedText
    const found = indexedDocs.find((d) => d.id === selectedDocId)
    return found?.text || combinedText
  }, [selectedDocId, combinedText, indexedDocs])

  // Generate newly drawn flashcards whenever activeText or nonce changes
  const cards = useMemo(
    () => generateFlashcards(activeText, 9, nonce),
    [activeText, nonce]
  )

  // Reset flips and study status when switching doc or regenerating
  useEffect(() => {
    setFlipped(new Set())
    setMastered(new Set())
    setNeedsReview(new Set())
  }, [selectedDocId, nonce])

  // Log study activity when cards are mastered
  useEffect(() => {
    if (!logged && cards.length > 0 && mastered.size >= Math.ceil(cards.length / 2)) {
      logActivity('flashcards', { count: cards.length, mastered: mastered.size }).catch(() => {})
      setLogged(true)
    }
  }, [mastered, cards, logged])

  const toggleFlip = useCallback((id) => {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleFlipAll = useCallback(() => {
    setFlipped((prev) => {
      if (prev.size === cards.length) {
        return new Set() // Flip all to front
      }
      return new Set(cards.map((c, i) => `${c.term}-${i}`)) // Flip all to back
    })
  }, [cards])

  const handleRegenerate = useCallback(() => {
    setIsRotating(true)
    setNonce((n) => n + 1)
    setTimeout(() => setIsRotating(false), 450)
  }, [])

  const markMastered = useCallback((id, e) => {
    e.stopPropagation()
    setMastered((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setNeedsReview((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const markNeedsReview = useCallback((id, e) => {
    e.stopPropagation()
    setNeedsReview((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setMastered((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const masteredCount = cards.filter((c, i) => mastered.has(`${c.term}-${i}`)).length
  const progressPct = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0

  return (
    <Block
      idx="04"
      title="Flashcards"
      hint="Active recall study deck generated from your notes. Click any card to reveal its definition and test your mastery."
    >
      {/* Header Controls Bar */}
      <div className="mb-6 space-y-4 border-b border-[#263653] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Document Filter */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
              Source Note:
            </span>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="rounded-lg border border-[#263653] bg-[#111a2b] px-3 py-1.5 font-mono text-[0.78rem] text-white outline-none transition-colors focus:border-gold"
            >
              <option value="all">All Indexed Notes ({indexedDocs.length})</option>
              {indexedDocs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fileName}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-md border border-gold/30 bg-gold/10 px-2.5 py-1 font-mono text-[0.7rem] font-semibold text-gold">
              Set #{nonce + 1}
            </span>

            {cards.length > 0 && (
              <button
                type="button"
                onClick={handleFlipAll}
                className="rounded-lg border border-[#263653] bg-[#111a2b] px-3 py-1.5 font-mono text-[0.75rem] font-medium text-slate-200 transition-colors hover:border-gold hover:text-white"
              >
                {flipped.size === cards.length ? 'Show All Terms' : 'Reveal All Definitions'}
              </button>
            )}

            <button
              type="button"
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold bg-gold px-3.5 py-1.5 font-mono text-[0.78rem] font-semibold text-[#0b1020] transition-transform hover:bg-[#f4c12e] active:scale-95"
            >
              <span className={`inline-block transition-transform duration-500 ${isRotating ? 'rotate-180' : ''}`}>
                ↻
              </span>
              <span>Draw New Cards</span>
            </button>
          </div>
        </div>

        {/* Study Progress Bar */}
        {cards.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1c2a44] bg-[#0b1020] px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-300">
                Mastery: <strong className="text-white">{masteredCount}</strong> / {cards.length} cards ({progressPct}%)
              </span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-xs text-slate-400">
                {flipped.size} reviewed
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-[#162238]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-mono text-[0.7rem] font-semibold text-emerald-400">
                {progressPct === 100 ? '🎉 Complete!' : `${progressPct}%`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#263653] bg-[#0e1626] p-10 text-center">
          <div className="text-3xl mb-2">🃏</div>
          <h3 className="font-display text-lg font-semibold text-white">
            No Flashcards Found
          </h3>
          <p className="mt-1 text-sm text-slate-300 max-w-md mx-auto">
            Not enough definition-style statements were detected in this selection. Try uploading a longer document or selecting another note above.
          </p>
        </div>
      ) : (
        /* Flashcards Grid */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => {
            const id = `${card.term}-${i}`
            const isFlipped = flipped.has(id)
            const isMastered = mastered.has(id)
            const isReview = needsReview.has(id)
            const catClass = CATEGORY_STYLES[card.category] || CATEGORY_STYLES['Core Concept']

            return (
              <div
                key={id}
                onClick={() => toggleFlip(id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleFlip(id)
                  }
                }}
                aria-label={isFlipped ? `Definition for ${card.term}` : `Term: ${card.term}`}
                className="flip-perspective block h-[245px] w-full cursor-pointer select-none border-none bg-transparent p-0 text-left outline-none"
              >
                <div className={`flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
                  {/* FRONT FACE (TERM) */}
                  <div
                    className={`flip-face front flex flex-col justify-between rounded-2xl border p-5 shadow-lg transition-all duration-300 ${
                      isMastered
                        ? 'border-emerald-500/50 bg-[#0e1b26] shadow-emerald-950/20'
                        : isReview
                        ? 'border-amber-500/50 bg-[#1a1712]'
                        : 'border-[#263653] bg-[#0e1626] hover:border-gold/60'
                    }`}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] font-semibold uppercase tracking-wider ${catClass}`}>
                        {card.category}
                      </span>
                      <span className="font-mono text-[0.7rem] text-slate-400">
                        #{String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Middle: Term */}
                    <div className="my-auto py-2 text-center">
                      <h4 className="font-display text-[1.2rem] font-bold text-white leading-snug tracking-tight">
                        {card.term}
                      </h4>
                      {isMastered && (
                        <span className="mt-2 inline-flex items-center gap-1 font-mono text-[0.72rem] font-semibold text-emerald-400">
                          <span>✓</span> Mastered
                        </span>
                      )}
                      {isReview && (
                        <span className="mt-2 inline-flex items-center gap-1 font-mono text-[0.72rem] font-semibold text-amber-400">
                          <span>↺</span> In Review
                        </span>
                      )}
                    </div>

                    {/* Bottom Prompt */}
                    <div className="flex items-center justify-between border-t border-[#1c2a44] pt-2.5 font-mono text-[0.7rem] text-slate-400">
                      <span className="text-gold">Recall challenge</span>
                      <span>Click to flip ↷</span>
                    </div>
                  </div>

                  {/* BACK FACE (DEFINITION & MASTERY) */}
                  <div
                    className={`flip-face back flex flex-col justify-between rounded-2xl border p-5 shadow-xl transition-all duration-300 ${
                      isMastered
                        ? 'border-emerald-500/60 bg-[#0e1b26]'
                        : isReview
                        ? 'border-amber-500/60 bg-[#1a1712]'
                        : 'border-[#263653] bg-[#111c30] hover:border-gold/60'
                    }`}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between border-b border-[#1c2a44] pb-2">
                      <span className="truncate pr-2 font-display text-[0.88rem] font-bold text-gold">
                        {card.term}
                      </span>
                      <span className="shrink-0 font-mono text-[0.68rem] text-slate-400">
                        Click to flip ↶
                      </span>
                    </div>

                    {/* Middle: Definition */}
                    <div className="my-auto overflow-y-auto py-2 pr-1">
                      <p className="text-[0.9rem] leading-relaxed text-slate-200">
                        {card.definition}
                      </p>
                    </div>

                    {/* Bottom: Mastery Actions */}
                    <div className="flex items-center justify-between border-t border-[#1c2a44] pt-2.5">
                      <button
                        type="button"
                        onClick={(e) => markNeedsReview(id, e)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-[0.72rem] transition-colors ${
                          isReview
                            ? 'bg-amber-500/20 text-amber-300 font-semibold'
                            : 'text-slate-400 hover:bg-[#162238] hover:text-amber-300'
                        }`}
                      >
                        ↺ Need Review
                      </button>

                      <button
                        type="button"
                        onClick={(e) => markMastered(id, e)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-[0.72rem] transition-colors ${
                          isMastered
                            ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                            : 'text-slate-400 hover:bg-[#162238] hover:text-emerald-300'
                        }`}
                      >
                        ✓ Got It
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Block>
  )
}
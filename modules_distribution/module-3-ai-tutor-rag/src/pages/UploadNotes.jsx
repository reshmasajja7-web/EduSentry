import { useRef, useState } from 'react'
import Block from '../components/Block.jsx'
import { useWorkspaceData } from '../context/WorkspaceDataContext.jsx'

function StatusPill({ status }) {
  const styles = {
    indexed: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    processing: 'border-gold/40 bg-gold/10 text-gold',
    error: 'border-rust/40 bg-rustTint text-rust',
  }
  const label = { indexed: 'Indexed', processing: 'Processing…', error: 'Failed' }[status]
  return (
    <span className={`rounded-sm border px-2.5 py-0.5 font-mono text-[0.7rem] font-semibold ${styles[status]}`}>
      {label}
    </span>
  )
}

export default function UploadNotes() {
  const { files, addFiles, removeFile } = useWorkspaceData()
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const indexedCount = files.filter((f) => f.status === 'indexed').length

  return (
    <Block
      idx="01"
      title="Upload Notes"
      hint="Add your own lecture slides, notes, or textbooks. Text is extracted right in your browser — nothing is uploaded to a server — and indexed for the AI Tutor, Summaries, Flashcards, and Quiz below."
    >
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="mb-7 cursor-pointer rounded-xl bg-[#111a2b] px-6 py-10 text-center text-[0.92rem] text-slate-200 transition-all duration-200 hover:bg-[#151f32]"
        style={{
          borderWidth: '1.5px',
          borderStyle: 'dashed',
          borderColor: isDragging ? '#f59e0b' : '#263653',
          color: isDragging ? '#f59e0b' : '#f1f5f9',
        }}
      >
        📄 Drag files here, or click to browse — PDF, DOCX, PPTX, or TXT
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept=".pdf,.docx,.pptx,.txt,.md"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      <div className="border-t border-line pt-5">
        <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-wide text-muted">
          Indexed material ({indexedCount}/{files.length})
        </div>
        {files.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-3 border-b border-line py-3 text-[0.87rem] text-ink last:border-none"
          >
            <span className="flex-1 truncate">
              {f.name}
              {f.isSample && (
                <span className="ml-2 font-mono text-[0.65rem] uppercase text-muted">Sample</span>
              )}
              {f.status === 'error' && (
                <span className="mt-0.5 block font-mono text-[0.7rem] text-rust">{f.error}</span>
              )}
            </span>
            <span className="font-mono text-[0.72rem] text-muted">{f.size}</span>
            <StatusPill status={f.status} />
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation()
                try {
                  await removeFile(f.id)
                } catch (error) {
                  window.alert(
                    error.message ||
                      'Could not remove this document.'
                  )
                }
              }}
              disabled={f.id === 'sample-doc'}
              className="font-mono text-[0.72rem] text-muted hover:text-rust disabled:cursor-not-allowed disabled:opacity-40"
              title={f.id === 'sample-doc' ? 'Sample document' : 'Remove'}
              aria-label={f.id === 'sample-doc' ? 'Sample document cannot be removed' : `Remove ${f.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </Block>
  )
}

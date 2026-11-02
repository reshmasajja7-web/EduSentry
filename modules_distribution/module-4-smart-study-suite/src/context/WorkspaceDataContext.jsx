import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'

import { extractTextFromFile } from '../lib/fileExtract.js'
import { sampleDocument } from '../data/sampleDocument.js'
import { api } from '../lib/api.js'

const WorkspaceDataContext = createContext(null)
const LOCAL_FILES_KEY = 'edusentry_local_workspace_files_v2'

function sampleFileRecord() {
  return {
    id: 'sample-doc',
    name: sampleDocument.name,
    size: sampleDocument.sizeLabel,
    status: 'indexed',
    text: sampleDocument.text,
    isSample: true,
  }
}

function getStoredLocalFiles() {
  try {
    const raw = localStorage.getItem(LOCAL_FILES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return [sampleFileRecord()]
}

function saveStoredLocalFiles(files) {
  try {
    const toSave = files.filter((f) => !f.isSample)
    localStorage.setItem(LOCAL_FILES_KEY, JSON.stringify(toSave.length > 0 ? toSave : [sampleFileRecord()]))
  } catch (e) {
    console.warn('Could not persist to localStorage:', e)
  }
}

export function WorkspaceDataProvider({ children }) {
  const [files, setFiles] = useState(getStoredLocalFiles())
  const [loading, setLoading] = useState(false)

  // ==========================================
  // LOAD DOCUMENTS FROM BACKEND (or Local)
  // ==========================================

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true)

      const data = await api.documents.list()
      const backendFiles = data?.documents || []

      if (backendFiles.length > 0) {
        const mapped = backendFiles.map((file) => ({
          id: file.id,
          name: file.name,
          size: file.size || '',
          status: file.status || 'indexed',
          text: file.text || '',
          isSample: file.isSample || false,
        }))
        setFiles(mapped)
        saveStoredLocalFiles(mapped)
      } else {
        // Fallback to local files if backend has no docs yet
        const local = getStoredLocalFiles()
        setFiles(local)
      }
    } catch (error) {
      // Unauthenticated or offline: load from local storage
      const local = getStoredLocalFiles()
      setFiles(local)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  // ==========================================
  // ADD / UPLOAD DOCUMENTS
  // ==========================================

  const addFiles = useCallback(async (fileList) => {
    const fileArray = Array.from(fileList || [])
    if (fileArray.length === 0) return

    for (const original of fileArray) {
      const temporaryId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

      // 1. Show processing state immediately
      setFiles((prev) => {
        const next = [
          {
            id: temporaryId,
            name: original.name,
            size: `${(original.size / (1024 * 1024)).toFixed(2)} MB`,
            status: 'processing',
            text: '',
            isSample: false,
          },
          ...prev.filter((file) => !file.isSample),
        ]
        saveStoredLocalFiles(next)
        return next
      })

      try {
        // 2. Extract text from PDF/DOCX/TXT/PPTX
        const text = await extractTextFromFile(original)

        let savedDocId = temporaryId
        let savedStatus = 'indexed'

        // 3. Attempt PostgreSQL save if signed in
        try {
          const data = await api.documents.create({
            name: original.name,
            size: `${(original.size / (1024 * 1024)).toFixed(2)} MB`,
            text,
          })
          if (data?.document?.id) {
            savedDocId = data.document.id
            savedStatus = data.document.status || 'indexed'
          }
        } catch (apiErr) {
          // Guest mode or offline: smoothly continue with client-side indexing
          console.info('Saved document to local workspace context (Guest/Offline mode).')
        }

        // 4. Update file record with real extracted text
        setFiles((prev) => {
          const next = [
            {
              id: savedDocId,
              name: original.name,
              size: `${(original.size / (1024 * 1024)).toFixed(2)} MB`,
              status: savedStatus,
              text,
              isSample: false,
            },
            ...prev.filter((file) => file.id !== temporaryId),
          ]
          saveStoredLocalFiles(next)
          return next
        })

      } catch (error) {
        console.error('Document extraction failed:', error)

        setFiles((prev) => {
          const next = prev.map((file) =>
            file.id === temporaryId
              ? {
                  ...file,
                  status: 'error',
                  error: error.message || 'Text extraction failed.',
                }
              : file
          )
          saveStoredLocalFiles(next)
          return next
        })
      }
    }
  }, [])

  // ==========================================
  // REMOVE ONE DOCUMENT
  // ==========================================

  const removeFile = useCallback(async (id) => {
    if (!id || id === 'sample-doc') return

    try {
      await api.documents.delete(id).catch(() => {})
    } catch {
      // ignore
    }

    setFiles((prev) => {
      const next = prev.filter((file) => file.id !== id)
      const res = next.length > 0 ? next : [sampleFileRecord()]
      saveStoredLocalFiles(res)
      return res
    })
  }, [])

  // ==========================================
  // CLEAR ALL DOCUMENTS
  // ==========================================

  const clearAllFiles = useCallback(async () => {
    try {
      await api.documents.deleteAll().catch(() => {})
    } catch {
      // ignore
    }

    const reset = [sampleFileRecord()]
    setFiles(reset)
    saveStoredLocalFiles(reset)
  }, [])

  // ==========================================
  // ONLY INDEXED DOCUMENTS
  // ==========================================

  const indexedDocs = useMemo(
    () =>
      files
        .filter(
          (file) =>
            file.status === 'indexed' &&
            file.text &&
            file.text.trim()
        )
        .map((file) => ({
          fileName: file.name,
          text: file.text,
        })),
    [files]
  )

  // ==========================================
  // COMBINE ALL DOCUMENT TEXT
  // ==========================================

  const combinedText = useMemo(
    () =>
      indexedDocs
        .map((document) => document.text)
        .join('\n\n'),
    [indexedDocs]
  )

  const value = useMemo(
    () => ({
      files,
      loading,
      addFiles,
      removeFile,
      clearAllFiles,
      indexedDocs,
      combinedText,
      reloadFiles: loadFiles,
    }),
    [
      files,
      loading,
      addFiles,
      removeFile,
      clearAllFiles,
      indexedDocs,
      combinedText,
      loadFiles,
    ]
  )

  return (
    <WorkspaceDataContext.Provider value={value}>
      {children}
    </WorkspaceDataContext.Provider>
  )
}

export function useWorkspaceData() {
  const ctx = useContext(WorkspaceDataContext)
  if (!ctx) {
    throw new Error('useWorkspaceData must be used inside <WorkspaceDataProvider>')
  }
  return ctx
}
// Real, in-browser text extraction — no backend, no API key.
// Each parser runs entirely client-side.
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'
import mammoth from 'mammoth'
import JSZip from 'jszip'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

async function extractPdf(file) {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item) => item.str).join(' ') + '\n\n'
  }
  return text.trim()
}

async function extractDocx(file) {
  const buf = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buf })
  return result.value.trim()
}

async function extractPptx(file) {
  const buf = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(buf)
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)[1], 10)
      const nb = parseInt(b.match(/(\d+)/)[1], 10)
      return na - nb
    })

  if (slideFiles.length === 0) {
    throw new Error('No slides found in this .pptx file.')
  }

  const parser = new DOMParser()
  let text = ''
  for (const name of slideFiles) {
    const xml = await zip.files[name].async('text')
    const doc = parser.parseFromString(xml, 'application/xml')
    const nodes = doc.getElementsByTagName('a:t')
    const slideText = Array.from(nodes)
      .map((n) => n.textContent)
      .join(' ')
    text += slideText + '\n\n'
  }
  return text.trim()
}

async function extractTxt(file) {
  return (await file.text()).trim()
}

// Dispatches by extension. Throws a friendly error for anything
// unsupported or unparsable — callers should catch this and mark
// the file as "error" rather than crash the app.
export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  let text
  if (ext === 'pdf') text = await extractPdf(file)
  else if (ext === 'docx') text = await extractDocx(file)
  else if (ext === 'pptx') text = await extractPptx(file)
  else if (ext === 'txt' || ext === 'md') text = await extractTxt(file)
  else throw new Error(`Unsupported file type ".${ext}". Try PDF, DOCX, PPTX, TXT, or MD.`)

  if (!text || text.replace(/\s/g, '').length < 30) {
    throw new Error('Could not find readable text in this file (it may be a scanned image without OCR).')
  }
  return text
}

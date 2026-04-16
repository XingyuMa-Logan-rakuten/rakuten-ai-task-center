import React, { useState, useEffect } from 'react'

export type OutputType = 'pptx' | 'html' | 'doc' | 'email'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (text: string, image: string | null, outputType: OutputType) => void
}

const PLACEHOLDERS: Record<OutputType, string> = {
  pptx:  'e.g. Q3 results overview, three key initiatives, team updates. Target audience: exec team, ~10 slides.',
  html:  'e.g. Product launch summary with key metrics, what we learned, and next steps.',
  doc:   'e.g. Meeting notes from April strategy session — decisions made, open questions, action items.',
  email: 'e.g. Follow-up to John about the project proposal. Friendly but professional tone. Mention the deadline is Friday.',
}

const OUTPUT_LABELS: Record<OutputType, string> = {
  pptx:  'PowerPoint',
  html:  'HTML Article',
  doc:   'Word Doc',
  email: 'Email',
}

export function NotesToActionComposer({ open, onClose, onSubmit }: Props) {
  const [outputType, setOutputType] = useState<OutputType>('pptx')
  const [notes, setNotes] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isImageFile, setIsImageFile] = useState(false)

  // Reset form each time the modal opens
  useEffect(() => {
    if (!open) return
    setOutputType('pptx')
    setNotes('')
    setUploadedImage(null)
    setUploadedFileName(null)
    setIsImageFile(false)
  }, [open])

  if (!open) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isImg = file.type.startsWith('image/')
    setIsImageFile(isImg)
    setUploadedFileName(file.name)
    if (isImg) {
      const reader = new FileReader()
      reader.onload = () => setUploadedImage(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setUploadedImage(null)
    }
    e.target.value = ''
  }

  const removeFile = () => {
    setUploadedFileName(null)
    setUploadedImage(null)
    setIsImageFile(false)
  }

  const canSubmit = notes.trim().length > 0 || !!uploadedFileName

  const handleSubmit = () => {
    if (!canSubmit) return
    let combinedText = notes.trim()
    if (uploadedFileName && !isImageFile) {
      combinedText = combinedText
        ? `[Attached document: ${uploadedFileName}]\n\n${combinedText}`
        : `[Attached document: ${uploadedFileName}]`
    }
    onSubmit(combinedText, uploadedImage, outputType)
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal n2a-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="n2a-header-left">
            <span className="n2a-header-icon">✦</span>
            <h2>Notes to Action</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal-body n2a-body">

          {/* ── Output type ── */}
          <div className="n2a-section">
            <div className="n2a-section-label">What do you want to create?</div>
            <div className="n2a-type-grid">

              {/* PowerPoint */}
              <button
                type="button"
                className={`n2a-type-card ${outputType === 'pptx' ? 'n2a-type-card--selected' : ''}`}
                onClick={() => setOutputType('pptx')}
              >
                <div className="n2a-type-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div className="n2a-type-name">PowerPoint</div>
                <div className="n2a-type-sub">Slide deck</div>
              </button>

              {/* HTML Article */}
              <button
                type="button"
                className={`n2a-type-card ${outputType === 'html' ? 'n2a-type-card--selected' : ''}`}
                onClick={() => setOutputType('html')}
              >
                <div className="n2a-type-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                </div>
                <div className="n2a-type-name">HTML Article</div>
                <div className="n2a-type-sub">Web page</div>
              </button>

              {/* Word Doc */}
              <button
                type="button"
                className={`n2a-type-card ${outputType === 'doc' ? 'n2a-type-card--selected' : ''}`}
                onClick={() => setOutputType('doc')}
              >
                <div className="n2a-type-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div className="n2a-type-name">Word Doc</div>
                <div className="n2a-type-sub">Document</div>
              </button>

              {/* Send an Email */}
              <button
                type="button"
                className={`n2a-type-card ${outputType === 'email' ? 'n2a-type-card--selected' : ''}`}
                onClick={() => setOutputType('email')}
              >
                <div className="n2a-type-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="n2a-type-name">Send an Email</div>
                <div className="n2a-type-sub">Email draft</div>
              </button>

            </div>
          </div>

          {/* ── File upload ── */}
          <div className="n2a-section">
            <div className="n2a-section-label">
              Upload image or document <span className="n2a-optional">(optional)</span>
            </div>
            {uploadedFileName ? (
              <div className="n2a-file-preview">
                {isImageFile && uploadedImage ? (
                  <img src={uploadedImage} alt="preview" className="n2a-img-thumb" />
                ) : (
                  <div className="n2a-file-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                )}
                <span className="n2a-file-name">{uploadedFileName}</span>
                <button type="button" className="n2a-file-remove" onClick={removeFile} aria-label="Remove file">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ) : (
              <label className="n2a-upload-zone">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
                <span>Drop a whiteboard photo or file here, or <u>click to upload</u></span>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt,.pptx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* ── Notes textarea ── */}
          <div className="n2a-section">
            <div className="n2a-section-label">
              Add notes or context <span className="n2a-optional">(optional)</span>
            </div>
            <textarea
              className="n2a-textarea"
              placeholder={PLACEHOLDERS[outputType]}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* ── Footer ── */}
          <div className="n2a-footer">
            <button
              type="button"
              className="btn-n2a-create"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {outputType === 'email' ? 'Draft Email' : `Create ${OUTPUT_LABELS[outputType]}`}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

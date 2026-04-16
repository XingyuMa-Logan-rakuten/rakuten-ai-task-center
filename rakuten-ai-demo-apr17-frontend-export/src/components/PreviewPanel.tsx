import React from 'react'

export type PreviewFileType = 'html' | 'pptx'

interface Props {
  open: boolean
  url: string | null
  fileType: PreviewFileType | null
  onClose: () => void
}

function getFileName(url: string): string {
  return url.split('/').pop() || url
}

export function PreviewPanel({ open, url, fileType, onClose }: Props) {
  const fileName = url ? getFileName(url) : ''

  return (
    <div className={`preview-panel ${open ? 'preview-panel--open' : ''}`} aria-hidden={!open}>

      {/* ── Header ── */}
      <div className="preview-panel-header">
        <div className="preview-panel-title">
          {fileType === 'pptx' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          )}
          <span className="preview-panel-filename" title={fileName}>{fileName}</span>
        </div>
        <div className="preview-panel-btns">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-panel-icon-btn"
              title="Open in new tab"
              tabIndex={open ? 0 : -1}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          )}
          <button
            type="button"
            className="preview-panel-icon-btn"
            onClick={onClose}
            aria-label="Close preview"
            tabIndex={open ? 0 : -1}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="preview-panel-body">

        {/* HTML — render in iframe */}
        {fileType === 'html' && url && (
          <iframe
            key={url}
            src={url}
            title={fileName}
            className="preview-panel-iframe"
          />
        )}

        {/* PPTX — download card */}
        {fileType === 'pptx' && url && (
          <div className="preview-dl-wrap">
            <div className="preview-dl-card">
              <div className="preview-dl-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div className="preview-dl-name" title={fileName}>{fileName}</div>
              <a
                href={url}
                download={fileName}
                className="btn-preview-dl"
                tabIndex={open ? 0 : -1}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PowerPoint
              </a>
              <p className="preview-dl-hint">
                Browser preview isn't available for .pptx files.<br/>
                Download to open in Microsoft PowerPoint.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

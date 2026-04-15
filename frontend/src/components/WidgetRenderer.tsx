import React, { useEffect, useRef, useState } from 'react'

interface Props {
  html: string
  onPrompt: (text: string) => void
}

export function WidgetRenderer({ html, onPrompt }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(200)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    function handle(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return
      // Only accept messages from this specific iframe
      if (iframeRef.current && e.source !== iframeRef.current.contentWindow) return

      if (e.data.type === 'widget_resize') {
        const h = e.data.height as number
        if (typeof h === 'number' && h > 0) {
          setHeight(h + 4) // small buffer for border
        }
      }

      if (e.data.type === 'widget_prompt') {
        const text = e.data.text as string
        if (text) {
          setSubmitted(true)
          onPrompt(text)
        }
      }
    }

    window.addEventListener('message', handle)
    return () => window.removeEventListener('message', handle)
  }, [onPrompt])

  if (submitted) {
    return (
      <div style={{
        margin: '8px 0',
        background: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
        color: '#15803d',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Response sent
      </div>
    )
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      sandbox="allow-scripts"
      style={{
        width: '100%',
        maxWidth: '520px',
        height: `${height}px`,
        border: '1.5px solid var(--border-subtle, #e5e7eb)',
        borderRadius: '12px',
        margin: '8px 0',
        display: 'block',
        background: '#fff',
        transition: 'height 0.18s ease',
      }}
      title="Widget"
    />
  )
}

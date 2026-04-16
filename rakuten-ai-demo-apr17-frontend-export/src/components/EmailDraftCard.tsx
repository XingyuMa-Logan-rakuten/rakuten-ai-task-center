import React, { useState, useRef } from 'react'
import type { EmailDraft } from '../types'

interface Suggestion {
  id: string
  category: string
  category_label: string
  issue: string
  field: 'subject' | 'body'
  original?: string
  revised: string
  applied: boolean
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  keigo:        { bg: '#e8f0fe', color: '#1a73e8' },
  subject_line: { bg: '#fce8e6', color: '#c5221f' },
  formality:    { bg: '#e6f4ea', color: '#137333' },
  opening:      { bg: '#fef7e0', color: '#b06000' },
  closing:      { bg: '#f3e8fd', color: '#7b1fa2' },
  other:        { bg: 'var(--surface-muted)', color: 'var(--text-secondary)' },
}

export function EmailDraftCard({ draft }: { draft: EmailDraft }) {
  const [subject, setSubject] = useState(draft.subject)
  const [body, setBody] = useState(draft.body)
  const [sent, setSent] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const subjectRowRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const flashAndScroll = (el: HTMLElement | null) => {
    if (!el) return
    // Small delay so React's re-render completes before we animate
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.remove('email-field-highlight')
      void el.offsetWidth // force reflow to restart animation if re-applying
      el.classList.add('email-field-highlight')
      setTimeout(() => el.classList.remove('email-field-highlight'), 1600)
    }, 30)
  }

  const handleReview = async () => {
    setIsReviewing(true)
    setReviewError(null)
    setSuggestions(null)
    try {
      const res = await fetch('/api/review-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: draft.to, subject, body, cc: draft.cc }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setSuggestions(
        (data.suggestions as Omit<Suggestion, 'applied'>[]).map(s => ({ ...s, applied: false }))
      )
    } catch (e) {
      setReviewError('診断に失敗しました。もう一度お試しください。')
    } finally {
      setIsReviewing(false)
    }
  }

  const applysuggestion = (s: Suggestion) => {
    if (s.field === 'subject') {
      setSubject(s.revised)
      flashAndScroll(subjectRowRef.current)
    } else if (s.original) {
      setBody(prev => prev.replace(s.original!, s.revised))
      flashAndScroll(bodyRef.current)
    } else {
      setBody(s.revised)
      flashAndScroll(bodyRef.current)
    }
    setSuggestions(prev =>
      prev ? prev.map(x => x.id === s.id ? { ...x, applied: true } : x) : prev
    )
  }

  return (
    <div className="email-draft-card">
      {/* Header */}
      <div className="email-draft-header">
        <div className="email-draft-header-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          New Message
        </div>
        <img src="/connectors/gmail.png" alt="Gmail" width="16" height="16" style={{ borderRadius: '3px' }} />
      </div>

      {/* Fields */}
      <div className="email-draft-fields">
        <div className="email-draft-row">
          <span className="email-draft-label">To</span>
          <div className="email-draft-chips">
            {draft.to.map(r => <span key={r} className="email-draft-chip">{r}</span>)}
          </div>
        </div>

        {draft.cc.length > 0 && (
          <div className="email-draft-row">
            <span className="email-draft-label">Cc</span>
            <div className="email-draft-chips">
              {draft.cc.map(r => <span key={r} className="email-draft-chip">{r}</span>)}
            </div>
          </div>
        )}

        <div className="email-draft-row" ref={subjectRowRef}>
          <span className="email-draft-label">Subject</span>
          <span className="email-draft-subject-text">{subject}</span>
        </div>
      </div>

      {/* Body */}
      <div className="email-draft-body" ref={bodyRef}>{body}</div>

      {/* Review panel */}
      {(isReviewing || suggestions !== null || reviewError) && (
        <div className="email-review-panel">
          <div className="email-review-panel-header">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            メール診断
          </div>

          {isReviewing && (
            <div className="email-review-loading">
              <span className="tool-dot" style={{ animationDelay: '0ms' }} />
              <span className="tool-dot" style={{ animationDelay: '150ms' }} />
              <span className="tool-dot" style={{ animationDelay: '300ms' }} />
              <span style={{ marginLeft: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>診断中…</span>
            </div>
          )}

          {reviewError && (
            <div className="email-review-empty">{reviewError}</div>
          )}

          {suggestions !== null && !isReviewing && (
            suggestions.length === 0 ? (
              <div className="email-review-empty">問題は見つかりませんでした ✓</div>
            ) : (
              <div className="email-review-suggestions">
                {suggestions.map(s => {
                  const colors = CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.other
                  return (
                    <div key={s.id} className={`email-suggestion ${s.applied ? 'applied' : ''}`}>
                      <div className="email-suggestion-top">
                        <span
                          className="email-suggestion-category"
                          style={{ background: colors.bg, color: colors.color }}
                        >
                          {s.category_label}
                        </span>
                        <span className="email-suggestion-issue">{s.issue}</span>
                      </div>

                      <div className="email-suggestion-diff">
                        {s.original && (
                          <span className="email-suggestion-original">{s.original}</span>
                        )}
                        {s.original && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--text-tertiary)' }}>
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        )}
                        <span className="email-suggestion-revised">{s.revised}</span>
                      </div>

                      <button
                        className={`email-suggestion-apply ${s.applied ? 'applied' : ''}`}
                        onClick={() => applysuggestion(s)}
                        disabled={s.applied}
                      >
                        {s.applied ? (
                          <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            適用済み
                          </>
                        ) : '適用'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          )}
        </div>
      )}

      {/* Footer */}
      <div className="email-draft-footer">
        <div className="email-draft-attachments">
          {draft.attachments.map(a => (
            <span key={a} className="email-draft-attachment-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
              </svg>
              {a}
            </span>
          ))}
        </div>
        <div className="email-draft-actions">
          <button
            className="email-diagnose-btn"
            onClick={handleReview}
            disabled={isReviewing || sent}
            title="メール診断"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            メール診断
          </button>
          <button
            className={`email-draft-send ${sent ? 'sent' : ''}`}
            onClick={() => setSent(true)}
            disabled={sent}
          >
            {sent ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Sent
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

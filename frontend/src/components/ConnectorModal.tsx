import React, { useState } from 'react'
import { CONNECTORS } from '../data/connectors'

interface Props {
  open: boolean
  onClose: () => void
  addedConnectors: Set<string>
  authorizedConnectors: Set<string>
  onToggleAdd: (id: string) => void
  onAuthorize: (id: string) => void
}

function AuthOverlay({ name, onDone }: { name: string; onDone: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(onDone, 1200)
  }

  return (
    <div className="exec-auth-overlay open" onClick={e => e.target === e.currentTarget && !loading && onDone()}>
      <div className="exec-auth-page">
        <div className="exec-auth-logo">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
            <circle cx="12" cy="16" r="1"/>
          </svg>
        </div>
        <h2 className="exec-auth-title">Sign in to {name}</h2>
        <p className="exec-auth-desc">Connect your {name} account to allow Rakuten AI to access it on your behalf.</p>
        <div className="exec-auth-form">
          <input type="text" className="exec-auth-input" placeholder="Email address" defaultValue="user@example.com" />
          <input type="password" className="exec-auth-input" placeholder="Password" defaultValue="••••••••" />
          <button type="button" className="exec-auth-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Authorizing…' : 'Authorize'}
          </button>
        </div>
        <p className="exec-auth-footer">By authorizing, you agree to share the requested permissions with Rakuten AI.</p>
      </div>
    </div>
  )
}

export function ConnectorModal({ open, onClose, addedConnectors, authorizedConnectors, onToggleAdd, onAuthorize }: Props) {
  const [authingName, setAuthingName] = useState<string | null>(null)
  const [authingId, setAuthingId] = useState<string | null>(null)

  const handleAuth = (id: string, name: string) => {
    if (authorizedConnectors.has(id)) return
    setAuthingId(id)
    setAuthingName(name)
  }

  const handleAuthDone = () => {
    if (authingId) onAuthorize(authingId)
    setAuthingId(null)
    setAuthingName(null)
  }

  if (!open) return null

  return (
    <>
      <div className={`conn-modal-overlay ${open ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="conn-modal">
          <div className="conn-modal-header">
            <h2>Connectors</h2>
            <button type="button" className="conn-modal-close" onClick={onClose}>&times;</button>
          </div>
          <p className="conn-modal-subtitle">Connect external services to give Rakuten AI access to your data and accounts.</p>
          <div className="conn-modal-list">
            {CONNECTORS.map(c => {
              const isAuth = authorizedConnectors.has(c.id)
              const isAdded = addedConnectors.has(c.id)
              return (
                <div key={c.id} className="conn-row">
                  <div className="conn-row-icon" dangerouslySetInnerHTML={{ __html: c.icon }} />
                  <div className="conn-row-info">
                    <span className="conn-row-name">{c.name}</span>
                    <span className="conn-row-desc">{c.desc}</span>
                  </div>
                  <div className="conn-row-actions">
                    <button
                      type="button"
                      className={`conn-btn-auth ${isAuth ? 'authed' : ''}`}
                      onClick={() => handleAuth(c.id, c.name)}
                    >
                      {isAuth ? 'Authorized ✓' : 'Authorize'}
                    </button>
                    <button
                      type="button"
                      className={`conn-btn-add ${isAdded ? 'added' : ''}`}
                      disabled={!isAuth}
                      onClick={() => isAuth && onToggleAdd(c.id)}
                    >
                      {isAdded ? 'Added ✓' : 'Add to chat'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {authingName && authingId && (
        <AuthOverlay name={authingName} onDone={handleAuthDone} />
      )}
    </>
  )
}

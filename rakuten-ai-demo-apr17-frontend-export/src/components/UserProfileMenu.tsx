import React, { useEffect, useRef, useState } from 'react'
import type { SubscriptionTier } from '../types'
import { avatarInitials, tierLabel } from '../subscriptionUtils'

interface Props {
  userName: string
  subscriptionTier: SubscriptionTier
  credits: number
  maxCredits: number
  onSettings: () => void
  onLogout: () => void
}

export function UserProfileMenu({ userName, subscriptionTier, credits, maxCredits, onSettings, onLogout }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const pct = Math.max(0, Math.min(100, (credits / maxCredits) * 100))
  const creditsFormatted = credits.toLocaleString()
  const maxFormatted = maxCredits.toLocaleString()

  return (
    <div className="user-profile-wrap" ref={rootRef}>
      <button
        type="button"
        className="user-profile-avatar-btn"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(v => !v)}
      >
        <span className="user-profile-avatar" aria-hidden>
          {avatarInitials(userName)}
        </span>
      </button>
      {open && (
        <div className="user-profile-popover" role="menu">
          <div className="user-profile-popover-user">
            <div className="user-profile-popover-avatar" aria-hidden>
              {avatarInitials(userName)}
            </div>
            <div className="user-profile-popover-text">
              <div className="user-profile-name">{userName}</div>
              <div className="user-profile-tier">{tierLabel(subscriptionTier)}</div>
            </div>
          </div>

          <div className="user-profile-divider" />

          {/* Credits section */}
          <div className="user-profile-credits">
            <div className="user-profile-credits-row">
              <span className="user-profile-credits-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Credits
              </span>
              <span className="user-profile-credits-value">{creditsFormatted} / {maxFormatted}</span>
            </div>
            <div className="user-profile-credits-bar" role="progressbar" aria-valuenow={credits} aria-valuemin={0} aria-valuemax={maxCredits}>
              <div className="user-profile-credits-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="user-profile-credits-sub">
              {credits === 0
                ? 'No credits remaining this month'
                : `${creditsFormatted} credits remaining`}
            </div>
          </div>

          <div className="user-profile-divider" />

          <button
            type="button"
            className="user-profile-menu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onSettings()
            }}
          >
            Settings
          </button>
          <button
            type="button"
            className="user-profile-menu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

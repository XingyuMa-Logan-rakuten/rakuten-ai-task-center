import React, { useEffect, useRef, useState } from 'react'
import type { SubscriptionTier } from '../types'
import { avatarInitials, tierLabel } from '../subscriptionUtils'

interface Props {
  userName: string
  subscriptionTier: SubscriptionTier
  onSettings: () => void
  onLogout: () => void
}

export function UserProfileMenu({ userName, subscriptionTier, onSettings, onLogout }: Props) {
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

import React from 'react'
import type { SubscriptionTier } from '../types'

interface Props {
  open: boolean
  subscriptionTier: SubscriptionTier
  onClose: () => void
  onUpgrade: () => void
}

function modalCopy(tier: SubscriptionTier) {
  switch (tier) {
    case 'free':
      return {
        title: "You've used all your credits",
        desc: "You've reached your monthly limit of 1,200 free credits. Upgrade to Premium for 4,800 credits/month and enjoy more AI features.",
        primaryLabel: 'Upgrade to Premium',
        showUpgrade: true,
      }
    case 'premium':
      return {
        title: "You've used all your credits",
        desc: "You've reached your monthly limit of 4,800 Premium credits. Upgrade to Pro for 60,000 credits/month and unlock the full experience.",
        primaryLabel: 'Upgrade to Pro',
        showUpgrade: true,
      }
    case 'pro':
      return {
        title: "Monthly credits exhausted",
        desc: "You've used all 60,000 Pro credits for this month. Credits will reset at the start of your next billing cycle.",
        primaryLabel: 'View Credits',
        showUpgrade: false,
      }
  }
}

export function UsageLimitModal({ open, subscriptionTier, onUpgrade, onClose }: Props) {
  if (!open) return null
  const copy = modalCopy(subscriptionTier)

  return (
    <div className="usage-limit-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="usage-limit-modal" role="dialog" aria-modal="true" aria-labelledby="usageLimitTitle">
        <button type="button" className="usage-limit-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <div className="usage-limit-icon" aria-hidden>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <h2 id="usageLimitTitle" className="usage-limit-title">
          {copy.title}
        </h2>
        <p className="usage-limit-desc">
          {copy.desc}
        </p>
        <div className="usage-limit-actions">
          <button type="button" className="usage-limit-btn-primary" onClick={onUpgrade}>
            {copy.primaryLabel}
          </button>
          <button type="button" className="usage-limit-btn-secondary" onClick={onClose}>
            {copy.showUpgrade ? 'Maybe later' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

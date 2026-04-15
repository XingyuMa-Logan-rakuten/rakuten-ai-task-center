import React from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onUpgrade: () => void
}

export function UsageLimitModal({ open, onUpgrade, onClose }: Props) {
  if (!open) return null

  return (
    <div className="usage-limit-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="usage-limit-modal" role="dialog" aria-modal="true" aria-labelledby="usageLimitTitle">
        <button type="button" className="usage-limit-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <h2 id="usageLimitTitle" className="usage-limit-title">
          You&apos;ve reached daily usage limit
        </h2>
        <p className="usage-limit-desc">
          After subscribing to the service, you can enjoy more usage times.
        </p>
        <div className="usage-limit-actions">
          <button type="button" className="usage-limit-btn-primary" onClick={onUpgrade}>
            Upgrade
          </button>
          <button type="button" className="usage-limit-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

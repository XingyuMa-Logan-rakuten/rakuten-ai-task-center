import React from 'react'
import type { CreditHistoryEntry, SubscriptionTier } from '../types'
import { tierLabel } from '../subscriptionUtils'

interface Props {
  credits: number
  maxCredits: number
  subscriptionTier: SubscriptionTier
  history: CreditHistoryEntry[]
  onBack: () => void
  onUpgrade: () => void
}

export function CreditsPage({ credits, maxCredits, subscriptionTier, history, onBack, onUpgrade }: Props) {
  const pct = Math.max(0, Math.min(100, (credits / maxCredits) * 100))
  const creditsFormatted = credits.toLocaleString()
  const maxFormatted = maxCredits.toLocaleString()

  return (
    <div className="credits-page view-enter">
      <div className="credits-page-inner">
        {/* Top back button */}
        <div className="credits-page-top">
          <button type="button" className="btn-back credits-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>

        <h1 className="credits-page-heading">Profile</h1>

        {/* User avatar row */}
        <div className="credits-user-row">
          <div className="credits-user-avatar" aria-hidden>JK</div>
          <div className="credits-user-info">
            <div className="credits-user-name">John Ken</div>
            <button type="button" className="credits-edit-name">Edit name</button>
          </div>
        </div>

        {/* Settings section */}
        <div className="credits-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          Settings
        </div>

        {/* Subscription row */}
        <div className="credits-card">
          <div className="credits-subscription-row">
            <span className="credits-subscription-label">{tierLabel(subscriptionTier)}</span>
            {subscriptionTier !== 'pro' && (
              <button type="button" className="credits-upgrade-btn" onClick={onUpgrade}>
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Payment row */}
        <div className="credits-card credits-card--chevron">
          <span>Payment</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Credits card */}
        <div className="credits-card credits-credits-card">
          <div className="credits-credits-header">
            <div className="credits-credits-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Credits
              <button type="button" className="credits-info-btn" aria-label="Credits info">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </button>
            </div>
            <span className="credits-credits-amount">{creditsFormatted}</span>
          </div>

          <div className="credits-credits-bar-wrap">
            <div className="credits-credits-bar" role="progressbar" aria-valuenow={credits} aria-valuemin={0} aria-valuemax={maxCredits}>
              <div className="credits-credits-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="credits-credits-meta">
            <span className="credits-credits-type">Free credits</span>
            <span className="credits-credits-total">{creditsFormatted}</span>
          </div>

          <div className="credits-credits-max-row">
            <span />
            <span className="credits-credits-max">{maxFormatted}</span>
          </div>
        </div>

        {/* Usage Record */}
        <div className="credits-usage-section">
          <div className="credits-usage-heading">Usage record</div>
          <div className="credits-usage-table">
            <div className="credits-usage-table-head">
              <span>Details</span>
              <span>Date</span>
              <span className="credits-usage-col-right">Credits change</span>
            </div>
            {history.length === 0 ? (
              <div className="credits-usage-empty">No usage records yet.</div>
            ) : (
              history.map(entry => (
                <div key={entry.id} className="credits-usage-row">
                  <span className="credits-usage-detail" title={entry.detail}>{entry.detail}</span>
                  <span className="credits-usage-date">{entry.date}</span>
                  <span className={`credits-usage-change ${entry.change >= 0 ? 'credits-usage-change--positive' : 'credits-usage-change--negative'}`}>
                    {entry.change >= 0 ? `+${entry.change.toLocaleString()}` : entry.change.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sign out */}
        <button type="button" className="credits-signout-btn" onClick={onBack}>
          Sign out
        </button>
      </div>
    </div>
  )
}

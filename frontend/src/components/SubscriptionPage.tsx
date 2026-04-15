import React from 'react'
import type { SubscriptionTier } from '../types'

interface Props {
  currentTier: SubscriptionTier
  onBack: () => void
  onSelectPlan: (tier: SubscriptionTier) => void
}

const FEATURE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="sub-plan-feature">
      <span className="sub-plan-feature-icon">{FEATURE_ICON}</span>
      <span>{children}</span>
    </li>
  )
}

/** Pricing UI is English-only; app default language is controlled in App.tsx sidebar. */
export function SubscriptionPage({ currentTier, onBack, onSelectPlan }: Props) {
  return (
    <div className="subscription-page view-enter">
      <div className="subscription-page-inner">
        <div className="subscription-page-top">
          <button type="button" className="btn-back subscription-back" onClick={onBack}>
            ← Back
          </button>
        </div>

        <h1 className="subscription-heading">Choose the plan that fits your needs</h1>
        <p className="subscription-sub">
          Upgrade for a broader search experience and premium AI models.
        </p>

        <div className="sub-plan-grid">
          {/* Free */}
          <div className={`sub-plan-card ${currentTier === 'free' ? 'sub-plan-card--current' : ''}`}>
            <h3 className="sub-plan-name">Free</h3>
            <div className="sub-plan-price">
              ¥0 <span>/ month</span>
            </div>
            <button
              type="button"
              className={currentTier === 'free' ? 'sub-plan-btn sub-plan-btn--disabled' : 'sub-plan-btn'}
              disabled={currentTier === 'free'}
              onClick={() => onSelectPlan('free')}
            >
              {currentTier === 'free' ? 'Your current plan' : 'Select Free'}
            </button>
            <ul className="sub-plan-features">
              <Feature>Unlimited Rakuten Ecosystem Agents</Feature>
              <Feature>Limited Skill Agents</Feature>
              <Feature>Best available (auto-selected) model</Feature>
              <Feature>1,200 credits per month</Feature>
              <Feature>20–30 requests per day</Feature>
              <Feature>8k token context per request</Feature>
              <Feature>10 MB file upload size</Feature>
              <Feature>1 concurrent skill task</Feature>
            </ul>
          </div>

          {/* Premium */}
          <div className={`sub-plan-card ${currentTier === 'premium' ? 'sub-plan-card--current' : ''}`}>
            <h3 className="sub-plan-name">Premium</h3>
            <div className="sub-plan-price">
              ¥1,980 <span>/ month</span>
            </div>
            <button
              type="button"
              className={currentTier === 'premium' ? 'sub-plan-btn sub-plan-btn--disabled' : 'sub-plan-btn'}
              disabled={currentTier === 'premium'}
              onClick={() => onSelectPlan('premium')}
            >
              {currentTier === 'premium' ? 'Your current plan' : 'Upgrade to Go'}
            </button>
            <ul className="sub-plan-features">
              <Feature>Higher limits for Skill Agents</Feature>
              <Feature>4,800 credits per month</Feature>
              <Feature>200–300 requests per day</Feature>
              <Feature>32k token context per request</Feature>
              <Feature>50 MB file upload size</Feature>
              <Feature>2 concurrent skill tasks</Feature>
              <Feature>Priority during peak usage</Feature>
              <Feature>Memory across chats</Feature>
              <Feature>Credit top-ups allowed</Feature>
            </ul>
          </div>

          {/* Pro */}
          <div className={`sub-plan-card ${currentTier === 'pro' ? 'sub-plan-card--current' : ''}`}>
            <h3 className="sub-plan-name">Pro</h3>
            <div className="sub-plan-price">
              ¥19,500 <span>/ month</span>
            </div>
            <button
              type="button"
              className={currentTier === 'pro' ? 'sub-plan-btn sub-plan-btn--disabled' : 'sub-plan-btn'}
              disabled={currentTier === 'pro'}
              onClick={() => onSelectPlan('pro')}
            >
              {currentTier === 'pro' ? 'Your current plan' : 'Upgrade to Go'}
            </button>
            <ul className="sub-plan-features">
              <Feature>Very high limits for Skill Agents</Feature>
              <Feature>60,000 credits per month</Feature>
              <Feature>1,000+ requests per day</Feature>
              <Feature>128k token context per request</Feature>
              <Feature>200 MB file upload size</Feature>
              <Feature>5 concurrent skill tasks</Feature>
              <Feature>All Premium features</Feature>
              <Feature>Beta / experimental features enabled</Feature>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

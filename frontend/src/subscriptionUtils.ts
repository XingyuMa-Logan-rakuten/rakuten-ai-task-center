import type { SubscriptionTier } from './types'

export function tierLabel(tier: SubscriptionTier): string {
  switch (tier) {
    case 'free':
      return 'RAI Free Plan'
    case 'premium':
      return 'RAI Premium Plan'
    case 'pro':
      return 'RAI Pro Plan'
    default:
      return 'RAI Free Plan'
  }
}

export function avatarInitials(displayName: string): string {
  const letters = displayName.match(/[a-zA-Z]/g)
  if (letters && letters.length >= 2) return (letters[0] + letters[1]).toUpperCase()
  if (letters && letters.length === 1) return letters[0].toUpperCase()
  return displayName.slice(0, 2).toUpperCase() || '?'
}

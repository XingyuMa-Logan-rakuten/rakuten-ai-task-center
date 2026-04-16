import type { SubscriptionTier } from './types'

export function tierLabel(tier: SubscriptionTier): string {
  switch (tier) {
    case 'free':
      return 'Rakuten AI Free Plan'
    case 'premium':
      return 'Rakuten AI Premium Plan'
    case 'pro':
      return 'Rakuten AI Pro Plan'
    default:
      return 'Rakuten AI Free Plan'
  }
}

export function avatarInitials(displayName: string): string {
  const letters = displayName.match(/[a-zA-Z]/g)
  if (letters && letters.length >= 2) return (letters[0] + letters[1]).toUpperCase()
  if (letters && letters.length === 1) return letters[0].toUpperCase()
  return displayName.slice(0, 2).toUpperCase() || '?'
}

/** Total credits granted per subscription tier per month. */
export const TIER_CREDITS: Record<SubscriptionTier, number> = {
  free: 1200,
  premium: 4800,
  pro: 60000,
}

/** Random credit cost per query (400–600). */
export function randomQueryCost(): number {
  return Math.floor(Math.random() * 201) + 400
}

/** Body line under “Estimated credits” in task modal; aligns with `randomQueryCost()`. */
export const CREDIT_MODAL_ESTIMATE = '400–600 credits'

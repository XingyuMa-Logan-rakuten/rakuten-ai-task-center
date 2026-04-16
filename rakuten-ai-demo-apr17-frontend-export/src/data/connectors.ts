import type { Connector } from '../types'

export const CONNECTORS: Connector[] = [
  {
    id: 'gmail', name: 'Gmail', color: '#EA4335',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path fill="#4285F4" d="M2 6l10 7 10-7v12H2z" opacity=".12"/><path fill="#EA4335" d="M22 6l-10 7L2 6"/><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="#EA4335" stroke-width="1.5"/></svg>`,
    desc: 'Read and send email via your Google account.',
  },
  {
    id: 'google-calendar', name: 'Google Calendar', color: '#4285F4',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="#4285F4" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#4285F4" stroke-width="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="#4285F4" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="#4285F4" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="15" r="1.5" fill="#4285F4"/></svg>`,
    desc: 'Create and read events from Google Calendar.',
  },
  {
    id: 'ms-teams', name: 'MS Teams', color: '#6264A7',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="#6264A7" stroke-width="1.5"/><path d="M7 10h10M7 14h6" stroke="#6264A7" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    desc: 'Send messages and manage channels in MS Teams.',
  },
  {
    id: 'ms-outlook', name: 'MS Outlook', color: '#0078D4',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="#0078D4" stroke-width="1.5"/><path d="M2 6l10 7 10-7" stroke="#0078D4" stroke-width="1.5" fill="none"/></svg>`,
    desc: 'Access mail, contacts and calendar via Outlook.',
  },
  {
    id: 'ms-calendar', name: 'MS Calendar', color: '#0078D4',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="#0078D4" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#0078D4" stroke-width="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="#0078D4" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="#0078D4" stroke-width="1.5" stroke-linecap="round"/><rect x="10" y="13" width="4" height="4" rx="0.5" fill="#0078D4"/></svg>`,
    desc: 'Schedule and read events from Microsoft Calendar.',
  },
  {
    id: 'line', name: 'Line', color: '#06C755',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="3" width="20" height="18" rx="4" fill="none" stroke="#06C755" stroke-width="1.5"/><path d="M7 13l2-3 2 2 4-5" stroke="#06C755" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    desc: 'Send and receive messages through Line Messenger.',
  },
  {
    id: 'viber', name: 'Viber', color: '#7360F2',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 2C6.48 2 2 6.03 2 10.94c0 2.75 1.34 5.2 3.44 6.83L5 22l4-2.3c.97.18 1.97.3 3 .3 5.52 0 10-4.03 10-8.94S17.52 2 12 2z" fill="none" stroke="#7360F2" stroke-width="1.5"/><path d="M9 10v4M12 9v6M15 11v2" stroke="#7360F2" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    desc: 'Communicate through Viber messaging platform.',
  },
  {
    id: 'instagram', name: 'Instagram', color: '#E4405F',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#E4405F" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="#E4405F" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="#E4405F"/></svg>`,
    desc: 'Post content and manage your Instagram account.',
  },
  {
    id: 'facebook', name: 'Facebook', color: '#1877F2',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" fill="none" stroke="#1877F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    desc: 'Manage pages and messages on Facebook.',
  },
  {
    id: 'x-twitter', name: 'X', color: '#171717',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M4 4l6.5 8L4 20h2l5.25-6.4L16 20h4l-7-8.5L19.5 4H18l-4.75 5.8L9 4H4z" fill="none" stroke="#171717" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    desc: 'Post and read on X (formerly Twitter).',
  },
  {
    id: 'canva', name: 'Canva', color: '#00C4CC',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="10" fill="none" stroke="#00C4CC" stroke-width="1.5"/><path d="M9 15c0-3.3 2.7-6 6-6" stroke="#00C4CC" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
    desc: 'Create designs and export assets from Canva.',
  },
  {
    id: 'figma', name: 'Figma', color: '#A259FF',
    icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5z" fill="none" stroke="#F24E1E" stroke-width="1.3"/><path d="M12 2h3.5A3.5 3.5 0 0115.5 9H12V2z" fill="none" stroke="#FF7262" stroke-width="1.3"/><path d="M12 9h3.5a3.5 3.5 0 110 7H12V9z" fill="none" stroke="#1ABCFE" stroke-width="1.3"/><path d="M5 18.5A3.5 3.5 0 018.5 15H12v3.5a3.5 3.5 0 11-7 0z" fill="none" stroke="#0ACF83" stroke-width="1.3"/><path d="M5 12a3.5 3.5 0 013.5-3.5H12v7H8.5A3.5 3.5 0 015 12z" fill="none" stroke="#A259FF" stroke-width="1.3"/></svg>`,
    desc: 'Access Figma designs and export assets.',
  },
]

export const CONNECTOR_COLORS: Record<string, { bg: string; text: string }> = {
  Gmail: { bg: '#fef2f2', text: '#b91c1c' },
  'Google Calendar': { bg: '#eff6ff', text: '#1d4ed8' },
  'MS Teams': { bg: '#f0f0ff', text: '#4338ca' },
  'MS Outlook': { bg: '#eff6ff', text: '#1d4ed8' },
  'MS Calendar': { bg: '#eff6ff', text: '#1d4ed8' },
  Outlook: { bg: '#eff6ff', text: '#1d4ed8' },
  Line: { bg: '#f0fdf4', text: '#15803d' },
  Viber: { bg: '#faf5ff', text: '#7c3aed' },
  Instagram: { bg: '#fff1f2', text: '#be123c' },
  Facebook: { bg: '#eff6ff', text: '#1d4ed8' },
  X: { bg: '#f8fafc', text: '#0f172a' },
  Canva: { bg: '#ecfeff', text: '#0e7490' },
  Figma: { bg: '#faf5ff', text: '#7c3aed' },
  'Rakuten Pay': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Card': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Points': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Ichiba': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Travel': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Fashion': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Beauty': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten GORA': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Sports': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Keiba': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Insurance': { bg: '#fff1f2', text: '#be123c' },
  'Rakuten Affiliate': { bg: '#fff1f2', text: '#be123c' },
  'Cooking Partner': { bg: '#fff7ed', text: '#c2410c' },
  Rakuma: { bg: '#fef3c7', text: '#b45309' },
  'Rakuten Marathon': { bg: '#fff1f2', text: '#be123c' },
}

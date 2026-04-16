export interface Task {
  id: string
  title: string
  category: string
  description: string
  type: 'simple' | 'multi-step' | 'schedule'
  typeTags: string[]
  sampleQueries: string[]
  connectors: string[]
  cover: string
  userFlowUrl: string
  featured?: boolean
  hot?: boolean
  featuredBadge?: string
  japanSub?: string
}

export interface TaskCategory {
  id: string
  label: string
  icon: string
  special?: boolean
}

export interface JapanSub {
  id: string
  icon: string
  titleJa: string
  titleEn: string
}

export interface Connector {
  id: string
  name: string
  icon: string
  color: string
  desc: string
}

export interface ActiveTask {
  id: string
  status: 'running' | 'completed' | 'paused' | 'failed' | 'scheduled'
  schedule?: string
  lastRun?: string
  nextRun?: string
}

export interface UIResource {
  handle: string
  toolName: string
  formData?: {
    title?: string
    icon?: string
    subtitle?: string
    questions: unknown[]
  }
  widgetType?: string
  widgetHtml?: string
}

export interface EmailDraft {
  to: string[]
  subject: string
  body: string
  cc: string[]
  attachments: string[]
}

export interface TodoItem {
  content: string
  status: 'pending' | 'in_progress' | 'completed'
  activeForm?: string
}

export interface ToolCallDisplay {
  id: string
  toolName: string
  displayName: string
  status: 'searching' | 'completed' | 'error'
  variant?: 'skill' | 'exec' | 'file'
  error?: string
  detail?: string
}

export interface Hotel {
  hotelId: string
  name: string
  location: string
  pricePerNight: number
  rating?: number
  reviewCount?: number
  imgUrl: string
  description?: string
  amenities?: string[]
  roomType?: string
}

export type MessageBlock =
  | { type: 'tool'; id: string; call: ToolCallDisplay }
  | { type: 'text'; id: string; content: string }
  | { type: 'todos'; id: string; items: TodoItem[] }
  | { type: 'carousel'; id: string; products: Product[] }
  | { type: 'hotel-carousel'; id: string; hotels: Hotel[] }

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
  toolCalls?: ToolCallDisplay[]
  isStreaming?: boolean
  products?: Product[]
  uiResources?: UIResource[]
  emailDrafts?: EmailDraft[]
  blocks?: MessageBlock[]
}

export interface Product {
  productId?: string
  name?: string
  price?: number
  link?: string
  imgUrl?: string
  rating?: string | number
  reviewCount?: number
  shopName?: string
  shipping?: string
}

export type AppView = 'home' | 'chat' | 'gallery' | 'my-tasks' | 'subscription' | 'credits'

export interface CreditHistoryEntry {
  id: string
  detail: string
  date: string
  change: number
}

export type Language = 'ja' | 'en'
export type SubscriptionTier = 'free' | 'premium' | 'pro'

export interface DebugEvent {
  id: string
  timestamp: Date
  type: 'system_prompt' | 'user_input' | 'tool_call' | 'tool_result' | 'tool_error' | 'llm_output'
  data: unknown
}

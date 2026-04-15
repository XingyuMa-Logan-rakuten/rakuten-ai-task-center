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

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
  toolCalls?: ToolCallDisplay[]
  isStreaming?: boolean
  products?: Product[]
  uiResources?: UIResource[]
}

export interface ToolCallDisplay {
  id: string
  toolName: string
  displayName: string
  status: 'searching' | 'completed' | 'error'
  error?: string
}

export interface Product {
  productId?: string
  name?: string
  price?: number
  link?: string
  imgUrl?: string
  rating?: string
  reviewCount?: number
}

export type AppView = 'home' | 'chat' | 'gallery' | 'my-tasks'
export type Language = 'ja' | 'en'

export interface DebugEvent {
  id: string
  timestamp: Date
  type: 'system_prompt' | 'user_input' | 'tool_call' | 'tool_result' | 'tool_error' | 'llm_output'
  data: unknown
}

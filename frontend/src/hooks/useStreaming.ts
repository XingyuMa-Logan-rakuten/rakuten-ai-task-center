import { useCallback, useRef } from 'react'
import type { Message, ToolCallDisplay, Product, DebugEvent, UIResource } from '../types'

const API_BASE = '/api'

interface StreamingParams {
  sessionId: string | null
  setSessionId: (id: string) => void
  language: 'ja' | 'en'
  agentType: string
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  onDebugEvent?: (type: DebugEvent['type'], data: unknown) => void
}

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  ichiba_product_search: 'Searching Rakuten Ichiba',
  rakuma_product_search: 'Searching Rakuma',
  rakuten_travel_search: 'Searching Rakuten Travel',
  fetch_product_detail: 'Fetching product details',
  fetch_hotel_detail: 'Fetching hotel details',
  initiate_checkout: 'Preparing checkout',
  rakuma_checkout: 'Preparing Rakuma checkout',
  compare_products: 'Comparing products',
  compare_products_tool: 'Comparing products',
  category_overview: 'Analyzing category',
  category_overview_tool: 'Analyzing category',
  mybest_buying_guide: 'Getting buying guide',
  mybest_buying_guide_tool: 'Getting buying guide',
  user_input: 'Collecting your preferences',
  web_search: 'Searching the web',
  memory_tool: 'Checking your history',
  delivery_status: 'Checking delivery status',
  get_product_storage_info: 'Retrieving product info',
  generate_marathon_plan: 'Planning shopping marathon',
  highlight_products_tool: 'Highlighting products',
}

// Tools that should not show a visible badge in the chat UI
const SILENT_TOOLS = new Set(['user_input', 'memory_tool', 'show_widget'])

function getToolDisplayName(toolName: string): string {
  return TOOL_DISPLAY_NAMES[toolName] || toolName.replace(/_/g, ' ')
}

function makeId() {
  return Math.random().toString(36).slice(2)
}

export function useStreaming(params: StreamingParams) {
  const {
    sessionId,
    setSessionId,
    language,
    agentType,
    isLoading,
    setIsLoading,
    setMessages,
    onDebugEvent,
  } = params

  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (text: string, imageDataUrl?: string) => {
    if (!text.trim() && !imageDataUrl || isLoading) return

    // Extract base64 payload and media type from data URL
    let imageBase64: string | undefined
    let imageMediaType: string | undefined
    if (imageDataUrl) {
      const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/)
      if (match) {
        imageMediaType = match[1]
        imageBase64 = match[2]
      }
    }

    const userMsgId = makeId()
    const assistantMsgId = makeId()

    // Add user message
    setMessages(prev => [...prev, {
      id: userMsgId,
      role: 'user',
      content: text.trim(),
      image: imageDataUrl,
    }])

    // Add empty assistant message (streaming)
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      toolCalls: [],
    }])

    onDebugEvent?.('user_input', { role: 'user', content: text.trim() })
    let accumulatedContent = ''

    setIsLoading(true)
    abortRef.current = new AbortController()

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          session_id: sessionId,
          agent_type: agentType,
          language,
          image: imageBase64,
          image_media_type: imageMediaType,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw || raw === '[DONE]') continue

          let event: Record<string, unknown>
          try {
            event = JSON.parse(raw)
          } catch {
            continue
          }

          const evType = event.type as string

          if (evType === 'debug') {
            const debugType = event.debug_type as string
            if (debugType === 'system_prompt') {
              onDebugEvent?.('system_prompt', { role: 'system', content: event.content })
            }
          }

          else if (evType === 'message_start') {
            const sid = event.session_id as string | undefined
            if (sid) setSessionId(sid)
          }

          else if (evType === 'token') {
            const token = event.content as string || ''
            accumulatedContent += token
            setMessages(prev => prev.map(m =>
              m.id === assistantMsgId
                ? { ...m, content: m.content + token }
                : m
            ))
          }

          else if (evType === 'tool_call') {
            const toolName = (event.tool_name || event.tool) as string
            onDebugEvent?.('tool_call', { tool: toolName, args: event.args })
            if (!SILENT_TOOLS.has(toolName)) {
              const toolId = makeId()
              const displayName = getToolDisplayName(toolName)
              setMessages(prev => prev.map(m => {
                if (m.id !== assistantMsgId) return m
                const newCall: ToolCallDisplay = {
                  id: toolId,
                  toolName,
                  displayName,
                  status: 'searching',
                }
                return { ...m, toolCalls: [...(m.toolCalls || []), newCall] }
              }))
            }
          }

          else if (evType === 'tool_result') {
            const toolName = (event.tool_name || event.tool) as string
            onDebugEvent?.('tool_result', { tool: toolName, data: event.data })
            const data = event.data as Record<string, unknown> | undefined

            // Handle ui_resource (user_input form / show_widget) — attach to message for inline rendering
            if (data?.type === 'ui_resource') {
              const resource: UIResource = {
                handle: (event.handle as string) || makeId(),
                toolName,
                formData: data.form_data as UIResource['formData'],
                widgetType: data.widget_type as string | undefined,
                widgetHtml: data.widget_html as string | undefined,
              }
              setMessages(prev => prev.map(m => {
                if (m.id !== assistantMsgId) return m
                return { ...m, uiResources: [...(m.uiResources || []), resource] }
              }))
            }

            let products: Product[] | undefined

            // Extract products if present
            if (data) {
              const items = data.items as unknown[] | undefined
              const dataProducts = data.products as unknown[] | undefined
              const rawProducts = items || dataProducts
              if (rawProducts && Array.isArray(rawProducts)) {
                products = (rawProducts as Record<string, unknown>[]).map(p => ({
                  productId: p.productId as string,
                  name: p.name as string,
                  price: p.price as number,
                  link: p.link as string,
                  imgUrl: p.imgUrl as string,
                  rating: p.rating as string,
                  reviewCount: p.reviewCount as number,
                })).filter(p => p.name)
              }
            }

            // Mark the last searching tool of this type as completed
            setMessages(prev => prev.map(m => {
              if (m.id !== assistantMsgId) return m
              const toolCalls = (m.toolCalls || []).map(tc => {
                if (tc.toolName === toolName && tc.status === 'searching') {
                  return { ...tc, status: 'completed' as const }
                }
                return tc
              })
              // Mark last unresolved tool_call as done if tool name matches
              const reversed = [...toolCalls].reverse()
              const lastSearching = reversed.find(tc => tc.status === 'searching')
              if (lastSearching && toolName && !toolCalls.find(tc => tc.toolName === toolName)) {
                const idx = toolCalls.lastIndexOf(lastSearching)
                const updated = [...toolCalls]
                updated[idx] = { ...lastSearching, status: 'completed' }
                return { ...m, toolCalls: updated, products: products || m.products }
              }
              return { ...m, toolCalls, products: products && products.length > 0 ? products : m.products }
            }))
          }

          else if (evType === 'tool_error') {
            const toolName = (event.tool_name || event.tool) as string
            onDebugEvent?.('tool_error', { tool: toolName, error: event.error })
            if (SILENT_TOOLS.has(toolName)) continue
            setMessages(prev => prev.map(m => {
              if (m.id !== assistantMsgId) return m
              const toolCalls = (m.toolCalls || []).map(tc => {
                if (tc.toolName === toolName && tc.status === 'searching') {
                  return { ...tc, status: 'error' as const, error: event.error as string }
                }
                return tc
              })
              return { ...m, toolCalls }
            }))
          }

          else if (evType === 'done') {
            if (accumulatedContent) {
              onDebugEvent?.('llm_output', { role: 'assistant', content: accumulatedContent })
            }
            const toolStore = event.tool_store as Record<string, unknown> | undefined
            // Extract all products from tool_store
            let allProducts: Product[] = []
            if (toolStore) {
              for (const [, result] of Object.entries(toolStore)) {
                const r = result as Record<string, unknown>
                const items = (r.items || r.products) as unknown[] | undefined
                if (items && Array.isArray(items)) {
                  const mapped = (items as Record<string, unknown>[]).map(p => ({
                    productId: p.productId as string,
                    name: p.name as string,
                    price: p.price as number,
                    link: p.link as string,
                    imgUrl: p.imgUrl as string,
                  })).filter(p => p.name)
                  allProducts = [...allProducts, ...mapped]
                }
              }
            }

            // Mark all remaining searching tools as completed
            setMessages(prev => prev.map(m => {
              if (m.id !== assistantMsgId) return m
              const toolCalls = (m.toolCalls || []).map(tc =>
                tc.status === 'searching' ? { ...tc, status: 'completed' as const } : tc
              )
              return {
                ...m,
                isStreaming: false,
                toolCalls,
                products: allProducts.length > 0 ? allProducts.slice(0, 8) : m.products,
              }
            }))
            break
          }

          else if (evType === 'error') {
            const errMsg = event.message as string || event.error as string || 'An error occurred'
            setMessages(prev => prev.map(m => {
              if (m.id !== assistantMsgId) return m
              return {
                ...m,
                isStreaming: false,
                content: m.content || `Error: ${errMsg}`,
              }
            }))
            break
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, isStreaming: false, content: m.content || '_(cancelled)_' }
            : m
        ))
      } else {
        const msg = err instanceof Error ? err.message : 'Connection error'
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, isStreaming: false, content: `Error: ${msg}` }
            : m
        ))
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [sessionId, setSessionId, language, agentType, isLoading, setIsLoading, setMessages, onDebugEvent])

  const cancelStreaming = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { sendMessage, cancelStreaming }
}

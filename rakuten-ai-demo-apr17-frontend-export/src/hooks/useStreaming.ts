import { useCallback, useRef } from 'react'
import type { Message, MessageBlock, ToolCallDisplay, TodoItem, Product, Hotel, DebugEvent, UIResource } from '../types'

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
  userId?: string
  onFileCreated?: (url: string, fileType: 'html' | 'pptx') => void
}

const TOOL_DISPLAY_NAMES: Record<string, { en: string; ja: string }> = {
  ichiba_product_search:    { en: 'Searching Rakuten Ichiba',       ja: '楽天市場を検索中' },
  rakuma_product_search:    { en: 'Searching Rakuma',               ja: 'ラクマを検索中' },
  rakuten_travel_search:    { en: 'Searching Rakuten Travel',       ja: '楽天トラベルを検索中' },
  fetch_product_detail:     { en: 'Fetching product details',       ja: '商品詳細を取得中' },
  fetch_hotel_detail:       { en: 'Fetching hotel details',         ja: 'ホテル詳細を取得中' },
  initiate_checkout:        { en: 'Preparing checkout',             ja: 'チェックアウトを準備中' },
  rakuma_checkout:          { en: 'Preparing Rakuma checkout',      ja: 'ラクマのチェックアウトを準備中' },
  compare_products:         { en: 'Comparing products',             ja: '商品を比較中' },
  compare_products_tool:    { en: 'Comparing products',             ja: '商品を比較中' },
  category_overview:        { en: 'Analyzing category',             ja: 'カテゴリを分析中' },
  category_overview_tool:   { en: 'Analyzing category',             ja: 'カテゴリを分析中' },
  mybest_buying_guide:      { en: 'Getting buying guide',           ja: '購入ガイドを取得中' },
  mybest_buying_guide_tool: { en: 'Getting buying guide',           ja: '購入ガイドを取得中' },
  user_input:               { en: 'Collecting your preferences',    ja: '設定を収集中' },
  web_search:               { en: 'Searching the web',              ja: 'ウェブを検索中' },
  memory_tool:              { en: 'Checking your history',          ja: '履歴を確認中' },
  search_emails:            { en: 'Searching your inbox',           ja: 'メールを検索中' },
  read_email:               { en: 'Reading email',                  ja: 'メールを読込中' },
  search_events:            { en: 'Checking your calendar',         ja: 'カレンダーを確認中' },
  create_event:             { en: 'Adding to Google Calendar',      ja: 'Googleカレンダーに追加中' },
  search_notes:             { en: 'Searching your notes',           ja: 'ノートを検索中' },
  read_note:                { en: 'Reading note',                   ja: 'ノートを読込中' },
  draft_email:              { en: 'Drafting email',                 ja: 'メールを下書き中' },
  delivery_status:          { en: 'Checking delivery status',       ja: '配送状況を確認中' },
  get_product_storage_info: { en: 'Retrieving product info',        ja: '商品情報を取得中' },
  generate_marathon_plan:   { en: 'Planning shopping marathon',     ja: 'マラソン計画を作成中' },
  highlight_products_tool:  { en: 'Highlighting products',          ja: '注目商品を表示中' },
  // Harness tools
  write_file:               { en: 'Writing file',                   ja: 'ファイルを作成中' },
  execute:                  { en: 'Running script',                 ja: 'スクリプトを実行中' },
  read_file:                { en: 'Reading file',                   ja: 'ファイルを読込中' },
}

// Tools whose badges are never shown
const SILENT_TOOLS = new Set(['user_input', 'memory_tool', 'show_widget', 'ls', 'glob', 'grep', 'edit_file', 'write_todos'])

function getToolDisplayName(toolName: string, language: 'ja' | 'en'): string {
  const entry = TOOL_DISPLAY_NAMES[toolName]
  if (entry) return entry[language] ?? entry.en
  return toolName.replace(/_/g, ' ')
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
    userId,
  } = params

  const abortRef = useRef<AbortController | null>(null)
  // Stable ref so sendMessage closure never becomes stale for this callback
  const onFileCreatedRef = useRef(params.onFileCreated)
  onFileCreatedRef.current = params.onFileCreated
  // Tracks the file path from the most recent write_file tool_call
  const lastWriteFileRef = useRef<string | null>(null)
  // Product store: search_id → Product[] (populated by tool_result, consumed by carousel token)
  const productStoreRef = useRef<Record<string, Product[]>>({})
  // Buffer for partial carousel tokens that span multiple SSE chunks
  const partialTokenRef = useRef<string | null>(null)

  const sendMessage = useCallback(async (text: string, imageDataUrl?: string) => {
    if (!text.trim() && !imageDataUrl || isLoading) return
    partialTokenRef.current = null

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
      blocks: [],
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
          user_id: userId,
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
            const rawToken = (event.content as string) || ''
            accumulatedContent += rawToken

            // Combine with any buffered partial carousel token
            const candidate: string = (partialTokenRef.current || '') + rawToken
            const CAROUSEL_RE = /⟪carousel:\{"ref":"([^"]+)"\}⟫/
            const match = CAROUSEL_RE.exec(candidate)

            if (match) {
              // Complete carousel token found — split into before/carousel/after
              const before = candidate.slice(0, match.index)
              const ref = match[1]
              const after = candidate.slice(match.index + match[0].length)
              partialTokenRef.current = null

              setMessages(prev => prev.map(m => {
                if (m.id !== assistantMsgId) return m
                const blocks: MessageBlock[] = [...(m.blocks || [])]

                if (before) {
                  const last = blocks[blocks.length - 1]
                  if (last?.type === 'text') {
                    blocks[blocks.length - 1] = { ...last, content: last.content + before }
                  } else {
                    blocks.push({ type: 'text', id: makeId(), content: before })
                  }
                }

                const products = productStoreRef.current[ref] || []
                if (products.length > 0) {
                  blocks.push({ type: 'carousel', id: makeId(), products })
                }

                if (after) {
                  blocks.push({ type: 'text', id: makeId(), content: after })
                }

                return { ...m, content: m.content + rawToken, blocks }
              }))
            } else if (candidate.includes('⟪') && !candidate.includes('⟫')) {
              // Opening brace seen but no closing yet — buffer and wait
              partialTokenRef.current = candidate
              setMessages(prev => prev.map(m =>
                m.id !== assistantMsgId ? m : { ...m, content: m.content + rawToken }
              ))
            } else {
              // No carousel token — emit the candidate text normally
              partialTokenRef.current = null
              const textToAdd = candidate
              setMessages(prev => prev.map(m => {
                if (m.id !== assistantMsgId) return m
                const blocks: MessageBlock[] = [...(m.blocks || [])]
                const lastBlock = blocks[blocks.length - 1]
                if (lastBlock && lastBlock.type === 'text') {
                  blocks[blocks.length - 1] = { ...lastBlock, content: lastBlock.content + textToAdd }
                } else {
                  blocks.push({ type: 'text', id: makeId(), content: textToAdd })
                }
                return { ...m, content: m.content + rawToken, blocks }
              }))
            }
          }

          else if (evType === 'tool_call') {
            const toolName = (event.tool_name || event.tool) as string
            const args = event.args as Record<string, unknown> | undefined
            onDebugEvent?.('tool_call', { tool: toolName, args })

            // Build email draft card from call arguments — no need to wait for tool result
            if (toolName === 'draft_email' && args) {
              const draft = {
                to: (args.to as string[]) || [],
                subject: (args.subject as string) || '',
                body: (args.body as string) || '',
                cc: (args.cc as string[]) || [],
                attachments: (args.attachments as string[]) || [],
              }
              setMessages(prev => prev.map(m =>
                m.id !== assistantMsgId ? m : { ...m, emailDrafts: [...(m.emailDrafts || []), draft] }
              ))
            }

            // Determine display name, variant, and visibility
            let displayName = getToolDisplayName(toolName, language)
            let variant: ToolCallDisplay['variant'] = undefined
            let shouldShow = !SILENT_TOOLS.has(toolName)
            let detail: string | undefined = undefined

            if (toolName === 'read_file') {
              const filePath = (args?.file_path as string) || ''
              if (filePath.includes('SKILL.md')) {
                const parts = filePath.replace(/\\/g, '/').split('/')
                const skillName = parts[parts.length - 2] || 'skill'
                displayName = language === 'ja' ? `スキル: ${skillName}` : `Skill: ${skillName}`
                variant = 'skill'
                shouldShow = true
              } else {
                shouldShow = false
              }
            } else if (toolName === 'write_file') {
              const filePath = (args?.file_path as string) || ''
              const fileName = filePath.split('/').pop() || filePath
              displayName = language === 'ja' ? `作成: ${fileName}` : `Writing ${fileName}`
              variant = 'file'
              if (filePath) lastWriteFileRef.current = filePath
            } else if (toolName === 'web_search') {
              const query = ((args?.query as string) || (args?.q as string) || '').trim()
              if (query) {
                const truncated = query.length > 46 ? query.slice(0, 46) + '…' : query
                displayName = language === 'ja' ? `「${truncated}」を検索` : `Searching "${truncated}"`
              }
            } else if (toolName === 'execute') {
              const cmd = ((args?.command as string) || '').trim()
              const desc = ((args?.description as string) || '').trim()
              // Prefer human-readable description for the label; fall back to command
              const label = desc || cmd
              displayName = label.length > 52 ? label.slice(0, 52) + '…'
                : (label || (language === 'ja' ? 'スクリプトを実行中' : 'Running script'))
              variant = 'exec'
              // Expose the full command as expandable detail when it's non-trivial
              if (cmd && (cmd.length > 52 || (desc && desc !== cmd))) {
                detail = cmd
              }
            }

            // write_todos: upsert a todos block (never show a tool badge)
            if (toolName === 'write_todos' && args?.todos) {
              const todoItems: TodoItem[] = (args.todos as Record<string, unknown>[]).map(t => ({
                content: String(t.content || ''),
                status: (t.status as TodoItem['status']) || 'pending',
                activeForm: t.activeForm ? String(t.activeForm) : undefined,
              }))
              setMessages(prev => prev.map(m => {
                if (m.id !== assistantMsgId) return m
                const blocks: MessageBlock[] = [...(m.blocks || [])]
                const todosIdx = blocks.map((b, i) => b.type === 'todos' ? i : -1).filter(i => i >= 0).pop() ?? -1
                if (todosIdx >= 0) {
                  blocks[todosIdx] = { ...blocks[todosIdx], items: todoItems } as MessageBlock
                } else {
                  blocks.push({ type: 'todos', id: makeId(), items: todoItems })
                }
                return { ...m, blocks }
              }))
            } else if (shouldShow) {
              const toolId = makeId()
              setMessages(prev => prev.map(m => {
                if (m.id !== assistantMsgId) return m
                const newCall: ToolCallDisplay = {
                  id: toolId,
                  toolName,
                  displayName,
                  variant,
                  status: 'searching',
                  detail,
                }
                const blocks: MessageBlock[] = [...(m.blocks || []), { type: 'tool', id: toolId, call: newCall }]
                return { ...m, toolCalls: [...(m.toolCalls || []), newCall], blocks }
              }))
            }
          }

          else if (evType === 'tool_result') {
            const toolName = (event.tool_name || event.tool) as string
            onDebugEvent?.('tool_result', { tool: toolName, data: event.data })

            // Notify when a previewable file has been written
            if (toolName === 'write_file' && lastWriteFileRef.current) {
              const fp = lastWriteFileRef.current
              const ext = fp.split('.').pop()?.toLowerCase()
              if (ext === 'html' || ext === 'pptx') {
                onFileCreatedRef.current?.(`/api/files/${fp}`, ext as 'html' | 'pptx')
              }
              lastWriteFileRef.current = null
            }
            const data = event.data as Record<string, unknown> | undefined

            // Product carousel (ichiba / rakuma) — store by search_id; carousel block added via token
            if (data?.type === 'product_carousel') {
              const searchId = (event.handle as string) || (data.search_id as string)
              const rawProducts = (data.products as Record<string, unknown>[]) || []
              if (searchId && rawProducts.length > 0) {
                productStoreRef.current[searchId] = rawProducts.map(p => ({
                  productId: p.productId as string,
                  name: p.name as string,
                  price: p.price as number,
                  link: (p.link || p.url) as string,
                  imgUrl: p.imgUrl as string,
                  rating: p.rating as string,
                  reviewCount: p.reviewCount as number,
                  shopName: p.shopName as string,
                  shipping: p.shipping as string,
                })).filter(p => p.name)
              }
            }

            // Hotel carousel — insert block directly (no token needed)
            if (data?.type === 'hotel_carousel') {
              const rawHotels = (data.hotels as Record<string, unknown>[]) || []
              const hotels: Hotel[] = rawHotels.map(h => ({
                hotelId: h.hotelId as string,
                name: h.name as string,
                location: h.location as string,
                pricePerNight: h.pricePerNight as number,
                rating: h.rating as number,
                reviewCount: h.reviewCount as number,
                imgUrl: h.imgUrl as string,
                description: h.description as string,
                amenities: h.amenities as string[],
                roomType: h.roomType as string,
              })).filter(h => h.name)
              if (hotels.length > 0) {
                setMessages(prev => prev.map(m => {
                  if (m.id !== assistantMsgId) return m
                  const blocks: MessageBlock[] = [...(m.blocks || []), { type: 'hotel-carousel', id: makeId(), hotels }]
                  return { ...m, blocks }
                }))
              }
            }

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
              let finalToolCalls = toolCalls
              if (lastSearching && toolName && !toolCalls.find(tc => tc.toolName === toolName)) {
                const idx = toolCalls.lastIndexOf(lastSearching)
                finalToolCalls = [...toolCalls]
                finalToolCalls[idx] = { ...lastSearching, status: 'completed' }
              }
              // Mirror status updates in blocks
              const completedIds = new Set(finalToolCalls.filter(tc => tc.status === 'completed').map(tc => tc.id))
              const blocks: MessageBlock[] = (m.blocks || []).map(b => {
                if (b.type !== 'tool') return b
                if (completedIds.has(b.call.id) && b.call.status === 'searching') {
                  return { ...b, call: { ...b.call, status: 'completed' as const } }
                }
                return b
              })
              return {
                ...m,
                toolCalls: finalToolCalls,
                blocks,
                products: products && products.length > 0 ? products : m.products,
              }
            }))
          }

          else if (evType === 'tool_error') {
            const toolName = (event.tool_name || event.tool) as string
            onDebugEvent?.('tool_error', { tool: toolName, error: event.error })
            if (toolName === 'write_file') lastWriteFileRef.current = null
            if (SILENT_TOOLS.has(toolName)) continue
            setMessages(prev => prev.map(m => {
              if (m.id !== assistantMsgId) return m
              const toolCalls = (m.toolCalls || []).map(tc => {
                if (tc.toolName === toolName && tc.status === 'searching') {
                  return { ...tc, status: 'error' as const, error: event.error as string }
                }
                return tc
              })
              const blocks: MessageBlock[] = (m.blocks || []).map(b => {
                if (b.type !== 'tool') return b
                if (b.call.toolName === toolName && b.call.status === 'searching') {
                  return { ...b, call: { ...b.call, status: 'error' as const, error: event.error as string } }
                }
                return b
              })
              return { ...m, toolCalls, blocks }
            }))
          }

          else if (evType === 'done') {
            if (accumulatedContent) {
              onDebugEvent?.('llm_output', { role: 'assistant', content: accumulatedContent })
            }
            // Flush any buffered partial carousel token as plain text
            if (partialTokenRef.current) {
              const remaining = partialTokenRef.current
              partialTokenRef.current = null
              setMessages(prev => prev.map(m => {
                if (m.id !== assistantMsgId) return m
                const blocks: MessageBlock[] = [...(m.blocks || [])]
                const last = blocks[blocks.length - 1]
                if (last?.type === 'text') {
                  blocks[blocks.length - 1] = { ...last, content: last.content + remaining }
                } else if (remaining.trim()) {
                  blocks.push({ type: 'text', id: makeId(), content: remaining })
                }
                return { ...m, blocks }
              }))
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
              const blocks: MessageBlock[] = (m.blocks || []).map(b => {
                if (b.type !== 'tool') return b
                return b.call.status === 'searching'
                  ? { ...b, call: { ...b.call, status: 'completed' as const } }
                  : b
              })
              return {
                ...m,
                isStreaming: false,
                toolCalls,
                blocks,
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
  }, [sessionId, setSessionId, language, agentType, isLoading, setIsLoading, setMessages, onDebugEvent, userId])

  const cancelStreaming = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { sendMessage, cancelStreaming }
}

import React, { useRef, useEffect, useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import type { Message, MessageBlock, TodoItem, Language, DebugEvent } from '../types'
import { CONNECTORS } from '../data/connectors'
import { ConnectorModal } from './ConnectorModal'
import { useStreaming } from '../hooks/useStreaming'
import { AttachmentIcon, CameraIcon, ImageIcon, MicIcon, SendIcon } from './Icons'
import { NativeUserInputForm } from './NativeUserInputForm'
import { WidgetRenderer } from './WidgetRenderer'
import { EmailDraftCard } from './EmailDraftCard'
import { ProductCarousel } from './ProductCarousel'
import { HotelCarousel } from './HotelCarousel'

interface Props {
  sessionId: string | null
  setSessionId: (id: string) => void
  language: Language
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  agentType: string
  initialMessage?: string
  addedConnectors: Set<string>
  authorizedConnectors: Set<string>
  onToggleAddConnector: (id: string) => void
  onAuthorizeConnector: (id: string) => void
  onDebugEvent?: (type: DebugEvent['type'], data: unknown) => void
  userId?: string
  onMessageLimitReached?: (currentInput: string) => void
  initialImage?: string
  initialInput?: string
  subscriptionTier?: string
  /** When set, each user send (and the first auto-send) spends credits instead of the legacy 3-message free cap. */
  trySpendCredits?: (detail: string) => boolean
  onFileCreated?: (url: string, fileType: 'html' | 'pptx') => void
  onPreviewFile?: (url: string, fileType: 'html' | 'pptx') => void
}

const TOOL_ICONS: Record<string, string> = {
  search_emails: '/connectors/gmail.png',
  read_email: '/connectors/gmail.png',
  search_events: '/connectors/gcalendar.png',
  create_event: '/connectors/gcalendar.png',
  search_notes: '/connectors/kobo.png',
  read_note: '/connectors/kobo.png',
  draft_email: '/connectors/gmail.png',
}

const VARIANT_ICONS: Record<string, React.ReactNode> = {
  skill: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  exec: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
  file: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
}

function ToolCallBadge({ toolName, status, displayName, variant, detail }: {
  toolName: string; status: string; displayName: string; variant?: string; detail?: string
}) {
  const [expanded, setExpanded] = useState(false)

  const statusIcon = status === 'completed'
    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
    : status === 'error'
    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    : <span className="tool-dot" />

  const toolIcon = TOOL_ICONS[toolName]
  const variantIcon = variant ? VARIANT_ICONS[variant] : null

  return (
    <div className="tool-badge-wrap">
      <div className={`tool-call-indicator ${status} ${variant ? `variant-${variant}` : ''}`}>
        {statusIcon}
        {variantIcon && <span className="tool-variant-icon">{variantIcon}</span>}
        {!variantIcon && toolIcon && <img src={toolIcon} alt="" width="14" height="14" style={{ borderRadius: '3px', flexShrink: 0 }} />}
        <span>{displayName}</span>
        {detail && (
          <button
            type="button"
            className="tool-badge-expand-btn"
            onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            aria-expanded={expanded}
          >
            <svg
              width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        )}
      </div>
      {detail && expanded && (
        <div className="tool-badge-detail">{detail}</div>
      )}
    </div>
  )
}

function TodoListBlock({ items }: { items: TodoItem[] }) {
  return (
    <div className="todo-list-block">
      {items.map((item, i) => (
        <div key={i} className={`todo-item todo-item-${item.status}`}>
          <span className="todo-item-icon">
            {item.status === 'completed' ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ) : item.status === 'in_progress' ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>
            )}
          </span>
          <span className="todo-item-content">
            {item.status === 'in_progress' && item.activeForm ? item.activeForm : item.content}
          </span>
        </div>
      ))}
    </div>
  )
}

function makeMarkdownComponents(onPreviewFile?: (url: string, type: 'html' | 'pptx') => void) {
  return {
    a({ href, children }: { href?: string; children?: React.ReactNode }) {
      const isFileLink = href?.startsWith('/api/files/')
      const isHtmlFile = isFileLink && href?.endsWith('.html')
      const isPptxFile = isFileLink && href?.endsWith('.pptx')
      const isPreviewable = isHtmlFile || isPptxFile
      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        if (isPreviewable && onPreviewFile) {
          onPreviewFile(href!, isHtmlFile ? 'html' : 'pptx')
        } else {
          window.open(href, '_blank', 'noopener,noreferrer')
        }
      }
      return (
        <a
          href={href}
          onClick={handleClick}
          className={isFileLink ? 'chat-download-link' : 'chat-link'}
        >
          {isHtmlFile && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          )}
          {!isHtmlFile && isFileLink && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          )}
          {children}
        </a>
      )
    },
  }
}

function renderTextBlock(content: string, isLastBlock: boolean, isStreaming: boolean | undefined, onPreviewFile?: (url: string, type: 'html' | 'pptx') => void) {
  return (
    <div className="message-text">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={makeMarkdownComponents(onPreviewFile) as never}>
        {content}
      </ReactMarkdown>
      {isLastBlock && isStreaming && content && <span className="streaming-cursor" />}
    </div>
  )
}

function AssistantMessage({ msg, onPrompt, onPreviewFile, language }: { msg: Message; onPrompt: (text: string) => void; onPreviewFile?: (url: string, type: 'html' | 'pptx') => void; language?: 'ja' | 'en' }) {
  const blocks = msg.blocks
  const hasBlocks = blocks && blocks.length > 0
  const hasTextInBlocks = hasBlocks && blocks.some(b => b.type === 'text' && b.content)
  const lastBlock = hasBlocks ? blocks[blocks.length - 1] : undefined
  const lastToolDone = lastBlock?.type === 'tool' && lastBlock.call.status === 'completed'
  // Also show dots while write_file is in progress — the badge alone isn't enough feedback
  const lastBlockIsWritingFile = lastBlock?.type === 'tool' &&
    lastBlock.call.variant === 'file' && lastBlock.call.status === 'searching'
  const lastBlockIsCompletedSkill = lastBlock?.type === 'tool' &&
    lastBlock.call.variant === 'skill' && lastBlock.call.status === 'completed'
  const showLoadingDots = msg.isStreaming && (!hasTextInBlocks || lastToolDone || lastBlockIsWritingFile)

  const lastBlockName = lastBlock?.type === 'tool' ? (lastBlock.call.displayName ?? '') : ''
  const isPptxContext = lastBlockName.includes('make-presentation') || lastBlockName.includes('.pptx')
  const loadingLabel = lastBlockIsWritingFile
    ? (isPptxContext
        ? (language === 'ja' ? 'スライドを生成中…' : 'Building slides…')
        : (language === 'ja' ? 'コンテンツを生成中…' : 'Generating content…'))
    : lastBlockIsCompletedSkill
    ? (isPptxContext
        ? (language === 'ja' ? 'プレゼンを作成中…' : 'Building presentation…')
        : (language === 'ja' ? '記事を作成中…' : 'Creating article…'))
    : null

  return (
    <div className="message-assistant">
      <div className="assistant-avatar">
        <img src="/ai-avatar.svg" alt="AI" width="20" height="20" />
      </div>
      <div className="assistant-content">

        {/* Email draft compose cards (always shown above blocks) */}
        {msg.emailDrafts?.map((draft, i) => (
          <EmailDraftCard key={i} draft={draft} />
        ))}

        {/* UI Resources (user_input forms + show_widget iframes) */}
        {msg.uiResources?.map(res => (
          res.widgetType === 'html' && res.widgetHtml
            ? <WidgetRenderer key={res.handle} html={res.widgetHtml} onPrompt={onPrompt} />
            : res.formData
            ? <NativeUserInputForm key={res.handle} formData={res.formData as any} onSubmit={onPrompt} />
            : null
        ))}

        {/* Interleaved blocks: tool badges, text, todo lists */}
        {hasBlocks ? (
          <>
            {blocks.map((block: MessageBlock, idx: number) => {
              const isLast = idx === blocks.length - 1
              if (block.type === 'tool') {
                return (
                  <div key={block.id} style={{ marginBottom: '0.3rem' }}>
                    <ToolCallBadge toolName={block.call.toolName} status={block.call.status} displayName={block.call.displayName} variant={block.call.variant} detail={block.call.detail} />
                  </div>
                )
              }
              if (block.type === 'todos') {
                return <TodoListBlock key={block.id} items={block.items} />
              }
              if (block.type === 'carousel') {
                return <ProductCarousel key={block.id} products={block.products} language={language} />
              }
              if (block.type === 'hotel-carousel') {
                return <HotelCarousel key={block.id} hotels={block.hotels} language={language} />
              }
              if (block.type === 'text') {
                return <div key={block.id}>{renderTextBlock(block.content, isLast, msg.isStreaming, onPreviewFile)}</div>
              }
              return null
            })}
            {showLoadingDots && (
              <div className="loading-dots">
                <div className="loading-dot" />
                <div className="loading-dot" />
                <div className="loading-dot" />
                {loadingLabel && <span className="loading-label">{loadingLabel}</span>}
              </div>
            )}
          </>
        ) : (
          /* Fallback for messages without blocks (legacy) */
          <>
            {msg.toolCalls && msg.toolCalls.length > 0 && (
              <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {msg.toolCalls.map(tc => (
                  <ToolCallBadge key={tc.id} toolName={tc.toolName} status={tc.status} displayName={tc.displayName} variant={tc.variant} detail={tc.detail} />
                ))}
              </div>
            )}
            {(msg.content || msg.isStreaming) && (
              <div className="message-text">
                {msg.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={makeMarkdownComponents(onPreviewFile) as never}>
                    {msg.content}
                  </ReactMarkdown>
                ) : null}
                {msg.isStreaming && !msg.content && (
                  <div className="loading-dots">
                    <div className="loading-dot" />
                    <div className="loading-dot" />
                    <div className="loading-dot" />
                  </div>
                )}
                {msg.isStreaming && msg.content && <span className="streaming-cursor" />}
              </div>
            )}
          </>
        )}


      </div>
    </div>
  )
}

export function ChatView({
  sessionId, setSessionId, language, messages, setMessages,
  isLoading, setIsLoading, agentType, initialMessage,
  addedConnectors, authorizedConnectors, onToggleAddConnector, onAuthorizeConnector, onDebugEvent,
  userId, onMessageLimitReached, initialImage, initialInput, subscriptionTier, trySpendCredits, onFileCreated, onPreviewFile,
}: Props) {
  const [input, setInput] = useState(initialInput ?? '')
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [connModalOpen, setConnModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const initialSentRef = useRef(false)

  const { sendMessage, cancelStreaming } = useStreaming({
    sessionId, setSessionId, language, agentType,
    isLoading, setIsLoading, setMessages, onDebugEvent, userId, onFileCreated,
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send initial message from task "Have a Try" or home send-with-image
  useEffect(() => {
    if (initialMessage && !initialSentRef.current && messages.length === 0) {
      if (trySpendCredits && !trySpendCredits(language === 'ja' ? 'タスク' : 'Task query')) {
        onMessageLimitReached?.('')
        initialSentRef.current = true
        return
      }
      initialSentRef.current = true
      sendMessage(initialMessage, initialImage)
    }
  }, [initialMessage, initialImage, messages.length, sendMessage, trySpendCredits, language, onMessageLimitReached])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPendingImage(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSend = useCallback(() => {
    if ((!input.trim() && !pendingImage) || isLoading) return
    if (trySpendCredits) {
      if (!trySpendCredits(language === 'ja' ? 'チャット' : 'Chat')) {
        onMessageLimitReached?.(input)
        return
      }
    } else {
      const userMessageCount = messages.filter(m => m.role === 'user').length
      if (userMessageCount >= 3 && (!subscriptionTier || subscriptionTier === 'free') && onMessageLimitReached) {
        onMessageLimitReached(input)
        return
      }
    }
    const text = input
    const img = pendingImage
    setInput('')
    setPendingImage(null)
    sendMessage(text, img ?? undefined)
  }, [input, pendingImage, isLoading, messages, onMessageLimitReached, sendMessage, trySpendCredits, language, subscriptionTier])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const addedList = CONNECTORS.filter(c => addedConnectors.has(c.id))

  return (
    <div className="chat-view">
      <div className="chat-messages">
        {messages.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginTop: '4rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</div>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{language === 'ja' ? 'メッセージを送信してRakuten AIとチャットを始めましょう' : 'Send a message to start chatting with Rakuten AI'}</p>
          </div>
        )}
        {messages.map(msg =>
          msg.role === 'user' ? (
            <div key={msg.id} className="message-user">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="attached"
                  style={{
                    maxWidth: '260px',
                    maxHeight: '200px',
                    borderRadius: '12px',
                    marginBottom: msg.content ? '6px' : 0,
                    display: 'block',
                    marginLeft: 'auto',
                    objectFit: 'cover',
                  }}
                />
              )}
              {msg.content && <div className="bubble">{msg.content}</div>}
            </div>
          ) : (
            <AssistantMessage key={msg.id} msg={msg} onPrompt={sendMessage} onPreviewFile={onPreviewFile} language={language} />
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrap-outer">
          <div className="chat-input-wrap-inner">
            {/* Image preview */}
            {pendingImage && (
              <div style={{ position: 'relative', display: 'inline-block', margin: '0 0 8px 2px' }}>
                <img
                  src={pendingImage}
                  alt="preview"
                  style={{ height: '72px', width: '72px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => setPendingImage(null)}
                  style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: '#374151', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            )}

            {/* Connector chips */}
            {addedList.length > 0 && (
              <div className="conn-chip-bar" style={{ marginBottom: '0.5rem' }}>
                {addedList.map(c => (
                  <span key={c.id} className="conn-chip">
                    <span className="conn-chip-icon" dangerouslySetInnerHTML={{ __html: c.icon }} />
                    <span className="conn-chip-check">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <button
                      type="button"
                      className="conn-chip-close"
                      onClick={() => onToggleAddConnector(c.id)}
                      aria-label={`Remove ${c.name}`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder={language === 'ja' ? 'Rakuten AIに何でも聞いてみましょう…' : 'Ask Rakuten AI anything…'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ height: 'auto' }}
              onInput={e => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = Math.min(el.scrollHeight, 200) + 'px'
              }}
            />

            <div className="input-toolbar">
              <div className="input-toolbar-left">
                <span className="select-mock">
                  <img src="/fast-icon.svg" alt="" width="14" height="14" style={{ opacity: 0.6 }} />
                  Think deeper
                </span>
                <button type="button" className="conn-trigger-btn" onClick={() => setConnModalOpen(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v6M8 2v6M16 2v6"/>
                    <rect x="4" y="8" width="16" height="8" rx="2"/>
                    <path d="M12 16v4"/>
                    <path d="M8 20h8"/>
                  </svg>
                  Connectors
                </button>
              </div>
              <div className="input-actions">
                <label className="input-icon-btn" title="Attach file" style={{ cursor: 'pointer' }}>
                  <AttachmentIcon size={18} />
                  <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                </label>
                <label className="input-icon-btn" title="Camera" style={{ cursor: 'pointer' }}>
                  <CameraIcon size={18} />
                  <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                </label>
                <label className="input-icon-btn" title="Image" style={{ cursor: 'pointer' }}>
                  <ImageIcon size={18} />
                  <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                </label>
                <button type="button" className="input-icon-btn" title="Voice">
                  <MicIcon size={18} />
                </button>
                {isLoading ? (
                  <button type="button" className="send-btn" onClick={cancelStreaming} title="Stop">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                  </button>
                ) : (
                  <button type="button" className="send-btn" onClick={handleSend} disabled={!input.trim() && !pendingImage}>
                    <SendIcon size={16} color="white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConnectorModal
        open={connModalOpen}
        onClose={() => setConnModalOpen(false)}
        addedConnectors={addedConnectors}
        authorizedConnectors={authorizedConnectors}
        onToggleAdd={onToggleAddConnector}
        onAuthorize={onAuthorizeConnector}
      />
    </div>
  )
}

import React, { useRef, useEffect, useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import type { Message, Language, DebugEvent } from '../types'
import { CONNECTORS } from '../data/connectors'
import { ConnectorModal } from './ConnectorModal'
import { useStreaming } from '../hooks/useStreaming'
import { AttachmentIcon, CameraIcon, ImageIcon, MicIcon, SendIcon } from './Icons'
import { NativeUserInputForm } from './NativeUserInputForm'
import { WidgetRenderer } from './WidgetRenderer'

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
}

const TOOL_ICONS: Record<string, string> = {
  search_emails: '/connectors/gmail.png',
  read_email: '/connectors/gmail.png',
  create_event: '/connectors/gcalendar.png',
}

function ToolCallBadge({ toolName, status, displayName }: { toolName: string; status: string; displayName: string }) {
  const statusIcon = status === 'completed'
    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
    : status === 'error'
    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    : <span className="tool-dot" />

  const toolIcon = TOOL_ICONS[toolName]

  return (
    <div className={`tool-call-indicator ${status}`}>
      {statusIcon}
      {toolIcon && <img src={toolIcon} alt="" width="14" height="14" style={{ borderRadius: '3px', flexShrink: 0 }} />}
      <span>{displayName}</span>
    </div>
  )
}

function AssistantMessage({ msg, onPrompt }: { msg: Message; onPrompt: (text: string) => void }) {
  return (
    <div className="message-assistant">
      <div className="assistant-avatar">
        <img src="/ai-avatar.svg" alt="AI" width="20" height="20" />
      </div>
      <div className="assistant-content">
        {/* Tool calls */}
        {msg.toolCalls && msg.toolCalls.length > 0 && (
          <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {msg.toolCalls.map(tc => (
              <ToolCallBadge key={tc.id} toolName={tc.toolName} status={tc.status} displayName={tc.displayName} />
            ))}
          </div>
        )}

        {/* UI Resources (user_input forms + show_widget iframes) */}
        {msg.uiResources?.map(res => (
          res.widgetType === 'html' && res.widgetHtml
            ? <WidgetRenderer key={res.handle} html={res.widgetHtml} onPrompt={onPrompt} />
            : res.formData
            ? <NativeUserInputForm key={res.handle} formData={res.formData as any} onSubmit={onPrompt} />
            : null
        ))}

        {/* Text content */}
        {(msg.content || msg.isStreaming) && (
          <div className="message-text">
            {msg.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
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
            {msg.isStreaming && msg.content && (
              <span className="streaming-cursor" />
            )}
          </div>
        )}

        {/* Products */}
        {msg.products && msg.products.length > 0 && (
          <div className="product-grid">
            {msg.products.slice(0, 6).map(p => (
              <a
                key={p.productId || p.name}
                href={p.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="product-card-mini"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {p.imgUrl && <img src={p.imgUrl} alt={p.name} loading="lazy" />}
                <div className="product-card-mini-body">
                  <div className="product-card-mini-name">{p.name}</div>
                  {p.price && (
                    <div className="product-card-mini-price">¥{p.price.toLocaleString()}</div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function ChatView({
  sessionId, setSessionId, language, messages, setMessages,
  isLoading, setIsLoading, agentType, initialMessage,
  addedConnectors, authorizedConnectors, onToggleAddConnector, onAuthorizeConnector, onDebugEvent,
  userId,
}: Props) {
  const [input, setInput] = useState('')
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [connModalOpen, setConnModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const initialSentRef = useRef(false)

  const { sendMessage, cancelStreaming } = useStreaming({
    sessionId, setSessionId, language, agentType,
    isLoading, setIsLoading, setMessages, onDebugEvent, userId,
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send initial message from task "Have a Try"
  useEffect(() => {
    if (initialMessage && !initialSentRef.current && messages.length === 0) {
      initialSentRef.current = true
      sendMessage(initialMessage)
    }
  }, [initialMessage, messages.length, sendMessage])

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
    const text = input
    const img = pendingImage
    setInput('')
    setPendingImage(null)
    sendMessage(text, img ?? undefined)
  }, [input, pendingImage, isLoading, sendMessage])

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
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Send a message to start chatting with Rakuten AI</p>
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
            <AssistantMessage key={msg.id} msg={msg} onPrompt={sendMessage} />
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
              placeholder="Ask Rakuten AI anything…"
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

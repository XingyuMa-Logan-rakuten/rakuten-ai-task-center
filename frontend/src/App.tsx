import React, { useState, useCallback } from 'react'

function getOrCreateUserId(): string {
  let id = localStorage.getItem('rakuten_ai_user_id')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('rakuten_ai_user_id', id) }
  return id
}
const USER_ID = getOrCreateUserId()
import type { Task, Message, AppView, Language, DebugEvent } from './types'
import { TASK_CATALOG, TASK_CATEGORIES } from './data/tasks'
import { CONNECTORS } from './data/connectors'
import { TaskModal } from './components/TaskModal'
import { ConnectorModal } from './components/ConnectorModal'
import { ChatView } from './components/ChatView'
import { GalleryView } from './components/GalleryView'
import { MyTasksView } from './components/MyTasksView'
import { FloatingDevWindow } from './components/FloatingDevWindow'
import { AttachmentIcon, CameraIcon, ImageIcon, MicIcon, SendIcon } from './components/Icons'
import { TaskCover } from './components/TaskCover'

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({
  view, onNavigate, language, onLanguageChange, onNewChat, devMode, onToggleDevMode,
}: {
  view: AppView
  onNavigate: (v: AppView) => void
  language: Language
  onLanguageChange: (l: Language) => void
  onNewChat: () => void
  devMode: boolean
  onToggleDevMode: () => void
}) {
  const [langOpen, setLangOpen] = useState(false)

  return (
    <aside className="sidebar">
      <div className="sidebar-top-row">
        <img src="/rakuten-ai-logo.svg" alt="Rakuten AI" className="sidebar-logo" />
        <button type="button" className="sidebar-grid-btn" aria-label="Grid view" onClick={() => onNavigate('gallery')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>
      </div>

      <button type="button" className="btn-new-chat" onClick={onNewChat}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        New Chat
      </button>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Rakuten Agents
          </div>
          <div className={`sidebar-item ${view === 'home' || view === 'chat' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            <span className="sidebar-item-icon">🅁</span>Rakuten AI
          </div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🛒</span>Rakuten Ichiba</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">✈️</span>Rakuten Travel</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🎵</span>Rakuten Music</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">📱</span>Rakuten Mobile</div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Daily Essentials
          </div>
          <div className={`sidebar-item ${view === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            <span className="sidebar-item-icon">🔍</span>AI Search
          </div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🖼</span>Image Creator</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🎬</span>Video Creator</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🌐</span>AI Translator</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🧩</span>Problem Solver</div>
          <div className="sidebar-show-more sidebar-item"><span className="sidebar-item-icon">▾</span>Show more</div>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-link-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          AI Community
          <span className="sidebar-link-action">Enter ›</span>
        </div>
        <div className="sidebar-link-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          Favorites
        </div>
        <div className="sidebar-link-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Chat history
          <span className="sidebar-link-action">See all ›</span>
        </div>

        <button
          type="button"
          onClick={onToggleDevMode}
          className="sidebar-link-row"
          style={{
            width: '100%',
            background: devMode ? 'rgba(109,40,217,0.08)' : 'none',
            border: devMode ? '1px solid rgba(109,40,217,0.2)' : '1px solid transparent',
            borderRadius: '6px',
            color: devMode ? '#6d28d9' : undefined,
            cursor: 'pointer',
            marginBottom: '4px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          Developer Mode
        </button>

        <div className="lang-switcher">
          <button type="button" className="lang-toggle" onClick={() => setLangOpen(v => !v)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            <span className="lang-current">{language === 'ja' ? '日本語' : 'English'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {langOpen && (
            <div className="lang-dropdown">
              <button type="button" className={`lang-option ${language === 'ja' ? 'active' : ''}`} onClick={() => { onLanguageChange('ja'); setLangOpen(false) }}>日本語</button>
              <button type="button" className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => { onLanguageChange('en'); setLangOpen(false) }}>English</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

// ── Top Bar ────────────────────────────────────────────────────────────────
function TopBar({ onMyTask }: { onMyTask: () => void }) {
  return (
    <header className="top-bar">
      <div className="top-bar-right">
        <button type="button" className="btn-my-task" onClick={onMyTask}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          My Task
        </button>
        <button type="button" className="top-icon-btn" aria-label="Voice call">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </button>
        <button type="button" className="top-icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
        <button type="button" className="btn-primary">Sign in</button>
      </div>
    </header>
  )
}

// ── Home View ──────────────────────────────────────────────────────────────
function HomeView({
  onSend, onTaskClick, onShowGallery, onOpenConnectors, addedConnectors,
  onToggleAddConnector,
}: {
  onSend: (text: string) => void
  onTaskClick: (task: Task) => void
  onShowGallery: () => void
  onOpenConnectors: () => void
  addedConnectors: Set<string>
  onToggleAddConnector: (id: string) => void
}) {
  const [input, setInput] = useState('')

  const featuredTasks = TASK_CATALOG.filter(t => t.featured).slice(0, 3)
  const displayTasks = featuredTasks.length >= 3 ? featuredTasks : TASK_CATALOG.slice(0, 3)

  const typeClass = (type: string) =>
    type === 'multi-step' ? 'multi-step' : type === 'schedule' ? 'schedule' : 'simple'
  const typeLabel = (type: string) =>
    type === 'multi-step' ? 'Multi-step' : type === 'schedule' ? 'Schedule' : 'Simple'

  const addedList = CONNECTORS.filter(c => addedConnectors.has(c.id))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        onSend(input.trim())
        setInput('')
      }
    }
  }

  const handleSendClick = () => {
    if (input.trim()) {
      onSend(input.trim())
      setInput('')
    }
  }

  const QUICK_PILLS = [
    { icon: '🔍', label: 'AI Search' },
    { icon: '🖼', label: 'Image Creator' },
    { icon: '🎬', label: 'Video Creator' },
    { icon: '🌐', label: 'AI Translator' },
    { icon: '🧩', label: 'Problem Solver' },
    { icon: '📝', label: 'AI Summarizer' },
    { icon: '✍️', label: 'Writing Assistant' },
    { icon: '💻', label: 'Coding Assistant' },
  ]

  return (
    <div className="content view-enter">
      <h1 className="greeting">Hi, how can I help you?</h1>

      <div className="input-wrap-outer">
        <div className="input-wrap-inner">
          {/* Connector chips */}
          {addedList.length > 0 && (
            <div className="conn-chip-bar">
              {addedList.map(c => (
                <span key={c.id} className="conn-chip">
                  <span className="conn-chip-icon" dangerouslySetInnerHTML={{ __html: c.icon }} />
                  <span className="conn-chip-check">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <button type="button" className="conn-chip-close" onClick={() => onToggleAddConnector(c.id)} aria-label={`Remove ${c.name}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          <textarea
            className="chat-textarea"
            placeholder="Input message here"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
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
              <button type="button" className="conn-trigger-btn" onClick={onOpenConnectors}>
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
              <button type="button" className="input-icon-btn" title="Attach file">
                <AttachmentIcon size={18} />
              </button>
              <button type="button" className="input-icon-btn" title="Camera">
                <CameraIcon size={18} />
              </button>
              <button type="button" className="input-icon-btn" title="Image">
                <ImageIcon size={18} />
              </button>
              <button type="button" className="input-icon-btn" title="Voice">
                <MicIcon size={18} />
              </button>
              <button type="button" className="send-btn" onClick={handleSendClick} disabled={!input.trim()}>
                <SendIcon size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-action-pills">
        {QUICK_PILLS.map(p => (
          <button
            key={p.label}
            type="button"
            className="quick-pill"
            onClick={() => onSend(p.label)}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      <section className="task-center-section" aria-labelledby="taskCenterHeading">
        <div className="task-center-head">
          <h2 id="taskCenterHeading" className="task-center-title">Task Center</h2>
          <button type="button" className="btn-ghost" onClick={onShowGallery}>Browse all →</button>
        </div>
        <div className="task-card-grid">
          {displayTasks.map(task => (
            <div key={task.id} className="task-card" onClick={() => onTaskClick(task)}>
              <TaskCover coverUrl={task.cover} className="task-card-cover">
                {task.hot && <span className="hot-badge hot-badge--card">HOT</span>}
                {task.featuredBadge && (
                  <span className={`featured-badge ${task.category === 'japan' ? 'featured-badge--japan' : ''}`}>
                    {task.featuredBadge}
                  </span>
                )}
              </TaskCover>
              <div className="task-card-body">
                <div className="task-card-title">{task.title}</div>
                <span className={`type-pill ${typeClass(task.type)}`}>{typeLabel(task.type)}</span>
              </div>
            </div>
          ))}

          {/* View more card */}
          <div className="task-card task-card--view-more" onClick={onShowGallery}>
            <div className="view-more-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <span>View all {TASK_CATALOG.length} tasks</span>
            </div>
          </div>
        </div>
      </section>

      <p className="footer-note">
        <span className="beta-badge">BETA</span>
        Please adhere to <a href="#">the precautions</a> when using this feature. This feature can only be used if you agree to the precautions. <a href="#">Hide</a>
      </p>
    </div>
  )
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<AppView>('home')
  const [language, setLanguage] = useState<Language>('ja')
  const [agentType] = useState('mcpui')

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>()

  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [connModalOpen, setConnModalOpen] = useState(false)

  // Connectors
  const [authorizedConnectors, setAuthorizedConnectors] = useState<Set<string>>(new Set())
  const [addedConnectors, setAddedConnectors] = useState<Set<string>>(new Set())

  const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([])
  const [showDevWindow, setShowDevWindow] = useState(false)

  const addDebugEvent = useCallback((type: DebugEvent['type'], data: unknown) => {
    setDebugEvents(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      timestamp: new Date(),
      type,
      data,
    }])
  }, [])

  const handleAuthorizeConnector = useCallback((id: string) => {
    setAuthorizedConnectors(prev => new Set([...prev, id]))
  }, [])

  const handleToggleAddConnector = useCallback((id: string) => {
    setAddedConnectors(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (authorizedConnectors.has(id)) next.add(id)
      return next
    })
  }, [authorizedConnectors])

  const handleNewChat = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setInitialChatMessage(undefined)
    setView('home')
  }, [])

  const handleSendFromHome = useCallback((text: string) => {
    setMessages([])
    setSessionId(null)
    setInitialChatMessage(text)
    setView('chat')
  }, [])

  const handleHaveATry = useCallback((task: Task) => {
    const query = task.sampleQueries?.[0] || `Help me with: ${task.title}`
    setMessages([])
    setSessionId(null)
    setInitialChatMessage(query)
    setView('chat')
  }, [])

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task)
  }, [])

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        onNavigate={setView}
        language={language}
        onLanguageChange={setLanguage}
        onNewChat={handleNewChat}
        devMode={showDevWindow}
        onToggleDevMode={() => setShowDevWindow(v => !v)}
      />

      <div className="main">
        <TopBar onMyTask={() => setView('my-tasks')} />

        {/* Home View */}
        {view === 'home' && (
          <HomeView
            onSend={handleSendFromHome}
            onTaskClick={handleTaskClick}
            onShowGallery={() => setView('gallery')}
            onOpenConnectors={() => setConnModalOpen(true)}
            addedConnectors={addedConnectors}
            onToggleAddConnector={handleToggleAddConnector}
          />
        )}

        {/* Chat View */}
        {view === 'chat' && (
          <ChatView
            sessionId={sessionId}
            setSessionId={setSessionId}
            language={language}
            messages={messages}
            setMessages={setMessages}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            agentType={agentType}
            initialMessage={initialChatMessage}
            addedConnectors={addedConnectors}
            authorizedConnectors={authorizedConnectors}
            onToggleAddConnector={handleToggleAddConnector}
            onAuthorizeConnector={handleAuthorizeConnector}
            onDebugEvent={addDebugEvent}
            userId={USER_ID}
          />
        )}

        {/* Gallery View */}
        {view === 'gallery' && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <GalleryView
              onBack={() => setView(messages.length > 0 ? 'chat' : 'home')}
              onTaskClick={handleTaskClick}
            />
          </div>
        )}

        {/* My Tasks View */}
        {view === 'my-tasks' && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <MyTasksView
              onBack={() => setView(messages.length > 0 ? 'chat' : 'home')}
            />
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onHaveATry={handleHaveATry}
        />
      )}

      {/* Connector Modal (home page) */}
      <ConnectorModal
        open={connModalOpen}
        onClose={() => setConnModalOpen(false)}
        addedConnectors={addedConnectors}
        authorizedConnectors={authorizedConnectors}
        onToggleAdd={handleToggleAddConnector}
        onAuthorize={handleAuthorizeConnector}
      />

      {/* Developer Mode floating window */}
      {showDevWindow && (
        <FloatingDevWindow
          events={debugEvents}
          onClear={() => setDebugEvents([])}
          onClose={() => setShowDevWindow(false)}
        />
      )}
    </div>
  )
}

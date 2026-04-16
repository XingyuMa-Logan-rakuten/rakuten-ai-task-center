import React, { useState, useCallback, useRef } from 'react'

function getOrCreateUserId(): string {
  let id = localStorage.getItem('rakuten_ai_user_id')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('rakuten_ai_user_id', id) }
  return id
}
const USER_ID = getOrCreateUserId()
import type { Task, Message, AppView, Language, DebugEvent, SubscriptionTier, ActiveTask, CreditHistoryEntry } from './types'
import { TASK_CATALOG, TASK_CATEGORIES, MY_ACTIVE_TASKS } from './data/tasks'
import { CONNECTORS } from './data/connectors'
import { TaskModal } from './components/TaskModal'
import { ConnectorModal } from './components/ConnectorModal'
import { ChatView } from './components/ChatView'
import { GalleryView } from './components/GalleryView'
import { MyTasksView } from './components/MyTasksView'
import { FloatingDevWindow } from './components/FloatingDevWindow'
import { UserProfileMenu } from './components/UserProfileMenu'
import { UsageLimitModal } from './components/UsageLimitModal'
import { SubscriptionPage } from './components/SubscriptionPage'
import { Toast } from './components/Toast'
import { TaskCover } from './components/TaskCover'
import { CreditsPage } from './components/CreditsPage'
import { AttachmentIcon, CameraIcon, ImageIcon, MicIcon, SendIcon, UpgradeSparkleIcon } from './components/Icons'
import { TIER_CREDITS, randomQueryCost } from './subscriptionUtils'
import { NotesToActionComposer } from './components/NotesToActionComposer'
import type { OutputType } from './components/NotesToActionComposer'
import { PreviewPanel } from './components/PreviewPanel'
import type { PreviewFileType } from './components/PreviewPanel'

// ── Sidebar i18n ───────────────────────────────────────────────────────────
const SIDEBAR_I18N = {
  ja: {
    newChat: '新規チャット',
    agentsSection: '楽天AIエージェント',
    rakutenAI: '楽天AI',
    rakutenIchiba: '楽天市場',
    rakutenTravel: '楽天トラベル',
    rakutenMusic: '楽天ミュージック',
    rakutenMobile: '楽天モバイル',
    essentialsSection: '便利ツール',
    aiSearch: '検索',
    imageCreator: '画像を作る',
    videoCreator: '動画を作る',
    aiTranslator: '翻訳',
    problemSolver: '問題を解く',
    showMore: 'もっと見る',
    aiCommunity: 'AIコミュニティー',
    enter: '入る ›',
    favorites: 'お気に入り',
    chatHistory: 'チャット履歴',
    seeAll: 'すべて表示 ›',
    developerMode: 'デベロッパーモード',
  },
  en: {
    newChat: 'New Chat',
    agentsSection: 'Rakuten Agents',
    rakutenAI: 'Rakuten AI',
    rakutenIchiba: 'Rakuten Ichiba',
    rakutenTravel: 'Rakuten Travel',
    rakutenMusic: 'Rakuten Music',
    rakutenMobile: 'Rakuten Mobile',
    essentialsSection: 'Daily Essentials',
    aiSearch: 'AI Search',
    imageCreator: 'Image Creator',
    videoCreator: 'Video Creator',
    aiTranslator: 'AI Translator',
    problemSolver: 'Problem Solver',
    showMore: 'Show more',
    aiCommunity: 'AI Community',
    enter: 'Enter ›',
    favorites: 'Favorites',
    chatHistory: 'Chat history',
    seeAll: 'See all ›',
    developerMode: 'Developer Mode',
  },
}

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
  const t = SIDEBAR_I18N[language] ?? SIDEBAR_I18N.en

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
        {t.newChat}
      </button>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {t.agentsSection}
          </div>
          <div className={`sidebar-item ${view === 'home' || view === 'chat' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            <span className="sidebar-item-icon">🅁</span>{t.rakutenAI}
          </div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🛒</span>{t.rakutenIchiba}</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">✈️</span>{t.rakutenTravel}</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🎵</span>{t.rakutenMusic}</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">📱</span>{t.rakutenMobile}</div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            {t.essentialsSection}
          </div>
          <div className={`sidebar-item ${view === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            <span className="sidebar-item-icon">🔍</span>{t.aiSearch}
          </div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🖼</span>{t.imageCreator}</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🎬</span>{t.videoCreator}</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🌐</span>{t.aiTranslator}</div>
          <div className="sidebar-item"><span className="sidebar-item-icon">🧩</span>{t.problemSolver}</div>
          <div className="sidebar-show-more sidebar-item"><span className="sidebar-item-icon">▾</span>{t.showMore}</div>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-link-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          {t.aiCommunity}
          <span className="sidebar-link-action">{t.enter}</span>
        </div>
        <div className="sidebar-link-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          {t.favorites}
        </div>
        <div className="sidebar-link-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {t.chatHistory}
          <span className="sidebar-link-action">{t.seeAll}</span>
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
          {t.developerMode}
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
function TopBar({
  onMyTask,
  onUpgrade,
  userName,
  subscriptionTier,
  credits,
  maxCredits,
  onSettings,
  onLogout,
  chatLeft,
}: {
  onMyTask: () => void
  onUpgrade: () => void
  userName: string
  subscriptionTier: SubscriptionTier
  credits: number
  maxCredits: number
  onSettings: () => void
  onLogout: () => void
  chatLeft?: {
    title: string
    onBack: () => void
    taskId: string | null
    onAddToMyTask?: () => void
    taskAlreadyInMyTasks?: boolean
  } | null
}) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {chatLeft && (
          <div className="top-bar-chat-head">
            <button type="button" className="top-bar-back" onClick={chatLeft.onBack} aria-label="Back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="top-bar-chat-title" title={chatLeft.title}>
              {chatLeft.title}
            </span>
            {chatLeft.taskId && chatLeft.onAddToMyTask && (
              <span
                className={`top-bar-add-task-wrap ${chatLeft.taskAlreadyInMyTasks ? 'top-bar-add-task-wrap--saved' : ''}`}
                data-tooltip={
                  chatLeft.taskAlreadyInMyTasks
                    ? undefined
                    : 'Add to My Task — save this task to your list'
                }
              >
                <button
                  type="button"
                  className={`top-bar-add-task-btn ${chatLeft.taskAlreadyInMyTasks ? 'top-bar-add-task-btn--saved' : ''}`}
                  onClick={e => {
                    e.stopPropagation()
                    chatLeft.onAddToMyTask?.()
                  }}
                  aria-label="Add to my task"
                  aria-pressed={chatLeft.taskAlreadyInMyTasks}
                >
                  {chatLeft.taskAlreadyInMyTasks ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="top-bar-add-task-icon" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="top-bar-add-task-icon" aria-hidden>
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </span>
            )}
          </div>
        )}
      </div>
      <div className="top-bar-right">
        <button type="button" className="btn-my-task" onClick={onMyTask}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          My Task
        </button>
        <button type="button" className="btn-upgrade-top" onClick={onUpgrade}>
          <UpgradeSparkleIcon size={14} />
          Upgrade
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
        <UserProfileMenu
          userName={userName}
          subscriptionTier={subscriptionTier}
          credits={credits}
          maxCredits={maxCredits}
          onSettings={onSettings}
          onLogout={onLogout}
        />
      </div>
    </header>
  )
}

// ── Home View ──────────────────────────────────────────────────────────────
const HOME_I18N = {
  ja: {
    greeting: 'こんにちは、何かお手伝いできますか？',
    placeholder: 'メッセージを入力してください',
    taskCenter: 'タスクセンター',
    browseAll: 'すべて見る →',
    typeLabels: { 'multi-step': 'マルチステップ', 'schedule': 'スケジュール', 'simple': 'シンプル' },
    pills: [
      { icon: '🔍', label: 'AI検索' },
      { icon: '🖼', label: '画像生成' },
      { icon: '🎬', label: '動画生成' },
      { icon: '🌐', label: 'AI翻訳' },
      { icon: '🧩', label: '問題解決' },
      { icon: '📝', label: 'AI要約' },
      { icon: '✍️', label: 'ライティング' },
      { icon: '💻', label: 'コーディング' },
    ],
  },
  en: {
    greeting: 'Hi, how can I help you?',
    placeholder: 'Input message here',
    taskCenter: 'Task Center',
    browseAll: 'Browse all →',
    typeLabels: { 'multi-step': 'Multi-step', 'schedule': 'Schedule', 'simple': 'Simple' },
    pills: [
      { icon: '🔍', label: 'AI Search' },
      { icon: '🖼', label: 'Image Creator' },
      { icon: '🎬', label: 'Video Creator' },
      { icon: '🌐', label: 'AI Translator' },
      { icon: '🧩', label: 'Problem Solver' },
      { icon: '📝', label: 'AI Summarizer' },
      { icon: '✍️', label: 'Writing Assistant' },
      { icon: '💻', label: 'Coding Assistant' },
    ],
  },
}

function HomeView({
  onSend, onTaskClick, onShowGallery, onOpenConnectors, addedConnectors,
  onToggleAddConnector, language,
}: {
  onSend: (text: string, image?: string) => void
  onTaskClick: (task: Task) => void
  onShowGallery: () => void
  onOpenConnectors: () => void
  addedConnectors: Set<string>
  onToggleAddConnector: (id: string) => void
  language: Language
}) {
  const [input, setInput] = useState('')
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const t = HOME_I18N[language] ?? HOME_I18N.en

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPendingImage(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const featuredTasks = TASK_CATALOG.filter(t => t.featured).slice(0, 3)
  const displayTasks = featuredTasks.length >= 3 ? featuredTasks : TASK_CATALOG.slice(0, 3)

  const typeClass = (type: string) =>
    type === 'multi-step' ? 'multi-step' : type === 'schedule' ? 'schedule' : 'simple'
  const typeLabel = (type: string) =>
    t.typeLabels[type as keyof typeof t.typeLabels] ?? type

  const addedList = CONNECTORS.filter(c => addedConnectors.has(c.id))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() || pendingImage) {
        onSend(input.trim(), pendingImage ?? undefined)
        setInput('')
        setPendingImage(null)
      }
    }
  }

  const handleSendClick = () => {
    if (input.trim() || pendingImage) {
      onSend(input.trim(), pendingImage ?? undefined)
      setInput('')
      setPendingImage(null)
    }
  }

  return (
    <div className="content view-enter">
      <h1 className="greeting">{t.greeting}</h1>

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

          <textarea
            className="chat-textarea"
            placeholder={t.placeholder}
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
              <button type="button" className="send-btn" onClick={handleSendClick} disabled={!input.trim() && !pendingImage}>
                <SendIcon size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-action-pills">
        {t.pills.map(p => (
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
          <h2 id="taskCenterHeading" className="task-center-title">{t.taskCenter}</h2>
          <button type="button" className="btn-ghost" onClick={onShowGallery}>{t.browseAll}</button>
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
  const [initialChatImage, setInitialChatImage] = useState<string | undefined>()
  /** Shown in top bar on chat view (task title or generic chat label). */
  const [chatContextTitle, setChatContextTitle] = useState('Rakuten AI')
  /** Set when entering chat from Task Center "Have a try"; null for generic home → chat. */
  const [activeChatTaskId, setActiveChatTaskId] = useState<string | null>(null)
  /** User-added rows merged into My Task list (in-memory). */
  const [userAddedMyTasks, setUserAddedMyTasks] = useState<ActiveTask[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [notesToActionOpen, setNotesToActionOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewFileType, setPreviewFileType] = useState<PreviewFileType | null>(null)

  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [connModalOpen, setConnModalOpen] = useState(false)

  // Connectors
  const [authorizedConnectors, setAuthorizedConnectors] = useState<Set<string>>(new Set())
  const [addedConnectors, setAddedConnectors] = useState<Set<string>>(new Set())

  const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([])
  const [showDevWindow, setShowDevWindow] = useState(false)

  /** In-memory subscription + usage; cleared on full page refresh. */
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free')
  const [credits, setCredits] = useState<number>(TIER_CREDITS['free'])
  const [creditHistory, setCreditHistory] = useState<CreditHistoryEntry[]>([])
  const creditsRef = useRef(credits)
  creditsRef.current = credits
  const [usageLimitModalOpen, setUsageLimitModalOpen] = useState(false)
  const [returnView, setReturnView] = useState<AppView>('home')
  const [preservedChatInput, setPreservedChatInput] = useState('')
  const userDisplayName = 'Kerry1234'

  const addDebugEvent = useCallback((type: DebugEvent['type'], data: unknown) => {
    setDebugEvents(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      timestamp: new Date(),
      type,
      data,
    }])
  }, [])

  const trySpendCredits = useCallback((detail: string): boolean => {
    const prev = creditsRef.current
    if (prev <= 0) {
      setUsageLimitModalOpen(true)
      return false
    }
    const cost = randomQueryCost()
    const next = Math.max(0, prev - cost)
    creditsRef.current = next
    setCredits(next)
    setCreditHistory(h => [{
      id: Math.random().toString(36).slice(2),
      detail,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      change: -cost,
    }, ...h])
    if (next === 0) setUsageLimitModalOpen(true)
    return true
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
    setInitialChatImage(undefined)
    setChatContextTitle('Rakuten AI')
    setActiveChatTaskId(null)
    setView('home')
  }, [])

  const handleSendFromHome = useCallback((text: string, image?: string) => {
    setMessages([])
    setSessionId(null)
    setInitialChatMessage(text)
    setInitialChatImage(image)
    setChatContextTitle(language === 'ja' ? 'Rakuten AI チャット' : 'Chat with Rakuten AI')
    setActiveChatTaskId(null)
    setView('chat')
  }, [language])

  const handleHaveATry = useCallback((task: Task) => {
    if (credits <= 0) {
      setUsageLimitModalOpen(true)
      return
    }
    const query = task.sampleQueries?.[0] || `Help me with: ${task.title}`
    setMessages([])
    setSessionId(null)
    setInitialChatMessage(query)
    setChatContextTitle(task.title)
    setActiveChatTaskId(task.id)
    setView('chat')
  }, [credits])

  const handleBackFromChat = useCallback(() => {
    setView('home')
  }, [])

  const handleAddToMyTask = useCallback(() => {
    if (!activeChatTaskId) return
    let didAdd = false
    setUserAddedMyTasks(prev => {
      if (
        MY_ACTIVE_TASKS.some(t => t.id === activeChatTaskId) ||
        prev.some(t => t.id === activeChatTaskId)
      ) {
        return prev
      }
      didAdd = true
      return [
        ...prev,
        {
          id: activeChatTaskId,
          status: 'running',
          lastRun: new Date().toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }),
        },
      ]
    })
    setToastMessage(didAdd ? 'Added to My Task.' : 'This task is already in My Task.')
  }, [activeChatTaskId])

  const taskAlreadyInMyTasks =
    !!activeChatTaskId &&
    (MY_ACTIVE_TASKS.some(t => t.id === activeChatTaskId) ||
      userAddedMyTasks.some(t => t.id === activeChatTaskId))

  const handleFileCreated = useCallback((url: string, fileType: PreviewFileType) => {
    setPreviewUrl(url)
    setPreviewFileType(fileType)
    setPreviewOpen(true)
  }, [])

  const handlePreviewFile = useCallback((url: string, fileType: PreviewFileType) => {
    setPreviewUrl(url)
    setPreviewFileType(fileType)
    setPreviewOpen(true)
  }, [])

  const handleTaskClick = useCallback((task: Task) => {
    if (task.id === 'notes-to-action') {
      setNotesToActionOpen(true)
    } else {
      setSelectedTask(task)
    }
  }, [])

  const handleNotesToAction = useCallback((text: string, image: string | null, outputType: OutputType) => {
    const filePart = image ? " (see the image I've attached)" : ''
    const textPart = text ? `\n\nNotes:\n${text}` : ''
    let prompt: string
    if (outputType === 'email') {
      prompt = `Please draft an email for me${filePart}.${textPart}`
    } else {
      const descs: Record<Exclude<OutputType, 'email'>, string> = {
        pptx: 'PowerPoint presentation',
        html: 'beautiful self-contained HTML article',
        doc:  'well-formatted document',
      }
      prompt = `Please create a ${descs[outputType]}${filePart}.${textPart}`
    }
    setNotesToActionOpen(false)
    setMessages([])
    setSessionId(null)
    setInitialChatMessage(prompt)
    setInitialChatImage(image ?? undefined)
    setChatContextTitle('Notes to Action')
    setActiveChatTaskId('notes-to-action')
    setView('chat')
  }, [])

  const openSubscriptionPage = useCallback(() => {
    setView(v => {
      if (v !== 'subscription') setReturnView(v)
      return 'subscription'
    })
  }, [])

  const handleSelectPlan = useCallback((tier: SubscriptionTier) => {
    setSubscriptionTier(tier)
    const grant = TIER_CREDITS[tier]
    setCredits(grant)
    creditsRef.current = grant
    setCreditHistory(h => [{
      id: Math.random().toString(36).slice(2),
      detail: `Subscribed to ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      change: grant,
    }, ...h])
    setView(returnView)
    // Clear the preserved input after ChatView has mounted and consumed it
    setTimeout(() => setPreservedChatInput(''), 0)
  }, [returnView])

  const handleSubscriptionBack = useCallback(() => {
    setView(returnView)
  }, [returnView])

  const handleSettings = useCallback(() => {
    setView(v => {
      if (v !== 'credits') setReturnView(v)
      return 'credits'
    })
  }, [])

  const handleLogout = useCallback(() => {
    setSubscriptionTier('free')
    const grant = TIER_CREDITS['free']
    setCredits(grant)
    creditsRef.current = grant
    setCreditHistory([])
    setUsageLimitModalOpen(false)
    setChatContextTitle('Rakuten AI')
    setActiveChatTaskId(null)
    setUserAddedMyTasks([])
    window.alert('Signed out (demo). Plan and credits were reset.')
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
        {view !== 'subscription' && view !== 'credits' && (
          <TopBar
            onMyTask={() => setView('my-tasks')}
            onUpgrade={openSubscriptionPage}
            userName={userDisplayName}
            subscriptionTier={subscriptionTier}
            credits={credits}
            maxCredits={TIER_CREDITS[subscriptionTier]}
            onSettings={handleSettings}
            onLogout={handleLogout}
            chatLeft={
              view === 'chat'
                ? {
                    title: chatContextTitle,
                    onBack: handleBackFromChat,
                    taskId: activeChatTaskId,
                    onAddToMyTask: activeChatTaskId ? handleAddToMyTask : undefined,
                    taskAlreadyInMyTasks,
                  }
                : null
            }
          />
        )}

        {/* Home View */}
        {view === 'home' && (
          <HomeView
            onSend={handleSendFromHome}
            onTaskClick={handleTaskClick}
            onShowGallery={() => setView('gallery')}
            onOpenConnectors={() => setConnModalOpen(true)}
            addedConnectors={addedConnectors}
            onToggleAddConnector={handleToggleAddConnector}
            language={language}
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
            initialImage={initialChatImage ?? undefined}
            addedConnectors={addedConnectors}
            authorizedConnectors={authorizedConnectors}
            onToggleAddConnector={handleToggleAddConnector}
            onAuthorizeConnector={handleAuthorizeConnector}
            onDebugEvent={addDebugEvent}
            userId={USER_ID}
            subscriptionTier={subscriptionTier}
            initialInput={preservedChatInput}
            onMessageLimitReached={(currentInput: string) => {
              setPreservedChatInput(currentInput)
              setUsageLimitModalOpen(true)
            }}
            trySpendCredits={trySpendCredits}
            onFileCreated={handleFileCreated}
            onPreviewFile={handlePreviewFile}
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
              userAddedTasks={userAddedMyTasks}
            />
          </div>
        )}

        {/* Subscription Page */}
        {view === 'subscription' && (
          <SubscriptionPage
            currentTier={subscriptionTier}
            onBack={handleSubscriptionBack}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {view === 'credits' && (
          <CreditsPage
            credits={credits}
            maxCredits={TIER_CREDITS[subscriptionTier]}
            subscriptionTier={subscriptionTier}
            history={creditHistory}
            onBack={() => setView(returnView)}
            onUpgrade={openSubscriptionPage}
          />
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

      <UsageLimitModal
        open={usageLimitModalOpen}
        subscriptionTier={subscriptionTier}
        onClose={() => setUsageLimitModalOpen(false)}
        onUpgrade={() => {
          setUsageLimitModalOpen(false)
          setView(v => {
            if (v !== 'subscription') setReturnView(v)
            return 'subscription'
          })
        }}
      />

      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      <NotesToActionComposer
        open={notesToActionOpen}
        onClose={() => setNotesToActionOpen(false)}
        onSubmit={handleNotesToAction}
      />

      <PreviewPanel
        open={previewOpen}
        url={previewUrl}
        fileType={previewFileType}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  )
}

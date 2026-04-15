import React, { useState } from 'react'
import type { Task } from '../types'
import { TASK_CATALOG, TASK_CATEGORIES } from '../data/tasks'

interface Props {
  onBack: () => void
  onTaskClick: (task: Task) => void
}

export function GalleryView({ onBack, onTaskClick }: Props) {
  const [activeTab, setActiveTab] = useState('all')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const filteredTasks = activeTab === 'all'
    ? TASK_CATALOG
    : TASK_CATALOG.filter(t => t.category === activeTab)

  const getCategoryTasks = (catId: string) =>
    catId === 'all' ? TASK_CATALOG : TASK_CATALOG.filter(t => t.category === catId)

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const typeClass = (type: string) =>
    type === 'multi-step' ? 'multi-step' : type === 'schedule' ? 'schedule' : 'simple'
  const typeLabel = (type: string) =>
    type === 'multi-step' ? 'Multi-step' : type === 'schedule' ? 'Schedule' : 'Simple'

  const displayCategories = activeTab === 'all'
    ? TASK_CATEGORIES.filter(c => c.id !== 'all')
    : [TASK_CATEGORIES.find(c => c.id === activeTab)!].filter(Boolean)

  return (
    <div className="page-view view-enter">
      <div className="back-row">
        <button type="button" className="btn-back" onClick={onBack}>← Back to chat</button>
      </div>
      <h1 className="page-title">Task Center</h1>

      <div className="gallery-tab-bar">
        {TASK_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`gallery-tab ${activeTab === cat.id ? 'active' : ''} ${cat.special ? 'gallery-tab--special' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.icon !== 'rakuten' && <span className="gallery-tab-icon">{cat.icon}</span>}
            {cat.icon === 'rakuten' && (
              <span className="gallery-tab-icon" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rakuten-crimson)' }}>R</span>
            )}
            {cat.label}
            <span className="gallery-tab-count">({getCategoryTasks(cat.id).length})</span>
          </button>
        ))}
      </div>

      {displayCategories.map(cat => {
        const tasks = getCategoryTasks(cat.id)
        if (tasks.length === 0) return null
        const isCollapsed = collapsed.has(cat.id)
        return (
          <div key={cat.id} className={`category-block ${isCollapsed ? 'collapsed' : ''}`}>
            <button type="button" className="category-toggle" onClick={() => toggleCollapse(cat.id)}>
              <span>{cat.icon !== 'rakuten' ? cat.icon : '🛒'} {cat.label}</span>
              <span className="type-count" style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--text-tertiary)', marginLeft: '0.25rem' }}>({tasks.length})</span>
              <span className="chevron" style={{ marginLeft: 'auto' }}>▾</span>
            </button>
            {!isCollapsed && (
              <div className="category-grid">
                {tasks.map(task => (
                  <div key={task.id} className="gallery-card" onClick={() => onTaskClick(task)}>
                    <div
                      className="gallery-card-cover"
                      style={task.cover ? { backgroundImage: `url(${task.cover})` } : undefined}
                    >
                      {task.hot && <span className="hot-badge hot-badge--card">HOT</span>}
                    </div>
                    <div className="gallery-card-body">
                      <div className="gallery-card-title">{task.title}</div>
                      <span className={`type-pill ${typeClass(task.type)}`}>{typeLabel(task.type)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

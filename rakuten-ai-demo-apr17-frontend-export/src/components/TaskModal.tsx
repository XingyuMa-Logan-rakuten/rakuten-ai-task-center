import React from 'react'
import type { Task } from '../types'
import { CREDIT_MODAL_ESTIMATE } from '../subscriptionUtils'
import { TaskCover } from './TaskCover'
import { CONNECTOR_COLORS } from '../data/connectors'

interface Props {
  task: Task | null
  onClose: () => void
  onHaveATry: (task: Task) => void
}

export function TaskModal({ task, onClose, onHaveATry }: Props) {
  if (!task) return null

  const typeClass = task.type === 'multi-step' ? 'multi-step' : task.type === 'schedule' ? 'schedule' : 'simple'
  const typeLabel = task.type === 'multi-step' ? 'Multi-step' : task.type === 'schedule' ? 'Schedule' : 'Simple'

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="modal-body">
          <TaskCover coverUrl={task.cover} className="modal-cover" />
          <div className="modal-type-row">
            <span className={`type-pill ${typeClass}`}>{typeLabel}</span>
            <span className="modal-extra-tags">
              {task.typeTags.map(tag => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </span>
          </div>

          <h3 className="modal-section-title">Description</h3>
          <p className="modal-desc">{task.description}</p>

          <h3 className="modal-section-title">Estimated credits</h3>
          <p className="modal-desc modal-credit-estimate">{CREDIT_MODAL_ESTIMATE}</p>

          {task.sampleQueries && task.sampleQueries.length > 0 && (
            <>
              <h3 className="modal-section-title">Sample Queries</h3>
              <ul style={{ margin: '0 0 1rem', paddingLeft: '1.15rem', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text)' }}>
                {task.sampleQueries.map((q, i) => (
                  <li key={i} style={{ marginBottom: '0.35rem' }}>{q}</li>
                ))}
              </ul>
            </>
          )}

          {task.connectors && task.connectors.length > 0 && (
            <>
              <h3 className="modal-section-title">Connectors</h3>
              <div className="modal-connector-chips">
                {task.connectors.map(conn => {
                  const colors = CONNECTOR_COLORS[conn] || { bg: '#f1f5f9', text: '#475569' }
                  return (
                    <span
                      key={conn}
                      className="modal-conn-chip"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {conn}
                    </span>
                  )
                })}
              </div>
            </>
          )}

          <div className="modal-cta-row">
            <button
              type="button"
              className="btn-have-a-try"
              onClick={() => { onHaveATry(task); onClose() }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Have a Try
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { TASK_CATALOG, MY_ACTIVE_TASKS } from '../data/tasks'

interface Props {
  onBack: () => void
}

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const STATUS_META: Record<string, { label: string; cls: string }> = {
  running: { label: '⏳ Running', cls: 'status--running' },
  completed: { label: '✅ Completed', cls: 'status--completed' },
  paused: { label: '⏸ Paused', cls: 'status--paused' },
  failed: { label: '❌ Failed', cls: 'status--failed' },
  scheduled: { label: '🕐 Scheduled', cls: 'status--scheduled' },
}

const SAMPLE_EVENTS = [
  { id: 'e1', taskId: 'case-weekly-report', time: '08:00', dayOfWeek: 1, recurrence: 'weekly', type: 'scheduled' as const },
  { id: 'e2', taskId: 'daily-news-digest', time: '07:30', dayOfWeek: 3, recurrence: 'weekly', type: 'scheduled' as const },
  { id: 'e3', taskId: 'daily-workout', time: '06:00', dayOfWeek: 2, recurrence: 'weekly', type: 'scheduled' as const },
  { id: 'e4', taskId: 'habit-tracker', time: '21:00', dayOfWeek: 5, recurrence: 'weekly', type: 'todo' as const },
]

export function MyTasksView({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar'>('tasks')
  const [calDate, setCalDate] = useState(new Date(2026, 3, 1))
  const [syncOpen, setSyncOpen] = useState(false)

  const year = calDate.getFullYear()
  const month = calDate.getMonth()

  const prevMonth = () => setCalDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCalDate(new Date(year, month + 1, 1))

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const getEventsForDow = (dow: number) =>
    SAMPLE_EVENTS.filter(e => e.recurrence === 'weekly' && e.dayOfWeek === dow)

  const typeClass = (type: string) =>
    type === 'multi-step' ? 'multi-step' : type === 'schedule' ? 'schedule' : 'simple'
  const typeLabel = (type: string) =>
    type === 'multi-step' ? 'Multi-step' : type === 'schedule' ? 'Schedule' : 'Simple'

  return (
    <div className="page-view view-enter">
      <div className="back-row">
        <button type="button" className="btn-back" onClick={onBack}>← Back to chat</button>
      </div>

      <div className="my-page-tabs">
        <button type="button" className={`my-page-tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>My Task</button>
        <button type="button" className={`my-page-tab ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>My Calendar</button>
      </div>

      {/* My Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="my-tab-panel">
          {MY_ACTIVE_TASKS.length === 0 ? (
            <div className="empty-state">No active tasks yet. Start one from the Task Center!</div>
          ) : (
            <div className="my-task-list">
              {MY_ACTIVE_TASKS.map(at => {
                const task = TASK_CATALOG.find(t => t.id === at.id)
                if (!task) return null
                const statusMeta = STATUS_META[at.status] || STATUS_META.running
                return (
                  <div key={at.id} className="my-task-row">
                    <div
                      className="my-task-thumb"
                      style={task.cover ? { backgroundImage: `url(${task.cover})` } : undefined}
                    >
                      <div className={`my-task-status-badge ${statusMeta.cls}`}>{statusMeta.label}</div>
                    </div>
                    <div className="my-task-meta">
                      <h3>{task.title}</h3>
                      <p className="my-task-desc">{task.description}</p>
                      <div className="my-task-detail-row">
                        {at.schedule && (
                          <span className="my-task-schedule">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {at.schedule}
                          </span>
                        )}
                        {at.lastRun && (
                          <span className="my-task-run-info">Last run: {at.lastRun}</span>
                        )}
                        {at.nextRun && (
                          <span className="my-task-run-info" style={{ color: 'var(--interactive-primary)' }}>Next: {at.nextRun}</span>
                        )}
                      </div>
                    </div>
                    <div className="my-task-right">
                      <span className={`type-pill ${typeClass(task.type)}`}>{typeLabel(task.type)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="my-tab-panel">
          <div className="my-cal-toolbar">
            <div className="my-cal-nav">
              <button type="button" className="my-cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span className="my-cal-month">{MONTH_NAMES[month]} {year}</span>
              <button type="button" className="my-cal-nav-btn" onClick={nextMonth} aria-label="Next month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div className="my-cal-sync-wrap">
              <button type="button" className="my-cal-sync-btn" onClick={() => setSyncOpen(v => !v)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                Sync
              </button>
              {syncOpen && (
                <div className="my-cal-sync-dropdown">
                  <button type="button" className="my-cal-sync-option" onClick={() => setSyncOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google Calendar
                  </button>
                  <button type="button" className="my-cal-sync-option" onClick={() => setSyncOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>
                    MS Calendar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <div className="my-cal-grid">
              {DOW_LABELS.map(d => (
                <div key={d} className="my-cal-dow">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="my-cal-cell empty" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const date = new Date(year, month, day)
                const dow = date.getDay()
                const today = new Date()
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
                const events = getEventsForDow(dow)
                return (
                  <div key={day} className={`my-cal-cell ${isToday ? 'today' : ''}`}>
                    <span className="my-cal-day">{day}</span>
                    {events.map(ev => {
                      const task = TASK_CATALOG.find(t => t.id === ev.taskId)
                      return (
                        <span key={ev.id} className={`my-cal-event my-cal-event--${ev.type}`} title={task?.title || ev.taskId}>
                          {ev.time} {task?.title || ev.taskId}
                        </span>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

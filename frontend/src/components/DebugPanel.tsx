import React, { useState, useRef, useEffect } from 'react'
import type { DebugEvent } from '../types'
import { DebugEventItem } from './DebugEventItem'

interface Props {
  events: DebugEvent[]
  onClear: () => void
}

export function DebugPanel({ events, onClear }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events])

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fafaf9' }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937' }}>LLM Context Window</span>
          <button
            onClick={onClear}
            style={{
              fontSize: '11px',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            Clear
          </button>
        </div>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
          Shows data sent to the LLM per turn
        </p>
      </div>

      {/* Event list */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
        {events.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            No events yet. Start a conversation.
          </div>
        ) : (
          events.map(event => (
            <DebugEventItem
              key={event.id}
              event={{ ...event, expanded: expandedIds.has(event.id) }}
              onToggle={() => toggle(event.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

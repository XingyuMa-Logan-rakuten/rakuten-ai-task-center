import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { DebugEvent } from '../types'

interface Props {
  event: DebugEvent & { expanded: boolean }
  onToggle: () => void
}

const TYPE_STYLES: Record<DebugEvent['type'], { bg: string; color: string; border: string; label: string }> = {
  system_prompt: { bg: '#f5f3ff', color: '#6d28d9', border: '#c4b5fd', label: 'System Prompt' },
  user_input:    { bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd', label: 'User Input' },
  tool_call:     { bg: '#fffbeb', color: '#b45309', border: '#fcd34d', label: 'Tool Call' },
  tool_result:   { bg: '#f0fdf4', color: '#15803d', border: '#86efac', label: 'Tool Result' },
  tool_error:    { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5', label: 'Tool Error' },
  llm_output:    { bg: '#faf5ff', color: '#7c3aed', border: '#d8b4fe', label: 'LLM Output' },
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getPreview(data: unknown): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  return str.length > 120 ? str.slice(0, 120) + '…' : str
}

export function DebugEventItem({ event, onToggle }: Props) {
  const style = TYPE_STYLES[event.type]
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <span style={{
          padding: '2px 6px',
          fontSize: '11px',
          fontWeight: 600,
          borderRadius: '4px',
          border: `1px solid ${style.border}`,
          background: style.bg,
          color: style.color,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          marginTop: '2px',
        }}>
          {style.label}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>{formatTime(event.timestamp)}</div>
          <div style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {getPreview(event.data)}
          </div>
        </div>
        {event.expanded
          ? <ChevronUp size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
          : <ChevronDown size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
        }
      </button>
      {event.expanded && (
        <div style={{ padding: '0 12px 12px' }}>
          <pre style={{
            fontSize: '11px',
            background: '#111827',
            color: '#d1fae5',
            padding: '10px 12px',
            borderRadius: '6px',
            overflow: 'auto',
            maxHeight: '240px',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {typeof event.data === 'string' ? event.data : JSON.stringify(event.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import { X, Maximize2, Minimize2, Code2 } from 'lucide-react'
import { DebugPanel } from './DebugPanel'
import type { DebugEvent } from '../types'

interface Props {
  events: DebugEvent[]
  onClear: () => void
  onClose: () => void
}

export function FloatingDevWindow({ events, onClear, onClose }: Props) {
  const [pos, setPos] = useState({ x: 80, y: 80 })
  const [size, setSize] = useState({ w: 480, h: 580 })
  const [maximized, setMaximized] = useState(false)
  const [saved, setSaved] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const dragging = useRef(false)
  const resizing = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) {
        setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y })
      } else if (resizing.current) {
        const dx = e.clientX - resizeStart.current.x
        const dy = e.clientY - resizeStart.current.y
        setSize({
          w: Math.max(320, resizeStart.current.w + dx),
          h: Math.max(200, resizeStart.current.h + dy),
        })
      }
    }
    const onUp = () => { dragging.current = false; resizing.current = false }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [])

  const startDrag = (e: React.MouseEvent) => {
    if (maximized) return
    dragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  }

  const startResize = (e: React.MouseEvent) => {
    if (maximized) return
    e.stopPropagation()
    resizing.current = true
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h }
  }

  const toggleMax = () => {
    if (maximized) {
      if (saved) { setPos({ x: saved.x, y: saved.y }); setSize({ w: saved.w, h: saved.h }) }
      setMaximized(false)
    } else {
      setSaved({ x: pos.x, y: pos.y, w: size.w, h: size.h })
      setPos({ x: 0, y: 0 })
      setSize({ w: window.innerWidth, h: window.innerHeight })
      setMaximized(true)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      left: maximized ? 0 : pos.x,
      top: maximized ? 0 : pos.y,
      width: maximized ? '100vw' : size.w,
      height: maximized ? '100vh' : size.h,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: maximized ? 0 : '10px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
      border: '1.5px solid #374151',
      overflow: 'hidden',
      minWidth: 320,
      minHeight: 200,
    }}>
      {/* Drag header */}
      <div
        onMouseDown={startDrag}
        style={{
          padding: '10px 14px',
          background: '#1f2937',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'grab',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
          <Code2 size={15} />
          Developer Mode — Context Window
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={toggleMax}
            title={maximized ? 'Restore' : 'Maximize'}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '3px', borderRadius: '4px', display: 'flex' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={onClose}
            title="Close"
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '3px', borderRadius: '4px', display: 'flex' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <DebugPanel events={events} onClear={onClear} />
      </div>

      {/* Resize handle */}
      {!maximized && (
        <div
          onMouseDown={startResize}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            cursor: 'nwse-resize',
            background: 'linear-gradient(135deg, transparent 50%, #9ca3af 50%)',
            borderBottomRightRadius: 10,
          }}
        />
      )}
    </div>
  )
}

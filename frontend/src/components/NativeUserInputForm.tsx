import React, { useState } from 'react'

interface Question {
  question: string
  type: 'single_choice' | 'multiple_choice' | 'text'
  options: (string | { text: string; emoji?: string })[]
  required?: boolean
  placeholder?: string
  helper_text?: string
}

interface FormData {
  title?: string
  icon?: string
  subtitle?: string
  questions: Question[]
}

interface Props {
  formData: FormData
  onSubmit: (formattedAnswers: string) => void
}

const CRIMSON = '#BF0000'

export function NativeUserInputForm({ formData, onSubmit }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!formData?.questions?.length) return null

  const questions = formData.questions
  const current = questions[currentIdx]
  const isLast = currentIdx === questions.length - 1
  const progress = ((currentIdx + 1) / questions.length) * 100

  const handleAnswer = (value: string | string[], autoAdvance = false) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: value }))
    if (autoAdvance) {
      setTimeout(() => {
        if (isLast) doSubmit({ ...answers, [currentIdx]: value })
        else setCurrentIdx(i => i + 1)
      }, 180)
    }
  }

  const doSubmit = (finalAnswers: Record<number, string | string[]>) => {
    const formatted = questions
      .map((q, i) => {
        const ans = finalAnswers[i]
        if (!ans || (Array.isArray(ans) && ans.length === 0)) return null
        const ansStr = Array.isArray(ans) ? ans.join(', ') : ans
        return `${q.question}\n${ansStr}`
      })
      .filter(Boolean)
      .join('\n\n')

    onSubmit(formatted || '(skipped)')
    setSubmitted(true)
  }

  const handleContinue = () => {
    if (isLast) doSubmit(answers)
    else setCurrentIdx(i => i + 1)
  }

  const handleSkip = () => {
    if (isLast) doSubmit(answers)
    else setCurrentIdx(i => i + 1)
  }

  if (submitted) {
    return (
      <div style={{
        margin: '12px 0',
        background: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: '10px',
        padding: '12px 16px',
        fontSize: '13px',
        color: '#15803d',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        Submitted!
      </div>
    )
  }

  const currentAnswers = answers[currentIdx]

  const optionText = (opt: string | { text: string; emoji?: string }) =>
    typeof opt === 'string' ? opt : opt.text
  const optionEmoji = (opt: string | { text: string; emoji?: string }) =>
    typeof opt === 'object' ? opt.emoji : undefined

  return (
    <div style={{
      margin: '12px 0',
      background: 'white',
      border: `2px solid ${CRIMSON}`,
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      maxWidth: '480px',
    }}>
      {/* Progress */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div style={{ height: '3px', background: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: CRIMSON, width: `${progress}%`, transition: 'width 0.3s ease', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{current.question}</div>
        {current.helper_text && <div style={{ fontSize: '12px', color: '#6b7280' }}>{current.helper_text}</div>}
        {current.type === 'single_choice' && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Click an option to continue</div>}
      </div>

      {/* Options */}
      {current.type === 'single_choice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {current.options.map((opt, i) => {
            const text = optionText(opt)
            const emoji = optionEmoji(opt)
            const selected = currentAnswers === text
            return (
              <label
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `2px solid ${selected ? CRIMSON : '#e5e7eb'}`,
                  background: selected ? '#fff5f5' : 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                  fontSize: '14px',
                  color: '#111827',
                }}
              >
                <input
                  type="radio"
                  name={`q-${currentIdx}`}
                  value={text}
                  checked={selected}
                  onChange={() => handleAnswer(text, true)}
                  style={{ accentColor: CRIMSON, width: '15px', height: '15px', flexShrink: 0 }}
                />
                {emoji && <span style={{ fontSize: '18px' }}>{emoji}</span>}
                <span>{text}</span>
              </label>
            )
          })}
        </div>
      )}

      {current.type === 'multiple_choice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {current.options.map((opt, i) => {
            const text = optionText(opt)
            const emoji = optionEmoji(opt)
            const cur = (currentAnswers as string[]) || []
            const checked = cur.includes(text)
            return (
              <label
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `2px solid ${checked ? CRIMSON : '#e5e7eb'}`,
                  background: checked ? '#fff5f5' : 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#111827',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => {
                    const next = e.target.checked ? [...cur, text] : cur.filter(a => a !== text)
                    handleAnswer(next)
                  }}
                  style={{ accentColor: CRIMSON, width: '15px', height: '15px', flexShrink: 0 }}
                />
                {emoji && <span style={{ fontSize: '18px' }}>{emoji}</span>}
                <span>{text}</span>
              </label>
            )
          })}
        </div>
      )}

      {current.type === 'text' && (
        <input
          type="text"
          value={(currentAnswers as string) || ''}
          onChange={e => handleAnswer(e.target.value)}
          placeholder={current.placeholder || 'Type your answer...'}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            fontSize: '14px',
            outline: 'none',
            marginBottom: '14px',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = CRIMSON)}
          onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
        />
      )}

      {/* Buttons (not shown for single_choice since it auto-advances) */}
      {current.type !== 'single_choice' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSkip}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              background: 'white',
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Skip
          </button>
          <button
            onClick={handleContinue}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              background: CRIMSON,
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isLast ? 'Submit' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  )
}

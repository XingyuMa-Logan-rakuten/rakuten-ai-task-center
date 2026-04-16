import React, { useState } from 'react'

interface Props {
  coverUrl?: string
  className: string
  children?: React.ReactNode
}

/**
 * Cover image with gradient placeholder when URL is missing or fails to load.
 */
export function TaskCover({ coverUrl, className, children }: Props) {
  const [broken, setBroken] = useState(false)
  const showImg = Boolean(coverUrl) && !broken

  return (
    <div
      className={className}
      data-cover-fallback={showImg ? undefined : 'true'}
    >
      {showImg && (
        <img
          className="task-cover-img"
          src={coverUrl}
          alt=""
          decoding="async"
          loading="lazy"
          onError={() => setBroken(true)}
        />
      )}
      {children}
    </div>
  )
}

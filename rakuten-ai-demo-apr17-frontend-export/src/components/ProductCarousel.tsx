import { useState, useRef, useCallback, useEffect } from 'react'
import type { Product } from '../types'

interface Props {
  products: Product[]
  language?: 'ja' | 'en'
}

export function ProductCarousel({ products, language = 'ja' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect() }
  }, [checkScroll, products])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -224 : 224, behavior: 'smooth' })
  }

  const t = language === 'ja'
    ? { buy: '購入手続きへ', free: '送料無料' }
    : { buy: 'Buy Now',      free: 'Free Shipping' }

  if (!products.length) return null

  return (
    <div className="pc-wrap carousel-ichiba">
      {canLeft && (
        <button className="pc-arrow pc-arrow--left" onClick={() => scroll('left')} aria-label="Scroll left">‹</button>
      )}
      {canRight && (
        <button className="pc-arrow pc-arrow--right" onClick={() => scroll('right')} aria-label="Scroll right">›</button>
      )}
      <div ref={scrollRef} className="pc-track">
        {products.map((p, idx) => (
          <div key={p.productId || idx} className="pc-card" style={{ animationDelay: `${idx * 50}ms` }}>
            <a
              href={p.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="pc-img-wrap"
            >
              <img
                src={p.imgUrl}
                alt={p.name}
                className="pc-img"
                onError={e => { e.currentTarget.src = 'https://via.placeholder.com/200?text=No+Image' }}
              />
            </a>
            <div className="pc-body">
              <a
                href={p.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-name"
              >
                {p.name}
              </a>
              <div className="pc-price">¥{(p.price ?? 0).toLocaleString()}</div>
              <div className="pc-meta">
                {p.rating && (
                  <span className="pc-rating">★ {p.rating} ({p.reviewCount ?? 0})</span>
                )}
                {p.shipping && (p.shipping.includes('Free') || p.shipping.includes('無料')) && (
                  <span className="pc-free-ship">{t.free}</span>
                )}
              </div>
              <a
                href={p.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-buy-btn"
              >
                {t.buy}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

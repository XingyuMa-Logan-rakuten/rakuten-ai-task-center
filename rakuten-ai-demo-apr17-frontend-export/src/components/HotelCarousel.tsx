import { useState, useRef, useCallback, useEffect } from 'react'
import type { Hotel } from '../types'

interface Props {
  hotels: Hotel[]
  language?: 'ja' | 'en'
}

export function HotelCarousel({ hotels, language = 'ja' }: Props) {
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
  }, [checkScroll, hotels])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' })
  }

  const t = language === 'ja'
    ? { perNight: '/ 泊', book: '詳細を見る', amenities: 'アメニティ' }
    : { perNight: '/ night', book: 'View Details', amenities: 'Amenities' }

  if (!hotels.length) return null

  return (
    <div className="hc-wrap">
      {canLeft && (
        <button className="pc-arrow pc-arrow--left" onClick={() => scroll('left')} aria-label="Scroll left">‹</button>
      )}
      {canRight && (
        <button className="pc-arrow pc-arrow--right" onClick={() => scroll('right')} aria-label="Scroll right">›</button>
      )}
      <div ref={scrollRef} className="pc-track">
        {hotels.map((h, idx) => (
          <div key={h.hotelId || idx} className="hc-card" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="hc-img-wrap">
              <img
                src={h.imgUrl}
                alt={h.name}
                className="hc-img"
                onError={e => { e.currentTarget.src = 'https://via.placeholder.com/240x140?text=No+Image' }}
              />
            </div>
            <div className="pc-body">
              <div className="pc-name hc-name">{h.name}</div>
              <div className="hc-location">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {h.location}
              </div>
              <div className="pc-price">
                ¥{h.pricePerNight.toLocaleString()}
                <span className="hc-per-night">{t.perNight}</span>
              </div>
              <div className="pc-meta">
                {h.rating && (
                  <span className="pc-rating">★ {h.rating} ({h.reviewCount ?? 0})</span>
                )}
              </div>
              {h.amenities && h.amenities.length > 0 && (
                <div className="hc-amenities">
                  {h.amenities.slice(0, 3).map((a, i) => (
                    <span key={i} className="hc-amenity">{a}</span>
                  ))}
                </div>
              )}
              <a
                href={`https://travel.rakuten.co.jp/`}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-buy-btn"
              >
                {t.book}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

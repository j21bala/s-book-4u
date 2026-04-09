import { useState, useEffect, useRef, useCallback } from "react"
import "./Book.css"

const PAGES = [
  {
    id: 0,
    type: "cover",
    title: "A Vous, Mon Amour",
    subtitle: "Un petit recueil de pensées",
    decoration: "roses",
  },
  {
    id: 1,
    type: "dedication",
    quote: "In all the world, there is no heart for me like yours.\nIn all the world, there is no love for you like mine.",
    author: "— Maya Angelou",
    image: "heart",
  },
  {
    id: 2,
    type: "poem",
    title: "I. Of Morning Light",
    lines: [
      "When morning breaks upon the windowpane",
      "and gilds the dust with amber, rose, and gold,",
      "I think of you — the way your laughter spills",
      "like water over stones, like stories told",
      "beside a fire on evenings cold and still.",
      "",
      "You are the quiet warmth of early light,",
      "the kind that asks for nothing, only glows.",
    ],
  },
  {
    id: 3,
    type: "quote",
    quote: "She is the book I never tire of reading, the song I hum without knowing its name, the place I call home.",
    author: "— Anonymous",
    decoration: "birds",
  },
  {
    id: 4,
    type: "poem",
    title: "II. Of Small Things",
    lines: [
      "I love you in the smallest of the ways —",
      "the cup of tea you place beside my hand,",
      "the way you read, the furrow of your brow,",
      "the particular language of your yawn.",
      "",
      "These quiet graces fill my every hour",
      "with more than kings have built their verses on.",
    ],
  },
  {
    id: 5,
    type: "letter",
    title: "A Letter",
    salutation: "My Dearest,",
    body: "I have tried, on many occasions, to write down what it is I feel for you. Each time the words fall short — not because they are insufficient, but because what I carry is too large for any alphabet yet devised.\n\nKnow only this: you are the truest thing I have encountered in this world.",
    closing: "Ever yours,",
  },
  {
    id: 6,
    type: "quote",
    quote: "To love is nothing. To be loved is something. But to love and be loved by the person you adore — that is everything.",
    author: "— T. Tolis",
    decoration: "moon",
  },
  {
    id: 7,
    type: "poem",
    title: "III. Of Evenings",
    lines: [
      "What I want is very simple really:",
      "to sit with you when daylight turns to dusk,",
      "to share the ordinary bread of hours,",
      "the silence that needs nothing from us.",
      "",
      "Not every love burns bright — some loves are candles,",
      "warm and steady, faithful to the last.",
    ],
  },
  {
    id: 8,
    type: "gallery",
    title: "Things I Adore",
    items: [
      "The sound of your voice at the end of a long day",
      "The way you laugh at your own jokes",
      "Your particular way of seeing beauty in small things",
      "Every version of you — past, present, and yet to come",
      "That you chose me, and keep choosing me",
    ],
  },
  {
    id: 9,
    type: "closing",
    quote: "You are my today and all of my tomorrows.",
    author: "— Leo Christopher",
    title: "Fin",
  },
]

function useSound() {
  const ctx = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctx.current) {
      ctx.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctx.current
  }, [])

  const playPageTurn = useCallback(() => {
    try {
      const ac = getCtx()
      const buf = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        const t = i / ac.sampleRate
        const env = Math.exp(-t * 12)
        data[i] = env * (Math.random() * 2 - 1) * 0.4
      }
      const src = ac.createBufferSource()
      src.buffer = buf
      const filter = ac.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.value = 800
      filter.Q.value = 0.5
      const gain = ac.createGain()
      gain.gain.value = 0.3
      src.connect(filter)
      filter.connect(gain)
      gain.connect(ac.destination)
      src.start()
    } catch (e) {}
  }, [getCtx])

  const playChime = useCallback(() => {
    try {
      const ac = getCtx()
      const freqs = [523.25, 659.25, 783.99]
      freqs.forEach((freq, i) => {
        const osc = ac.createOscillator()
        const gain = ac.createGain()
        osc.type = "sine"
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0, ac.currentTime + i * 0.12)
        gain.gain.linearRampToValueAtTime(0.08, ac.currentTime + i * 0.12 + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.12 + 1.2)
        osc.connect(gain)
        gain.connect(ac.destination)
        osc.start(ac.currentTime + i * 0.12)
        osc.stop(ac.currentTime + i * 0.12 + 1.2)
      })
    } catch (e) {}
  }, [getCtx])

  return { playPageTurn, playChime }
}

/* ─── Decorative SVG elements ─── */
function RoseBorder() {
  return (
    <svg className="page-border-svg" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Corner roses */}
      {[
        [20, 20], [380, 20], [20, 540], [380, 540]
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx}, ${cy})`}>
          <circle r="12" fill="#8b2252" opacity="0.6"/>
          <circle r="8" fill="#c44a7a" opacity="0.7"/>
          <circle r="4" fill="#f0a0b8" opacity="0.8"/>
          {[0,60,120,180,240,300].map((deg, j) => (
            <ellipse key={j} cx={Math.cos(deg*Math.PI/180)*14} cy={Math.sin(deg*Math.PI/180)*14}
              rx="5" ry="8" fill="#b03060" opacity="0.5"
              transform={`rotate(${deg}, ${Math.cos(deg*Math.PI/180)*14}, ${Math.sin(deg*Math.PI/180)*14})`}/>
          ))}
        </g>
      ))}
      {/* Border lines */}
      <rect x="6" y="6" width="388" height="548" rx="2" stroke="#8b6914" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.5"/>
      <rect x="12" y="12" width="376" height="536" rx="2" stroke="#8b6914" strokeWidth="0.5" fill="none" opacity="0.3"/>
    </svg>
  )
}

function FloralDivider() {
  return (
    <div className="floral-divider">
      <svg viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="12" x2="80" y2="12" stroke="#8b6914" strokeWidth="0.5" opacity="0.6"/>
        <line x1="120" y1="12" x2="200" y2="12" stroke="#8b6914" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="100" cy="12" r="4" fill="#8b2252" opacity="0.6"/>
        <circle cx="88" cy="12" r="2" fill="#8b6914" opacity="0.5"/>
        <circle cx="112" cy="12" r="2" fill="#8b6914" opacity="0.5"/>
        <circle cx="78" cy="12" r="1.5" fill="#8b6914" opacity="0.4"/>
        <circle cx="122" cy="12" r="1.5" fill="#8b6914" opacity="0.4"/>
      </svg>
    </div>
  )
}

/* ─── Individual page renderers ─── */
function CoverPage({ data, isBack }) {
  return (
    <div className={`page page-cover ${isBack ? "page-back" : ""} relative overflow-hidden`}> 
      <div className="page-texture"/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,169,92,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(183,83,198,0.16),_transparent_22%)] pointer-events-none"/>
      <div className="absolute inset-4 rounded-[2rem] border border-amber-200/20 pointer-events-none"/>
      <div className="absolute inset-x-6 top-6 flex items-center justify-between pointer-events-none">
        <span className="w-12 h-12 rounded-full border border-amber-200/30 bg-amber-100/5"/>
        <span className="w-12 h-12 rounded-full border border-amber-200/30 bg-amber-100/5"/>
      </div>
      <div className="absolute inset-x-6 bottom-6 flex items-center justify-between pointer-events-none">
        <span className="w-12 h-12 rounded-full border border-amber-200/30 bg-amber-100/5"/>
        <span className="w-12 h-12 rounded-full border border-amber-200/30 bg-amber-100/5"/>
      </div>
      <div className="cover-content">
        <div className="cover-ornament">✦</div>
        <div className="cover-subtitle-top">A Little Book of</div>
        <h1 className="cover-title">{data.title}</h1>
        <FloralDivider/>
        <p className="cover-subtitle">{data.subtitle}</p>
        <div className="cover-ornament small">❧</div>
        <div className="cover-year">MDCCCCXXV</div>
      </div>
    </div>
  )
}

function DedicationPage({ data, isBack }) {
  return (
    <div className={`page page-light ${isBack ? "page-back" : ""}`}>
      <div className="page-texture"/>
      <RoseBorder/>
      <div className="inner-page-content">
        <div className="dedication-symbol">♥</div>
        <FloralDivider/>
        <blockquote className="big-quote">
          {data.quote.split("\n").map((line, i) => <p key={i}>{line}</p>)}
        </blockquote>
        <FloralDivider/>
        <cite className="quote-author">{data.author}</cite>
        <div className="page-number">i</div>
      </div>
    </div>
  )
}

function PoemPage({ data, isBack }) {
  return (
    <div className={`page page-cream ${isBack ? "page-back" : ""}`}>
      <div className="page-texture"/>
      <div className="inner-page-content poem-page">
        <h2 className="poem-title">{data.title}</h2>
        <FloralDivider/>
        <div className="poem-lines">
          {data.lines.map((line, i) =>
            line === "" ? <div key={i} className="poem-stanza-break"/> :
            <p key={i} className="poem-line">{line}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function QuotePage({ data, isBack }) {
  return (
    <div className={`page page-dark ${isBack ? "page-back" : ""}`}>
      <div className="page-texture"/>
      <div className="inner-page-content quote-page">
        <div className="big-quotemark">"</div>
        <blockquote className="dark-quote">{data.quote}</blockquote>
        <FloralDivider/>
        <cite className="dark-author">{data.author}</cite>
      </div>
    </div>
  )
}

function LetterPage({ data, isBack }) {
  return (
    <div className={`page page-parchment ${isBack ? "page-back" : ""}`}>
      <div className="page-texture"/>
      <div className="inner-page-content letter-page">
        <h2 className="letter-title">{data.title}</h2>
        <FloralDivider/>
        <p className="letter-salutation">{data.salutation}</p>
        <div className="letter-body">
          {data.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <p className="letter-closing">{data.closing}</p>
        <div className="letter-seal">✦</div>
      </div>
    </div>
  )
}

function GalleryPage({ data, isBack }) {
  return (
    <div className={`page page-cream ${isBack ? "page-back" : ""}`}>
      <div className="page-texture"/>
      <div className="inner-page-content gallery-page">
        <h2 className="gallery-title">{data.title}</h2>
        <FloralDivider/>
        <ul className="gallery-list">
          {data.items.map((item, i) => (
            <li key={i} className="gallery-item">
              <span className="gallery-bullet">❧</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ClosingPage({ data, isBack }) {
  return (
    <div className={`page page-cover closing-page ${isBack ? "page-back" : ""}`}>
      <div className="page-texture"/>
      <RoseBorder/>
      <div className="inner-page-content closing-content">
        <div className="closing-ornament">✦ ✦ ✦</div>
        <div className="big-quotemark">"</div>
        <blockquote className="closing-quote">{data.quote}</blockquote>
        <FloralDivider/>
        <cite className="dark-author">{data.author}</cite>
        <div className="closing-fin">{data.title}</div>
      </div>
    </div>
  )
}

function renderPage(page, isBack = false) {
  if (!page) return null
  switch (page.type) {
    case "cover": return <CoverPage key={page.id} data={page} isBack={isBack}/>
    case "dedication": return <DedicationPage key={page.id} data={page} isBack={isBack}/>
    case "poem": return <PoemPage key={page.id} data={page} isBack={isBack}/>
    case "quote": return <QuotePage key={page.id} data={page} isBack={isBack}/>
    case "letter": return <LetterPage key={page.id} data={page} isBack={isBack}/>
    case "gallery": return <GalleryPage key={page.id} data={page} isBack={isBack}/>
    case "closing": return <ClosingPage key={page.id} data={page} isBack={isBack}/>
    default: return null
  }
}

/* ─── Main Book ─── */
export default function Book() {
  const [currentPage, setCurrentPage] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState("forward")
  const [animating, setAnimating] = useState(false)
  const { playPageTurn, playChime } = useSound()

  const totalPages = PAGES.length

  const goNext = useCallback(() => {
    if (animating || currentPage >= totalPages - 1) return
    setFlipDir("forward")
    setFlipping(true)
    setAnimating(true)
    playPageTurn()
    setTimeout(() => {
      setCurrentPage(p => p + 1)
      setFlipping(false)
      setAnimating(false)
      if (currentPage + 1 === totalPages - 1) playChime()
    }, 600)
  }, [animating, currentPage, totalPages, playPageTurn, playChime])

  const goPrev = useCallback(() => {
    if (animating || currentPage <= 0) return
    setFlipDir("backward")
    setFlipping(true)
    setAnimating(true)
    playPageTurn()
    setTimeout(() => {
      setCurrentPage(p => p - 1)
      setFlipping(false)
      setAnimating(false)
    }, 600)
  }, [animating, currentPage, playPageTurn])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [goNext, goPrev])

  const current = PAGES[currentPage]
  const next = PAGES[currentPage + 1]
  const isCoverSingle = currentPage === 0
  const previous = currentPage > 0 ? PAGES[currentPage - 1] : null

  return (
    <div className="book-scene min-h-screen flex items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
      {/* Ambient particles */}
      <div className="particles" aria-hidden>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`particle p${i}`}/>
        ))}
      </div>

      <div className="book-container w-full max-w-[1180px]">
        {/* Title above */}
        <div className="book-header text-center">
          <span className="book-header-text">Petit Livre d'Amour</span>
        </div>

        {/* The Book */}
        <div className={`book ${isCoverSingle ? "book-single" : "book-spread"}`}>
          {isCoverSingle ? (
            <div className={`book-right ${flipping ? `flipping-${flipDir}` : ""}`}>
              <div className="flip-front">
                {renderPage(current)}
              </div>
              {flipping && next && (
                <div className="flip-back">
                  {renderPage(next, true)}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="book-left">
                {previous
                  ? renderPage(previous, true)
                  : <div className="page page-cover page-endpaper"><div className="page-texture"/><div className="endpaper-content"><div className="endpaper-text">Ex Libris</div></div></div>
                }
              </div>

              <div className={`book-right ${flipping ? `flipping-${flipDir}` : ""}`}>
                <div className="flip-front">
                  {renderPage(current)}
                </div>
                {flipping && next && (
                  <div className="flip-back">
                    {renderPage(next, true)}
                  </div>
                )}
              </div>

              <div className="book-spine">
                <div className="spine-text">A Vous</div>
              </div>
            </>
          )}

          {/* Shadow */}
          <div className="book-shadow"/>

          {/* Side navigation buttons */}
          <button
            className="book-edge-button book-edge-prev"
            onClick={goPrev}
            disabled={currentPage === 0 || animating}
            aria-label="Previous page"
          >
            ‹
          </button>
          <button
            className="book-edge-button book-edge-next"
            onClick={goNext}
            disabled={currentPage === totalPages - 1 || animating}
            aria-label="Next page"
          >
            ›
          </button>
        </div>

        {/* Navigation */}
        <div className="book-nav">
          <button
            className="nav-btn"
            onClick={goPrev}
            disabled={currentPage === 0 || animating}
            aria-label="Previous page"
          >
            ‹
          </button>

          <div className="page-indicator">
            {PAGES.map((_, i) => (
              <button
                key={i}
                className={`pip ${i === currentPage ? "pip-active" : ""}`}
                onClick={() => {
                  if (!animating && i !== currentPage) {
                    setFlipDir(i > currentPage ? "forward" : "backward")
                    setFlipping(true)
                    setAnimating(true)
                    playPageTurn()
                    setTimeout(() => {
                      setCurrentPage(i)
                      setFlipping(false)
                      setAnimating(false)
                    }, 600)
                  }
                }}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="nav-btn"
            onClick={goNext}
            disabled={currentPage === totalPages - 1 || animating}
            aria-label="Next page"
          >
            ›
          </button>
        </div>

        <div className="book-hint">Use ← → keys or click the arrows</div>
      </div>
    </div>
  )
}
import { useEffect, useRef, useState } from 'react'
import './SignaturePad.css'

function getPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect()
  const source = event.touches?.[0] || event.changedTouches?.[0] || event
  return {
    x: ((source.clientX - rect.left) / rect.width) * canvas.width,
    y: ((source.clientY - rect.top) / rect.height) * canvas.height,
  }
}

export function SignaturePad({
  value = '',
  onChange,
  label = 'Please provide your handwritten signature',
}) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const strokesRef = useRef([])
  const currentStrokeRef = useRef(null)
  const hydratedRef = useRef(false)
  const [erasing, setErasing] = useState(false)
  const [hasInk, setHasInk] = useState(Boolean(value))

  function redraw(strokes) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (const stroke of strokes) {
      if (!stroke.points.length) continue
      ctx.beginPath()
      ctx.strokeStyle = stroke.erase ? '#ffffff' : '#1f1220'
      ctx.lineWidth = stroke.erase ? 18 : 2.4
      stroke.points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    }
  }

  function emitChange(strokes) {
    const canvas = canvasRef.current
    if (!canvas) return
    const empty = strokes.length === 0
    setHasInk(!empty)
    onChange?.(empty ? '' : canvas.toDataURL('image/png'))
  }

  function setupCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = Math.max(1, Math.floor(width * ratio))
    canvas.height = Math.max(1, Math.floor(height * ratio))

    if (!hydratedRef.current && value) {
      const image = new Image()
      image.onload = () => {
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        setHasInk(true)
        hydratedRef.current = true
      }
      image.src = value
      return
    }

    hydratedRef.current = true
    redraw(strokesRef.current)
  }

  useEffect(() => {
    setupCanvas()
    window.addEventListener('resize', setupCanvas)
    return () => window.removeEventListener('resize', setupCanvas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startDraw(event) {
    event.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    drawingRef.current = true
    const point = getPoint(event, canvas)
    currentStrokeRef.current = {
      erase: erasing,
      points: [point],
    }
  }

  function moveDraw(event) {
    if (!drawingRef.current || !currentStrokeRef.current) return
    event.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    currentStrokeRef.current.points.push(getPoint(event, canvas))
    redraw([...strokesRef.current, currentStrokeRef.current])
  }

  function endDraw(event) {
    if (!drawingRef.current) return
    event.preventDefault()
    drawingRef.current = false
    if (currentStrokeRef.current?.points.length) {
      strokesRef.current = [...strokesRef.current, currentStrokeRef.current]
      currentStrokeRef.current = null
      redraw(strokesRef.current)
      emitChange(strokesRef.current)
    }
  }

  function clearPad() {
    strokesRef.current = []
    currentStrokeRef.current = null
    redraw([])
    emitChange([])
  }

  function undoPad() {
    strokesRef.current = strokesRef.current.slice(0, -1)
    redraw(strokesRef.current)
    emitChange(strokesRef.current)
  }

  return (
    <div className="signature-pad">
      <p className="signature-pad__label">
        <span className="req">*</span> {label}
      </p>
      <div className={`signature-pad__frame${erasing ? ' is-erasing' : ''}`}>
        {!hasInk ? (
          <span className="signature-pad__hint">
            Please draw within the rectangle area below
          </span>
        ) : null}
        <canvas
          ref={canvasRef}
          className="signature-pad__canvas"
          onMouseDown={startDraw}
          onMouseMove={moveDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={moveDraw}
          onTouchEnd={endDraw}
        />
      </div>
      <div className="signature-pad__toolbar">
        <div className="signature-pad__tools">
          <button type="button" onClick={clearPad}>
            Clear
          </button>
          <button type="button" onClick={undoPad}>
            Undo
          </button>
          <button
            type="button"
            className={erasing ? 'is-active' : ''}
            onClick={() => setErasing((current) => !current)}
          >
            Eraser
          </button>
        </div>
      </div>
    </div>
  )
}

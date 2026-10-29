import { useEffect, useRef, useState } from 'react'
import sectionSummaries from '../data/site/section-summaries.json'
import { pages } from '../data'
import { useAuth } from '../auth/AuthContext'
import { blobToWavFile } from '../lib/audioWav'
import { Icon } from './Icons'
import './SectionSummaryTask.css'

const copy = pages.article.sectionSummary

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '')
}

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return ''
  }
  const types = [
    'audio/mp4',
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/aac',
  ]
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || ''
}

function extensionFor(type) {
  if (type.includes('mp4') || type.includes('aac') || type.includes('m4a')) return 'm4a'
  if (type.includes('ogg')) return 'ogg'
  return 'webm'
}

function slugPart(value) {
  return String(value || 'section')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'section'
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function downloadFile(file) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function sharePayloads(file, text) {
  return [
    { files: [file], text, title: file.name },
    { files: [file], title: file.name },
  ]
}

async function shareAudioFile(file, text) {
  if (typeof navigator.share !== 'function') return 'unsupported'

  for (const data of sharePayloads(file, text)) {
    try {
      if (navigator.canShare && !navigator.canShare(data)) continue
      await navigator.share(data)
      return 'shared'
    } catch (error) {
      if (error?.name === 'AbortError') return 'aborted'
    }
  }

  try {
    await navigator.share({ files: [file], title: file.name })
    return 'shared'
  } catch (error) {
    if (error?.name === 'AbortError') return 'aborted'
    return 'unsupported'
  }
}

export function SectionSummaryTask({
  articleTitle,
  taskKey = 'summary',
}) {
  const taskCopy = copy[taskKey] || copy.summary
  const { session } = useAuth()
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const previewUrlRef = useRef('')
  const shareFileRef = useRef(null)

  const [status, setStatus] = useState('idle')
  const [seconds, setSeconds] = useState(0)
  const [blob, setBlob] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [workName, setWorkName] = useState(session?.name || session?.username || '')
  const [message, setMessage] = useState('')
  const [showSave, setShowSave] = useState(false)

  useEffect(() => {
    setWorkName(session?.name || session?.username || '')
  }, [session])

  useEffect(() => {
    return () => {
      stopTimer()
      stopStream()
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  function stopTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    recorderRef.current = null
  }

  function setPreview(nextBlob) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const url = nextBlob ? URL.createObjectURL(nextBlob) : ''
    previewUrlRef.current = url
    setPreviewUrl(url)
    setBlob(nextBlob)
  }

  async function prepareShareFile(nextBlob, mimeType) {
    const base = `zura-${taskKey}-${slugPart(articleTitle)}`
    const original = new File(
      [nextBlob],
      `${base}.${extensionFor(mimeType)}`,
      { type: mimeType || 'audio/webm' },
    )
    shareFileRef.current = original
    try {
      shareFileRef.current = await blobToWavFile(nextBlob, `${base}.wav`)
    } catch {
      shareFileRef.current = original
    }
  }

  async function startRecording() {
    setMessage('')
    setShowSave(false)
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setMessage(copy.unsupported)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const mimeType = pickMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      recorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const type = recorder.mimeType || mimeType || 'audio/webm'
        const nextBlob = new Blob(chunksRef.current, { type })
        setPreview(nextBlob)
        void prepareShareFile(nextBlob, type)
        stopStream()
        stopTimer()
        setStatus('ready')
      }

      try {
        recorder.start(250)
      } catch {
        recorder.start()
      }
      setSeconds(0)
      setStatus('recording')
      timerRef.current = window.setInterval(() => {
        setSeconds((value) => value + 1)
      }, 1000)
    } catch {
      stopStream()
      setMessage(copy.micDenied)
      setStatus('idle')
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    } else {
      stopStream()
      stopTimer()
      setStatus(blob ? 'ready' : 'idle')
    }
  }

  function caption(phone) {
    const name = workName.trim() || 'Therapist'
    return [
      taskCopy.caption,
      `To: +${phone}`,
      `Therapist: ${name}`,
      `Article: ${articleTitle}`,
      `Instruction: ${taskCopy.prompt}`,
    ].join('\n')
  }

  async function send() {
    if (!blob) return
    if (!workName.trim()) {
      setMessage(copy.nameNeeded)
      return
    }

    const phone = digitsOnly(sectionSummaries.whatsappNumber)
    if (!phone) {
      setMessage(copy.missingNumber)
      return
    }

    const type = blob.type || 'audio/webm'
    const file =
      shareFileRef.current ||
      new File(
        [blob],
        `zura-${taskKey}-${slugPart(articleTitle)}.${extensionFor(type)}`,
        { type },
      )
    const text = caption(phone)

    setStatus('sending')
    setMessage('')
    setShowSave(false)
    void navigator.clipboard?.writeText(text).catch(() => {})

    const result = await shareAudioFile(file, text)
    setStatus('ready')
    if (result === 'shared') {
      setMessage(copy.shared)
      return
    }
    if (result === 'aborted') {
      setMessage('')
      return
    }

    setShowSave(true)
    setMessage(copy.shareUnavailable)
  }

  function saveAudio() {
    const type = blob?.type || 'audio/webm'
    const file =
      shareFileRef.current ||
      (blob
        ? new File(
            [blob],
            `zura-${taskKey}-${slugPart(articleTitle)}.${extensionFor(type)}`,
            { type },
          )
        : null)
    if (!file) return
    downloadFile(file)
  }

  return (
    <div className="section-summary">
      <p className="section-summary__label">{taskCopy.label}</p>
      <p className="section-summary__prompt">{taskCopy.prompt}</p>

      {!session ? (
        <label className="section-summary__name">
          {copy.nameLabel}
          <input
            type="text"
            value={workName}
            onChange={(event) => setWorkName(event.target.value)}
            autoComplete="name"
          />
        </label>
      ) : null}

      {previewUrl ? (
        <audio className="section-summary__preview" controls src={previewUrl} preload="metadata" />
      ) : null}

      <div className="section-summary__actions">
        {status === 'recording' ? (
          <button
            type="button"
            className="section-summary__btn section-summary__btn--stop"
            onClick={stopRecording}
          >
            <Icon name="stop" size={16} />
            {copy.stop} · {formatTime(seconds)}
          </button>
        ) : (
          <button
            type="button"
            className="section-summary__btn section-summary__btn--record"
            onClick={startRecording}
          >
            <Icon name="mic" size={16} />
            {blob ? copy.rerecord : copy.record}
          </button>
        )}

        <button
          type="button"
          className="section-summary__btn section-summary__btn--send"
          onClick={send}
          disabled={!blob || status === 'recording' || status === 'sending'}
        >
          <Icon name="send" size={16} />
          {status === 'sending' ? copy.sending : copy.send}
        </button>
        {showSave ? (
          <button
            type="button"
            className="section-summary__btn section-summary__btn--record"
            onClick={saveAudio}
          >
            {copy.saveAudio}
          </button>
        ) : null}
      </div>

      {message ? <p className="section-summary__note">{message}</p> : null}
    </div>
  )
}

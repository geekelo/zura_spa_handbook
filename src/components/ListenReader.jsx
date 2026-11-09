import { useEffect, useRef, useState } from 'react'
import { articleListenText, chunkListenText, pickEnglishVoice } from '../lib/articleSpeech'
import { Icon } from './Icons'
import './ListenReader.css'

function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function ListenReader({ article }) {
  const text = articleListenText(article)
  const [status, setStatus] = useState('idle')
  const [unsupported, setUnsupported] = useState(false)
  const queueRef = useRef([])
  const indexRef = useRef(0)
  const voiceRef = useRef(null)
  const runRef = useRef(0)

  useEffect(() => {
    setUnsupported(!canSpeak())
    if (!canSpeak()) return undefined
    const synth = window.speechSynthesis
    const pick = () => {
      voiceRef.current = pickEnglishVoice(synth.getVoices())
    }
    pick()
    synth.addEventListener('voiceschanged', pick)
    return () => synth.removeEventListener('voiceschanged', pick)
  }, [])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => {
    runRef.current += 1
    window.speechSynthesis?.cancel()
    setStatus('idle')
    indexRef.current = 0
    queueRef.current = []
  }, [article?.id, text])

  function speakFrom(index) {
    const synth = window.speechSynthesis
    const chunks = queueRef.current
    if (!synth || index >= chunks.length) {
      setStatus('idle')
      return
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index])
    utterance.rate = 0.95
    utterance.pitch = 1
    if (voiceRef.current) utterance.voice = voiceRef.current
    const runId = runRef.current
    utterance.onend = () => {
      if (runRef.current !== runId) return
      if (window.speechSynthesis.paused) return
      indexRef.current = index + 1
      speakFrom(index + 1)
    }
    utterance.onerror = (event) => {
      if (event.error === 'interrupted' || event.error === 'canceled') return
      setStatus('idle')
    }
    synth.speak(utterance)
    setStatus('playing')
  }

  function handleListen() {
    if (!canSpeak() || !text) return
    const synth = window.speechSynthesis
    const voices = synth.getVoices()
    voiceRef.current = pickEnglishVoice(voices)
    queueRef.current = chunkListenText(text)
    indexRef.current = 0
    runRef.current += 1
    if (synth.speaking || synth.pending) synth.cancel()
    speakFrom(0)
  }

  function handlePause() {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.pause()
    window.setTimeout(() => {
      if (synth.speaking && synth.paused) setStatus('paused')
    }, 50)
  }

  function handleResume() {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.resume()
    setStatus('playing')
  }

  function handleStop() {
    runRef.current += 1
    window.speechSynthesis?.cancel()
    setStatus('idle')
    indexRef.current = 0
  }

  if (!text) return null

  return (
    <div className="listen-reader">
      <p className="listen-reader__copy">
        {unsupported
          ? 'This device cannot read the lesson aloud.'
          : 'Listen to this lesson if you do not have time to read it.'}
      </p>
      {unsupported ? null : (
      <div className="listen-reader__actions">
        {status === 'idle' ? (
          <button type="button" onClick={handleListen}>
            <Icon name="play" size={16} />
            Listen
          </button>
        ) : null}
        {status === 'playing' ? (
          <button type="button" onClick={handlePause}>
            <Icon name="pause" size={16} />
            Pause
          </button>
        ) : null}
        {status === 'paused' ? (
          <button type="button" onClick={handleResume}>
            <Icon name="play" size={16} />
            Resume
          </button>
        ) : null}
        {status !== 'idle' ? (
          <button type="button" className="ghost" onClick={handleStop}>
            <Icon name="stop" size={16} />
            Stop
          </button>
        ) : null}
      </div>
      )}
    </div>
  )
}

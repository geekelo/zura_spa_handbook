import { useEffect, useMemo, useRef, useState } from 'react'
import logo from '../assets/zura-logo.png'
import { PageHeader } from '../components/PageHeader'
import { LockedContent } from '../components/LockedContent'
import { SignaturePad } from '../components/SignaturePad'
import { saveForm, readForm } from '../data/forms'
import { useAuth } from '../auth/AuthContext'
import './EmploymentLetter.css'
import './FormTopic.css'

const TRANSFORMATION_STATEMENT =
  'I recognise that personal growth is a continuous journey. I am committed to developing the character, discipline, professionalism and skills necessary to become a better version of myself and to contribute positively to the Zura Spa team.'

const emptyValues = {
  letterDate: '',
  therapistName: '',
  signatureImage: '',
}

function blank(value) {
  return value?.trim() ? value.trim() : '____________________'
}

function letterStyles(forPrint) {
  return `
    @page { margin: 18mm; }
    body {
      margin: 0;
      color: #1f1220;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 12.5px;
      line-height: 1.45;
      background: #fff;
    }
    .sheet {
      max-width: 760px;
      margin: 0 auto;
      padding: ${forPrint ? '0' : '24px'};
    }
    .brand {
      text-align: center;
      margin-bottom: 18px;
      border-bottom: 2px solid #6d2c40;
      padding-bottom: 14px;
    }
    .brand h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6d2c40;
    }
    .brand .tag {
      margin: 4px 0 8px;
      font-style: italic;
      color: #7a5a62;
      font-size: 12px;
    }
    .brand .addr {
      margin: 0;
      font-size: 11px;
      color: #4a3a40;
      line-height: 1.4;
    }
    h2 {
      text-align: center;
      margin: 18px 0 8px;
      font-size: 16px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    h3 {
      margin: 16px 0 8px;
      font-size: 13.5px;
      color: #6d2c40;
    }
    h4 {
      margin: 12px 0 6px;
      font-size: 12.5px;
      color: #6d2c40;
    }
    p, li { margin: 0 0 8px; }
    blockquote {
      margin: 8px 0 12px;
      padding: 8px 12px;
      border-left: 3px solid #6d2c40;
      background: #faf6f7;
      font-weight: 600;
    }
    .application {
      margin-top: 22px;
      padding-top: 14px;
      border-top: 1px solid #d7c7cb;
    }
    .sig-img {
      display: block;
      width: 220px;
      max-width: 55%;
      height: auto;
      margin: 6px 0 10px;
      border-bottom: 1px solid #1f1220;
    }
  `
}

function buildLetterHtml(values, { forPrint = false } = {}) {
  const therapistName = blank(values.therapistName)
  const letterDate = blank(values.letterDate)
  const signatureBlock = values.signatureImage
    ? `<p><strong>Signature:</strong></p><img class="sig-img" src="${values.signatureImage}" alt="Therapist signature" />`
    : '<p><strong>Signature:</strong> ____________________</p>'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Apply to Return to Work — ${therapistName}</title>
  <style>${letterStyles(forPrint)}</style>
</head>
<body>
  <div class="sheet">
    <div class="brand">
      <h1>Zura Spa</h1>
      <p class="tag">Relaxation You Won’t Forget</p>
      <p class="addr">
        4 Elohor Avenue, Peter Odili Rd, off Ekpeli Drive, Trans Amadi,<br />
        beside Market Square, Port Harcourt<br />
        Phone: 0810122 9237
      </p>
    </div>

    <p><strong>Date:</strong> ${letterDate}</p>
    <h2>Apply to Return to Work</h2>
    <p style="text-align:center;font-style:italic;margin-bottom:16px;">
      14-Day Personal Transformation &amp; Realignment Programme
    </p>

    ${managementLetterHtml()}

    <div class="application">
      <h3>Application to Return</h3>
      <h4>My Personal Transformation Statement</h4>
      <p>${TRANSFORMATION_STATEMENT}</p>
      <p><strong>Therapist:</strong> ${therapistName}</p>
      ${signatureBlock}
      <p><strong>Date:</strong> ${letterDate}</p>
    </div>
  </div>
</body>
</html>`
}

function managementLetterHtml() {
  return `
    <h3>Letter from Management</h3>
    <h3>The Psychological Approach</h3>
    <p>We want you to understand that this transformation programme is not simply about correcting past mistakes. It is about helping you rediscover your strengths, recognise opportunities for growth, and become a better version of yourself.</p>
    <p>Through this programme, we want you to experience three important psychological shifts:</p>

    <h4>1. From Shame to Responsibility</h4>
    <p>We want you to see that making mistakes does not make you a failure, and acknowledging your shortcomings does not diminish your worth as a person.</p>
    <p>We want you to understand that taking responsibility for your actions is a sign of maturity, courage, and personal growth.</p>
    <p>Rather than allowing past experiences to produce shame, guilt, or self-condemnation, we encourage you to see them as opportunities to learn, make better decisions, and develop healthier habits.</p>
    <blockquote>We want you to take responsibility for your actions without allowing your mistakes to define your identity.</blockquote>

    <h4>2. From Defensiveness to Belonging</h4>
    <p>We want you to see that receiving correction does not necessarily mean you are being rejected, disliked, or considered unimportant.</p>
    <p>We want you to understand that constructive feedback can be an opportunity to develop your abilities, improve your relationships, and become more effective in your responsibilities.</p>
    <p>At Zura Spa, we value teamwork, mutual respect, professionalism, and accountability. We want you to recognise that you have the ability to contribute positively to the team and help create a peaceful, supportive, and productive working environment.</p>
    <p>We also want you to feel comfortable asking questions, expressing concerns respectfully, acknowledging mistakes, and seeking clarification when necessary.</p>
    <blockquote>We want you to move from seeing every correction as a personal attack to recognising constructive feedback as an opportunity for improvement.</blockquote>

    <h4>3. From Obligation to Personal Ambition</h4>
    <p>We want you to see that becoming a better therapist is not something you should pursue simply because Zura Spa expects it of you.</p>
    <p>We want you to understand that every positive habit you develop, every professional skill you improve, and every lesson you learn contributes to your own future.</p>
    <p>Your discipline can create greater opportunities for you.</p>
    <p>Your emotional maturity can improve your relationships.</p>
    <p>Your professionalism can strengthen your reputation.</p>
    <p>Your willingness to learn can increase your competence, confidence, and earning potential.</p>
    <p>We want you to develop a personal desire for excellence that goes beyond supervision, instructions, or workplace expectations.</p>
    <p>We want you to become someone who chooses to do what is right, not merely because someone is watching, but because excellence has become part of who you are.</p>
    <blockquote>We want you to see that your personal growth is an investment in yourself, your career, your relationships, and the future you want to build.</blockquote>

    <h4>Our Ultimate Desire for You</h4>
    <p>At the end of these 14 days, we do not simply want you to return to Zura Spa because your transformation break has ended.</p>
    <p>We want you to return with renewed confidence, greater self-awareness, emotional maturity, personal discipline, and a genuine desire to contribute positively.</p>
    <p>We want you to understand and embrace the existing Zura Spa standards, not merely as rules you are expected to obey, but as professional principles that can help you become more dependable, respected, and successful.</p>
    <p>Most importantly, <strong>we want you to see that the greatest beneficiary of your transformation is YOU.</strong></p>
    <p><em>Your growth is personal. Your future is valuable. And the person you are becoming is worth investing in.</em></p>
  `
}

function downloadBlob(filename, html) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function printLetter(html) {
  const frame = document.createElement('iframe')
  frame.style.position = 'fixed'
  frame.style.right = '0'
  frame.style.bottom = '0'
  frame.style.width = '0'
  frame.style.height = '0'
  frame.style.border = '0'
  document.body.appendChild(frame)
  const doc = frame.contentDocument
  doc.open()
  doc.write(html)
  doc.close()
  frame.onload = () => {
    frame.contentWindow?.focus()
    frame.contentWindow?.print()
    setTimeout(() => frame.remove(), 1000)
  }
}

function ScriptEmbed({ src, title }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || !src) return undefined

    host.replaceChildren()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.async = true
    host.appendChild(script)

    return () => {
      host.replaceChildren()
    }
  }, [src])

  return (
    <div
      className="form-embed form-embed--script"
      ref={hostRef}
      title={title}
      aria-label={title}
    />
  )
}

function LetterPreview({ values }) {
  return (
    <section className="el-letter" aria-label="Return-to-work application preview">
      <div className="el-letter__brand">
        <img src={logo} alt="Zura Spa" />
        <h2>Zura Spa</h2>
        <p className="el-letter__tag">Relaxation You Won’t Forget</p>
        <p className="el-letter__addr">
          4 Elohor Avenue, Peter Odili Rd, off Ekpeli Drive, Trans Amadi,
          beside Market Square, Port Harcourt
          <br />
          Phone: 0810122 9237
        </p>
      </div>

      <p>
        <strong>Date:</strong> {blank(values.letterDate)}
      </p>
      <h3 className="el-letter__title">Apply to Return to Work</h3>
      <p>
        <em>14-Day Personal Transformation & Realignment Programme</em>
      </p>

      <h3>Letter from Management</h3>
      <h3>The Psychological Approach</h3>
      <p>
        We want you to understand that this transformation programme is not simply
        about correcting past mistakes. It is about helping you rediscover your
        strengths, recognise opportunities for growth, and become a better version
        of yourself.
      </p>
      <p>
        Through this programme, we want you to experience three important
        psychological shifts:
      </p>

      <h4>1. From Shame to Responsibility</h4>
      <p>
        We want you to see that making mistakes does not make you a failure, and
        acknowledging your shortcomings does not diminish your worth as a person.
      </p>
      <p>
        We want you to understand that taking responsibility for your actions is a
        sign of maturity, courage, and personal growth.
      </p>
      <p>
        Rather than allowing past experiences to produce shame, guilt, or
        self-condemnation, we encourage you to see them as opportunities to learn,
        make better decisions, and develop healthier habits.
      </p>
      <blockquote>
        We want you to take responsibility for your actions without allowing your
        mistakes to define your identity.
      </blockquote>

      <h4>2. From Defensiveness to Belonging</h4>
      <p>
        We want you to see that receiving correction does not necessarily mean you
        are being rejected, disliked, or considered unimportant.
      </p>
      <p>
        We want you to understand that constructive feedback can be an opportunity
        to develop your abilities, improve your relationships, and become more
        effective in your responsibilities.
      </p>
      <p>
        At Zura Spa, we value teamwork, mutual respect, professionalism, and
        accountability. We want you to recognise that you have the ability to
        contribute positively to the team and help create a peaceful, supportive,
        and productive working environment.
      </p>
      <p>
        We also want you to feel comfortable asking questions, expressing concerns
        respectfully, acknowledging mistakes, and seeking clarification when
        necessary.
      </p>
      <blockquote>
        We want you to move from seeing every correction as a personal attack to
        recognising constructive feedback as an opportunity for improvement.
      </blockquote>

      <h4>3. From Obligation to Personal Ambition</h4>
      <p>
        We want you to see that becoming a better therapist is not something you
        should pursue simply because Zura Spa expects it of you.
      </p>
      <p>
        We want you to understand that every positive habit you develop, every
        professional skill you improve, and every lesson you learn contributes to
        your own future.
      </p>
      <p>Your discipline can create greater opportunities for you.</p>
      <p>Your emotional maturity can improve your relationships.</p>
      <p>Your professionalism can strengthen your reputation.</p>
      <p>
        Your willingness to learn can increase your competence, confidence, and
        earning potential.
      </p>
      <p>
        We want you to develop a personal desire for excellence that goes beyond
        supervision, instructions, or workplace expectations.
      </p>
      <p>
        We want you to become someone who chooses to do what is right, not merely
        because someone is watching, but because excellence has become part of who
        you are.
      </p>
      <blockquote>
        We want you to see that your personal growth is an investment in yourself,
        your career, your relationships, and the future you want to build.
      </blockquote>

      <h4>Our Ultimate Desire for You</h4>
      <p>
        At the end of these 14 days, we do not simply want you to return to Zura Spa
        because your transformation break has ended.
      </p>
      <p>
        We want you to return with renewed confidence, greater self-awareness,
        emotional maturity, personal discipline, and a genuine desire to contribute
        positively.
      </p>
      <p>
        We want you to understand and embrace the existing Zura Spa standards, not
        merely as rules you are expected to obey, but as professional principles
        that can help you become more dependable, respected, and successful.
      </p>
      <p>
        Most importantly, <strong>we want you to see that the greatest beneficiary
        of your transformation is YOU.</strong>
      </p>
      <p>
        <em>
          Your growth is personal. Your future is valuable. And the person you are
          becoming is worth investing in.
        </em>
      </p>

      <div className="el-acceptance">
        <h4>Application to Return</h4>
        <h4>My Personal Transformation Statement</h4>
        <p>{TRANSFORMATION_STATEMENT}</p>
        <p>
          <strong>Therapist:</strong> {blank(values.therapistName)}
        </p>
        {values.signatureImage ? (
          <>
            <p>
              <strong>Signature:</strong>
            </p>
            <img
              className="el-signature-img"
              src={values.signatureImage}
              alt="Therapist handwritten signature"
            />
          </>
        ) : (
          <p>
            <strong>Signature:</strong> ____________________
          </p>
        )}
        <p>
          <strong>Date:</strong> {blank(values.letterDate)}
        </p>
      </div>
    </section>
  )
}

export function ReturnToWorkLetter({ topic, backTo, locked = true }) {
  const { isLoggedIn } = useAuth()
  const existing = readForm(topic.id)
  const [values, setValues] = useState(() => ({
    ...emptyValues,
    ...existing,
    letterDate: existing?.letterDate || new Date().toISOString().slice(0, 10),
  }))
  const [agreed, setAgreed] = useState(Boolean(existing?.agreed))
  const [saved, setSaved] = useState(Boolean(existing?.signatureImage || existing?.therapistName))
  const [status, setStatus] = useState('')

  const setField = (name, value) =>
    setValues((current) => ({ ...current, [name]: value }))

  const letterHtml = useMemo(() => buildLetterHtml(values), [values])
  const canLoadEmbed = !locked || isLoggedIn

  function handleSign(event) {
    event.preventDefault()
    if (!agreed) {
      setStatus('Please confirm the Personal Transformation Statement before signing.')
      return
    }
    if (!values.therapistName.trim()) {
      setStatus('Please enter your full name.')
      return
    }
    if (!values.signatureImage) {
      setStatus('Please draw your handwritten signature.')
      return
    }

    const payload = {
      ...values,
      agreed: true,
      signedAt: new Date().toISOString(),
    }
    saveForm(topic.id, payload)
    setSaved(true)
    setStatus('')
  }

  function handleDownloadHtml() {
    const name = values.therapistName.trim().replace(/\s+/g, '-').toLowerCase()
    downloadBlob(`zura-spa-apply-to-return-${name || 'therapist'}.html`, letterHtml)
  }

  function handleDownloadPdf() {
    printLetter(buildLetterHtml(values, { forPrint: true }))
  }

  return (
    <div className="page employment-letter-page">
      <PageHeader title={topic.title} backTo={backTo} />
      {topic.summary ? <p className="lead-copy">{topic.summary}</p> : null}

      <LockedContent locked={locked}>
        {saved ? <p className="form-success">{topic.successMessage}</p> : null}

        <section className="el-card">
          <h2>Your details</h2>
          <div className="el-grid">
            <label>
              Therapist full name
              <input
                type="text"
                value={values.therapistName}
                onChange={(e) => setField('therapistName', e.target.value)}
                required
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={values.letterDate}
                onChange={(e) => setField('letterDate', e.target.value)}
                required
              />
            </label>
          </div>
        </section>

        <LetterPreview values={values} />

        <form className="el-card el-sign-form" onSubmit={handleSign}>
          <h2>Sign and download</h2>

          <label className="check-row">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
            />
            <span>
              I have read the letter from management and I make this Personal
              Transformation Statement as my application to return to work.
            </span>
          </label>

          <SignaturePad
            value={values.signatureImage}
            onChange={(dataUrl) => setField('signatureImage', dataUrl)}
            label="Please provide your handwritten signature"
          />

          {status ? <p className="el-status">{status}</p> : null}

          <div className="el-actions">
            <button type="submit">Sign application</button>
            <button type="button" className="ghost" onClick={handleDownloadHtml}>
              Download letter
            </button>
            <button type="button" className="ghost" onClick={handleDownloadPdf}>
              Print / Save PDF
            </button>
          </div>
        </form>

        <section className="el-card">
          <h2>Send your application</h2>
          <p className="lead-copy">
            Upload your downloaded letter using this form.
          </p>
          {topic.embedScript && canLoadEmbed ? (
            <ScriptEmbed
              src={topic.embedScript}
              title={topic.embedTitle || 'Return-to-work application submission'}
            />
          ) : (
            <div className="form-embed form-embed--placeholder" aria-hidden="true" />
          )}
        </section>
      </LockedContent>
    </div>
  )
}

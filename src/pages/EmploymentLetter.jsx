import { useMemo, useState } from 'react'
import logo from '../assets/zura-logo.png'
import { PageHeader } from '../components/PageHeader'
import { LockedContent } from '../components/LockedContent'
import { SignaturePad } from '../components/SignaturePad'
import { saveForm, readForm } from '../data/forms'
import './EmploymentLetter.css'

const emptyValues = {
  letterDate: '',
  recipientName: '',
  recipientAddress: '',
  dearName: '',
  resumptionDate: '',
  salary: '',
  workSchedule: '',
  probationPeriod: '',
  terminationNotice: 'one (1) month',
  authorizedName: '',
  authorizedPosition: '',
  acceptanceName: '',
  employeeSignature: '',
  signatureImage: '',
  acceptanceDate: '',
}

function blank(value) {
  return value?.trim() ? value.trim() : '_______________________________'
}

function buildLetterHtml(values, { forPrint = false } = {}) {
  const v = {
    letterDate: blank(values.letterDate),
    recipientName: blank(values.recipientName),
    recipientAddress: blank(values.recipientAddress),
    dearName: blank(values.dearName),
    resumptionDate: blank(values.resumptionDate),
    salary: blank(values.salary),
    workSchedule: blank(values.workSchedule),
    probationPeriod: blank(values.probationPeriod),
    terminationNotice: blank(values.terminationNotice),
    authorizedName: blank(values.authorizedName),
    authorizedPosition: blank(values.authorizedPosition),
    acceptanceName: blank(values.acceptanceName || values.employeeSignature),
    employeeSignature: blank(values.employeeSignature),
    signatureImage: values.signatureImage || '',
    acceptanceDate: blank(values.acceptanceDate),
  }

  const signatureBlock = v.signatureImage
    ? `<p><strong>Signature:</strong></p><img class="sig-img" src="${v.signatureImage}" alt="Employee signature" />`
    : `<p><strong>Signature:</strong> ${v.employeeSignature}</p>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Zura Spa Employment Letter — ${v.acceptanceName}</title>
  <style>
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
    .brand img { width: 72px; height: auto; margin-bottom: 8px; }
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
      margin: 18px 0 14px;
      font-size: 16px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    p, li { margin: 0 0 8px; }
    .meta p { margin-bottom: 6px; }
    .clause { margin: 14px 0; }
    .clause h3 {
      margin: 0 0 6px;
      font-size: 13px;
      color: #6d2c40;
    }
    ul { margin: 0 0 8px; padding-left: 18px; }
    .sign-block {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 22px;
    }
    .line { border-top: 1px solid #1f1220; margin-top: 36px; padding-top: 6px; }
    .acceptance {
      margin-top: 28px;
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
  </style>
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

    <div class="meta">
      <p><strong>Date:</strong> ${v.letterDate}</p>
      <h2>Employment Letter</h2>
      <p><strong>To:</strong> ${v.recipientName}</p>
      <p><strong>Address:</strong> ${v.recipientAddress}</p>
      <p>Dear ${v.dearName},</p>
    </div>

    <p><strong>OFFER OF EMPLOYMENT AS ZURA WELLNESS THERAPIST</strong></p>
    <p>
      We are pleased to offer you employment with Zura Spa as a Wellness Therapist.
      This appointment is based on your suitability for the role and your willingness to uphold
      the professional standards, values, service expectations, and operational policies of Zura Spa.
    </p>

    <div class="clause">
      <h3>1. Position</h3>
      <p>
        You are employed as a Massage Therapist. Your duties include providing professional massage
        services, preparing the massage room, maintaining hygiene standards, attending to clients
        respectfully, following company procedures, and carrying out other related duties assigned
        by management.
      </p>
    </div>

    <div class="clause">
      <h3>2. Work Location</h3>
      <p>
        Your primary place of work shall be Zura Spa, 4 Elohor Avenue, Peter Odili Rd, off Ekpeli Drive,
        Trans Amadi, beside Market Square, Port Harcourt. You may also be required to attend to approved
        home-service bookings where applicable and as assigned by management.
      </p>
    </div>

    <div class="clause">
      <h3>3. Resumption Date</h3>
      <p>Your employment shall commence on: <strong>${v.resumptionDate}</strong></p>
    </div>

    <div class="clause">
      <h3>4. Salary</h3>
      <p>
        Your monthly salary shall be: <strong>₦${v.salary}</strong>. This salary is subject to attendance,
        punctuality, work schedule, deductions for non-payable absence, late-coming deductions, and any
        other agreed employment terms.
      </p>
    </div>

    <div class="clause">
      <h3>5. Work Schedule</h3>
      <p>
        Your work schedule shall be: <strong>${v.workSchedule}</strong>. You are expected to resume work
        on time, remain available during working hours, and notify management early where there is any
        issue affecting your attendance or availability.
      </p>
    </div>

    <div class="clause">
      <h3>6. Non-Payable Absence</h3>
      <p>
        Any day the employee does not work or is absent shall be treated as non-payable. Salary shall
        only be paid for payable workdays, approved workdays, or days expressly approved by management.
      </p>
    </div>

    <div class="clause">
      <h3>7. Lateness Deduction</h3>
      <p>
        Where an employee reports late to work, a lateness deduction of 0.4% of the employee’s monthly
        salary shall apply per lateness incident, unless otherwise waived by management.
      </p>
    </div>

    <div class="clause">
      <h3>8. Queries, Suspension and Termination</h3>
      <p>
        Three (3) official queries may lead to suspension. Three (3) suspensions within one year may lead
        to termination of employment. Serious misconduct may still attract immediate disciplinary action,
        including suspension or termination, depending on the severity of the matter.
      </p>
    </div>

    <div class="clause">
      <h3>9. Staff Accommodation</h3>
      <p>
        Staff accommodation is free to access as a staff member, subject to availability, house rules,
        cleanliness standards, peaceful conduct, and continued employment with Zura Spa.
      </p>
    </div>

    <div class="clause">
      <h3>10. Reporting, Escalation, Correction, and Improvement</h3>
      <p>
        You are expected to be willing to give reports, escalate issues promptly, accept correction, and
        show continuous improvement. This includes reporting client concerns, operational issues, therapist
        observations, room readiness, tool condition, and any matter that may affect service quality,
        client safety, or company standards.
      </p>
    </div>

    <div class="clause">
      <h3>11. Duties and Responsibilities</h3>
      <ul>
        <li>Provide professional massage services to clients.</li>
        <li>Maintain proper hygiene, cleanliness, and personal appearance.</li>
        <li>Prepare and clean the massage room before and after each session.</li>
        <li>Handle towels, oils, massage tools, and company property responsibly.</li>
        <li>Communicate politely with clients, colleagues, and management.</li>
        <li>Maintain confidentiality regarding clients and company matters.</li>
        <li>Follow Zura Spa service standards, procedures, and instructions.</li>
        <li>Attend training, correction, and performance reviews when required.</li>
        <li>Avoid gossip, conflict, disrespectful conduct, or unprofessional behaviour.</li>
        <li>Represent Zura Spa in a respectful and professional manner at all times.</li>
      </ul>
    </div>

    <div class="clause">
      <h3>12. Professional Conduct</h3>
      <p>
        Zura Spa places high value on professionalism, discipline, client care, teamwork, integrity,
        emotional control, respect, and accountability. Any act of dishonesty, negligence, harassment,
        theft, disrespect, breach of confidentiality, or behaviour that damages the image of Zura Spa may
        attract disciplinary action, including suspension or termination of employment.
      </p>
    </div>

    <div class="clause">
      <h3>13. Client Boundaries and Confidentiality</h3>
      <p>
        You must maintain proper professional boundaries with all clients. Client information, conversations,
        personal details, bookings, preferences, and private matters must not be discussed outside official
        work purposes.
      </p>
    </div>

    <div class="clause">
      <h3>14. Content and Brand Cooperation</h3>
      <p>
        As part of Zura Spa’s brand visibility and growth, staff may be required to participate in approved
        professional content creation, including photos, short videos, service demonstrations,
        behind-the-scenes content, educational content, or promotional content. Staff are expected to
        cooperate with the social media manager and management while maintaining professional appearance,
        conduct, and brand standards.
      </p>
    </div>

    <div class="clause">
      <h3>15. Performance Review</h3>
      <p>
        Your performance may be reviewed monthly or periodically using areas such as punctuality, attendance,
        integrity, professional conduct, client care, hygiene, teamwork, communication, responsibility,
        attention to detail, compliance with spa standards, emotional control, willingness to learn,
        confidentiality, initiative, accountability, and cooperation with leadership.
      </p>
    </div>

    <div class="clause">
      <h3>16. Probation Period</h3>
      <p>
        Your employment shall be subject to a probation period of: <strong>${v.probationPeriod}</strong>.
        During this period, your attitude, skill, punctuality, client care, teamwork, and general suitability
        for the role will be assessed.
      </p>
    </div>

    <div class="clause">
      <h3>17. Termination of Employment</h3>
      <p>
        Either party may terminate this employment by giving: <strong>${v.terminationNotice}</strong> notice
        or payment in lieu of notice, except in cases of serious misconduct where employment may be
        terminated immediately.
      </p>
    </div>

    <div class="clause">
      <h3>18. Acceptance</h3>
      <p>
        Kindly sign below to confirm that you accept this offer of employment and agree to abide by the
        rules, standards, and expectations of Zura Spa. We welcome you to Zura Spa and look forward to your
        commitment, growth, and excellent service delivery.
      </p>
      <p>Yours faithfully,</p>
      <p><strong>For: Zura Spa</strong></p>
    </div>

    <div class="sign-block">
      <div>
        <div class="line">Authorized Signatory</div>
        <p>Name: ${v.authorizedName}</p>
        <p>Position: ${v.authorizedPosition}</p>
      </div>
      <div></div>
    </div>

    <div class="acceptance">
      <h3>ACCEPTANCE OF OFFER</h3>
      <p>
        I, <strong>${v.acceptanceName}</strong>, hereby accept this offer of employment as a Massage
        Therapist with Zura Spa. I agree to comply with the company’s rules, standards, and employment terms.
      </p>
      ${signatureBlock}
      <p><strong>Date:</strong> ${v.acceptanceDate}</p>
    </div>
  </div>
</body>
</html>`
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

export function EmploymentLetter({ topic, backTo, locked = true }) {
  const existing = readForm(topic.id)
  const [values, setValues] = useState(() => ({
    ...emptyValues,
    ...existing,
    letterDate: existing?.letterDate || new Date().toISOString().slice(0, 10),
    acceptanceDate: existing?.acceptanceDate || new Date().toISOString().slice(0, 10),
  }))
  const [agreed, setAgreed] = useState(Boolean(existing?.agreed))
  const [saved, setSaved] = useState(
    Boolean(existing?.signatureImage || existing?.employeeSignature),
  )
  const [status, setStatus] = useState('')

  const setField = (name, value) =>
    setValues((current) => ({ ...current, [name]: value }))

  const letterHtml = useMemo(() => buildLetterHtml(values), [values])

  function handleSign(event) {
    event.preventDefault()
    if (!agreed) {
      setStatus('Please confirm acceptance before signing.')
      return
    }
    if (!values.signatureImage) {
      setStatus('Please draw your handwritten signature.')
      return
    }
    if (!values.acceptanceName.trim() && !values.employeeSignature.trim()) {
      setStatus('Please enter your full name for acceptance.')
      return
    }

    const payload = {
      ...values,
      acceptanceName: values.acceptanceName || values.employeeSignature,
      employeeSignature: values.employeeSignature || values.acceptanceName,
      agreed: true,
      signedAt: new Date().toISOString(),
    }
    saveForm(topic.id, payload)
    setSaved(true)
    setStatus('')
  }

  function handleDownloadHtml() {
    const name = (values.employeeSignature || values.recipientName || 'staff')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()
    downloadBlob(`zura-spa-employment-letter-${name || 'staff'}.html`, letterHtml)
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
          <h2>Fill employment details</h2>
          <div className="el-grid">
            <label>
              Letter date
              <input
                type="date"
                value={values.letterDate}
                onChange={(e) => setField('letterDate', e.target.value)}
                required
              />
            </label>
            <label>
              Employee full name
              <input
                type="text"
                value={values.recipientName}
                onChange={(e) => {
                  const name = e.target.value
                  setValues((current) => ({
                    ...current,
                    recipientName: name,
                    dearName: current.dearName || name,
                    acceptanceName: current.acceptanceName || name,
                  }))
                }}
                required
              />
            </label>
            <label className="el-span-2">
              Employee address
              <textarea
                value={values.recipientAddress}
                onChange={(e) => setField('recipientAddress', e.target.value)}
                required
              />
            </label>
            <label>
              Salutation name
              <input
                type="text"
                value={values.dearName}
                onChange={(e) => setField('dearName', e.target.value)}
                required
              />
            </label>
            <label>
              Resumption date
              <input
                type="date"
                value={values.resumptionDate}
                onChange={(e) => setField('resumptionDate', e.target.value)}
                required
              />
            </label>
            <label>
              Monthly salary (₦)
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 70,000"
                value={values.salary}
                onChange={(e) => setField('salary', e.target.value)}
                required
              />
            </label>
            <label>
              Work schedule
              <input
                type="text"
                placeholder="e.g. 6 days a week"
                value={values.workSchedule}
                onChange={(e) => setField('workSchedule', e.target.value)}
                required
              />
            </label>
            <label>
              Probation period
              <input
                type="text"
                placeholder="e.g. 1 month"
                value={values.probationPeriod}
                onChange={(e) => setField('probationPeriod', e.target.value)}
                required
              />
            </label>
            <label>
              Termination notice
              <input
                type="text"
                value={values.terminationNotice}
                onChange={(e) => setField('terminationNotice', e.target.value)}
                required
              />
            </label>
            <label>
              Authorized signatory name
              <input
                type="text"
                value={values.authorizedName}
                onChange={(e) => setField('authorizedName', e.target.value)}
              />
            </label>
            <label>
              Authorized signatory position
              <input
                type="text"
                value={values.authorizedPosition}
                onChange={(e) => setField('authorizedPosition', e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="el-letter" aria-label="Employment letter preview">
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

          <p><strong>Date:</strong> {blank(values.letterDate)}</p>
          <h3 className="el-letter__title">Employment Letter</h3>
          <p><strong>To:</strong> {blank(values.recipientName)}</p>
          <p><strong>Address:</strong> {blank(values.recipientAddress)}</p>
          <p>Dear {blank(values.dearName)},</p>

          <p>
            <strong>OFFER OF EMPLOYMENT AS ZURA WELLNESS THERAPIST</strong>
          </p>
          <p>
            We are pleased to offer you employment with Zura Spa as a Wellness Therapist.
            This appointment is based on your suitability for the role and your willingness
            to uphold the professional standards, values, service expectations, and operational
            policies of Zura Spa.
          </p>

          <h4>1. Position</h4>
          <p>
            You are employed as a Massage Therapist. Your duties include providing professional
            massage services, preparing the massage room, maintaining hygiene standards, attending
            to clients respectfully, following company procedures, and carrying out other related
            duties assigned by management.
          </p>

          <h4>2. Work Location</h4>
          <p>
            Your primary place of work shall be Zura Spa, 4 Elohor Avenue, Peter Odili Rd, off
            Ekpeli Drive, Trans Amadi, beside Market Square, Port Harcourt. You may also be
            required to attend to approved home-service bookings where applicable and as assigned
            by management.
          </p>

          <h4>3. Resumption Date</h4>
          <p>Your employment shall commence on: <strong>{blank(values.resumptionDate)}</strong></p>

          <h4>4. Salary</h4>
          <p>
            Your monthly salary shall be: <strong>₦{blank(values.salary)}</strong>. This salary is
            subject to attendance, punctuality, work schedule, deductions for non-payable absence,
            late-coming deductions, and any other agreed employment terms.
          </p>

          <h4>5. Work Schedule</h4>
          <p>
            Your work schedule shall be: <strong>{blank(values.workSchedule)}</strong>. You are
            expected to resume work on time, remain available during working hours, and notify
            management early where there is any issue affecting your attendance or availability.
          </p>

          <h4>6. Non-Payable Absence</h4>
          <p>
            Any day the employee does not work or is absent shall be treated as non-payable. Salary
            shall only be paid for payable workdays, approved workdays, or days expressly approved
            by management.
          </p>

          <h4>7. Lateness Deduction</h4>
          <p>
            Where an employee reports late to work, a lateness deduction of 0.4% of the employee’s
            monthly salary shall apply per lateness incident, unless otherwise waived by management.
          </p>

          <h4>8. Queries, Suspension and Termination</h4>
          <p>
            Three (3) official queries may lead to suspension. Three (3) suspensions within one year
            may lead to termination of employment. Serious misconduct may still attract immediate
            disciplinary action, including suspension or termination, depending on the severity of
            the matter.
          </p>

          <h4>9. Staff Accommodation</h4>
          <p>
            Staff accommodation is free to access as a staff member, subject to availability, house
            rules, cleanliness standards, peaceful conduct, and continued employment with Zura Spa.
          </p>

          <h4>10. Reporting, Escalation, Correction, and Improvement</h4>
          <p>
            You are expected to be willing to give reports, escalate issues promptly, accept
            correction, and show continuous improvement. This includes reporting client concerns,
            operational issues, therapist observations, room readiness, tool condition, and any
            matter that may affect service quality, client safety, or company standards.
          </p>

          <h4>11. Duties and Responsibilities</h4>
          <ul>
            <li>Provide professional massage services to clients.</li>
            <li>Maintain proper hygiene, cleanliness, and personal appearance.</li>
            <li>Prepare and clean the massage room before and after each session.</li>
            <li>Handle towels, oils, massage tools, and company property responsibly.</li>
            <li>Communicate politely with clients, colleagues, and management.</li>
            <li>Maintain confidentiality regarding clients and company matters.</li>
            <li>Follow Zura Spa service standards, procedures, and instructions.</li>
            <li>Attend training, correction, and performance reviews when required.</li>
            <li>Avoid gossip, conflict, disrespectful conduct, or unprofessional behaviour.</li>
            <li>Represent Zura Spa in a respectful and professional manner at all times.</li>
          </ul>

          <h4>12. Professional Conduct</h4>
          <p>
            Zura Spa places high value on professionalism, discipline, client care, teamwork,
            integrity, emotional control, respect, and accountability. Any act of dishonesty,
            negligence, harassment, theft, disrespect, breach of confidentiality, or behaviour that
            damages the image of Zura Spa may attract disciplinary action, including suspension or
            termination of employment.
          </p>

          <h4>13. Client Boundaries and Confidentiality</h4>
          <p>
            You must maintain proper professional boundaries with all clients. Client information,
            conversations, personal details, bookings, preferences, and private matters must not be
            discussed outside official work purposes.
          </p>

          <h4>14. Content and Brand Cooperation</h4>
          <p>
            As part of Zura Spa’s brand visibility and growth, staff may be required to participate
            in approved professional content creation, including photos, short videos, service
            demonstrations, behind-the-scenes content, educational content, or promotional content.
            Staff are expected to cooperate with the social media manager and management while
            maintaining professional appearance, conduct, and brand standards.
          </p>

          <h4>15. Performance Review</h4>
          <p>
            Your performance may be reviewed monthly or periodically using areas such as punctuality,
            attendance, integrity, professional conduct, client care, hygiene, teamwork,
            communication, responsibility, attention to detail, compliance with spa standards,
            emotional control, willingness to learn, confidentiality, initiative, accountability,
            and cooperation with leadership.
          </p>

          <h4>16. Probation Period</h4>
          <p>
            Your employment shall be subject to a probation period of:{' '}
            <strong>{blank(values.probationPeriod)}</strong>. During this period, your attitude,
            skill, punctuality, client care, teamwork, and general suitability for the role will be
            assessed.
          </p>

          <h4>17. Termination of Employment</h4>
          <p>
            Either party may terminate this employment by giving:{' '}
            <strong>{blank(values.terminationNotice)}</strong> notice or payment in lieu of notice,
            except in cases of serious misconduct where employment may be terminated immediately.
          </p>

          <h4>18. Acceptance</h4>
          <p>
            Kindly sign below to confirm that you accept this offer of employment and agree to abide
            by the rules, standards, and expectations of Zura Spa. We welcome you to Zura Spa and look
            forward to your commitment, growth, and excellent service delivery.
          </p>
          <p>Yours faithfully,</p>
          <p><strong>For: Zura Spa</strong></p>
          <div className="el-sign-row">
            <div>
              <p className="el-sign-line">Authorized Signatory</p>
              <p>Name: {blank(values.authorizedName)}</p>
              <p>Position: {blank(values.authorizedPosition)}</p>
            </div>
          </div>

          <div className="el-acceptance">
            <h4>ACCEPTANCE OF OFFER</h4>
            <p>
              I, <strong>{blank(values.acceptanceName || values.employeeSignature)}</strong>, hereby
              accept this offer of employment as a Massage Therapist with Zura Spa. I agree to comply
              with the company’s rules, standards, and employment terms.
            </p>
            {values.signatureImage ? (
              <>
                <p><strong>Signature:</strong></p>
                <img
                  className="el-signature-img"
                  src={values.signatureImage}
                  alt="Employee handwritten signature"
                />
              </>
            ) : (
              <p><strong>Signature:</strong> {blank(values.employeeSignature)}</p>
            )}
            <p><strong>Date:</strong> {blank(values.acceptanceDate)}</p>
          </div>
        </section>

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
              I have read this employment letter and accept the offer of employment with Zura Spa.
            </span>
          </label>
          <label>
            Full name for acceptance
            <input
              type="text"
              value={values.acceptanceName}
              onChange={(e) => setField('acceptanceName', e.target.value)}
              required
            />
          </label>

          <SignaturePad
            value={values.signatureImage}
            onChange={(dataUrl) => setField('signatureImage', dataUrl)}
            label="Please provide your handwritten signature to confirm your acknowledgment"
          />

          <label>
            Acceptance date
            <input
              type="date"
              value={values.acceptanceDate}
              onChange={(e) => setField('acceptanceDate', e.target.value)}
              required
            />
          </label>

          {status ? <p className="el-status">{status}</p> : null}

          <div className="el-actions">
            <button type="submit">Sign letter</button>
            <button type="button" className="ghost" onClick={handleDownloadHtml}>
              Download letter
            </button>
            <button type="button" className="ghost" onClick={handleDownloadPdf}>
              Print / Save PDF
            </button>
          </div>
        </form>
      </LockedContent>
    </div>
  )
}

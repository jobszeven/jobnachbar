import * as React from 'react'

// Brand colors
const colors = {
  red: '#E63946',
  redDark: '#C62E3A',
  dark: '#1A1A2E',
  darkCard: '#252527',
  white: '#F8F8F8',
  gray: '#8E8E93',
  grayLight: '#AEAEB2',
}

// Base email template wrapper
interface EmailTemplateProps {
  children: React.ReactNode
  previewText?: string
}

export function EmailTemplate({ children, previewText }: EmailTemplateProps) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        {previewText && (
          <title>{previewText}</title>
        )}
      </head>
      <body style={{
        backgroundColor: colors.dark,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: 0,
        width: '100%',
      }}>
        {/* Preview text (hidden) */}
        {previewText && (
          <div style={{
            display: 'none',
            maxHeight: 0,
            overflow: 'hidden',
          }}>
            {previewText}
          </div>
        )}

        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: colors.dark }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '40px 20px' }}>
                <table width="100%" style={{ maxWidth: '600px' }} cellPadding="0" cellSpacing="0">
                  {/* Header with Logo */}
                  <tbody>
                    <tr>
                      <td align="center" style={{ paddingBottom: '30px' }}>
                        <table cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={{
                                backgroundColor: colors.red,
                                borderRadius: '8px',
                                padding: '8px 16px',
                              }}>
                                <span style={{
                                  color: colors.white,
                                  fontSize: '24px',
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                }}>
                                  Job<span style={{ fontWeight: 'normal' }}>Nachbar</span>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Content */}
                    <tr>
                      <td style={{
                        backgroundColor: colors.darkCard,
                        borderRadius: '12px',
                        padding: '40px',
                      }}>
                        {children}
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={{ paddingTop: '30px' }}>
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td align="center" style={{ paddingBottom: '15px' }}>
                                <a href="https://jobnachbar.com/impressum" style={{
                                  color: colors.gray,
                                  fontSize: '12px',
                                  textDecoration: 'none',
                                  marginRight: '15px',
                                }}>
                                  Impressum
                                </a>
                                <a href="https://jobnachbar.com/datenschutz" style={{
                                  color: colors.gray,
                                  fontSize: '12px',
                                  textDecoration: 'none',
                                  marginRight: '15px',
                                }}>
                                  Datenschutz
                                </a>
                                <a href="https://jobnachbar.com/kontakt" style={{
                                  color: colors.gray,
                                  fontSize: '12px',
                                  textDecoration: 'none',
                                }}>
                                  Kontakt
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td align="center">
                                <p style={{
                                  color: colors.gray,
                                  fontSize: '12px',
                                  margin: 0,
                                }}>
                                  © 2026 JobNachbar. Alle Rechte vorbehalten.
                                </p>
                                <p style={{
                                  color: colors.gray,
                                  fontSize: '11px',
                                  margin: '10px 0 0 0',
                                }}>
                                  Diese E-Mail wurde automatisch versendet. Bitte antworte nicht direkt auf diese E-Mail.
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

// Button component
interface ButtonProps {
  href: string
  children: React.ReactNode
}

export function EmailButton({ href, children }: ButtonProps) {
  return (
    <table cellPadding="0" cellSpacing="0" style={{ margin: '25px 0' }}>
      <tbody>
        <tr>
          <td style={{
            backgroundColor: colors.red,
            borderRadius: '8px',
            padding: '14px 28px',
          }}>
            <a href={href} style={{
              color: colors.white,
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
            }}>
              {children}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

// Heading component
interface HeadingProps {
  children: React.ReactNode
}

export function EmailHeading({ children }: HeadingProps) {
  return (
    <h1 style={{
      color: colors.white,
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0 0 20px 0',
      lineHeight: '1.3',
    }}>
      {children}
    </h1>
  )
}

// Paragraph component
interface ParagraphProps {
  children: React.ReactNode
}

export function EmailParagraph({ children }: ParagraphProps) {
  return (
    <p style={{
      color: colors.grayLight,
      fontSize: '16px',
      lineHeight: '1.6',
      margin: '0 0 16px 0',
    }}>
      {children}
    </p>
  )
}

// Divider component
export function EmailDivider() {
  return (
    <hr style={{
      border: 'none',
      borderTop: `1px solid ${colors.gray}40`,
      margin: '25px 0',
    }} />
  )
}

// Info box component
interface InfoBoxProps {
  children: React.ReactNode
}

export function EmailInfoBox({ children }: InfoBoxProps) {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" style={{
      backgroundColor: colors.dark,
      borderRadius: '8px',
      margin: '20px 0',
    }}>
      <tbody>
        <tr>
          <td style={{ padding: '20px' }}>
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

// ==========================================
// SPECIFIC EMAIL TEMPLATES
// ==========================================

// 1. Welcome Email (Bewerber)
interface WelcomeApplicantProps {
  name: string
  verificationUrl?: string
}

export function WelcomeApplicantEmail({ name, verificationUrl }: WelcomeApplicantProps) {
  return (
    <EmailTemplate previewText={`Willkommen bei JobNachbar, ${name}!`}>
      <EmailHeading>Willkommen bei JobNachbar!</EmailHeading>
      <EmailParagraph>
        Hallo {name},
      </EmailParagraph>
      <EmailParagraph>
        herzlich willkommen bei JobNachbar! Wir freuen uns, dich an Bord zu haben.
      </EmailParagraph>
      <EmailParagraph>
        Du bist jetzt Teil der größten lokalen Jobbörse für Zeven und Umgebung.
        Mit deinem Profil findest du schnell passende Jobs in deiner Nähe.
      </EmailParagraph>

      {verificationUrl && (
        <>
          <EmailParagraph>
            Bitte bestätige zunächst deine E-Mail-Adresse:
          </EmailParagraph>
          <EmailButton href={verificationUrl}>
            E-Mail bestätigen
          </EmailButton>
        </>
      )}

      <EmailDivider />

      <EmailParagraph>
        <strong style={{ color: '#F8F8F8' }}>Deine nächsten Schritte:</strong>
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          ✓ Vervollständige dein Profil für bessere Job-Matches
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          ✓ Lade deinen Lebenslauf hoch
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0' }}>
          ✓ Entdecke passende Jobs in deiner Region
        </p>
      </EmailInfoBox>

      <EmailButton href="https://jobnachbar.com/dashboard/bewerber">
        Zum Dashboard
      </EmailButton>

      <EmailParagraph>
        Bei Fragen sind wir jederzeit für dich da!
      </EmailParagraph>
      <EmailParagraph>
        Viele Grüße,<br />
        <span style={{ color: colors.white }}>Dein JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 2. Email Verification
interface EmailVerificationProps {
  name: string
  verificationUrl: string
}

export function EmailVerificationEmail({ name, verificationUrl }: EmailVerificationProps) {
  return (
    <EmailTemplate previewText="Bestätige deine E-Mail-Adresse">
      <EmailHeading>E-Mail bestätigen</EmailHeading>
      <EmailParagraph>
        Hallo {name},
      </EmailParagraph>
      <EmailParagraph>
        bitte bestätige deine E-Mail-Adresse, um alle Funktionen von JobNachbar nutzen zu können.
      </EmailParagraph>
      <EmailButton href={verificationUrl}>
        E-Mail bestätigen
      </EmailButton>
      <EmailParagraph>
        Oder kopiere diesen Link in deinen Browser:
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '12px', margin: 0, wordBreak: 'break-all' }}>
          {verificationUrl}
        </p>
      </EmailInfoBox>
      <EmailParagraph>
        Der Link ist 24 Stunden gültig. Falls du diese E-Mail nicht angefordert hast,
        kannst du sie einfach ignorieren.
      </EmailParagraph>
      <EmailParagraph>
        Viele Grüße,<br />
        <span style={{ color: colors.white }}>Dein JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 3. Password Reset
interface PasswordResetProps {
  name: string
  resetUrl: string
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetProps) {
  return (
    <EmailTemplate previewText="Passwort zurücksetzen">
      <EmailHeading>Passwort zurücksetzen</EmailHeading>
      <EmailParagraph>
        Hallo {name},
      </EmailParagraph>
      <EmailParagraph>
        du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.
        Klicke auf den Button unten, um ein neues Passwort zu erstellen.
      </EmailParagraph>
      <EmailButton href={resetUrl}>
        Passwort zurücksetzen
      </EmailButton>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: 0 }}>
          ⚠️ Der Link ist nur 1 Stunde gültig.
        </p>
      </EmailInfoBox>
      <EmailParagraph>
        Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail.
        Dein Passwort bleibt unverändert.
      </EmailParagraph>
      <EmailParagraph>
        Viele Grüße,<br />
        <span style={{ color: colors.white }}>Dein JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 4. New Job Matches
interface NewJobMatchesProps {
  name: string
  jobs: Array<{ id: string; title: string; company: string; city: string; matchScore: number }>
}

export function NewJobMatchesEmail({ name, jobs }: NewJobMatchesProps) {
  return (
    <EmailTemplate previewText={`${jobs.length} neue Jobs passen zu deinem Profil!`}>
      <EmailHeading>Neue passende Jobs für dich!</EmailHeading>
      <EmailParagraph>
        Hallo {name},
      </EmailParagraph>
      <EmailParagraph>
        wir haben {jobs.length} neue Jobs gefunden, die zu deinem Profil passen:
      </EmailParagraph>

      {jobs.map((job) => (
        <EmailInfoBox key={job.id}>
          <p style={{ color: colors.white, fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
            {job.title}
          </p>
          <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
            {job.company} • {job.city}
          </p>
          <p style={{ color: colors.red, fontSize: '12px', margin: 0 }}>
            {job.matchScore}% Match
          </p>
        </EmailInfoBox>
      ))}

      <EmailButton href="https://jobnachbar.com/dashboard/bewerber">
        Alle Jobs ansehen
      </EmailButton>

      <EmailParagraph>
        Viele Grüße,<br />
        <span style={{ color: colors.white }}>Dein JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 5. Application Sent
interface ApplicationSentProps {
  name: string
  jobTitle: string
  companyName: string
}

export function ApplicationSentEmail({ name, jobTitle, companyName }: ApplicationSentProps) {
  return (
    <EmailTemplate previewText={`Deine Bewerbung wurde gesendet`}>
      <EmailHeading>Bewerbung erfolgreich gesendet!</EmailHeading>
      <EmailParagraph>
        Hallo {name},
      </EmailParagraph>
      <EmailParagraph>
        deine Bewerbung wurde erfolgreich an <strong style={{ color: colors.white }}>{companyName}</strong> gesendet.
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: 0 }}>
          <strong style={{ color: colors.white }}>Position:</strong> {jobTitle}<br />
          <strong style={{ color: colors.white }}>Unternehmen:</strong> {companyName}
        </p>
      </EmailInfoBox>
      <EmailParagraph>
        Der Arbeitgeber wurde benachrichtigt und kann deine Bewerbung nun einsehen.
        Wir informieren dich, sobald es ein Update gibt.
      </EmailParagraph>
      <EmailButton href="https://jobnachbar.com/dashboard/bewerber">
        Bewerbungen verwalten
      </EmailButton>
      <EmailParagraph>
        Viel Erfolg!<br />
        <span style={{ color: colors.white }}>Dein JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 6. Application Status Update
interface ApplicationStatusProps {
  name: string
  jobTitle: string
  companyName: string
  status: 'viewed' | 'invited' | 'rejected'
}

export function ApplicationStatusEmail({ name, jobTitle, companyName, status }: ApplicationStatusProps) {
  const statusMessages = {
    viewed: {
      title: 'Deine Bewerbung wurde angesehen',
      message: `${companyName} hat deine Bewerbung für die Stelle "${jobTitle}" angesehen.`,
      cta: 'Das ist ein gutes Zeichen! Wir halten dich auf dem Laufenden.',
    },
    invited: {
      title: 'Du wurdest eingeladen!',
      message: `${companyName} möchte dich für die Stelle "${jobTitle}" kennenlernen.`,
      cta: 'Herzlichen Glückwunsch! Prüfe dein Dashboard für weitere Details.',
    },
    rejected: {
      title: 'Update zu deiner Bewerbung',
      message: `Leider hat ${companyName} sich für andere Kandidaten entschieden.`,
      cta: 'Kopf hoch! Es gibt viele andere passende Jobs für dich.',
    },
  }

  const content = statusMessages[status]

  return (
    <EmailTemplate previewText={content.title}>
      <EmailHeading>{content.title}</EmailHeading>
      <EmailParagraph>
        Hallo {name},
      </EmailParagraph>
      <EmailParagraph>
        {content.message}
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: 0 }}>
          {content.cta}
        </p>
      </EmailInfoBox>
      <EmailButton href="https://jobnachbar.com/dashboard/bewerber">
        Zum Dashboard
      </EmailButton>
      <EmailParagraph>
        Viele Grüße,<br />
        <span style={{ color: colors.white }}>Dein JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 7. Profile Incomplete Reminder
interface ProfileReminderProps {
  name: string
  completionPercentage: number
  missingFields: string[]
}

export function ProfileReminderEmail({ name, completionPercentage, missingFields }: ProfileReminderProps) {
  return (
    <EmailTemplate previewText="Vervollständige dein Profil für bessere Job-Matches">
      <EmailHeading>Dein Profil ist zu {completionPercentage}% vollständig</EmailHeading>
      <EmailParagraph>
        Hallo {name},
      </EmailParagraph>
      <EmailParagraph>
        ein vollständiges Profil erhöht deine Chancen, von Arbeitgebern gefunden zu werden, erheblich.
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.white, fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
          Das fehlt noch:
        </p>
        {missingFields.map((field, index) => (
          <p key={index} style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 5px 0' }}>
            • {field}
          </p>
        ))}
      </EmailInfoBox>
      <EmailButton href="https://jobnachbar.com/dashboard/bewerber/profil">
        Profil vervollständigen
      </EmailButton>
      <EmailParagraph>
        Viele Grüße,<br />
        <span style={{ color: colors.white }}>Dein JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 8. Welcome Email (Arbeitgeber)
interface WelcomeEmployerProps {
  name: string
  companyName: string
  verificationUrl?: string
}

export function WelcomeEmployerEmail({ name, companyName, verificationUrl }: WelcomeEmployerProps) {
  return (
    <EmailTemplate previewText={`Willkommen bei JobNachbar, ${companyName}!`}>
      <EmailHeading>Willkommen bei JobNachbar!</EmailHeading>
      <EmailParagraph>
        Hallo {name},
      </EmailParagraph>
      <EmailParagraph>
        herzlich willkommen bei JobNachbar! Wir freuen uns, <strong style={{ color: colors.white }}>{companyName}</strong> als
        neuen Partner begrüßen zu dürfen.
      </EmailParagraph>
      <EmailParagraph>
        Mit JobNachbar finden Sie qualifizierte Mitarbeiter direkt aus Ihrer Region –
        schnell, einfach und effektiv.
      </EmailParagraph>

      {verificationUrl && (
        <>
          <EmailParagraph>
            Bitte bestätigen Sie zunächst Ihre E-Mail-Adresse:
          </EmailParagraph>
          <EmailButton href={verificationUrl}>
            E-Mail bestätigen
          </EmailButton>
        </>
      )}

      <EmailDivider />

      <EmailParagraph>
        <strong style={{ color: '#F8F8F8' }}>Ihre nächsten Schritte:</strong>
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          ✓ Vervollständigen Sie Ihr Firmenprofil
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          ✓ Erstellen Sie Ihre erste Stellenanzeige
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0' }}>
          ✓ Wählen Sie das passende Abo
        </p>
      </EmailInfoBox>

      <EmailButton href="https://jobnachbar.com/dashboard/arbeitgeber">
        Zum Dashboard
      </EmailButton>

      <EmailParagraph>
        Bei Fragen stehen wir Ihnen jederzeit zur Verfügung!
      </EmailParagraph>
      <EmailParagraph>
        Mit freundlichen Grüßen,<br />
        <span style={{ color: colors.white }}>Ihr JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 11. New Application Received (Arbeitgeber)
interface NewApplicationProps {
  employerName: string
  applicantName: string
  jobTitle: string
  isPremium: boolean
}

export function NewApplicationEmail({ employerName, applicantName, jobTitle, isPremium }: NewApplicationProps) {
  return (
    <EmailTemplate previewText={`Neue Bewerbung für ${jobTitle}`}>
      <EmailHeading>Neue Bewerbung eingegangen!</EmailHeading>
      <EmailParagraph>
        Hallo {employerName},
      </EmailParagraph>
      <EmailParagraph>
        Sie haben eine neue Bewerbung für die Stelle <strong style={{ color: colors.white }}>"{jobTitle}"</strong> erhalten.
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.white, fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
          {applicantName}
          {isPremium && (
            <span style={{
              backgroundColor: colors.red,
              color: colors.white,
              fontSize: '10px',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: '10px',
            }}>
              PREMIUM
            </span>
          )}
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: 0 }}>
          Bewerbung für: {jobTitle}
        </p>
      </EmailInfoBox>
      <EmailButton href="https://jobnachbar.com/dashboard/arbeitgeber/bewerbungen">
        Bewerbung ansehen
      </EmailButton>
      <EmailParagraph>
        Mit freundlichen Grüßen,<br />
        <span style={{ color: colors.white }}>Ihr JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 12. Job Expiring Soon
interface JobExpiringProps {
  employerName: string
  jobTitle: string
  daysLeft: number
  renewUrl: string
}

export function JobExpiringEmail({ employerName, jobTitle, daysLeft, renewUrl }: JobExpiringProps) {
  return (
    <EmailTemplate previewText={`Ihre Stellenanzeige läuft in ${daysLeft} Tagen ab`}>
      <EmailHeading>Stellenanzeige läuft bald ab</EmailHeading>
      <EmailParagraph>
        Hallo {employerName},
      </EmailParagraph>
      <EmailParagraph>
        Ihre Stellenanzeige <strong style={{ color: colors.white }}>"{jobTitle}"</strong> läuft
        in <strong style={{ color: colors.red }}>{daysLeft} Tagen</strong> ab.
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: 0 }}>
          Verlängern Sie jetzt, um weiterhin Bewerbungen zu erhalten und keine qualifizierten
          Kandidaten zu verpassen.
        </p>
      </EmailInfoBox>
      <EmailButton href={renewUrl}>
        Anzeige verlängern
      </EmailButton>
      <EmailParagraph>
        Mit freundlichen Grüßen,<br />
        <span style={{ color: colors.white }}>Ihr JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 13. Job Expired
interface JobExpiredProps {
  employerName: string
  jobTitle: string
}

export function JobExpiredEmail({ employerName, jobTitle }: JobExpiredProps) {
  return (
    <EmailTemplate previewText={`Ihre Stellenanzeige ist abgelaufen`}>
      <EmailHeading>Stellenanzeige abgelaufen</EmailHeading>
      <EmailParagraph>
        Hallo {employerName},
      </EmailParagraph>
      <EmailParagraph>
        Ihre Stellenanzeige <strong style={{ color: colors.white }}>"{jobTitle}"</strong> ist abgelaufen
        und nicht mehr öffentlich sichtbar.
      </EmailParagraph>
      <EmailParagraph>
        Sie können die Anzeige jederzeit reaktivieren oder eine neue erstellen.
      </EmailParagraph>
      <EmailButton href="https://jobnachbar.com/dashboard/arbeitgeber">
        Zum Dashboard
      </EmailButton>
      <EmailParagraph>
        Mit freundlichen Grüßen,<br />
        <span style={{ color: colors.white }}>Ihr JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 14. Subscription Activated
interface SubscriptionActivatedProps {
  employerName: string
  planName: string
  validUntil: string
}

export function SubscriptionActivatedEmail({ employerName, planName, validUntil }: SubscriptionActivatedProps) {
  return (
    <EmailTemplate previewText={`Ihr ${planName}-Abo ist aktiv`}>
      <EmailHeading>Abo erfolgreich aktiviert!</EmailHeading>
      <EmailParagraph>
        Hallo {employerName},
      </EmailParagraph>
      <EmailParagraph>
        Vielen Dank für Ihr Vertrauen! Ihr <strong style={{ color: colors.white }}>{planName}</strong>-Abo
        wurde erfolgreich aktiviert.
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: 0 }}>
          <strong style={{ color: colors.white }}>Paket:</strong> {planName}<br />
          <strong style={{ color: colors.white }}>Gültig bis:</strong> {validUntil}
        </p>
      </EmailInfoBox>
      <EmailParagraph>
        Sie können nun alle Funktionen Ihres Pakets nutzen.
      </EmailParagraph>
      <EmailButton href="https://jobnachbar.com/dashboard/arbeitgeber">
        Zum Dashboard
      </EmailButton>
      <EmailParagraph>
        Mit freundlichen Grüßen,<br />
        <span style={{ color: colors.white }}>Ihr JobNachbar Team</span>
      </EmailParagraph>
    </EmailTemplate>
  )
}

// 15. Admin: New Subscription Request
interface AdminSubscriptionRequestProps {
  customerName: string
  customerEmail: string
  planName: string
  userType: 'bewerber' | 'arbeitgeber'
  billingAddress: string
}

export function AdminSubscriptionRequestEmail({
  customerName,
  customerEmail,
  planName,
  userType,
  billingAddress,
}: AdminSubscriptionRequestProps) {
  return (
    <EmailTemplate previewText={`Neue Abo-Anfrage: ${planName}`}>
      <EmailHeading>Neue Abo-Anfrage eingegangen</EmailHeading>
      <EmailParagraph>
        Eine neue Abo-Anfrage ist eingegangen:
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          <strong style={{ color: colors.white }}>Kunde:</strong> {customerName}
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          <strong style={{ color: colors.white }}>E-Mail:</strong> {customerEmail}
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          <strong style={{ color: colors.white }}>Typ:</strong> {userType === 'bewerber' ? 'Bewerber' : 'Arbeitgeber'}
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          <strong style={{ color: colors.white }}>Paket:</strong> {planName}
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: 0 }}>
          <strong style={{ color: colors.white }}>Rechnungsadresse:</strong><br />
          {billingAddress}
        </p>
      </EmailInfoBox>
      <EmailButton href="https://jobnachbar.com/admin/abo-anfragen">
        Anfrage bearbeiten
      </EmailButton>
    </EmailTemplate>
  )
}

// 16. Admin: New Feedback
interface AdminFeedbackProps {
  rating: number
  category: string
  message: string
  email?: string
  pageUrl: string
}

export function AdminFeedbackEmail({ rating, category, message, email, pageUrl }: AdminFeedbackProps) {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

  return (
    <EmailTemplate previewText={`Neues Feedback: ${category}`}>
      <EmailHeading>Neues Feedback erhalten</EmailHeading>
      <EmailInfoBox>
        <p style={{ color: colors.red, fontSize: '24px', margin: '0 0 10px 0' }}>
          {stars}
        </p>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          <strong style={{ color: colors.white }}>Kategorie:</strong> {category}
        </p>
        {email && (
          <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
            <strong style={{ color: colors.white }}>E-Mail:</strong> {email}
          </p>
        )}
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: '0 0 10px 0' }}>
          <strong style={{ color: colors.white }}>Seite:</strong> {pageUrl}
        </p>
      </EmailInfoBox>
      <EmailParagraph>
        <strong style={{ color: colors.white }}>Nachricht:</strong>
      </EmailParagraph>
      <EmailInfoBox>
        <p style={{ color: colors.grayLight, fontSize: '14px', margin: 0, whiteSpace: 'pre-wrap' }}>
          {message}
        </p>
      </EmailInfoBox>
      <EmailButton href="https://jobnachbar.com/admin/feedback">
        Im Admin-Bereich ansehen
      </EmailButton>
    </EmailTemplate>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

// POST: Send invoice via email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get invoice with company
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        companies (id, company_name, email, contact_person),
        invoice_items (*)
      `)
      .eq('id', id)
      .single()

    if (error || !invoice) {
      return NextResponse.json(
        { error: 'Rechnung nicht gefunden' },
        { status: 404 }
      )
    }

    // Get email template
    const { data: template } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'invoice_new')
      .single()

    // Format amount
    const amount = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(invoice.total_cents / 100)

    const dueDate = new Date(invoice.due_date).toLocaleDateString('de-DE')

    // Replace template variables
    let emailHtml = template?.body_html || getDefaultInvoiceEmail()
    emailHtml = emailHtml
      .replace(/\{\{customer_name\}\}/g, invoice.customer_name)
      .replace(/\{\{invoice_number\}\}/g, invoice.invoice_number)
      .replace(/\{\{amount\}\}/g, amount)
      .replace(/\{\{due_date\}\}/g, dueDate)

    let emailSubject = template?.subject || 'Ihre Rechnung von JobNachbar'
    emailSubject = emailSubject.replace(/\{\{invoice_number\}\}/g, invoice.invoice_number)

    // Build email with invoice details
    const fullEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1D1D1F; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1D1D1F; padding: 20px; text-align: center; }
    .header img { height: 40px; }
    .content { padding: 30px; background: #f8f8f8; }
    .invoice-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .invoice-header { border-bottom: 2px solid #E63946; padding-bottom: 15px; margin-bottom: 15px; }
    .invoice-number { font-size: 24px; font-weight: bold; color: #E63946; }
    .line-items { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .line-items th, .line-items td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
    .line-items th { background: #f5f5f5; }
    .totals { text-align: right; margin-top: 20px; }
    .total-row { font-size: 18px; font-weight: bold; color: #E63946; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .btn { display: inline-block; background: #E63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: white; margin: 0;">JobNachbar</h1>
    </div>
    <div class="content">
      ${emailHtml}

      <div class="invoice-box">
        <div class="invoice-header">
          <span class="invoice-number">${invoice.invoice_number}</span>
          <div style="float: right; text-align: right;">
            <div>Rechnungsdatum: ${new Date(invoice.invoice_date).toLocaleDateString('de-DE')}</div>
            <div>Fällig: ${dueDate}</div>
          </div>
        </div>

        <table class="line-items">
          <thead>
            <tr>
              <th>Beschreibung</th>
              <th>Menge</th>
              <th>Preis</th>
              <th>Gesamt</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.invoice_items.map((item: any) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${(item.unit_price_cents / 100).toFixed(2)} €</td>
                <td>${(item.total_cents / 100).toFixed(2)} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div>Zwischensumme: ${(invoice.subtotal_cents / 100).toFixed(2)} €</div>
          <div>MwSt. (${invoice.tax_rate}%): ${(invoice.tax_cents / 100).toFixed(2)} €</div>
          <div class="total-row">Gesamtbetrag: ${amount}</div>
        </div>
      </div>

      <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin-top: 20px;">
        <strong>Bankverbindung:</strong><br>
        IBAN: DE89 3704 0044 0532 0130 00<br>
        BIC: COBADEFFXXX<br>
        Verwendungszweck: ${invoice.invoice_number}
      </div>
    </div>
    <div class="footer">
      <p>JobNachbar - Die lokale Jobbörse für Zeven und Umgebung</p>
      <p>Bei Fragen: info@jobnachbar.com</p>
    </div>
  </div>
</body>
</html>
    `

    // Send email via Resend
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'JobNachbar <rechnung@jobnachbar.com>',
      to: invoice.customer_email,
      subject: emailSubject,
      html: fullEmailHtml,
    })

    if (emailError) {
      throw new Error(emailError.message)
    }

    // Log email
    await supabase.from('email_log').insert({
      to_email: invoice.customer_email,
      to_name: invoice.customer_name,
      company_id: invoice.company_id,
      invoice_id: invoice.id,
      template_name: 'invoice_new',
      subject: emailSubject,
      body_preview: `Rechnung ${invoice.invoice_number} über ${amount}`,
      status: 'sent',
      resend_id: emailResult?.id
    })

    // Update invoice status
    await supabase
      .from('invoices')
      .update({ status: 'sent' })
      .eq('id', id)

    // Log activity
    await supabase.from('crm_activities').insert({
      company_id: invoice.company_id,
      invoice_id: invoice.id,
      activity_type: 'email_sent',
      title: 'Rechnung versendet',
      description: `Rechnung ${invoice.invoice_number} an ${invoice.customer_email} gesendet`,
      performed_by: 'admin'
    })

    return NextResponse.json({
      success: true,
      message: 'Rechnung wurde per E-Mail versendet'
    })
  } catch (error: any) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

function getDefaultInvoiceEmail() {
  return `
    <h2>Hallo {{customer_name}},</h2>
    <p>vielen Dank für Ihre Bestellung bei JobNachbar!</p>
    <p>Anbei finden Sie Ihre Rechnung <strong>{{invoice_number}}</strong> über <strong>{{amount}}</strong>.</p>
    <p><strong>Zahlungsziel:</strong> {{due_date}}</p>
  `
}

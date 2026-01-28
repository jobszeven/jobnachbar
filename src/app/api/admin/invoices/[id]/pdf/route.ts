import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Generate PDF invoice (returns HTML for printing/saving as PDF)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get invoice with items
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        companies (id, company_name, email, contact_person, phone, street, zip_code, city),
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

    const formatCurrency = (cents: number) => {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(cents / 100)
    }

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Rechnung ${invoice.invoice_number}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1D1D1F;
      background: white;
    }
    .invoice { max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; }

    /* Header */
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 28px; font-weight: bold; color: #E63946; }
    .logo span { color: #1D1D1F; }
    .company-info { text-align: right; font-size: 9pt; color: #666; }

    /* Addresses */
    .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .address-block { width: 45%; }
    .address-label { font-size: 8pt; color: #999; text-transform: uppercase; margin-bottom: 5px; }
    .address-content { font-size: 10pt; }

    /* Invoice Info */
    .invoice-info { background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .invoice-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .info-item label { font-size: 8pt; color: #999; text-transform: uppercase; display: block; }
    .info-item value { font-size: 12pt; font-weight: 600; display: block; }
    .invoice-number { font-size: 16pt; color: #E63946; }

    /* Table */
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table th {
      background: #1D1D1F;
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-weight: 500;
      font-size: 9pt;
      text-transform: uppercase;
    }
    .items-table th:last-child { text-align: right; }
    .items-table td {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
    .items-table td:last-child { text-align: right; }
    .items-table tbody tr:hover { background: #fafafa; }

    /* Totals */
    .totals { width: 300px; margin-left: auto; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .totals-row.subtotal { border-bottom: 1px solid #eee; }
    .totals-row.total {
      background: #E63946;
      color: white;
      padding: 15px;
      margin-top: 10px;
      border-radius: 6px;
      font-size: 14pt;
      font-weight: bold;
    }

    /* Payment Info */
    .payment-info {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
    }
    .payment-info h3 { margin-bottom: 10px; color: #856404; }
    .payment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    .payment-item label { font-size: 8pt; color: #856404; display: block; }
    .payment-item value { font-weight: 600; display: block; }

    /* Notes */
    .notes { margin-top: 30px; padding: 20px; background: #f8f8f8; border-radius: 8px; }
    .notes h4 { margin-bottom: 10px; }

    /* Footer */
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 8pt;
      color: #999;
    }

    /* Status Badge */
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 9pt;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-draft { background: #e0e0e0; color: #666; }
    .status-sent { background: #e3f2fd; color: #1976d2; }
    .status-paid { background: #e8f5e9; color: #2e7d32; }
    .status-overdue { background: #ffebee; color: #c62828; }
    .status-cancelled { background: #fce4ec; color: #c2185b; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .invoice { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="logo">Job<span>Nachbar</span></div>
        <p style="margin-top: 5px; color: #666;">Die lokale Jobbörse</p>
      </div>
      <div class="company-info">
        <strong>JobNachbar GmbH</strong><br>
        Musterstraße 123<br>
        27404 Zeven<br>
        info@jobnachbar.com<br>
        www.jobnachbar.com
      </div>
    </div>

    <!-- Addresses -->
    <div class="addresses">
      <div class="address-block">
        <div class="address-label">Rechnungsempfänger</div>
        <div class="address-content">
          <strong>${invoice.customer_name}</strong><br>
          ${invoice.customer_address ? `${invoice.customer_address}<br>` : ''}
          ${invoice.customer_zip} ${invoice.customer_city}<br>
          ${invoice.customer_country}
        </div>
      </div>
      <div class="address-block" style="text-align: right;">
        <span class="status-badge status-${invoice.status}">${
          invoice.status === 'draft' ? 'Entwurf' :
          invoice.status === 'sent' ? 'Versendet' :
          invoice.status === 'paid' ? 'Bezahlt' :
          invoice.status === 'overdue' ? 'Überfällig' :
          'Storniert'
        }</span>
      </div>
    </div>

    <!-- Invoice Info -->
    <div class="invoice-info">
      <div class="invoice-info-grid">
        <div class="info-item">
          <label>Rechnungsnummer</label>
          <value class="invoice-number">${invoice.invoice_number}</value>
        </div>
        <div class="info-item">
          <label>Rechnungsdatum</label>
          <value>${formatDate(invoice.invoice_date)}</value>
        </div>
        <div class="info-item">
          <label>Fälligkeitsdatum</label>
          <value>${formatDate(invoice.due_date)}</value>
        </div>
        <div class="info-item">
          <label>Kundennummer</label>
          <value>${invoice.company_id?.slice(0, 8).toUpperCase() || '-'}</value>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%;">Beschreibung</th>
          <th>Menge</th>
          <th>Einzelpreis</th>
          <th>Gesamt</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.invoice_items.map((item: any) => `
          <tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.unit_price_cents)}</td>
            <td>${formatCurrency(item.total_cents)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-row subtotal">
        <span>Zwischensumme</span>
        <span>${formatCurrency(invoice.subtotal_cents)}</span>
      </div>
      <div class="totals-row">
        <span>MwSt. (${invoice.tax_rate}%)</span>
        <span>${formatCurrency(invoice.tax_cents)}</span>
      </div>
      <div class="totals-row total">
        <span>Gesamtbetrag</span>
        <span>${formatCurrency(invoice.total_cents)}</span>
      </div>
    </div>

    <!-- Payment Info -->
    <div class="payment-info">
      <h3>Zahlungsinformationen</h3>
      <div class="payment-grid">
        <div class="payment-item">
          <label>Bank</label>
          <value>Commerzbank</value>
        </div>
        <div class="payment-item">
          <label>IBAN</label>
          <value>DE89 3704 0044 0532 0130 00</value>
        </div>
        <div class="payment-item">
          <label>Verwendungszweck</label>
          <value>${invoice.invoice_number}</value>
        </div>
      </div>
    </div>

    ${invoice.notes ? `
    <div class="notes">
      <h4>Anmerkungen</h4>
      <p>${invoice.notes}</p>
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p>JobNachbar GmbH | Musterstraße 123, 27404 Zeven | Geschäftsführer: Max Mustermann</p>
      <p>Amtsgericht Tostedt | HRB 12345 | USt-IdNr.: DE123456789</p>
      <p>Vielen Dank für Ihr Vertrauen!</p>
    </div>
  </div>

  <script>
    // Auto-print for PDF generation
    if (window.location.search.includes('print=true')) {
      window.onload = function() { window.print(); }
    }
  </script>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customer: {
    name: string
    company?: string
    address: string
    email: string
  }
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes?: string
  bankDetails: {
    accountHolder: string
    iban: string
    bic: string
    bank: string
  }
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: '2 solid #E63946',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E63946',
  },
  logoSubtext: {
    fontSize: 10,
    color: '#666666',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
    marginTop: 5,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoBlock: {
    width: '45%',
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E63946',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 3,
    lineHeight: 1.5,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    padding: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '0.5 solid #eeeeee',
  },
  colDescription: {
    width: '50%',
  },
  colQuantity: {
    width: '15%',
    textAlign: 'center',
  },
  colPrice: {
    width: '17.5%',
    textAlign: 'right',
  },
  colTotal: {
    width: '17.5%',
    textAlign: 'right',
  },
  totalsSection: {
    marginLeft: 'auto',
    width: '40%',
    marginBottom: 30,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '5 0',
  },
  totalsLabel: {
    color: '#666666',
  },
  totalsValue: {
    color: '#333333',
    fontWeight: 'bold',
  },
  totalsFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '10 0',
    borderTop: '1 solid #E63946',
    marginTop: 5,
  },
  totalsFinalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  totalsFinalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E63946',
  },
  bankSection: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  bankTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 10,
  },
  bankRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bankLabel: {
    width: '30%',
    color: '#666666',
  },
  bankValue: {
    width: '70%',
    color: '#333333',
  },
  notes: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.5,
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999999',
    borderTop: '0.5 solid #eeeeee',
    paddingTop: 10,
  },
})

export function InvoicePDF({ data }: { data: InvoiceData }) {
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace('.', ',') + ' €'
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>JobNachbar</Text>
            <Text style={styles.logoSubtext}>Die lokale Jobbörse</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>RECHNUNG</Text>
            <Text style={styles.invoiceNumber}>Nr. {data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Rechnungsadresse</Text>
            <Text style={styles.infoText}>{data.customer.name}</Text>
            {data.customer.company && (
              <Text style={styles.infoText}>{data.customer.company}</Text>
            )}
            <Text style={styles.infoText}>{data.customer.address}</Text>
            <Text style={styles.infoText}>{data.customer.email}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Rechnungsdetails</Text>
            <Text style={styles.infoText}>Rechnungsdatum: {data.invoiceDate}</Text>
            <Text style={styles.infoText}>Fällig bis: {data.dueDate}</Text>
            <Text style={styles.infoText}>Rechnungsnummer: {data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Beschreibung</Text>
            <Text style={styles.colQuantity}>Menge</Text>
            <Text style={styles.colPrice}>Einzelpreis</Text>
            <Text style={styles.colTotal}>Gesamt</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.colTotal}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Zwischensumme</Text>
            <Text style={styles.totalsValue}>{formatCurrency(data.subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>MwSt. ({data.taxRate}%)</Text>
            <Text style={styles.totalsValue}>{formatCurrency(data.taxAmount)}</Text>
          </View>
          <View style={styles.totalsFinal}>
            <Text style={styles.totalsFinalLabel}>Gesamtbetrag</Text>
            <Text style={styles.totalsFinalValue}>{formatCurrency(data.total)}</Text>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.bankSection}>
          <Text style={styles.bankTitle}>Bankverbindung</Text>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Empfänger:</Text>
            <Text style={styles.bankValue}>{data.bankDetails.accountHolder}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>IBAN:</Text>
            <Text style={styles.bankValue}>{data.bankDetails.iban}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>BIC:</Text>
            <Text style={styles.bankValue}>{data.bankDetails.bic}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Bank:</Text>
            <Text style={styles.bankValue}>{data.bankDetails.bank}</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Verwendungszweck:</Text>
            <Text style={[styles.bankValue, { color: '#E63946', fontWeight: 'bold' }]}>
              {data.invoiceNumber}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <Text style={styles.notes}>{data.notes}</Text>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          JobNachbar GmbH | Zeven | info@jobnachbar.com | www.jobnachbar.com
        </Text>
      </Page>
    </Document>
  )
}

export type { InvoiceData, InvoiceItem }

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

interface CoverLetterData {
  sender: {
    name: string
    address: string
    phone: string
    email: string
  }
  recipient: {
    company: string
    contactPerson?: string
    address: string
  }
  date: string
  subject: string
  content: string
  closing?: string
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 40,
  },
  senderInfo: {
    marginBottom: 30,
  },
  senderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 5,
  },
  senderDetails: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  recipientInfo: {
    marginBottom: 20,
  },
  recipientText: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 2,
  },
  date: {
    textAlign: 'right',
    marginBottom: 30,
    color: '#666666',
  },
  subject: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 20,
  },
  content: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.7,
    textAlign: 'justify',
    marginBottom: 30,
  },
  closing: {
    marginTop: 20,
  },
  closingText: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 40,
  },
  signature: {
    fontSize: 11,
    color: '#1A1A2E',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: '#999999',
    borderTop: '0.5 solid #eeeeee',
    paddingTop: 10,
  },
})

export function CoverLetterPDF({ data }: { data: CoverLetterData }) {
  const paragraphs = data.content.split('\n\n')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header / Sender Info */}
        <View style={styles.header}>
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{data.sender.name}</Text>
            <Text style={styles.senderDetails}>{data.sender.address}</Text>
            <Text style={styles.senderDetails}>{data.sender.phone}</Text>
            <Text style={styles.senderDetails}>{data.sender.email}</Text>
          </View>

          {/* Recipient Info */}
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientText}>{data.recipient.company}</Text>
            {data.recipient.contactPerson && (
              <Text style={styles.recipientText}>{data.recipient.contactPerson}</Text>
            )}
            <Text style={styles.recipientText}>{data.recipient.address}</Text>
          </View>

          {/* Date */}
          <Text style={styles.date}>{data.date}</Text>
        </View>

        {/* Subject Line */}
        <Text style={styles.subject}>{data.subject}</Text>

        {/* Content */}
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.content}>
            {paragraph}
          </Text>
        ))}

        {/* Closing */}
        <View style={styles.closing}>
          <Text style={styles.closingText}>{data.closing || 'Mit freundlichen Grüßen,'}</Text>
          <Text style={styles.signature}>{data.sender.name}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Erstellt mit JobNachbar | www.jobnachbar.com
        </Text>
      </Page>
    </Document>
  )
}

export type { CoverLetterData }

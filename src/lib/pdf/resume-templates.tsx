import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts (using system fonts)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
})

// Types
interface PersonalInfo {
  name: string
  email: string
  phone: string
  address: string
  birthDate?: string
  nationality?: string
}

interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string[]
}

interface Education {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  details?: string
}

interface ResumeData {
  personal: PersonalInfo
  summary?: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  languages?: { language: string; level: string }[]
}

// ========================================
// MODERN TEMPLATE
// ========================================
const modernStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    borderBottom: '2 solid #E63946',
    paddingBottom: 20,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E63946',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  company: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 3,
  },
  dates: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.5,
    marginLeft: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    fontSize: 10,
    backgroundColor: '#E63946',
    color: '#ffffff',
    padding: '4 10',
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  summary: {
    fontSize: 11,
    color: '#444444',
    lineHeight: 1.6,
  },
})

export function ModernResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={modernStyles.page}>
        {/* Header */}
        <View style={modernStyles.header}>
          <View style={modernStyles.nameSection}>
            <Text style={modernStyles.name}>{data.personal.name}</Text>
            <Text style={modernStyles.contactInfo}>{data.personal.email} • {data.personal.phone}</Text>
            <Text style={modernStyles.contactInfo}>{data.personal.address}</Text>
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={modernStyles.section}>
            <Text style={modernStyles.sectionTitle}>Profil</Text>
            <Text style={modernStyles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        <View style={modernStyles.section}>
          <Text style={modernStyles.sectionTitle}>Berufserfahrung</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={modernStyles.experienceItem}>
              <Text style={modernStyles.jobTitle}>{exp.title}</Text>
              <Text style={modernStyles.company}>{exp.company}, {exp.location}</Text>
              <Text style={modernStyles.dates}>{exp.startDate} - {exp.endDate}</Text>
              {exp.description.map((desc, i) => (
                <Text key={i} style={modernStyles.description}>• {desc}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={modernStyles.section}>
          <Text style={modernStyles.sectionTitle}>Ausbildung</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={modernStyles.experienceItem}>
              <Text style={modernStyles.jobTitle}>{edu.degree}</Text>
              <Text style={modernStyles.company}>{edu.institution}, {edu.location}</Text>
              <Text style={modernStyles.dates}>{edu.startDate} - {edu.endDate}</Text>
              {edu.details && <Text style={modernStyles.description}>{edu.details}</Text>}
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={modernStyles.section}>
          <Text style={modernStyles.sectionTitle}>Kenntnisse</Text>
          <View style={modernStyles.skillsContainer}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={modernStyles.skill}>{skill}</Text>
            ))}
          </View>
        </View>

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View style={modernStyles.section}>
            <Text style={modernStyles.sectionTitle}>Sprachen</Text>
            {data.languages.map((lang, index) => (
              <Text key={index} style={modernStyles.description}>
                {lang.language}: {lang.level}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

// ========================================
// CLASSIC TEMPLATE
// ========================================
const classicStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '1 solid #333333',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  contactInfo: {
    fontSize: 10,
    color: '#333333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textTransform: 'uppercase',
    borderBottom: '0.5 solid #cccccc',
    paddingBottom: 5,
  },
  experienceItem: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  dates: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  company: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
    marginLeft: 15,
  },
  skillsText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
  },
  summary: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
})

export function ClassicResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={classicStyles.page}>
        {/* Header */}
        <View style={classicStyles.header}>
          <Text style={classicStyles.name}>{data.personal.name}</Text>
          <View style={classicStyles.contactRow}>
            <Text style={classicStyles.contactInfo}>{data.personal.email}</Text>
            <Text style={classicStyles.contactInfo}>|</Text>
            <Text style={classicStyles.contactInfo}>{data.personal.phone}</Text>
            <Text style={classicStyles.contactInfo}>|</Text>
            <Text style={classicStyles.contactInfo}>{data.personal.address}</Text>
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Zusammenfassung</Text>
            <Text style={classicStyles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Berufserfahrung</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={classicStyles.experienceItem}>
              <View style={classicStyles.row}>
                <Text style={classicStyles.jobTitle}>{exp.title}</Text>
                <Text style={classicStyles.dates}>{exp.startDate} - {exp.endDate}</Text>
              </View>
              <Text style={classicStyles.company}>{exp.company}, {exp.location}</Text>
              {exp.description.map((desc, i) => (
                <Text key={i} style={classicStyles.description}>• {desc}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Ausbildung</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={classicStyles.experienceItem}>
              <View style={classicStyles.row}>
                <Text style={classicStyles.jobTitle}>{edu.degree}</Text>
                <Text style={classicStyles.dates}>{edu.startDate} - {edu.endDate}</Text>
              </View>
              <Text style={classicStyles.company}>{edu.institution}, {edu.location}</Text>
              {edu.details && <Text style={classicStyles.description}>{edu.details}</Text>}
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
          <Text style={classicStyles.skillsText}>{data.skills.join(' • ')}</Text>
        </View>

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Sprachen</Text>
            <Text style={classicStyles.skillsText}>
              {data.languages.map(l => `${l.language} (${l.level})`).join(' • ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

// ========================================
// CREATIVE TEMPLATE
// ========================================
const creativeStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: '#1A1A2E',
    padding: 30,
  },
  main: {
    marginLeft: 220,
    padding: 40,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#E63946',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sidebarSection: {
    marginBottom: 25,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E63946',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sidebarText: {
    fontSize: 9,
    color: '#cccccc',
    lineHeight: 1.6,
    marginBottom: 3,
  },
  skillBar: {
    height: 4,
    backgroundColor: '#333344',
    marginBottom: 8,
    borderRadius: 2,
  },
  skillBarFill: {
    height: 4,
    backgroundColor: '#E63946',
    borderRadius: 2,
  },
  skillLabel: {
    fontSize: 9,
    color: '#ffffff',
    marginBottom: 3,
  },
  mainSection: {
    marginBottom: 25,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2 solid #E63946',
  },
  experienceItem: {
    marginBottom: 18,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  company: {
    fontSize: 10,
    color: '#E63946',
    marginBottom: 3,
  },
  dates: {
    fontSize: 9,
    color: '#888888',
    marginBottom: 5,
  },
  description: {
    fontSize: 9,
    color: '#444444',
    lineHeight: 1.5,
    marginLeft: 10,
    marginBottom: 2,
  },
  summary: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.6,
  },
})

export function CreativeResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={creativeStyles.page}>
        {/* Sidebar */}
        <View style={creativeStyles.sidebar}>
          <Text style={creativeStyles.name}>{data.personal.name}</Text>
          <Text style={creativeStyles.subtitle}>Bewerberprofil</Text>

          {/* Contact */}
          <View style={creativeStyles.sidebarSection}>
            <Text style={creativeStyles.sidebarTitle}>Kontakt</Text>
            <Text style={creativeStyles.sidebarText}>{data.personal.email}</Text>
            <Text style={creativeStyles.sidebarText}>{data.personal.phone}</Text>
            <Text style={creativeStyles.sidebarText}>{data.personal.address}</Text>
          </View>

          {/* Skills with visual bars */}
          <View style={creativeStyles.sidebarSection}>
            <Text style={creativeStyles.sidebarTitle}>Top Skills</Text>
            {data.skills.slice(0, 5).map((skill, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={creativeStyles.skillLabel}>{skill}</Text>
                <View style={creativeStyles.skillBar}>
                  <View style={[creativeStyles.skillBarFill, { width: `${90 - index * 10}%` }]} />
                </View>
              </View>
            ))}
          </View>

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <View style={creativeStyles.sidebarSection}>
              <Text style={creativeStyles.sidebarTitle}>Sprachen</Text>
              {data.languages.map((lang, index) => (
                <Text key={index} style={creativeStyles.sidebarText}>
                  {lang.language}: {lang.level}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={creativeStyles.main}>
          {/* Summary */}
          {data.summary && (
            <View style={creativeStyles.mainSection}>
              <Text style={creativeStyles.mainTitle}>Über mich</Text>
              <Text style={creativeStyles.summary}>{data.summary}</Text>
            </View>
          )}

          {/* Experience */}
          <View style={creativeStyles.mainSection}>
            <Text style={creativeStyles.mainTitle}>Berufserfahrung</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={creativeStyles.experienceItem}>
                <Text style={creativeStyles.jobTitle}>{exp.title}</Text>
                <Text style={creativeStyles.company}>{exp.company} | {exp.location}</Text>
                <Text style={creativeStyles.dates}>{exp.startDate} - {exp.endDate}</Text>
                {exp.description.map((desc, i) => (
                  <Text key={i} style={creativeStyles.description}>▸ {desc}</Text>
                ))}
              </View>
            ))}
          </View>

          {/* Education */}
          <View style={creativeStyles.mainSection}>
            <Text style={creativeStyles.mainTitle}>Ausbildung</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={creativeStyles.experienceItem}>
                <Text style={creativeStyles.jobTitle}>{edu.degree}</Text>
                <Text style={creativeStyles.company}>{edu.institution} | {edu.location}</Text>
                <Text style={creativeStyles.dates}>{edu.startDate} - {edu.endDate}</Text>
                {edu.details && <Text style={creativeStyles.description}>{edu.details}</Text>}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Export types for external use
export type { ResumeData, PersonalInfo, Experience, Education }

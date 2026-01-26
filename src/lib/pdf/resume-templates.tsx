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

// ========================================
// MINIMAL TEMPLATE
// ========================================
const minimalStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 50,
    fontFamily: 'Helvetica',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  contactLine: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  experienceItem: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  dates: {
    fontSize: 10,
    color: '#888888',
  },
  company: {
    fontSize: 10,
    color: '#444444',
    marginBottom: 5,
  },
  description: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.6,
    marginLeft: 0,
  },
  skillsText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 20,
  },
  summary: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.7,
  },
})

export function MinimalResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={minimalStyles.page}>
        <Text style={minimalStyles.name}>{data.personal.name}</Text>
        <Text style={minimalStyles.contactLine}>
          {data.personal.email} · {data.personal.phone} · {data.personal.address}
        </Text>

        {data.summary && (
          <>
            <Text style={minimalStyles.summary}>{data.summary}</Text>
            <View style={minimalStyles.divider} />
          </>
        )}

        <View style={minimalStyles.section}>
          <Text style={minimalStyles.sectionTitle}>Erfahrung</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={minimalStyles.experienceItem}>
              <View style={minimalStyles.row}>
                <Text style={minimalStyles.jobTitle}>{exp.title}</Text>
                <Text style={minimalStyles.dates}>{exp.startDate} – {exp.endDate}</Text>
              </View>
              <Text style={minimalStyles.company}>{exp.company}, {exp.location}</Text>
              {exp.description.map((desc, i) => (
                <Text key={i} style={minimalStyles.description}>– {desc}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={minimalStyles.section}>
          <Text style={minimalStyles.sectionTitle}>Ausbildung</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={minimalStyles.experienceItem}>
              <View style={minimalStyles.row}>
                <Text style={minimalStyles.jobTitle}>{edu.degree}</Text>
                <Text style={minimalStyles.dates}>{edu.startDate} – {edu.endDate}</Text>
              </View>
              <Text style={minimalStyles.company}>{edu.institution}, {edu.location}</Text>
            </View>
          ))}
        </View>

        <View style={minimalStyles.section}>
          <Text style={minimalStyles.sectionTitle}>Kenntnisse</Text>
          <Text style={minimalStyles.skillsText}>{data.skills.join(' · ')}</Text>
        </View>

        {data.languages && data.languages.length > 0 && (
          <View style={minimalStyles.section}>
            <Text style={minimalStyles.sectionTitle}>Sprachen</Text>
            <Text style={minimalStyles.skillsText}>
              {data.languages.map(l => `${l.language} (${l.level})`).join(' · ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

// ========================================
// PROFESSIONAL TEMPLATE
// ========================================
const professionalStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#2C3E50',
    margin: -40,
    marginBottom: 30,
    padding: 30,
    paddingTop: 40,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#BDC3C7',
    marginBottom: 15,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 15,
  },
  contactItem: {
    fontSize: 10,
    color: '#ECF0F1',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 30,
  },
  leftColumn: {
    width: '65%',
  },
  rightColumn: {
    width: '35%',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '2 solid #3498DB',
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  company: {
    fontSize: 10,
    color: '#3498DB',
  },
  dates: {
    fontSize: 9,
    color: '#7F8C8D',
  },
  description: {
    fontSize: 9,
    color: '#34495E',
    lineHeight: 1.5,
    marginLeft: 10,
    marginBottom: 2,
  },
  skillItem: {
    fontSize: 10,
    color: '#34495E',
    marginBottom: 5,
    paddingLeft: 10,
    borderLeft: '2 solid #3498DB',
  },
  summary: {
    fontSize: 10,
    color: '#34495E',
    lineHeight: 1.6,
    marginBottom: 20,
  },
})

export function ProfessionalResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={professionalStyles.page}>
        <View style={professionalStyles.header}>
          <Text style={professionalStyles.name}>{data.personal.name}</Text>
          <Text style={professionalStyles.subtitle}>Professioneller Lebenslauf</Text>
          <View style={professionalStyles.contactRow}>
            <Text style={professionalStyles.contactItem}>{data.personal.email}</Text>
            <Text style={professionalStyles.contactItem}>|</Text>
            <Text style={professionalStyles.contactItem}>{data.personal.phone}</Text>
            <Text style={professionalStyles.contactItem}>|</Text>
            <Text style={professionalStyles.contactItem}>{data.personal.address}</Text>
          </View>
        </View>

        {data.summary && (
          <Text style={professionalStyles.summary}>{data.summary}</Text>
        )}

        <View style={professionalStyles.twoColumn}>
          <View style={professionalStyles.leftColumn}>
            <View style={professionalStyles.section}>
              <Text style={professionalStyles.sectionTitle}>Berufserfahrung</Text>
              {data.experience.map((exp, index) => (
                <View key={index} style={professionalStyles.experienceItem}>
                  <Text style={professionalStyles.jobTitle}>{exp.title}</Text>
                  <View style={professionalStyles.companyRow}>
                    <Text style={professionalStyles.company}>{exp.company}, {exp.location}</Text>
                    <Text style={professionalStyles.dates}>{exp.startDate} - {exp.endDate}</Text>
                  </View>
                  {exp.description.map((desc, i) => (
                    <Text key={i} style={professionalStyles.description}>• {desc}</Text>
                  ))}
                </View>
              ))}
            </View>

            <View style={professionalStyles.section}>
              <Text style={professionalStyles.sectionTitle}>Ausbildung</Text>
              {data.education.map((edu, index) => (
                <View key={index} style={professionalStyles.experienceItem}>
                  <Text style={professionalStyles.jobTitle}>{edu.degree}</Text>
                  <View style={professionalStyles.companyRow}>
                    <Text style={professionalStyles.company}>{edu.institution}</Text>
                    <Text style={professionalStyles.dates}>{edu.startDate} - {edu.endDate}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={professionalStyles.rightColumn}>
            <View style={professionalStyles.section}>
              <Text style={professionalStyles.sectionTitle}>Kenntnisse</Text>
              {data.skills.map((skill, index) => (
                <Text key={index} style={professionalStyles.skillItem}>{skill}</Text>
              ))}
            </View>

            {data.languages && data.languages.length > 0 && (
              <View style={professionalStyles.section}>
                <Text style={professionalStyles.sectionTitle}>Sprachen</Text>
                {data.languages.map((lang, index) => (
                  <Text key={index} style={professionalStyles.skillItem}>
                    {lang.language} - {lang.level}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// ========================================
// ELEGANT TEMPLATE
// ========================================
const elegantStyles = StyleSheet.create({
  page: {
    backgroundColor: '#FAFAFA',
    padding: 45,
    fontFamily: 'Helvetica',
  },
  headerBox: {
    backgroundColor: '#ffffff',
    padding: 25,
    marginBottom: 25,
    borderLeft: '4 solid #C9A227',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
  },
  contentBox: {
    backgroundColor: '#ffffff',
    padding: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C9A227',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  experienceItem: {
    marginBottom: 18,
    paddingBottom: 15,
    borderBottom: '0.5 solid #eeeeee',
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 3,
  },
  company: {
    fontSize: 10,
    color: '#C9A227',
    marginBottom: 3,
  },
  dates: {
    fontSize: 9,
    color: '#888888',
    marginBottom: 8,
  },
  description: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.6,
    marginLeft: 12,
    marginBottom: 2,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    fontSize: 9,
    color: '#333333',
    backgroundColor: '#F5F5F5',
    padding: '6 12',
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 3,
  },
  summary: {
    fontSize: 10,
    color: '#555555',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
})

export function ElegantResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={elegantStyles.page}>
        <View style={elegantStyles.headerBox}>
          <Text style={elegantStyles.name}>{data.personal.name}</Text>
          <Text style={elegantStyles.contactInfo}>{data.personal.email}</Text>
          <Text style={elegantStyles.contactInfo}>{data.personal.phone}</Text>
          <Text style={elegantStyles.contactInfo}>{data.personal.address}</Text>
        </View>

        {data.summary && (
          <View style={elegantStyles.contentBox}>
            <Text style={elegantStyles.sectionTitle}>Profil</Text>
            <Text style={elegantStyles.summary}>{data.summary}</Text>
          </View>
        )}

        <View style={elegantStyles.contentBox}>
          <Text style={elegantStyles.sectionTitle}>Berufserfahrung</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={elegantStyles.experienceItem}>
              <Text style={elegantStyles.jobTitle}>{exp.title}</Text>
              <Text style={elegantStyles.company}>{exp.company} · {exp.location}</Text>
              <Text style={elegantStyles.dates}>{exp.startDate} – {exp.endDate}</Text>
              {exp.description.map((desc, i) => (
                <Text key={i} style={elegantStyles.description}>◦ {desc}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={elegantStyles.contentBox}>
          <Text style={elegantStyles.sectionTitle}>Ausbildung</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={[elegantStyles.experienceItem, { borderBottom: 'none' }]}>
              <Text style={elegantStyles.jobTitle}>{edu.degree}</Text>
              <Text style={elegantStyles.company}>{edu.institution} · {edu.location}</Text>
              <Text style={elegantStyles.dates}>{edu.startDate} – {edu.endDate}</Text>
            </View>
          ))}
        </View>

        <View style={elegantStyles.contentBox}>
          <Text style={elegantStyles.sectionTitle}>Kenntnisse</Text>
          <View style={elegantStyles.skillsGrid}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={elegantStyles.skill}>{skill}</Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Template 7: Executive Resume
const executiveStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '3 solid #e94560',
  },
  name: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  title: {
    fontSize: 14,
    color: '#e94560',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },
  contactItem: {
    fontSize: 10,
    color: '#a0a0a0',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#e94560',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summary: {
    fontSize: 11,
    color: '#d0d0d0',
    lineHeight: 1.6,
  },
  expItem: {
    marginBottom: 18,
  },
  jobTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  company: {
    fontSize: 11,
    color: '#e94560',
    marginTop: 2,
  },
  dates: {
    fontSize: 10,
    color: '#808080',
    marginTop: 2,
  },
  desc: {
    fontSize: 10,
    color: '#c0c0c0',
    marginTop: 6,
    marginLeft: 15,
    lineHeight: 1.5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skill: {
    fontSize: 10,
    backgroundColor: '#e94560',
    color: '#ffffff',
    padding: '6 12',
    borderRadius: 3,
  },
})

export function ExecutiveResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={executiveStyles.page}>
        <View style={executiveStyles.header}>
          <Text style={executiveStyles.name}>{data.personal.name}</Text>
          <Text style={executiveStyles.title}>Executive Profile</Text>
          <View style={executiveStyles.contactRow}>
            <Text style={executiveStyles.contactItem}>{data.personal.email}</Text>
            <Text style={executiveStyles.contactItem}>{data.personal.phone}</Text>
            <Text style={executiveStyles.contactItem}>{data.personal.address}</Text>
          </View>
        </View>

        {data.summary && (
          <View style={executiveStyles.section}>
            <Text style={executiveStyles.sectionTitle}>Executive Summary</Text>
            <Text style={executiveStyles.summary}>{data.summary}</Text>
          </View>
        )}

        <View style={executiveStyles.section}>
          <Text style={executiveStyles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={executiveStyles.expItem}>
              <Text style={executiveStyles.jobTitle}>{exp.title}</Text>
              <Text style={executiveStyles.company}>{exp.company} | {exp.location}</Text>
              <Text style={executiveStyles.dates}>{exp.startDate} - {exp.endDate}</Text>
              {exp.description.map((desc, i) => (
                <Text key={i} style={executiveStyles.desc}>• {desc}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={executiveStyles.section}>
          <Text style={executiveStyles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={executiveStyles.expItem}>
              <Text style={executiveStyles.jobTitle}>{edu.degree}</Text>
              <Text style={executiveStyles.company}>{edu.institution}</Text>
              <Text style={executiveStyles.dates}>{edu.startDate} - {edu.endDate}</Text>
            </View>
          ))}
        </View>

        <View style={executiveStyles.section}>
          <Text style={executiveStyles.sectionTitle}>Core Competencies</Text>
          <View style={executiveStyles.skillsContainer}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={executiveStyles.skill}>{skill}</Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Template 8: Tech Resume
const techStyles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'Courier',
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
  },
  header: {
    marginBottom: 25,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Courier-Bold',
    color: '#58a6ff',
  },
  tagline: {
    fontSize: 12,
    color: '#8b949e',
    marginTop: 5,
  },
  contactLine: {
    fontSize: 10,
    color: '#7ee787',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Courier-Bold',
    color: '#f0883e',
    marginBottom: 12,
    paddingBottom: 5,
    borderBottom: '1 solid #30363d',
  },
  summary: {
    fontSize: 10,
    color: '#c9d1d9',
    lineHeight: 1.6,
    backgroundColor: '#161b22',
    padding: 12,
    borderRadius: 6,
  },
  expBlock: {
    marginBottom: 15,
    paddingLeft: 15,
    borderLeft: '2 solid #58a6ff',
  },
  role: {
    fontSize: 12,
    fontFamily: 'Courier-Bold',
    color: '#c9d1d9',
  },
  org: {
    fontSize: 10,
    color: '#58a6ff',
    marginTop: 2,
  },
  period: {
    fontSize: 9,
    color: '#8b949e',
    marginTop: 2,
  },
  bullet: {
    fontSize: 10,
    color: '#c9d1d9',
    marginTop: 5,
    marginLeft: 10,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  techTag: {
    fontSize: 9,
    backgroundColor: '#21262d',
    color: '#7ee787',
    padding: '4 8',
    borderRadius: 3,
    border: '1 solid #30363d',
  },
})

export function TechResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={techStyles.page}>
        <View style={techStyles.header}>
          <Text style={techStyles.name}>{data.personal.name}</Text>
          <Text style={techStyles.tagline}>// Software Developer</Text>
          <Text style={techStyles.contactLine}>
            {data.personal.email} | {data.personal.phone} | {data.personal.address}
          </Text>
        </View>

        {data.summary && (
          <View style={techStyles.section}>
            <Text style={techStyles.sectionHeader}>/* README.md */</Text>
            <Text style={techStyles.summary}>{data.summary}</Text>
          </View>
        )}

        <View style={techStyles.section}>
          <Text style={techStyles.sectionHeader}>/* Experience */</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={techStyles.expBlock}>
              <Text style={techStyles.role}>{exp.title}</Text>
              <Text style={techStyles.org}>@{exp.company} - {exp.location}</Text>
              <Text style={techStyles.period}>{exp.startDate} → {exp.endDate}</Text>
              {exp.description.map((desc, i) => (
                <Text key={i} style={techStyles.bullet}>→ {desc}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={techStyles.section}>
          <Text style={techStyles.sectionHeader}>/* Education */</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={techStyles.expBlock}>
              <Text style={techStyles.role}>{edu.degree}</Text>
              <Text style={techStyles.org}>@{edu.institution}</Text>
              <Text style={techStyles.period}>{edu.startDate} → {edu.endDate}</Text>
            </View>
          ))}
        </View>

        <View style={techStyles.section}>
          <Text style={techStyles.sectionHeader}>/* Tech Stack */</Text>
          <View style={techStyles.techStack}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={techStyles.techTag}>{skill}</Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Template 9: Academic Resume
const academicStyles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Times-Roman',
    backgroundColor: '#fffef5',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2 solid #2c3e50',
  },
  name: {
    fontSize: 26,
    fontFamily: 'Times-Bold',
    color: '#2c3e50',
    letterSpacing: 1,
  },
  contactCenter: {
    fontSize: 10,
    color: '#34495e',
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    color: '#2c3e50',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottom: '1 solid #bdc3c7',
    paddingBottom: 4,
  },
  summary: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    color: '#2c3e50',
    lineHeight: 1.7,
    textAlign: 'justify',
  },
  entry: {
    marginBottom: 14,
  },
  entryTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: '#2c3e50',
  },
  entrySubtitle: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    color: '#7f8c8d',
    marginTop: 2,
  },
  entryDate: {
    fontSize: 10,
    color: '#95a5a6',
    marginTop: 2,
  },
  entryDesc: {
    fontSize: 10,
    color: '#2c3e50',
    marginTop: 6,
    marginLeft: 12,
    lineHeight: 1.5,
  },
  skillsList: {
    fontSize: 10,
    color: '#2c3e50',
    lineHeight: 1.6,
  },
})

export function AcademicResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={academicStyles.page}>
        <View style={academicStyles.header}>
          <Text style={academicStyles.name}>{data.personal.name}</Text>
          <Text style={academicStyles.contactCenter}>
            {data.personal.email} · {data.personal.phone} · {data.personal.address}
          </Text>
        </View>

        {data.summary && (
          <View style={academicStyles.section}>
            <Text style={academicStyles.sectionTitle}>Research Interests</Text>
            <Text style={academicStyles.summary}>{data.summary}</Text>
          </View>
        )}

        <View style={academicStyles.section}>
          <Text style={academicStyles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={academicStyles.entry}>
              <Text style={academicStyles.entryTitle}>{edu.degree}</Text>
              <Text style={academicStyles.entrySubtitle}>{edu.institution}, {edu.location}</Text>
              <Text style={academicStyles.entryDate}>{edu.startDate} – {edu.endDate}</Text>
            </View>
          ))}
        </View>

        <View style={academicStyles.section}>
          <Text style={academicStyles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={academicStyles.entry}>
              <Text style={academicStyles.entryTitle}>{exp.title}</Text>
              <Text style={academicStyles.entrySubtitle}>{exp.company}, {exp.location}</Text>
              <Text style={academicStyles.entryDate}>{exp.startDate} – {exp.endDate}</Text>
              {exp.description.map((desc, i) => (
                <Text key={i} style={academicStyles.entryDesc}>• {desc}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={academicStyles.section}>
          <Text style={academicStyles.sectionTitle}>Skills & Expertise</Text>
          <Text style={academicStyles.skillsList}>
            {data.skills.join(' · ')}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

// Template 10: Compact Resume
const compactStyles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '1 solid #e0e0e0',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
  },
  contactSection: {
    alignItems: 'flex-end',
  },
  contact: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 2,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 15,
  },
  mainColumn: {
    flex: 2,
  },
  sideColumn: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 4,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 6,
    textTransform: 'uppercase',
    borderBottom: '1 solid #ddd',
    paddingBottom: 2,
  },
  summary: {
    fontSize: 8,
    color: '#444444',
    lineHeight: 1.5,
  },
  expItem: {
    marginBottom: 8,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
  },
  dates: {
    fontSize: 7,
    color: '#888888',
  },
  company: {
    fontSize: 8,
    color: '#666666',
  },
  desc: {
    fontSize: 7,
    color: '#555555',
    marginTop: 2,
    marginLeft: 8,
  },
  sideSectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 6,
  },
  skill: {
    fontSize: 7,
    color: '#444444',
    marginBottom: 3,
    paddingLeft: 8,
  },
})

export function CompactResume({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={compactStyles.page}>
        <View style={compactStyles.header}>
          <View style={compactStyles.nameSection}>
            <Text style={compactStyles.name}>{data.personal.name}</Text>
          </View>
          <View style={compactStyles.contactSection}>
            <Text style={compactStyles.contact}>{data.personal.email}</Text>
            <Text style={compactStyles.contact}>{data.personal.phone}</Text>
            <Text style={compactStyles.contact}>{data.personal.address}</Text>
          </View>
        </View>

        <View style={compactStyles.twoColumn}>
          <View style={compactStyles.mainColumn}>
            {data.summary && (
              <View style={compactStyles.section}>
                <Text style={compactStyles.sectionTitle}>Profil</Text>
                <Text style={compactStyles.summary}>{data.summary}</Text>
              </View>
            )}

            <View style={compactStyles.section}>
              <Text style={compactStyles.sectionTitle}>Berufserfahrung</Text>
              {data.experience.map((exp, index) => (
                <View key={index} style={compactStyles.expItem}>
                  <View style={compactStyles.expHeader}>
                    <Text style={compactStyles.jobTitle}>{exp.title}</Text>
                    <Text style={compactStyles.dates}>{exp.startDate} - {exp.endDate}</Text>
                  </View>
                  <Text style={compactStyles.company}>{exp.company}, {exp.location}</Text>
                  {exp.description.slice(0, 2).map((desc, i) => (
                    <Text key={i} style={compactStyles.desc}>• {desc}</Text>
                  ))}
                </View>
              ))}
            </View>

            <View style={compactStyles.section}>
              <Text style={compactStyles.sectionTitle}>Ausbildung</Text>
              {data.education.map((edu, index) => (
                <View key={index} style={compactStyles.expItem}>
                  <View style={compactStyles.expHeader}>
                    <Text style={compactStyles.jobTitle}>{edu.degree}</Text>
                    <Text style={compactStyles.dates}>{edu.startDate} - {edu.endDate}</Text>
                  </View>
                  <Text style={compactStyles.company}>{edu.institution}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={compactStyles.sideColumn}>
            <Text style={compactStyles.sideSectionTitle}>Kenntnisse</Text>
            {data.skills.map((skill, index) => (
              <Text key={index} style={compactStyles.skill}>• {skill}</Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Export types for external use
export type { ResumeData, PersonalInfo, Experience, Education }

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export interface ResumeAnalysisResult {
  score: number
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  summary: string
}

export interface CoverLetterResult {
  coverLetter: string
  tips: string[]
}

export interface InterviewPrepResult {
  commonQuestions: { question: string; suggestedAnswer: string }[]
  tips: string[]
  companyResearch: string[]
}

export interface SalaryNegotiationResult {
  marketRange: { min: number; max: number }
  tips: string[]
  scripts: string[]
  preparation: string[]
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysisResult> {
  const prompt = `Du bist ein erfahrener HR-Experte und Karriereberater. Analysiere den folgenden Lebenslauf und gib eine detaillierte Bewertung auf Deutsch.

Lebenslauf:
${resumeText}

Antworte im folgenden JSON-Format (ohne Markdown-Formatierung):
{
  "score": <Zahl von 1-100>,
  "strengths": ["Stärke 1", "Stärke 2", ...],
  "improvements": ["Verbesserungspunkt 1", "Verbesserungspunkt 2", ...],
  "suggestions": ["Konkreter Vorschlag 1", "Konkreter Vorschlag 2", ...],
  "summary": "Kurze Zusammenfassung der Analyse"
}

Sei konstruktiv und hilfreich. Fokussiere auf konkrete, umsetzbare Tipps.`

  const result = await geminiModel.generateContent(prompt)
  const response = result.response.text()

  try {
    // Remove markdown code blocks if present
    const cleanJson = response.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleanJson)
  } catch {
    return {
      score: 70,
      strengths: ['Lebenslauf wurde analysiert'],
      improvements: ['Struktur könnte verbessert werden'],
      suggestions: ['Fügen Sie mehr Details zu Ihren Erfolgen hinzu'],
      summary: 'Analyse abgeschlossen. Bitte versuchen Sie es erneut für detailliertere Ergebnisse.',
    }
  }
}

export async function generateCoverLetter(
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  userProfile: string
): Promise<CoverLetterResult> {
  const prompt = `Du bist ein erfahrener Bewerbungscoach. Erstelle ein professionelles Anschreiben auf Deutsch.

Stellentitel: ${jobTitle}
Unternehmen: ${companyName}
Stellenbeschreibung: ${jobDescription}
Bewerber-Profil: ${userProfile}

Erstelle ein überzeugendes Anschreiben und gib Tipps. Antworte im folgenden JSON-Format (ohne Markdown-Formatierung):
{
  "coverLetter": "Das vollständige Anschreiben...",
  "tips": ["Tipp 1 zur Verbesserung", "Tipp 2", ...]
}

Das Anschreiben sollte:
- Persönlich und authentisch klingen
- Die wichtigsten Qualifikationen hervorheben
- Einen klaren Bezug zur Stelle haben
- Motivation zeigen
- Etwa 300-400 Wörter lang sein`

  const result = await geminiModel.generateContent(prompt)
  const response = result.response.text()

  try {
    const cleanJson = response.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleanJson)
  } catch {
    return {
      coverLetter: 'Fehler bei der Generierung. Bitte versuchen Sie es erneut.',
      tips: ['Stellen Sie sicher, dass alle Felder ausgefüllt sind'],
    }
  }
}

export async function generateInterviewPrep(
  jobTitle: string,
  companyName: string,
  industry: string
): Promise<InterviewPrepResult> {
  const prompt = `Du bist ein erfahrener Interview-Coach. Bereite einen Bewerber auf ein Vorstellungsgespräch vor.

Stelle: ${jobTitle}
Unternehmen: ${companyName}
Branche: ${industry}

Erstelle eine umfassende Vorbereitung auf Deutsch. Antworte im folgenden JSON-Format (ohne Markdown-Formatierung):
{
  "commonQuestions": [
    {"question": "Frage 1", "suggestedAnswer": "Vorgeschlagene Antwort..."},
    {"question": "Frage 2", "suggestedAnswer": "Vorgeschlagene Antwort..."},
    ...
  ],
  "tips": ["Allgemeiner Tipp 1", "Tipp 2", ...],
  "companyResearch": ["Recherche-Punkt 1", "Punkt 2", ...]
}

Inkludiere mindestens:
- 5 häufige Fragen mit guten Beispielantworten
- 5 praktische Tipps
- 3 Punkte zur Unternehmensrecherche`

  const result = await geminiModel.generateContent(prompt)
  const response = result.response.text()

  try {
    const cleanJson = response.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleanJson)
  } catch {
    return {
      commonQuestions: [
        {
          question: 'Erzählen Sie etwas über sich.',
          suggestedAnswer: 'Beginnen Sie mit Ihrer aktuellen Position und gehen Sie auf relevante Erfahrungen ein.',
        },
      ],
      tips: ['Bereiten Sie sich gründlich vor', 'Recherchieren Sie das Unternehmen'],
      companyResearch: ['Besuchen Sie die Unternehmenswebseite', 'Lesen Sie aktuelle Nachrichten'],
    }
  }
}

export async function generateSalaryNegotiation(
  jobTitle: string,
  experience: string,
  location: string,
  currentSalary?: string
): Promise<SalaryNegotiationResult> {
  const prompt = `Du bist ein Gehaltsverhandlungs-Experte. Hilf einem Bewerber bei der Gehaltsverhandlung.

Stelle: ${jobTitle}
Erfahrung: ${experience}
Standort: ${location}
${currentSalary ? `Aktuelles Gehalt: ${currentSalary}` : ''}

Erstelle Tipps und Strategien auf Deutsch. Antworte im folgenden JSON-Format (ohne Markdown-Formatierung):
{
  "marketRange": {"min": <Zahl>, "max": <Zahl>},
  "tips": ["Verhandlungstipp 1", "Tipp 2", ...],
  "scripts": ["Formulierung 1 für die Verhandlung", "Formulierung 2", ...],
  "preparation": ["Vorbereitungspunkt 1", "Punkt 2", ...]
}

Die Gehaltsspanne sollte realistisch für die Region Zeven/Rotenburg sein (ländliche Region in Niedersachsen).
Gib mindestens:
- 5 Verhandlungstipps
- 3 konkrete Formulierungen
- 4 Vorbereitungspunkte`

  const result = await geminiModel.generateContent(prompt)
  const response = result.response.text()

  try {
    const cleanJson = response.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleanJson)
  } catch {
    return {
      marketRange: { min: 35000, max: 55000 },
      tips: ['Recherchieren Sie Marktgehälter', 'Kennen Sie Ihren Wert'],
      scripts: ['Basierend auf meiner Erfahrung und den Marktdaten...'],
      preparation: ['Sammeln Sie Gehaltsvergleiche', 'Listen Sie Ihre Erfolge auf'],
    }
  }
}

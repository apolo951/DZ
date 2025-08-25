/**
 * Service d'expressions régulières pour documents juridiques algériens
 * Détection et extraction d'entités juridiques spécifiques à l'Algérie
 */

import { logger } from '@/utils/logger';

// Export pour compatibilité
export interface LegalEntity extends LegalEntityMatch {}

export interface LegalEntityMatch {
  type: string;
  value: string;
  originalText: string;
  confidence: number;
  position: {
    start: number;
    end: number;
  };
}

export interface StructuredPublication {
  title: string;
  type: 'loi' | 'decret' | 'arrete' | 'circulaire' | 'instruction' | 'journal_officiel' | 'other';
  number: string;
  date: string;
  // Contenu complet pour compatibilité
  content: string; // Required pour compatibilité
  // Entités à plat pour l'UI
  entities: LegalEntityMatch[];
  // Entités par type pour les algorithmes
  entitiesByType: {
    dates: LegalEntityMatch[];
    numbers: LegalEntityMatch[];
    institutions: LegalEntityMatch[];
    references: LegalEntityMatch[];
    subjects: LegalEntityMatch[];
  };
  // Métadonnées document
  metadata: {
    isOfficial: boolean;
    language: 'ar' | 'fr' | 'mixed';
    confidence: number;
    processingTime: number;
  };
  // Informations supplémentaires utilisées par certaines vues
  institution?: string;
  joNumber?: string;
  joDate?: string;
  sections: {
    header: string;
    body: string;
    footer: string;
    articles?: string[];
  };
  // Propriété pour compatibilité avec certaines vues
  articles?: string[];
}

class AlgerianLegalRegexService {
  
  // Méthode principale pour la compatibilité avec l'existant
  async processText(extractedText: string): Promise<StructuredPublication> {
    return this.processExtractedText(extractedText);
  }
  
  async processExtractedText(extractedText: string): Promise<StructuredPublication> {
    const startTime = performance.now();
    logger.info('OCR', '🔍 Début traitement regex juridique algérien');

    try {
      const entities = {
        dates: this.extractDates(extractedText),
        numbers: this.extractNumbers(extractedText),
        institutions: this.extractInstitutions(extractedText),
        references: this.extractReferences(extractedText),
        subjects: this.extractSubjects(extractedText)
      };

      const documentType = this.detectDocumentType(extractedText, entities);
      const title = this.extractTitle(extractedText, documentType);
      const number = this.extractMainNumber(extractedText, entities.numbers);
      const date = this.extractMainDate(extractedText, entities.dates);
      const sections = this.structureText(extractedText);
      const language = this.detectLanguage(extractedText);
      const confidence = this.calculateConfidence(entities, extractedText);
      const processingTime = performance.now() - startTime;
      
      const flatEntities = [
        ...entities.dates,
        ...entities.numbers,
        ...entities.institutions,
        ...entities.references,
        ...entities.subjects
      ];

      const result: StructuredPublication = {
        title,
        type: documentType,
        number,
        date,
        content: extractedText, // Ajout pour compatibilité
        entities: flatEntities,
        entitiesByType: entities,
        metadata: {
          isOfficial: this.isOfficialDocument(extractedText),
          language,
          confidence,
          processingTime
        },
        sections,
        // Ajout pour compatibilité top-level avec certaines vues
        joNumber: entities.numbers.find(n => n.originalText.toLowerCase().includes('journal'))?.value,
        joDate: entities.dates.find(d => d.originalText.toLowerCase().includes('journal'))?.value,
        articles: this.extractArticles(extractedText)
      };

      logger.info('OCR', '✅ Traitement regex terminé');
      return result;
    } catch (error) {
      logger.error('OCR', '❌ Erreur traitement regex:', error);
      throw error;
    }
  }

  private extractDates(text: string): LegalEntityMatch[] {
    const matches: LegalEntityMatch[] = [];
    const patterns = [
      /\b(\d{1,2})(?:er)?\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})\b/gi,
      /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g
    ];
    
    patterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        matches.push({
          type: 'date',
          value: match[0],
          originalText: match[0],
          confidence: 0.9 - (index * 0.1),
          position: { start: match.index, end: match.index + match[0].length }
        });
      }
      pattern.lastIndex = 0;
    });
    
    return matches;
  }

  private extractNumbers(text: string): LegalEntityMatch[] {
    const matches: LegalEntityMatch[] = [];
    const patterns = [
      /loi\s+n°?\s*(\d{2}-\d{2})/gi,
      /décret\s+(?:exécutif|présidentiel)?\s*n°?\s*(\d{2}-\d{3}|\d{2}-\d{2})/gi,
      /arrêté\s+(?:interministériel|ministériel)?\s*n°?\s*(\d{1,4})/gi
    ];
    
    patterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        matches.push({
          type: 'number',
          value: match[1] || match[0],
          originalText: match[0],
          confidence: 0.95 - (index * 0.05),
          position: { start: match.index, end: match.index + match[0].length }
        });
      }
      pattern.lastIndex = 0;
    });
    
    return matches;
  }

  private extractInstitutions(text: string): LegalEntityMatch[] {
    const matches: LegalEntityMatch[] = [];
    const patterns = [
      /présidence\s+de\s+la\s+république/gi,
      /ministère\s+de\s+(?:la\s+|l'|le\s+)?[\w\s]+/gi,
      /assemblée\s+populaire\s+nationale/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        matches.push({
          type: 'institution',
          value: match[0],
          originalText: match[0],
          confidence: 0.9,
          position: { start: match.index, end: match.index + match[0].length }
        });
      }
      pattern.lastIndex = 0;
    });
    
    return matches;
  }

  private extractReferences(text: string): LegalEntityMatch[] {
    const matches: LegalEntityMatch[] = [];
    const patterns = [
      /vu\s+(?:la\s+)?(?:loi|décret|arrêté|ordonnance)\s+n°?\s*[\d\-]+/gi,
      /articles?\s+(\d+(?:\s+(?:et|à)\s+\d+)?)/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        matches.push({
          type: 'reference',
          value: match[0],
          originalText: match[0],
          confidence: 0.8,
          position: { start: match.index, end: match.index + match[0].length }
        });
      }
      pattern.lastIndex = 0;
    });
    
    return matches;
  }

  private extractSubjects(text: string): LegalEntityMatch[] {
    const matches: LegalEntityMatch[] = [];
    const patterns = [
      /portant\s+[\w\s,]+/gi,
      /relatif\s+(?:à|au|aux)\s+[\w\s,]+/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        matches.push({
          type: 'subject',
          value: match[0],
          originalText: match[0],
          confidence: 0.7,
          position: { start: match.index, end: match.index + match[0].length }
        });
      }
      pattern.lastIndex = 0;
    });
    
    return matches;
  }

  private detectDocumentType(text: string, entities: any): StructuredPublication['type'] {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('journal officiel')) return 'journal_officiel';
    if (entities.numbers.some((n: any) => n.originalText.toLowerCase().includes('loi'))) return 'loi';
    if (lowerText.includes('décret')) return 'decret';
    if (lowerText.includes('arrêté')) return 'arrete';
    if (lowerText.includes('circulaire')) return 'circulaire';
    if (lowerText.includes('instruction')) return 'instruction';
    
    return 'other';
  }

  private extractTitle(text: string, type: StructuredPublication['type']): string {
    const lines = text.split('\n').filter(line => line.trim().length > 10);
    return lines[0] || 'Document juridique algérien';
  }

  private extractMainNumber(text: string, numberEntities: LegalEntityMatch[]): string {
    if (numberEntities.length > 0) {
      const bestMatch = numberEntities.reduce((best, current) => 
        current.confidence > best.confidence ? current : best
      );
      return bestMatch.value;
    }
    return '';
  }

  private extractMainDate(text: string, dateEntities: LegalEntityMatch[]): string {
    if (dateEntities.length > 0) {
      const bestMatch = dateEntities.reduce((best, current) => 
        current.confidence > best.confidence ? current : best
      );
      return bestMatch.value;
    }
    return '';
  }

  private structureText(text: string): StructuredPublication['sections'] {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    const headerLines = lines.slice(0, 10).filter(line => 
      line.toLowerCase().includes('république') || 
      line.toLowerCase().includes('ministère') ||
      line.toLowerCase().includes('journal officiel')
    );
    
    return {
      header: headerLines.join('\n'),
      body: text,
      footer: '',
      articles: this.extractArticles(text)
    };
  }

  private extractArticles(text: string): string[] {
    const articles: string[] = [];
    const articlePattern = /article\s+(\d+)[^\n]*(?:\n(?!article\s+\d+)[^\n]*)*?/gi;
    
    let match;
    while ((match = articlePattern.exec(text)) !== null) {
      articles.push(match[0].trim());
    }
    
    return articles;
  }

  private detectLanguage(text: string): 'ar' | 'fr' | 'mixed' {
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
    
    if (arabicChars > 0 && latinChars > 0) return 'mixed';
    if (arabicChars > latinChars) return 'ar';
    return 'fr';
  }

  private calculateConfidence(entities: any, text: string): number {
    const weights = { dates: 0.3, numbers: 0.3, institutions: 0.2, references: 0.1, subjects: 0.1 };
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(entities).forEach(([type, matches]: [string, any]) => {
      if (matches.length > 0) {
        const avgConfidence = matches.reduce((sum: number, match: any) => sum + match.confidence, 0) / matches.length;
        totalScore += avgConfidence * weights[type as keyof typeof weights];
        totalWeight += weights[type as keyof typeof weights];
      }
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private isOfficialDocument(text: string): boolean {
    const officialIndicators = [
      'république algérienne démocratique et populaire',
      'journal officiel',
      'ministère'
    ];
    
    const lowerText = text.toLowerCase();
    return officialIndicators.some(indicator => lowerText.includes(indicator));
  }
}

export const algerianLegalRegexService = new AlgerianLegalRegexService();
export default algerianLegalRegexService;
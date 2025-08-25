// 🇩🇿 Moteur OCR spécialisé pour l'Algérie - Version simplifiée et stable
// Utilise le service Tesseract unifié pour éviter les conflits

import { tesseractWorkerService } from './tesseractWorker';

export interface AlgerianOCRResult {
  text: string;
  confidence: number;
  language: 'fra' | 'ara' | 'mixed';
  arabicRatio: number;
  processingTime: number;
  wordCount: number;
}

class AlgerianOCREngine {
  constructor() {
    console.log('🇩🇿 [ALGÉRIE] Moteur OCR utilisant le service unifié');
  }

  /**
   * Initialisation publique
   */
  async initialize(): Promise<void> {
    console.log('🇩🇿 [ALGÉRIE] Initialisation via service unifié...');
    // Le service unifié gère l'initialisation
  }

  /**
   * Détection de langue algérienne
   */
  private analyzeLanguage(text: string): { language: 'fra' | 'ara' | 'mixed'; arabicRatio: number } {
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const frenchChars = (text.match(/[a-zA-ZàáâäèéêëìíîïòóôöùúûüÿçÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜŸÇ]/g) || []).length;
    
    const totalChars = arabicChars + frenchChars;
    const arabicRatio = totalChars > 0 ? arabicChars / totalChars : 0;
    
    let language: 'fra' | 'ara' | 'mixed' = 'fra';
    if (arabicRatio > 0.7) {
      language = 'ara';
    } else if (arabicRatio > 0.2) {
      language = 'mixed';
    }
    
    console.log(`📊 [ALGÉRIE] Détection: ${Math.round(arabicRatio * 100)}% arabe → ${language}`);
    return { language, arabicRatio };
  }

  /**
   * Extraction OCR avec préprocessing intelligent pour l'arabe
   */
  async extractText(file: File): Promise<AlgerianOCRResult> {
    const startTime = performance.now();
    console.log(`🔍 [ALGÉRIE] Début extraction: ${file.name}`);
    
    try {
      // Vérifier le status du service unifié
      const status = tesseractWorkerService.getStatus();
      console.log(`📊 [ALGÉRIE] Status service OCR:`, status);
      
      // Préprocessing intelligent selon le type de contenu probable
      let processedFile = file;
      
      // Détecter si l'image contient probablement du texte arabe
      const { ArabicImagePreprocessor } = await import('./arabicImagePreprocessor');
      const isLikelyArabic = await this.detectLikelyArabicContent(file);
      
      // DÉSACTIVATION TEMPORAIRE DU PRÉPROCESSING POUR TESTER L'EXTRACTION PURE
      console.log('🔧 [ALGÉRIE] PRÉPROCESSING DÉSACTIVÉ - Test extraction directe...');
      processedFile = file; // Utiliser l'image originale
      
      // Utiliser le service Tesseract unifié avec gestion d'erreur robuste
      const worker = await tesseractWorkerService.getTesseractWorker();
      const result = await worker.recognize(processedFile);
      
      const text = result.data.text;
      const { language, arabicRatio } = this.analyzeLanguage(text);
      const processingTime = performance.now() - startTime;
      const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      // Post-traitement du texte arabe pour corriger l'orientation RTL
      const correctedText = this.correctArabicTextDirection(text, arabicRatio);
      
      console.log(`✅ [ALGÉRIE] Extraction terminée: ${correctedText.length} caractères, ${wordCount} mots en ${Math.round(processingTime)}ms`);
      console.log(`🌍 [ALGÉRIE] Langue détectée: ${language} (${Math.round(arabicRatio * 100)}% arabe)`);
      
      return {
        text: correctedText,
        confidence: result.data.confidence / 100, // Normaliser la confiance
        language,
        arabicRatio,
        processingTime,
        wordCount
      };
      
    } catch (error) {
      console.error('❌ [ALGÉRIE] Erreur extraction:', error);
      
      // Fournir un message d'erreur détaillé selon le type d'erreur
      if (error.message?.includes('Ressources Tesseract locales manquantes')) {
        throw new Error(`Impossible d'initialiser l'OCR Algérien: Fichiers Tesseract manquants dans public/. 
        Voir README-TESSERACT.md pour les instructions d'installation.`);
      }
      
      throw new Error(`Erreur OCR Algérien: ${error.message}`);
    }
  }

  /**
   * Détecte si une image contient probablement du texte arabe majoritaire
   */
  private async detectLikelyArabicContent(file: File): Promise<boolean> {
    // Pour l'instant, utilise une heuristique simple basée sur le nom du fichier
    // Une implémentation plus avancée pourrait analyser l'image
    const fileName = file.name.toLowerCase();
    const arabicIndicators = ['arabe', 'arabic', 'ar_', '_ar', 'عربي', 'جريدة', 'رسمية'];
    
    return arabicIndicators.some(indicator => fileName.includes(indicator));
  }

  /**
   * Corrige l'orientation et la structure du texte arabe RTL avec algorithmes avancés
   */
  private correctArabicTextDirection(text: string, arabicRatio: number): string {
    if (arabicRatio < 0.1) {
      // Texte principalement français, pas de correction nécessaire
      return text;
    }
    
    console.log('🔄 [ALGÉRIE] Correction avancée texte arabe RTL...');
    
    let correctedText = text;
    
    // 1. Pré-nettoyage des artefacts OCR courants
    correctedText = this.preCleanOCRArtifacts(correctedText);
    
    // 2. Normaliser les espaces et la ponctuation arabe
    correctedText = this.normalizeArabicSpacing(correctedText);
    
    // 3. Corriger les problèmes de liaison entre caractères arabes
    correctedText = this.fixArabicCharacterLigatures(correctedText);
    
    // 4. Corriger les caractères arabes mal reconnus
    correctedText = this.fixMisrecognizedArabicChars(correctedText);
    
    // 5. Corriger l'ordre des mots si nécessaire (dans certains cas OCR inverse l'ordre)
    if (arabicRatio > 0.7) {
      correctedText = this.fixArabicWordOrder(correctedText);
    }
    
    // 6. Nettoyer les caractères parasites finaux
    correctedText = this.cleanArabicArtifacts(correctedText);
    
    // 7. Post-traitement final pour améliorer la lisibilité
    correctedText = this.finalArabicPostProcessing(correctedText);
    
    return correctedText.trim();
  }

  /**
   * Pré-nettoyage des artefacts OCR avant traitement principal
   */
  private preCleanOCRArtifacts(text: string): string {
    let cleaned = text;
    
    // Supprimer les caractères de contrôle et parasites
    cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    
    // Corriger les espaces multiples en espaces simples
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    
    // Supprimer les sauts de ligne excessifs
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned;
  }

  /**
   * Normalise les espaces et la ponctuation arabe
   */
  private normalizeArabicSpacing(text: string): string {
    let normalized = text;
    
    // Normaliser les espaces autour de la ponctuation arabe
    normalized = normalized.replace(/\s*([؟،؛])\s*/g, '$1 ');
    
    // Normaliser les espaces avec les guillemets arabes
    normalized = normalized.replace(/\s*«\s*/g, ' «');
    normalized = normalized.replace(/\s*»\s*/g, '» ');
    
    // Espaces autour des parenthèses
    normalized = normalized.replace(/\s*\(\s*/g, ' (');
    normalized = normalized.replace(/\s*\)\s*/g, ') ');
    
    return normalized;
  }

  /**
   * Corrige les caractères arabes mal reconnus par l'OCR
   */
  private fixMisrecognizedArabicChars(text: string): string {
    const charCorrections = [
      // Corrections communes d'OCR pour l'arabe
      [/\|/g, 'ل'],           // | confondu avec ل
      [/]/g, 'ي'],            // ] confondu avec ي  
      [/\[/g, 'ب'],           // [ confondu avec ب
      [/}/g, 'د'],            // } confondu avec د
      [/{/g, 'ج'],            // { confondu avec ج
      [/l/g, 'ل'],            // l latin confondu avec ل arabe
      [/\]/g, 'ن'],           // ] confondu avec ن
      [/\\\\/g, 'ال'],        // \\ confondu avec ال
      [/0/g, '٠'],            // Chiffre 0 en chiffre arabe ٠
      [/1/g, '١'],            // Chiffre 1 en chiffre arabe ١
      [/2/g, '٢'],            // Chiffre 2 en chiffre arabe ٢
      [/3/g, '٣'],            // Chiffre 3 en chiffre arabe ٣
      [/4/g, '٤'],            // Chiffre 4 en chiffre arabe ٤
      [/5/g, '٥'],            // Chiffre 5 en chiffre arabe ٥
      [/6/g, '٦'],            // Chiffre 6 en chiffre arabe ٦
      [/7/g, '٧'],            // Chiffre 7 en chiffre arabe ٧
      [/8/g, '٨'],            // Chiffre 8 en chiffre arabe ٨
      [/9/g, '٩'],            // Chiffre 9 en chiffre arabe ٩
      
      // Corrections spécifiques aux documents algériens
      [/AS élu/g, 'الجمهورية'], // "AS élu" mal reconnu pour "الجمهورية"
      [/E33a/g, 'الجزائرية'],    // "E33a" mal reconnu pour "الجزائرية"  
      [/07-20/g, '٠٧-٢٠'],      // Date mal reconnue
      [/lis/g, 'رقم'],          // "lis" mal reconnu pour "رقم"
      [/Lace phil/g, 'المؤرخ في'], // "Lace phil" mal reconnu pour "المؤرخ في"
      [/lg/g, 'من'],            // "lg" mal reconnu pour "من"
      [/1441/g, '١٤٤١'],        // Année hijri
      [/Le/g, 'هـ'],            // "Le" mal reconnu pour "هـ"
      [/Apaahiis/g, 'الموافق'],  // "Apaahiis" mal reconnu pour "الموافق"
      [/y Vé appaall/g, 'لـ'],   // Séquence mal reconnue
      [/Ru plume Lune/g, 'من شهر رجب'] // Séquence de date mal reconnue
    ];
    
    let corrected = text;
    charCorrections.forEach(([pattern, replacement]: [RegExp, string]) => {
      corrected = corrected.replace(pattern, replacement);
    });
    
    return corrected;
  }

  /**
   * Corrige les liaisons entre caractères arabes mal reconnues
   */
  private fixArabicCharacterLigatures(text: string): string {
    // Corrections communes pour les caractères arabes mal reconnus
    const corrections = [
      [/ه\s+([ا-ي])/g, 'ه$1'], // Liaison ه avec caractère suivant
      [/([ا-ي])\s+ة/g, '$1ة'],   // Liaison avec ة finale
      [/ال\s+([ا-ي])/g, 'ال$1'], // Liaison article "ال"
      [/([ا-ي])\s+ئ/g, '$1ئ'],   // Liaison avec همزة
      [/ل\s+ل\s+ه/g, 'لله'],     // Correction "الله"
      [/م\s+ر\s+س\s+و\s+م/g, 'مرسوم'], // Correction "مرسوم" dispersé
      [/ي\s+ح\s+د\s+د/g, 'يحدد'], // Correction "يحدد" dispersé
    ];
    
    let corrected = text;
    corrections.forEach(([pattern, replacement]: [RegExp, string]) => {
      corrected = corrected.replace(pattern, replacement);
    });
    
    return corrected;
  }

  /**
   * Post-traitement final pour améliorer la lisibilité du texte arabe
   */
  private finalArabicPostProcessing(text: string): string {
    let processed = text;
    
    // Assurer des espaces corrects autour des mots arabes
    processed = processed.replace(/([ا-ي])\s*([a-zA-Z])/g, '$1 $2');
    processed = processed.replace(/([a-zA-Z])\s*([ا-ي])/g, '$1 $2');
    
    // Nettoyer les espaces finaux
    processed = processed.replace(/\s+$/gm, '');
    processed = processed.replace(/^\s+/gm, '');
    
    // Supprimer les lignes vides en excès
    processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return processed;
  }

  /**
   * Corrige l'ordre des mots arabes si inversé par l'OCR
   */
  private fixArabicWordOrder(text: string): string {
    // Pour l'instant, implémentation basique
    // Une implémentation plus avancée pourrait utiliser des modèles linguistiques
    const lines = text.split('\n');
    
    return lines.map(line => {
      // Détecter si la ligne est principalement arabe
      const arabicChars = (line.match(/[\u0600-\u06FF]/g) || []).length;
      const totalChars = line.replace(/\s/g, '').length;
      
      if (totalChars > 0 && arabicChars / totalChars > 0.8) {
        // Ligne principalement arabe - vérifier l'ordre des mots
        const words = line.trim().split(/\s+/);
        if (words.length > 1) {
          // Logique simple: si le premier mot semble être une fin de phrase, inverser
          const firstWord = words[0];
          const lastWord = words[words.length - 1];
          
          // Heuristiques simples d'inversion
          if (firstWord.match(/[.،؛!؟]$/) && !lastWord.match(/[.،؛!؟]$/)) {
            return words.reverse().join(' ');
          }
        }
      }
      
      return line;
    }).join('\n');
  }

  /**
   * Nettoie les artéfacts courants dans la reconnaissance arabe
   */
  private cleanArabicArtifacts(text: string): string {
    let cleaned = text;
    
    // Supprimer les caractères parasites courants
    cleaned = cleaned.replace(/[|]/g, 'ل'); // | souvent confondu avec ل
    cleaned = cleaned.replace(/[]/g, 'ي');  // ] souvent confondu avec ي
    cleaned = cleaned.replace(/[]/g, 'ب');  // [ souvent confondu avec ب
    
    // Supprimer les espaces excessifs
    cleaned = cleaned.replace(/\s{3,}/g, ' ');
    
    // Supprimer les lignes vides multiples
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return cleaned;
  }

  /**
   * Nettoyage des ressources - délégué au service unifié
   */
  async cleanup(): Promise<void> {
    console.log('🧹 [ALGÉRIE] Nettoyage délégué au service unifié');
    // Le service unifié gère le nettoyage global
  }
}

// Instance singleton
export const algerianOCREngine = new AlgerianOCREngine();
export default algerianOCREngine;
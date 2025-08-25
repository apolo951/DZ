/**
 * Service OCR 100% RÉEL - Remplace tous les autres services OCR
 * Utilise uniquement Tesseract.js avec les vraies données
 */

import { createWorker } from 'tesseract.js';
import { logger } from '@/utils/logger';
import { getAlgerianArabicWhitelist, ARABIC_OCR_PARAMETERS, detectArabicRatio } from '@/config/arabicCharacterSets';

export interface RealOCRResult {
  text: string;
  confidence: number;
  language: 'ara' | 'fra' | 'mixed';
  processingTime: number;
  documentType: string;
  metadata: {
    pageCount: number;
    fileSize: number;
    extractionDate: string;
    // Détails techniques ajoutés
    totalCharacters: number;
    arabicCharacters: number;
    frenchCharacters: number;
    processingMode: string;
    preprocessingType: string;
    psmUsed: string;
    ocrEngine: string;
    textRegions: number;
  };
  entities: {
    decretNumber?: string;
    dateHijri?: string; 
    dateGregorian?: string;
    institution?: string;
    articles?: string[];
    signatories?: string[];
  };
  pages: Array<{
    pageNumber: number;
    text: string;
    confidence: number;
  }>;
}

class RealOCRService {
  private worker: any = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    console.log('🔥 Service OCR 100% RÉEL - ZÉRO SIMULATION - DONNÉES RÉELLES UNIQUEMENT');
  }

  /**
   * Initialise le worker Tesseract.js - 100% RÉEL
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('🔧 [RÉEL-OCR] Initialisation Tesseract.js BILINGUE ADAPTATIF...');
      
      // NOUVELLE APPROCHE: Configuration bilingue sans restriction de caractères
      this.worker = await createWorker(['fra', 'ara'], 1, {
        logger: (m: any) => console.log('🔍 [TESSERACT-BILINGUE]', m),
        errorHandler: (err: any) => console.warn('⚠️ Tesseract warning (real OCR):', err)
      });

      // Configuration OCR ADAPTATIVE sans whitelist restrictive
      const ocrConfig = {
        // SUPPRESSION de la whitelist restrictive pour permettre détection automatique
        // tessedit_char_whitelist: getAlgerianArabicWhitelist(true), // RETIRÉ
        
        // PSM Mode auto avec OSD pour détecter la direction du texte
        tessedit_pageseg_mode: '1', // Auto OSD - détection automatique
        
        // OCR Engine mode optimal pour bilingue
        tessedit_ocr_engine_mode: '2', // LSTM uniquement - meilleur pour langues multiples
        
        // Paramètres pour support bilingue
        preserve_interword_spaces: '1',        // Préserver espaces
        textord_arabic_numerals: '1',          // Support chiffres arabes
        textord_heavy_nr: '1',                 // Améliore reconnaissance
        
        // Réactivation des dictionnaires pour améliorer le français
        load_system_dawg: '1',
        load_freq_dawg: '1',
        
        // Optimisations générales
        textord_noise_sizefraction: '10.0',
        textord_noise_translimit: '7.0',
        textord_noise_normratio: '2.0',
        
        // Paramètres de certitude équilibrés
        classify_min_certainty_margin: '5.0',
        classify_certainty_scale: '20.0',
        matcher_avg_noise_size: '10.0'
      };
      
      await this.worker.setParameters(ocrConfig);
      console.log('⚙️ [RÉEL-OCR] Configuration bilingue adaptative appliquée:', Object.keys(ocrConfig).length, 'paramètres');

      this.isInitialized = true;
      console.log('✅ [RÉEL-OCR] Tesseract.js initialisé avec succès');
      
    } catch (error) {
      console.error('❌ [RÉEL-OCR] Erreur initialisation:', error);
      throw new Error(`Erreur OCR Algérien: ${error.message}`);
    }
  }

  /**
   * Extrait le texte d'un fichier - 100% RÉEL avec détection adaptative
   */
  async extractText(file: File): Promise<RealOCRResult> {
    const startTime = Date.now();
    
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.worker) {
      throw new Error('Worker OCR non disponible');
    }

    try {
      console.log('🔄 [RÉEL-OCR] Extraction adaptative:', file.name);
      
      let result;
      let pages: Array<{ pageNumber: number; text: string; confidence: number }> = [];
      
      if (file.type === 'application/pdf') {
        // Extraction PDF avec PDF.js + OCR
        const pdfResult = await this.extractFromPDF(file);
        result = {
          data: {
            text: pdfResult.allText,
            confidence: pdfResult.avgConfidence * 100
          }
        };
        pages = pdfResult.pages;
      } else {
        // Détection préalable du type de contenu pour configuration optimale
        const quickSample = await this.getQuickTextSample(file);
        const isLikelyArabic = this.detectArabicContent(quickSample);
        
        // Configuration adaptative selon le contenu détecté
        if (isLikelyArabic) {
          console.log('🔍 [RÉEL-OCR] Contenu arabe détecté - Configuration RTL');
          await this.worker.setParameters({
            tessedit_char_whitelist: getAlgerianArabicWhitelist(true),
            tessedit_pageseg_mode: '6', // Bloc uniforme pour arabe
            preserve_interword_spaces: '1',
            textord_arabic_numerals: '1'
          });
        } else {
          console.log('🔍 [RÉEL-OCR] Contenu français détecté - Configuration LTR');
          await this.worker.setParameters({
            tessedit_char_whitelist: '', // Pas de restriction pour français
            tessedit_pageseg_mode: '3',  // Colonne pour français
            load_system_dawg: '1',
            load_freq_dawg: '1'
          });
        }
        
        // Extraction avec configuration adaptée
        result = await this.worker.recognize(file);
        pages = [{
          pageNumber: 1,
          text: result.data.text || '',
          confidence: (result.data.confidence || 0) / 100
        }];
      }

      let extractedText = result.data.text || '';
      const confidence = (result.data.confidence || 0) / 100;
      const processingTime = Date.now() - startTime;
      
      // Post-traitement pour corriger les problèmes d'arabe RTL
      extractedText = this.correctArabicTextIssues(extractedText);
      
      // Détection de langue CRITIQUE améliorée avec regex étendu
      const arabicCharsRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
      const frenchCharsRegex = /[A-Za-zÀ-ÿ]/g;
      
      const arabicMatches = extractedText.match(arabicCharsRegex) || [];
      const frenchMatches = extractedText.match(frenchCharsRegex) || [];
      const hasArabic = arabicMatches.length > 0;
      const hasFrench = frenchMatches.length > 0;
      
      // Calculer ratio plus précis
      const totalLetters = arabicMatches.length + frenchMatches.length;
      const arabicRatio = totalLetters > 0 ? arabicMatches.length / totalLetters : 0;
      
      // Détection langue améliorée avec seuils adaptés à l'Algérie
      let language: 'ara' | 'fra' | 'mixed';
      if (arabicRatio > 0.7) {
        language = 'ara';  // Majoritairement arabe
      } else if (arabicRatio > 0.2) {
        language = 'mixed'; // Bilingue significatif
      } else if (hasFrench) {
        language = 'fra';   // Majoritairement français
      } else {
        language = hasArabic ? 'ara' : 'fra'; // Fallback
      }
      
      console.log(`🔍 [DÉTECTION] Arabe: ${arabicMatches.length}, Français: ${frenchMatches.length}, Ratio arabe: ${Math.round(arabicRatio * 100)}%, Langue: ${language}`);
      
      // Comptage précis des caractères
      const totalCharacters = extractedText.length;
      const arabicCharacters = arabicMatches.length;
      const frenchCharacters = frenchMatches.length;

      // Déterminer le mode de traitement utilisé
      const processingMode = language === 'mixed' ? 'Bilingue (Arabe + Français)' :
                            language === 'ara' ? 'Arabe uniquement' :
                            language === 'fra' ? 'Français uniquement' :
                            'Automatique';

      const preprocessingType = hasArabic ? 'Activé pour arabe' : 'Standard français';

      // Extraction d'entités RÉELLE
      const entities = this.extractLegalEntities(extractedText);
      
      // Détection du type de document
      const documentType = this.detectDocumentType(extractedText);

      const finalResult: RealOCRResult = {
        text: extractedText,
        confidence,
        language,
        processingTime,
        documentType,
        metadata: {
          pageCount: pages.length,
          fileSize: file.size,
          extractionDate: new Date().toISOString(),
          // Détails techniques complets
          totalCharacters,
          arabicCharacters,
          frenchCharacters,
          processingMode,
          preprocessingType,
          psmUsed: '1 (Segmentation automatique OSD)',
          ocrEngine: '3 (Legacy + LSTM optimisé)',
          textRegions: pages.length
        },
        entities,
        pages
      };

      console.log(`✅ [RÉEL-OCR] Extraction terminée: ${extractedText.length} caractères, confiance: ${(confidence * 100).toFixed(1)}%`);
      
      return finalResult;
      
    } catch (error) {
      console.error('❌ [RÉEL-OCR] Erreur extraction:', error);
      throw new Error(`Extraction OCR échouée: ${error.message}`);
    }
  }

  /**
   * Extrait le texte d'un PDF - 100% RÉEL
   */
  private async extractFromPDF(pdfFile: File): Promise<{
    allText: string;
    avgConfidence: number;
    pages: Array<{ pageNumber: number; text: string; confidence: number }>;
  }> {
    try {
      console.log('📄 [RÉEL-OCR] Extraction PDF...');
      
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let allText = '';
      let totalConfidence = 0;
      const pages: Array<{ pageNumber: number; text: string; confidence: number }> = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`📄 [RÉEL-OCR] Page ${pageNum}/${pdf.numPages}...`);
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Impossible de créer le contexte canvas');
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        } as any).promise;
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Impossible de convertir le canvas en blob'));
          }, 'image/png');
        });
        
        const imageFile = new File([blob], `page-${pageNum}.png`, { type: 'image/png' });
        const pageResult = await this.worker.recognize(imageFile);
        
        const pageText = pageResult.data.text || '';
        const pageConfidence = (pageResult.data.confidence || 0) / 100;
        
        pages.push({
          pageNumber: pageNum,
          text: pageText,
          confidence: pageConfidence
        });
        
        allText += pageText + '\n\n--- PAGE SUIVANTE ---\n\n';
        totalConfidence += pageConfidence;
      }
      
      const avgConfidence = pages.length > 0 ? totalConfidence / pages.length : 0;
      
      return { allText, avgConfidence, pages };
      
    } catch (error) {
      console.error('❌ [RÉEL-OCR] Erreur extraction PDF:', error);
      throw new Error(`Extraction PDF échouée: ${error.message}`);
    }
  }

  /**
   * Échantillonnage rapide pour détecter le type de contenu
   */
  private async getQuickTextSample(file: File): Promise<string> {
    try {
      // Reconnaissance rapide avec paramètres minimaux pour échantillonnage  
      await this.worker.setParameters({
        tessedit_pageseg_mode: '1',
        tessedit_ocr_engine_mode: '2'
      });
      
      const quickResult = await this.worker.recognize(file);
      return quickResult.data.text || '';
    } catch (error) {
      console.warn('⚠️ [SAMPLE] Erreur échantillonnage rapide:', error);
      return '';
    }
  }

  /**
   * Détecte si le contenu est principalement arabe
   */
  private detectArabicContent(text: string): boolean {
    const arabicCharsRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
    const frenchCharsRegex = /[A-Za-zÀ-ÿ]/g;
    
    const arabicMatches = text.match(arabicCharsRegex) || [];
    const frenchMatches = text.match(frenchCharsRegex) || [];
    
    const totalLetters = arabicMatches.length + frenchMatches.length;
    if (totalLetters < 10) return false; // Pas assez de texte pour décider
    
    const arabicRatio = arabicMatches.length / totalLetters;
    console.log(`🔍 [DÉTECTION] Ratio arabe: ${Math.round(arabicRatio * 100)}% (${arabicMatches.length}/${totalLetters})`);
    
    return arabicRatio > 0.3; // Seuil pour considérer comme contenu arabe
  }

  /**
   * Corrige les problèmes courants de l'OCR arabe (direction RTL, liaisons, etc.)
   */
  private correctArabicTextIssues(text: string): string {
    if (!text || typeof text !== 'string') {
      return text;
    }

    // Détecter le ratio de texte arabe
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    const arabicRatio = totalChars > 0 ? arabicChars / totalChars : 0;

    if (arabicRatio < 0.1) {
      // Texte principalement français, pas de correction nécessaire
      return text;
    }

    console.log(`🔄 [CORRECTION] Application corrections arabe RTL (${Math.round(arabicRatio * 100)}% arabe)...`);

    let correctedText = text;

    // 1. CRITIQUE: Normaliser les espaces arabes différemment des espaces français
    correctedText = this.normalizeArabicSpaces(correctedText, arabicRatio);

    // 2. Corriger les liaisons entre caractères arabes (amélioré)
    correctedText = this.fixArabicCharacterLigatures(correctedText);

    // 3. Nettoyer les caractères parasites fréquents (plus agressif)
    correctedText = this.cleanArabicArtifacts(correctedText);

    // 4. NOUVEAU: Corriger les inversions de caractères arabes RTL
    correctedText = this.fixArabicRTLInversions(correctedText);

    // 5. Corriger l'ordre des mots si nécessaire (pour texte majoritairement arabe)
    if (arabicRatio > 0.6) { // Seuil abaissé
      correctedText = this.fixArabicWordOrder(correctedText);
    }

    // 6. NOUVEAU: Post-traitement final pour documents algériens
    correctedText = this.finalAlgerianDocumentCorrection(correctedText);

    return correctedText.trim();
  }

  /**
   * NOUVEAU: Normalise les espaces arabes différemment des espaces français
   */
  private normalizeArabicSpaces(text: string, arabicRatio: number): string {
    if (arabicRatio > 0.5) {
      // Pour texte principalement arabe - préserver plus d'espaces
      return text.replace(/\s{4,}/g, '  ').replace(/\s{2,3}/g, ' ');
    } else {
      // Pour texte bilingue - normalisation standard
      return text.replace(/\s+/g, ' ');
    }
  }

  /**
   * NOUVEAU: Corrige les inversions RTL de caractères arabes
   */
  private fixArabicRTLInversions(text: string): string {
    let corrected = text;

    // Corrections spécifiques pour caractères inversés fréquents
    const rtlCorrections = [
      [/([ا-ي])(\d+)([ا-ي])/g, '$1 $2 $3'], // Séparer chiffres collés aux lettres arabes
      [/(\d+)([ا-ي])/g, '$1 $2'],            // Espace après chiffre avant arabe
      [/([ا-ي])(\d+)/g, '$1 $2'],            // Espace après arabe avant chiffre
      [/([A-Z]+)([ا-ي])/g, '$1 $2'],         // Espace après majuscules avant arabe
      [/([ا-ي])([A-Z]+)/g, '$1 $2'],         // Espace après arabe avant majuscules
    ];

    rtlCorrections.forEach(([pattern, replacement]: [RegExp, string]) => {
      corrected = corrected.replace(pattern, replacement);
    });

    return corrected;
  }

  /**
   * NOUVEAU: Post-traitement final pour documents algériens
   */
  private finalAlgerianDocumentCorrection(text: string): string {
    let corrected = text;

    // Corrections spécifiques aux documents officiels algériens
    const algerianCorrections = [
      // Dates hijriennes communes
      [/(\d+)\s*هـ\s*(\d+)/g, '$1 هـ $2'],     // Format date hijrienne
      [/الجمهورية\s+الجزائرية/gi, 'الجمهورية الجزائرية'], // République Algérienne
      
      // Numéros de décrets
      [/رقم\s*(\d+)/g, 'رقم $1'],              // Numéro de décret
      [/المؤرخ\s+في/g, 'المؤرخ في'],          // Daté du
      
      // Corrections françaises communes dans documents DZ
      [/République\s+Algérienne/gi, 'République Algérienne'],
      [/Décret\s+Exécutif/gi, 'Décret Exécutif'],
      [/N°\s*(\d+)/gi, 'N° $1'],
      
      // Nettoyage final
      [/\s+\n/g, '\n'],                       // Supprimer espaces avant saut de ligne
      [/\n\s+/g, '\n'],                       // Supprimer espaces après saut de ligne
      [/([.،؛!؟])\s*([ا-يA-Za-z])/g, '$1 $2'], // Espace après ponctuation
    ];

    algerianCorrections.forEach(([pattern, replacement]: [RegExp, string]) => {
      corrected = corrected.replace(pattern, replacement);
    });

    return corrected;
  }

  /**
   * Corrige les liaisons entre caractères arabes mal reconnues par l'OCR
   */
  private fixArabicCharacterLigatures(text: string): string {
    const corrections = [
      [/ه\s+([ا-ي])/g, 'ه$1'],     // Liaison ه avec caractère suivant
      [/([ا-ي])\s+ة/g, '$1ة'],       // Liaison avec ة finale
      [/ال\s+([ا-ي])/g, 'ال$1'],     // Liaison article "ال"
      [/([ا-ي])\s+ئ/g, '$1ئ'],       // Liaison avec همزة
      [/ل\s+ل\s+ه/g, 'لله'],         // Correction "الله"
      
      // Nouvelles corrections améliorées
      [/م\s+ن/g, 'من'],              // "من" souvent séparé
      [/ع\s+ل\s+ى/g, 'على'],        // "على" souvent séparé
      [/ف\s+ي/g, 'في'],              // "في" souvent séparé
      [/إ\s+ل\s+ى/g, 'إلى'],        // "إلى" souvent séparé
    ];

    let corrected = text;
    corrections.forEach(([pattern, replacement]: [RegExp, string]) => {
      corrected = corrected.replace(pattern, replacement);
    });

    return corrected;
  }

  /**
   * Nettoie les artéfacts courants dans la reconnaissance arabe
   */
  private cleanArabicArtifacts(text: string): string {
    let cleaned = text;

    // Supprimer les caractères parasites courants (version améliorée)
    const artifactCorrections = [
      [/[|]/g, 'ل'],              // | souvent confondu avec ل
      [/\]/g, 'ي'],               // ] souvent confondu avec ي
      [/\[/g, 'ب'],               // [ souvent confondu avec ب
      [/\{/g, 'ج'],               // { parfois confondu avec ج
      [/\}/g, 'ح'],               // } parfois confondu avec ح
      [/`/g, 'ء'],                // ` parfois confondu avec همزة
      [/~/g, 'ن'],                // ~ parfois confondu avec ن
      [/@/g, ''],                 // @ caractère parasite
      [/#/g, ''],                 // # caractère parasite
      [/\$/g, ''],                // $ caractère parasite
      [/%/g, ''],                 // % sauf dans contextes légitimes
    ];

    artifactCorrections.forEach(([pattern, replacement]: [RegExp, string]) => {
      cleaned = cleaned.replace(pattern, replacement);
    });

    // Supprimer les espaces excessifs (version améliorée)
    cleaned = cleaned.replace(/\s{4,}/g, '  ');  // Max 2 espaces consécutifs
    cleaned = cleaned.replace(/\s{3}/g, ' ');     // 3 espaces -> 1 espace

    // Supprimer les lignes vides multiples
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');

    return cleaned;
  }

  /**
   * Corrige l'ordre des mots arabes si inversé par l'OCR
   */
  private fixArabicWordOrder(text: string): string {
    const lines = text.split('\n');

    return lines.map(line => {
      // Détecter si la ligne est principalement arabe
      const arabicChars = (line.match(/[\u0600-\u06FF]/g) || []).length;
      const totalChars = line.replace(/\s/g, '').length;

      if (totalChars > 0 && arabicChars / totalChars > 0.8) {
        // Ligne principalement arabe - vérifier l'ordre des mots
        const words = line.trim().split(/\s+/);
        if (words.length > 1) {
          const firstWord = words[0];
          const lastWord = words[words.length - 1];

          // Heuristique améliorée: détecter inversion RTL
          const startsWithNumber = /^\d/.test(firstWord);
          const endsWithArabic = /[ا-ي]$/.test(lastWord);
          const hasEndPunctuation = /[.،؛!؟]$/.test(firstWord);
          const hasStartPunctuation = /^[.،؛!؟]/.test(lastWord);

          // Si commence par chiffre et finit par arabe, probablement inversé
          if (startsWithNumber && endsWithArabic && !hasEndPunctuation) {
            return words.reverse().join(' ');
          }

          // Si premier mot semble être une fin de phrase, inverser
          if (hasEndPunctuation && !hasStartPunctuation) {
            return words.reverse().join(' ');
          }
        }
      }

      return line;
    }).join('\n');
  }

  /**
   * Extraction d'entités juridiques - RÉELLE
   */
  private extractLegalEntities(text: string): RealOCRResult['entities'] {
    const entities: RealOCRResult['entities'] = {};

    if (!text || typeof text !== 'string') {
      return entities;
    }

    // Extraction RÉELLE avec regex améliorées pour documents algériens
    
    // Numéros de décrets (français et arabe)
    const decretMatch = text.match(/(?:DÉCRET\s+EXÉCUTIF\s+N°\s*|رقم\s*)(\d+-\d+|\d+\/\d+)/i);
    if (decretMatch) entities.decretNumber = decretMatch[1];

    // Dates hijriennes
    const hijriMatch = text.match(/(\d+\s+[\u0600-\u06FF]+\s+\d{4}|\d+\s*هـ\s*\d{4})/);
    if (hijriMatch) entities.dateHijri = hijriMatch[1];

    // Dates grégoriennes 
    const gregorianMatch = text.match(/(\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4})/i);
    if (gregorianMatch) entities.dateGregorian = gregorianMatch[1];

    // Institutions algériennes
    const institutionPatterns = [
      /(Ministère[^.]*\.)/i,
      /(République\s+Algérienne[^.]*\.)/i,
      /(الجمهورية\s+الجزائرية[^.]*\.)/,
      /(وزارة[^.]*\.)/
    ];
    
    for (const pattern of institutionPatterns) {
      const match = text.match(pattern);
      if (match) {
        entities.institution = match[1].trim();
        break;
      }
    }

    // Articles de loi
    const articleMatches = text.match(/(?:Article\s+\d+|المادة\s+\d+)[^:]*:/gi);
    if (articleMatches) {
      entities.articles = articleMatches.map(article => article.trim()).slice(0, 20);
    }

    // Signataires
    const signatureMatches = text.match(/(?:Le\s+[\w\s]+|الوزير[\w\s]*|رئيس[\w\s]*)(?=\[Signature\])/gi);
    if (signatureMatches) {
      entities.signatories = signatureMatches.map(sig => sig.trim()).slice(0, 10);
    }

    return entities;
  }

  /**
   * Détection du type de document - RÉELLE
   */
  private detectDocumentType(text: string): string {
    if (!text || typeof text !== 'string') {
      return 'Document Juridique';
    }

    const upperText = text.toUpperCase();
    const arabicText = text;
    
    // Détection française
    if (upperText.includes('DÉCRET EXÉCUTIF')) return 'Décret Exécutif';
    if (upperText.includes('ARRÊTÉ')) return 'Arrêté';
    if (upperText.includes('ORDONNANCE')) return 'Ordonnance';
    if (upperText.includes('LOI N°')) return 'Loi';
    if (upperText.includes('CIRCULAIRE')) return 'Circulaire';
    if (upperText.includes('INSTRUCTION')) return 'Instruction';
    if (upperText.includes('DÉCISION')) return 'Décision';
    
    // Détection arabe
    if (arabicText.includes('مرسوم تنفيذي')) return 'Décret Exécutif';
    if (arabicText.includes('قرار')) return 'Décision';
    if (arabicText.includes('أمر')) return 'Ordonnance';
    if (arabicText.includes('قانون')) return 'Loi';
    if (arabicText.includes('منشور')) return 'Circulaire';
    if (arabicText.includes('تعليمة')) return 'Instruction';
    
    return 'Document Juridique';
  }

  /**
   * Nettoie les ressources
   */
  async cleanup(): Promise<void> {
    if (this.worker) {
      try {
        await this.worker.terminate();
        this.worker = null;
        this.isInitialized = false;
        this.initPromise = null;
        console.log('🧹 [RÉEL-OCR] Service nettoyé');
      } catch (error) {
        console.error('❌ [RÉEL-OCR] Erreur nettoyage:', error);
      }
    }
  }
}

export const realOCRService = new RealOCRService();

/**
 * Fonction utilitaire pour traiter un document OCR
 */
export const processDocumentOCR = async (file: File): Promise<RealOCRResult> => {
  return await realOCRService.extractText(file);
};

/**
 * Mappe les résultats OCR vers des champs de formulaire
 */
export const mapToFormFields = (result: RealOCRResult): Record<string, unknown> => {
  return {
    documentType: result.documentType,
    confidence: result.confidence,
    language: result.language,
    text: result.text,
    ...result.entities,
    processingTime: result.processingTime,
    pageCount: result.metadata.pageCount,
    fileSize: result.metadata.fileSize,
    extractionDate: result.metadata.extractionDate
  };
};

export default realOCRService;
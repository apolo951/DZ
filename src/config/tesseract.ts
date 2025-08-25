/**
 * Configuration globale pour Tesseract.js
 * Utilise les fichiers locaux pour éviter les problèmes CSP
 */

import { getAlgerianArabicWhitelist, ARABIC_OCR_PARAMETERS } from './arabicCharacterSets';

export const TESSERACT_CONFIG = {
  // Chemins des fichiers locaux - 100% LOCAL POUR L'ALGÉRIE
  workerPath: '/tesseract-worker.js',
  corePath: '/tesseract-core.wasm.js',
  langPath: '/tesseract-lang',
  
  // Configuration CRITIQUE Algérie : Arabe UNIQUEMENT pour meilleure extraction
  languages: ['ara'], // ARABE SEUL pour éviter interférences françaises
  defaultLanguage: 'ara', // Mode arabe pur pour documents algériens
  
  // Paramètres OCR OPTIMISÉS pour extraction arabe pure
  parameters: {
    // Mode de segmentation optimal pour arabe dense
    tessedit_pageseg_mode: '6', // Bloc uniforme - meilleur pour texte arabe
    tessedit_ocr_engine_mode: '2', // LSTM seul - optimal pour arabe moderne
    
    // Désactivation des dictionnaires pour pure reconnaissance de formes
    load_system_dawg: '0',
    load_freq_dawg: '0',
    load_unambig_dawg: '0',
    load_punc_dawg: '0',
    load_number_dawg: '0',
    
    // Configuration RTL essentielle
    preserve_interword_spaces: '1',
    textord_arabic_numerals: '1',
    
    // Paramètres spécifiques pour l'arabe (importés depuis la configuration dédiée)
    ...ARABIC_OCR_PARAMETERS
  },
  
  // Configuration des workers
  workerOptions: {
    logger: (m: any) => console.log('Tesseract:', m),
    errorHandler: (err: any) => console.error('Tesseract Error:', err),
    gzip: false, // Désactivé pour les fichiers locaux
  }
};

/**
 * Vérifie si les fichiers Tesseract.js sont disponibles localement
 */
export async function checkTesseractAvailability(): Promise<boolean> {
  try {
    // 🇩🇿 Vérification des fichiers Tesseract pour fonctionnement 100% local algérien
    const workerResponse = await fetch(TESSERACT_CONFIG.workerPath);
    const coreResponse = await fetch(TESSERACT_CONFIG.corePath);
    const frenchLangResponse = await fetch('/tesseract-lang/fra.traineddata');
    const arabicLangResponse = await fetch('/tesseract-lang/ara.traineddata');
    
    const allFilesAvailable = workerResponse.ok && coreResponse.ok && 
                             frenchLangResponse.ok && arabicLangResponse.ok;
    
    if (allFilesAvailable) {
      console.log('🇩🇿 ✅ TOUS les fichiers Tesseract disponibles localement - Mode 100% algérien activé');
    } else {
      console.log('🇩🇿 ⚠️ Fichiers Tesseract manquants - Vérification du mode local');
    }
    
    return allFilesAvailable;
  } catch (error) {
    console.warn('🇩🇿 Erreur vérification fichiers Tesseract locaux:', error);
    return false;
  }
}

/**
 * Obtient la configuration Tesseract.js selon l'environnement
 */
export function getTesseractConfig() {
  // Mode strictement local: toujours renvoyer les chemins locaux
  return {
    ...TESSERACT_CONFIG
  };
}
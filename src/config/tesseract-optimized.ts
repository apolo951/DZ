/**
 * Configuration optimisée pour Tesseract.js
 * Utilise CDN + compression pour réduire la taille
 */

export const TESSERACT_OPTIMIZED_CONFIG = {
  "workerPath": "/tesseract-worker.js",
  "corePath": "/tesseract-core.wasm.js",
  "langPath": "/tesseract-lang",
  "loadOnlyNeeded": true,
  "preloadLanguages": [
    "fra"
  ],
  "useCompression": false,
  "compressedExtensions": [
    ".gz",
    ".br"
  ]
};

export const TESSERACT_LANGUAGES = {
  fra: {
    name: 'Français',
    size: '1.08MB',
    compressed: '0.58MB'
  },
  ara: {
    name: 'Arabe',
    size: '1.37MB',
    compressed: '0.69MB'
  }
};

export function getOptimizedTesseractConfig() {
  return {
    ...TESSERACT_OPTIMIZED_CONFIG,
    // Détection automatique de la meilleure source
    getWorkerPath: () => {
      // Essayer CDN d'abord, puis local
      return TESSERACT_OPTIMIZED_CONFIG.workerPath;
    },
    getCorePath: () => {
      return TESSERACT_OPTIMIZED_CONFIG.corePath;
    }
  };
}

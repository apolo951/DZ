/**
 * Système de fallback pour Tesseract.js
 * Évite les erreurs d'initialisation en détectant la disponibilité des ressources
 */

let tesseractAvailable: boolean | null = null;
let checkPromise: Promise<boolean> | null = null;

export async function isTesseractAvailable(): Promise<boolean> {
  // Si on a déjà vérifié, retourner le résultat en cache
  if (tesseractAvailable !== null) {
    return tesseractAvailable;
  }

  // Si une vérification est en cours, attendre son résultat
  if (checkPromise) {
    return checkPromise;
  }

  // Nouvelle vérification
  checkPromise = checkTesseractResources();
  tesseractAvailable = await checkPromise;
  checkPromise = null;
  
  return tesseractAvailable;
}

async function checkTesseractResources(): Promise<boolean> {
  try {
    console.log('🔍 Vérification des ressources Tesseract...');

    // Vérifier la disponibilité des fichiers Tesseract avec timeout
    const timeout = 5000; // 5 secondes max
    
    const resourceChecks = [
      '/tesseract-worker.js',
      '/tesseract-core.wasm.js', 
      '/tesseract-lang/fra.traineddata',
      '/tesseract-lang/ara.traineddata' // Support arabe obligatoire
    ].map(async (url) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
      } catch (error) {
        console.warn(`❌ Ressource Tesseract indisponible: ${url}`, error);
        return false;
      }
    });

    const results = await Promise.all(resourceChecks);
    const allAvailable = results.every(r => r === true);

    if (allAvailable) {
      console.log('✅ Ressources Tesseract disponibles');
    } else {
      console.warn('⚠️ Ressources Tesseract indisponibles - mode fallback activé');
    }

    return allAvailable;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification Tesseract:', error);
    return false;
  }
}

/**
 * Wrapper sécurisé pour créer un worker Tesseract - ARABE PRIORITAIRE ALGÉRIE
 */
export async function createSafeTesseractWorker(languages: string | string[] = ['ara', 'fra'], workerNum = 1, options = {}) {
  try {
    const isAvailable = await isTesseractAvailable();
    
    if (!isAvailable) {
      console.warn('⚠️ Tesseract indisponible - retour d\'un worker fictif');
      return createMockWorker();
    }

    const { createWorker } = await import('tesseract.js');
    
    const worker = await createWorker(languages, workerNum, {
      workerPath: '/tesseract-worker.js',
      corePath: '/tesseract-core.wasm.js',
      langPath: '/tesseract-lang',
      gzip: false,
      ...options,
      errorHandler: (err: any) => {
        console.warn('⚠️ Tesseract worker warning:', err);
        // Ne pas faire planter l'application
      }
    });

    return worker;
  } catch (error) {
    console.error('❌ Erreur création worker Tesseract:', error);
    return createMockWorker();
  }
}

/**
 * Worker fictif qui retourne des résultats vides mais ne fait pas planter l'app
 */
function createMockWorker() {
  return {
    recognize: async () => ({
      data: {
        text: '',
        confidence: 0
      }
    }),
    setParameters: async () => {},
    terminate: async () => {},
    reinitialize: async () => {},
    getParameters: async () => ({}),
  };
}

/**
 * Précharge les ressources Tesseract pour éviter les timeouts
 */
export async function preloadTesseractResources(): Promise<void> {
  try {
    const resources = [
      '/tesseract-lang/fra.traineddata',
      '/tesseract-lang/ara.traineddata'
    ];

    await Promise.all(resources.map(async (url) => {
      try {
        await fetch(url, { method: 'HEAD' });
        console.log(`✅ Ressource préchargée: ${url}`);
      } catch (error) {
        console.warn(`⚠️ Échec préchargement: ${url}`, error);
      }
    }));
  } catch (error) {
    console.warn('Erreur préchargement ressources Tesseract:', error);
  }
}

/**
 * Reset du cache de disponibilité (utile pour les tests)
 */
export function resetTesseractCache() {
  tesseractAvailable = null;
  checkPromise = null;
}
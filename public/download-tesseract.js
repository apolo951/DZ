// Script pour télécharger automatiquement les fichiers Tesseract.js
// Utilisé comme fallback si les fichiers locaux ne sont pas disponibles

async function downloadTesseractFiles() {
  console.log('📥 Téléchargement des fichiers Tesseract.js...');
  
  try {
    // Chemins strictement locaux pour Tesseract.js (outil hors-ligne)
    const files = [
      { name: 'worker.min.js', url: '/tesseract-worker.js' },
      { name: 'tesseract-core-simd.wasm.js', url: '/tesseract-core.wasm.js' }
    ];
    
    // Créer les workers en mémoire
    const workers = {};
    
    for (const file of files) {
      try {
        const response = await fetch(file.url);
        if (response.ok) {
          const content = await response.text();
          const blob = new Blob([content], { type: 'application/javascript' });
          workers[file.name] = URL.createObjectURL(blob);
          console.log(`✅ ${file.name} téléchargé avec succès`);
        }
      } catch (error) {
        console.warn(`⚠️ Impossible de télécharger ${file.name}:`, error);
      }
    }
    
    // Exposer les URLs générées globalement
    window.tesseractWorkers = workers;
    console.log('✅ Fichiers Tesseract.js prêts');
    
  } catch (error) {
    console.error('❌ Erreur lors du téléchargement des fichiers Tesseract:', error);
  }
}

// Auto-démarrage
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', downloadTesseractFiles);
} else {
  downloadTesseractFiles();
}
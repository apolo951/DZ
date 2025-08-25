import React, { useState } from 'react';
import { pdfProcessingService } from '@/services/enhanced/pdfProcessingService';

/**
 * Composant de test pour vérifier le fonctionnement de PDF.js local
 * Remplace les services PDF externes pour éviter les problèmes de CSP
 */
export const PDFTestComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else {
      setError('Veuillez sélectionner un fichier PDF valide');
    }
  };

  const testPDFProcessing = async () => {
    if (!file) {
      setError('Veuillez d\'abord sélectionner un fichier PDF');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Test du service PDF local
      const pdfResult = await pdfProcessingService.processPDF(file, {
        scale: 1.5,
        quality: 0.8,
        maxPages: 2
      });

      setResult({
        pagesProcessed: pdfResult.pages.length,
        textLength: pdfResult.text.length,
        metadata: pdfResult.metadata,
        processingTime: pdfResult.processingTime
      });

      console.log('✅ Test PDF réussi:', pdfResult);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du traitement PDF: ${errorMessage}`);
      console.error('❌ Test PDF échoué:', err);
    } finally {
      setLoading(false);
    }
  };

  const testTextExtraction = async () => {
    if (!file) {
      setError('Veuillez d\'abord sélectionner un fichier PDF');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Test de l'extraction de texte
      const text = await pdfProcessingService.extractText(file);
      
      setResult({
        textLength: text.length,
        textPreview: text.substring(0, 500) + '...',
        type: 'text'
      });

      console.log('✅ Extraction de texte réussie, longueur:', text.length);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de l'extraction de texte: ${errorMessage}`);
      console.error('❌ Extraction de texte échouée:', err);
    } finally {
      setLoading(false);
    }
  };

  const getServiceInfo = () => {
    const info = pdfProcessingService.getServiceInfo();
    return info;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🧪 Test PDF.js Local (Remplace les services PDF externes)
      </h2>

      {/* Informations du service */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          ℹ️ Informations du Service PDF
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Nom:</strong> {getServiceInfo().name}
          </div>
          <div>
            <strong>Version:</strong> {getServiceInfo().version}
          </div>
          <div>
            <strong>Disponible:</strong> 
            <span className={getServiceInfo().available ? 'text-green-600' : 'text-red-600'}>
              {getServiceInfo().available ? '✅ Oui' : '❌ Non'}
            </span>
          </div>
          <div>
            <strong>Worker:</strong> {getServiceInfo().workerPath}
          </div>
        </div>
      </div>

      {/* Sélection de fichier */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📄 Sélectionner un fichier PDF
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Fichier sélectionné: <strong>{file.name}</strong> 
            ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Boutons de test */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={testPDFProcessing}
          disabled={!file || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Traitement...' : '🚀 Tester Traitement PDF Complet'}
        </button>

        <button
          onClick={testTextExtraction}
          disabled={!file || loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Extraction...' : '📝 Tester Extraction de Texte'}
        </button>
      </div>

      {/* Affichage des résultats */}
      {result && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Résultats du Test
          </h3>
          <div className="space-y-2 text-sm">
            {result.pagesProcessed && (
              <div><strong>Pages traitées:</strong> {result.pagesProcessed}</div>
            )}
            {result.textLength && (
              <div><strong>Longueur du texte:</strong> {result.textLength} caractères</div>
            )}
            {result.processingTime && (
              <div><strong>Temps de traitement:</strong> {result.processingTime.toFixed(2)}ms</div>
            )}
            {result.metadata && (
              <div>
                <strong>Métadonnées:</strong>
                <ul className="ml-4 mt-1">
                  <li>Pages: {result.metadata.pageCount}</li>
                  {result.metadata.title && <li>Titre: {result.metadata.title}</li>}
                  {result.metadata.author && <li>Auteur: {result.metadata.author}</li>}
                </ul>
              </div>
            )}
            {result.textPreview && (
              <div>
                <strong>Aperçu du texte:</strong>
                <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono max-h-32 overflow-y-auto">
                  {result.textPreview}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ❌ Erreur
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📋 Instructions de Test
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Sélectionnez un fichier PDF (de préférence un journal officiel algérien)</li>
          <li>Cliquez sur "Tester Traitement PDF Complet" pour tester la conversion en images</li>
          <li>Cliquez sur "Tester Extraction de Texte" pour tester l'extraction de texte</li>
          <li>Vérifiez que les résultats s'affichent correctement</li>
        </ol>
        <p className="mt-2 text-xs text-gray-500">
          Ce composant utilise PDF.js local pour éviter les problèmes de CSP.
        </p>
      </div>
    </div>
  );
};
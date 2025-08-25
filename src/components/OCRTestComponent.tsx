import React, { useState, useRef } from 'react';
import { unifiedOCRService } from '../services/unifiedOCRService';
import { ArabicOCRTester } from './ArabicOCRTester';

/**
 * Composant de test pour vérifier le fonctionnement de l'OCR
 */
export const OCRTestComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Teste l'initialisation du service OCR
   */
  const testInitialization = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResult('');
      
      console.log('🧪 [Test] Test d\'initialisation OCR...');
      await unifiedOCRService.initialize();
      
      const currentStatus = unifiedOCRService.getStatus();
      setStatus(currentStatus);
      
      setResult('✅ Service OCR initialisé avec succès !');
      console.log('✅ [Test] Initialisation réussie');
      
    } catch (err: any) {
      setError(`❌ Erreur d'initialisation: ${err.message}`);
      console.error('❌ [Test] Erreur d\'initialisation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Teste l'extraction de texte d'une image
   */
  const testImageOCR = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError('');
      setResult('');
      
      console.log('🧪 [Test] Test OCR sur image:', file.name);
      
      const ocrResult = await unifiedOCRService.extractText(file);
      
      setResult(`
✅ OCR réussi !
📝 Texte extrait: ${ocrResult.text.substring(0, 200)}${ocrResult.text.length > 200 ? '...' : ''}
🎯 Confiance: ${(ocrResult.confidence * 100).toFixed(1)}%
🌍 Langue: ${ocrResult.language}
      `);
      
      console.log('✅ [Test] OCR réussi:', ocrResult);
      
    } catch (err: any) {
      setError(`❌ Erreur OCR: ${err.message}`);
      console.error('❌ [Test] Erreur OCR:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Vérifie la disponibilité des fichiers Tesseract
   */
  const checkFilesAvailability = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResult('');
      
      console.log('🧪 [Test] Vérification des fichiers Tesseract...');
      
      const workerResponse = await fetch('/tesseract-worker.js');
      const coreResponse = await fetch('/tesseract-core.wasm.js');
      const langResponse = await fetch('/tesseract-lang/fra.traineddata');
      
      const results = {
        worker: workerResponse.ok ? '✅' : '❌',
        core: coreResponse.ok ? '✅' : '❌',
        lang: langResponse.ok ? '✅' : '❌'
      };
      
      setResult(`
📁 Vérification des fichiers Tesseract:
${results.worker} Worker: /tesseract-worker.js
${results.core} Core: /tesseract-core.wasm.js  
${results.lang} Langues: /tesseract-lang/fra.traineddata
      `);
      
      console.log('✅ [Test] Vérification terminée:', results);
      
    } catch (err: any) {
      setError(`❌ Erreur de vérification: ${err.message}`);
      console.error('❌ [Test] Erreur de vérification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Nettoie le service OCR
   */
  const cleanupOCR = async () => {
    try {
      await unifiedOCRService.terminate();
      setResult('🧹 Service OCR nettoyé et terminé');
      setStatus(null);
      console.log('🧹 [Test] Service OCR nettoyé');
    } catch (err: any) {
      setError(`❌ Erreur de nettoyage: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Nouveau testeur OCR Arabe optimisé */}
      <ArabicOCRTester />
      
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🧪 Test du Service OCR Unifié (Legacy)
        </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <button
            onClick={testInitialization}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '⏳ Initialisation...' : '🔧 Tester l\'initialisation'}
          </button>
          
          <button
            onClick={checkFilesAvailability}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? '⏳ Vérification...' : '📁 Vérifier les fichiers'}
          </button>
          
          <button
            onClick={cleanupOCR}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🧹 Nettoyer l'OCR
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={testImageOCR}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? '⏳ Traitement...' : '🖼️ Tester OCR sur image'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Cliquez pour sélectionner une image
            </p>
          </div>
        </div>
      </div>
      
      {status && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">📊 État du service:</h3>
          <pre className="text-sm text-gray-600">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
      
      {result && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Résultat:</h3>
          <pre className="text-sm text-green-700 whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">❌ Erreur:</h3>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
        </div>
      )}
      
      <div className="text-sm text-gray-600">
        <p>💡 Ce composant teste le service OCR unifié qui résout les problèmes CSP.</p>
        <p>🔧 Il utilise les fichiers Tesseract.js locaux au lieu des CDN externes.</p>
      </div>
      </div>
    </div>
  );
};
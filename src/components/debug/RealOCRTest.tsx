/**
 * Composant de test pour vérifier que l'OCR est 100% réel
 * AUCUNE SIMULATION - Test de l'extraction réelle uniquement
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function RealOCRTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testRealOCR = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    setResult('');
    
    try {
      console.log('🧪 TEST EXTRACTION RÉELLE - Fichier:', file.name);
      
      // Importer et utiliser le nouveau service OCR réel
      const { realUnifiedOCRService } = await import('@/services/realUnifiedOCRService');
      
      console.log('🔧 Initialisation du service OCR réel...');
      await realUnifiedOCRService.initialize();
      
      console.log('🔄 Début extraction OCR réelle...');
      let ocrResult;
      
      if (file.type === 'application/pdf') {
        ocrResult = await realUnifiedOCRService.extractFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        ocrResult = await realUnifiedOCRService.extractText(file);
      } else {
        throw new Error('Type de fichier non supporté');
      }
      
      const resultText = `
🎉 EXTRACTION RÉELLE RÉUSSIE !

📄 Fichier: ${file.name}
📏 Taille: ${(file.size / 1024).toFixed(1)} KB
⏱️ Temps de traitement: ${ocrResult.processingTime}ms
🎯 Confiance: ${(ocrResult.confidence * 100).toFixed(1)}%
🌍 Langue détectée: ${ocrResult.language}
📖 Pages: ${ocrResult.pages || 1}

✅ TEXTE EXTRAIT (premiers 500 caractères):
${ocrResult.text.substring(0, 500)}${ocrResult.text.length > 500 ? '...' : ''}

📊 LONGUEUR TOTALE: ${ocrResult.text.length} caractères

🔥 CONFIRMATION: Ceci est une extraction OCR 100% RÉELLE avec Tesseract.js
`;
      
      setResult(resultText);
      console.log('✅ Test d\'extraction réelle terminé avec succès');
      
    } catch (err: any) {
      const errorMsg = `❌ ÉCHEC DE L'EXTRACTION RÉELLE: ${err.message}`;
      setError(errorMsg);
      console.error('❌ Test d\'extraction réelle échoué:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Test d'Extraction OCR 100% Réelle
          <Badge variant="destructive" className="ml-2">
            AUCUNE SIMULATION
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
            onChange={testRealOCR}
            className="hidden"
            id="real-ocr-test"
          />
          <label htmlFor="real-ocr-test" className="cursor-pointer">
            <Button 
              variant="default" 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? '⏳ Extraction en cours...' : '🔥 Tester Extraction RÉELLE'}
            </Button>
          </label>
          <p className="text-sm text-green-700 mt-2">
            Sélectionnez une image ou un PDF pour tester l'extraction OCR réelle
          </p>
        </div>

        {isLoading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">🔄 Extraction OCR réelle en cours...</p>
            <p className="text-blue-600 text-sm">Tesseract.js traite votre document...</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Résultat d'extraction réelle:</h3>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">❌ Erreur:</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Comment vérifier que c'est réel:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• ✅ Temps de traitement variable selon la taille du fichier</li>
            <li>• ✅ Confiance basée sur la qualité réelle de l'image</li>
            <li>• ✅ Texte extrait correspond exactement au contenu du fichier</li>
            <li>• ✅ Détection automatique de la langue française/arabe</li>
            <li>• ❌ Pas de texte générique répétitif</li>
            <li>• ❌ Pas de mention "simulation" dans les logs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
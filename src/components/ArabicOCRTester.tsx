import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, Eye, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { algerianOCREngine } from '@/services/algerianOCREngine';

interface OCRTestResult {
  text: string;
  confidence: number;
  language: 'fra' | 'ara' | 'mixed';
  processingTime: number;
  wordCount: number;
  arabicRatio: number;
}

export function ArabicOCRTester() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRTestResult | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOcrResult(null);
      setError('');
      console.log('📄 [Test Arabe] Fichier sélectionné:', file.name);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOcrResult(null);
      setError('');
      console.log('📄 [Test Arabe] Fichier déposé:', file.name);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const processOCR = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');
    setProgress(0);
    
    try {
      console.log('🚀 [Test Arabe] Début du traitement OCR...');
      
      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await algerianOCREngine.extractText(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setOcrResult(result);
      console.log('✅ [Test Arabe] OCR terminé:', result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('❌ [Test Arabe] Erreur OCR:', err);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const resetTest = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setOcrResult(null);
    setError('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'ara': return 'bg-green-600';
      case 'fra': return 'bg-blue-600';
      case 'mixed': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-6 h-6 text-green-600" />
            Testeur OCR Arabe Algérien - Optimisé 100% Local
          </CardTitle>
          <p className="text-sm text-gray-600">
            Testez l'extraction OCR sur vos documents arabes avec les dernières optimisations.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Zone de téléchargement */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <div>
                  <p className="font-medium text-green-800">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Glissez votre image ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-600">
                    PNG, JPG, GIF jusqu'à 10MB. Optimisé pour texte arabe.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Aperçu de l'image */}
          {previewUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5" />
                  Aperçu de l'image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Aperçu" 
                    className="max-w-full max-h-96 object-contain border rounded"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contrôles */}
          <div className="flex gap-4">
            <Button 
              onClick={processOCR}
              disabled={!selectedFile || isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <FileImage className="w-4 h-4 mr-2" />
                  Analyser le texte arabe
                </>
              )}
            </Button>
            
            <Button 
              onClick={resetTest}
              variant="outline"
              disabled={isProcessing}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>

          {/* Barre de progression */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Traitement OCR en cours...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Erreur */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Erreur de traitement:</span>
                </div>
                <p className="text-red-700 mt-2">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Résultats OCR */}
          {ocrResult && (
            <Card className="border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Résultats de l'extraction OCR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                
                {/* Métriques */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {Math.round(ocrResult.confidence * 100)}%
                    </div>
                    <div className={`text-sm font-medium ${getConfidenceColor(ocrResult.confidence)}`}>
                      Confiance
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={getLanguageColor(ocrResult.language)}>
                      {ocrResult.language === 'ara' ? 'Arabe' : 
                       ocrResult.language === 'fra' ? 'Français' : 'Mixte'}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">Langue détectée</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {ocrResult.wordCount}
                    </div>
                    <div className="text-sm text-gray-600">Mots</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {ocrResult.processingTime}ms
                    </div>
                    <div className="text-sm text-gray-600">Temps</div>
                  </div>
                </div>

                {/* Ratio arabe */}
                {ocrResult.arabicRatio > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Proportion de texte arabe</span>
                      <span className="font-medium">{Math.round(ocrResult.arabicRatio * 100)}%</span>
                    </div>
                    <Progress value={ocrResult.arabicRatio * 100} className="h-2" />
                  </div>
                )}

                {/* Texte extrait */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Texte extrait:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                      {ocrResult.text || 'Aucun texte détecté'}
                    </pre>
                  </div>
                </div>

                {/* Statistiques détaillées */}
                <details className="bg-blue-50 p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium text-blue-800">
                    Voir les détails techniques
                  </summary>
                  <div className="mt-3 space-y-2 text-sm">
                    <div><strong>Caractères totaux:</strong> {ocrResult.text.length}</div>
                    <div><strong>Caractères arabes:</strong> {Math.round(ocrResult.arabicRatio * ocrResult.text.length)}</div>
                    <div><strong>Mode de traitement:</strong> Bilingue (Français + Arabe)</div>
                    <div><strong>Préprocessing:</strong> Activé pour arabe</div>
                    <div><strong>PSM utilisé:</strong> 1 (Segmentation automatique)</div>
                    <div><strong>Moteur OCR:</strong> 3 (Legacy + LSTM)</div>
                  </div>
                </details>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
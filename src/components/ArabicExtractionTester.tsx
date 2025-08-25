import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, CheckCircle, AlertTriangle, Info, Settings } from 'lucide-react';
import { algerianOCREngine } from '@/services/algerianOCREngine';
import { detectArabicRatio, getOptimalConfigForText } from '@/config/arabicCharacterSets';

interface ArabicTestResult {
  text: string;
  confidence: number;
  language: 'fra' | 'ara' | 'mixed';
  processingTime: number;
  wordCount: number;
  arabicRatio: number;
  preprocessingApplied: 'standard' | 'arabic_rtl';
  textDirection: 'ltr' | 'rtl' | 'mixed';
  qualityMetrics: {
    characterCoverage: number;
    wordSeparation: number;
    ligatureCorrection: number;
  };
}

export function ArabicExtractionTester() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResult, setTestResult] = useState<ArabicTestResult | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTestResult(null);
      setError('');
      console.log('📄 [Test Extraction AR] Fichier sélectionné:', file.name);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTestResult(null);
      setError('');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const testArabicExtraction = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');
    setProgress(0);
    
    try {
      console.log('🚀 [Test Extraction AR] Début test extraction arabe améliorée...');
      
      // Animation du progrès
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 800);

      const result = await algerianOCREngine.extractText(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Analyser la qualité de l'extraction
      const qualityMetrics = analyzeExtractionQuality(result.text, result.arabicRatio);
      const textDirection = determineTextDirection(result.text, result.arabicRatio);
      const preprocessingType = result.arabicRatio > 0.3 ? 'arabic_rtl' : 'standard';
      
      const enhancedResult: ArabicTestResult = {
        ...result,
        preprocessingApplied: preprocessingType,
        textDirection,
        qualityMetrics
      };
      
      setTestResult(enhancedResult);
      console.log('✅ [Test Extraction AR] Test terminé:', enhancedResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors du test');
      console.error('❌ [Test Extraction AR] Erreur:', err);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const analyzeExtractionQuality = (text: string, arabicRatio: number) => {
    const totalChars = text.replace(/\s/g, '').length;
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const validChars = (text.match(/[a-zA-ZÀ-ÿ\u0600-\u06FF0-9]/g) || []).length;
    
    // Métrique de couverture des caractères (ratio de caractères valides)
    const characterCoverage = totalChars > 0 ? validChars / totalChars : 0;
    
    // Métrique de séparation des mots (espaces appropriés)
    const words = text.trim().split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const wordSeparation = avgWordLength > 1 && avgWordLength < 15 ? 0.9 : 0.6;
    
    // Métrique de correction des liaisons (moins d'espaces dans les mots arabes)
    const arabicWords = words.filter(word => detectArabicRatio(word) > 0.7);
    const ligatureCorrection = arabicWords.length > 0 ? 
      arabicWords.filter(word => !word.includes(' ')).length / arabicWords.length : 1;
    
    return {
      characterCoverage: Math.round(characterCoverage * 100) / 100,
      wordSeparation: Math.round(wordSeparation * 100) / 100,
      ligatureCorrection: Math.round(ligatureCorrection * 100) / 100
    };
  };

  const determineTextDirection = (text: string, arabicRatio: number): 'ltr' | 'rtl' | 'mixed' => {
    if (arabicRatio > 0.7) return 'rtl';
    if (arabicRatio > 0.2) return 'mixed';
    return 'ltr';
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const resetTest = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setTestResult(null);
    setError('');
    setProgress(0);
    setShowDetails(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-6 h-6 text-blue-600" />
            Testeur d'Extraction Arabe Améliorée - Corrections OCR
          </CardTitle>
          <p className="text-sm text-gray-600">
            Testez les améliorations d'extraction OCR pour texte arabe avec préprocessing intelligent et correction RTL.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Zone de téléchargement */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
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
                    Glissez votre image avec texte arabe ici
                  </p>
                  <p className="text-sm text-gray-600">
                    PNG, JPG, GIF - Optimisé pour documents juridiques algériens
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Aperçu et contrôles */}
          {previewUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aperçu de l'image</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={previewUrl} 
                    alt="Aperçu" 
                    className="w-full max-h-64 object-contain border rounded"
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button 
                  onClick={testArabicExtraction}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Test extraction en cours...
                    </>
                  ) : (
                    <>
                      <FileImage className="w-4 h-4 mr-2" />
                      Tester extraction arabe améliorée
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={resetTest}
                  variant="outline"
                  disabled={isProcessing}
                  className="w-full"
                >
                  Réinitialiser
                </Button>

                <Button 
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost"
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {showDetails ? 'Masquer' : 'Afficher'} les détails techniques
                </Button>
              </div>
            </div>
          )}

          {/* Barre de progression */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test d'extraction avec améliorations arabes...</span>
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
                  <span className="font-medium">Erreur de test:</span>
                </div>
                <p className="text-red-700 mt-2">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Résultats du test */}
          {testResult && (
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Résultats du test d'extraction arabe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                
                {/* Métriques principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {Math.round(testResult.confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Confiance OCR</div>
                  </div>
                  
                  <div className="text-center">
                    <Badge variant="outline" className={getQualityBadge(testResult.arabicRatio)}>
                      {Math.round(testResult.arabicRatio * 100)}% Arabe
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">Ratio détecté</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {testResult.wordCount}
                    </div>
                    <div className="text-sm text-gray-600">Mots extraits</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {Math.round(testResult.processingTime)}ms
                    </div>
                    <div className="text-sm text-gray-600">Temps</div>
                  </div>
                </div>

                {/* Métriques de qualité */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">Métriques de qualité d'extraction:</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Couverture caractères</span>
                        <span className={`font-medium ${getQualityColor(testResult.qualityMetrics.characterCoverage)}`}>
                          {Math.round(testResult.qualityMetrics.characterCoverage * 100)}%
                        </span>
                      </div>
                      <Progress value={testResult.qualityMetrics.characterCoverage * 100} className="h-2 mt-2" />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Séparation mots</span>
                        <span className={`font-medium ${getQualityColor(testResult.qualityMetrics.wordSeparation)}`}>
                          {Math.round(testResult.qualityMetrics.wordSeparation * 100)}%
                        </span>
                      </div>
                      <Progress value={testResult.qualityMetrics.wordSeparation * 100} className="h-2 mt-2" />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Liaisons corrigées</span>
                        <span className={`font-medium ${getQualityColor(testResult.qualityMetrics.ligatureCorrection)}`}>
                          {Math.round(testResult.qualityMetrics.ligatureCorrection * 100)}%
                        </span>
                      </div>
                      <Progress value={testResult.qualityMetrics.ligatureCorrection * 100} className="h-2 mt-2" />
                    </div>
                  </div>
                </div>

                {/* Informations de traitement */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Préprocessing appliqué</div>
                    <div className="text-sm text-blue-600 capitalize">
                      {testResult.preprocessingApplied === 'arabic_rtl' ? 'Arabe RTL spécialisé' : 'Standard bilingue'}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800">Direction du texte</div>
                    <div className="text-sm text-green-600">
                      {testResult.textDirection === 'rtl' ? 'Droite vers gauche (RTL)' : 
                       testResult.textDirection === 'ltr' ? 'Gauche vers droite (LTR)' : 'Mixte'}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-purple-800">Langue détectée</div>
                    <div className="text-sm text-purple-600">
                      {testResult.language === 'ara' ? 'Arabe' : 
                       testResult.language === 'fra' ? 'Français' : 'Bilingue'}
                    </div>
                  </div>
                </div>

                {/* Texte extrait */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Texte extrait avec corrections:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed" 
                         style={{ direction: testResult.textDirection === 'rtl' ? 'rtl' : 'ltr' }}>
                      {testResult.text || 'Aucun texte détecté'}
                    </pre>
                  </div>
                </div>

                {/* Détails techniques */}
                {showDetails && (
                  <details className="bg-slate-50 p-4 rounded-lg">
                    <summary className="cursor-pointer font-medium text-slate-800">
                      Détails techniques de l'extraction
                    </summary>
                    <div className="mt-3 space-y-2 text-sm">
                      <div><strong>Caractères totaux:</strong> {testResult.text.length}</div>
                      <div><strong>Caractères arabes:</strong> {(testResult.text.match(/[\u0600-\u06FF]/g) || []).length}</div>
                      <div><strong>Configuration utilisée:</strong> {getOptimalConfigForText(testResult.text)}</div>
                      <div><strong>Corrections RTL appliquées:</strong> {testResult.arabicRatio > 0.1 ? 'Oui' : 'Non'}</div>
                      <div><strong>Préprocessing d'image:</strong> {testResult.preprocessingApplied}</div>
                      <div><strong>Moteur OCR:</strong> Tesseract.js avec LSTM</div>
                      <div><strong>Langues chargées:</strong> Français + Arabe</div>
                    </div>
                  </details>
                )}

                {/* Info sur les améliorations */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">Améliorations appliquées :</div>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Jeu de caractères arabes étendu et optimisé</li>
                        <li>• Préprocessing intelligent selon le contenu détecté</li>
                        <li>• Correction automatique des liaisons entre caractères arabes</li>
                        <li>• Amélioration de la séparation des mots RTL</li>
                        <li>• Nettoyage des artéfacts de reconnaissance courants</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
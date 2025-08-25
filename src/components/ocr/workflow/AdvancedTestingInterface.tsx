/**
 * Interface de test avancée pour les algorithmes OCR-IA
 * Permet de tester avec de vrais documents et visualiser les résultats
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { realImageProcessingService, RealProcessingResult } from '@/services/enhanced/realImageProcessingService';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface TestingState {
  isProcessing: boolean;
  currentStage: string;
  progress: number;
  results: RealProcessingResult[];
  selectedResult: RealProcessingResult | null;
  error: string | null;
}

export function AdvancedTestingInterface() {
  const [testingState, setTestingState] = useState<TestingState>({
    isProcessing: false,
    currentStage: '',
    progress: 0,
    results: [],
    selectedResult: null,
    error: null
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showProcessedImages, setShowProcessedImages] = useState(false);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    
    // Reset des résultats précédents
    setTestingState(prev => ({
      ...prev,
      results: [],
      selectedResult: null,
      error: null
    }));
  };

  const processDocuments = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Veuillez sélectionner au moins un fichier');
      return;
    }

    setTestingState(prev => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      error: null,
      results: []
    }));

    try {
      logger.info('OCR', `🧪 Début test avec ${selectedFiles.length} fichier(s)`);
      
      const results: RealProcessingResult[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileProgress = (i / selectedFiles.length) * 100;
        
        setTestingState(prev => ({
          ...prev,
          currentStage: `Traitement ${file.name}`,
          progress: fileProgress
        }));

        // Conversion du fichier en ImageData
        const imageData = await this.fileToImageData(file);
        
        // Traitement avec les algorithmes réels
        const result = await realImageProcessingService.processDocumentPage(imageData, i + 1);
        results.push(result);

        // Mise à jour du progrès
        setTestingState(prev => ({
          ...prev,
          progress: ((i + 1) / selectedFiles.length) * 100,
          results: [...results]
        }));
      }

      setTestingState(prev => ({
        ...prev,
        isProcessing: false,
        currentStage: '',
        selectedResult: results[0] || null
      }));

      toast.success(`Test complété avec succès! ${results.length} page(s) traitée(s)`);

    } catch (error) {
      logger.error('OCR', 'Erreur test algorithmes:', error);
      setTestingState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));
      toast.error('Erreur lors du test des algorithmes');
    }
  };

  const fileToImageData = (file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          resolve(imageData);
        } else {
          reject(new Error('Impossible de créer ImageData'));
        }
      };

      img.onerror = () => reject(new Error('Erreur chargement image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const resetTest = () => {
    setTestingState({
      isProcessing: false,
      currentStage: '',
      progress: 0,
      results: [],
      selectedResult: null,
      error: null
    });
    setSelectedFiles([]);
  };

  const downloadResults = () => {
    if (testingState.results.length === 0) return;

    const exportData = {
      testResults: testingState.results.map(result => ({
        pageNumber: result.pageNumber,
        detectedLines: {
          horizontal: result.detectedLines.horizontal.length,
          vertical: result.detectedLines.vertical.length
        },
        tables: result.tables.length,
        textZones: result.textZones.length,
        verticalSeparators: result.verticalSeparators.length,
        processingTime: result.totalProcessingTime,
        qualityMetrics: result.qualityMetrics
      })),
      testSummary: {
        totalPages: testingState.results.length,
        averageProcessingTime: testingState.results.reduce(
          (sum, r) => sum + r.totalProcessingTime, 0
        ) / testingState.results.length,
        averageQuality: testingState.results.reduce(
          (sum, r) => sum + r.qualityMetrics.overallQuality, 0
        ) / testingState.results.length
      },
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr_algorithm_test_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Résultats exportés avec succès');
  };

  const formatDuration = (ms: number): string => {
    return `${ms.toFixed(2)}ms`;
  };

  const getQualityBadge = (quality: number) => {
    if (quality >= 0.8) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (quality >= 0.6) return <Badge className="bg-yellow-100 text-yellow-800">Bon</Badge>;
    if (quality >= 0.4) return <Badge className="bg-orange-100 text-orange-800">Moyen</Badge>;
    return <Badge className="bg-red-100 text-red-800">Faible</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Interface de sélection et lancement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Interface de Test - Algorithmes OCR Réels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!testingState.isProcessing ? (
            <>
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  Testez les algorithmes réels avec vos propres documents. 
                  Formats supportés: PDF, JPG, PNG, TIFF.
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.tiff"
                      onChange={handleFileSelection}
                      className="hidden"
                      id="algorithm-test-files"
                    />
                    <label htmlFor="algorithm-test-files">
                      <Button className="cursor-pointer">
                        Sélectionner des documents
                      </Button>
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {selectedFiles.length} fichier(s) sélectionné(s):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {file.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={processDocuments}
                  disabled={selectedFiles.length === 0}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Lancer le Test
                </Button>
                <Button onClick={resetTest} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Test en cours...</h3>
                <p className="text-sm text-gray-600 mb-4">{testingState.currentStage}</p>
                <Progress value={testingState.progress} className="w-full" />
              </div>
            </div>
          )}

          {testingState.error && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{testingState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {testingState.results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Résultats du Test ({testingState.results.length} page(s))
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadResults} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button 
                  onClick={() => setShowProcessedImages(!showProcessedImages)} 
                  variant="outline" 
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Images
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {testingState.results.map((result, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer transition-colors ${
                        testingState.selectedResult?.pageNumber === result.pageNumber 
                          ? 'ring-2 ring-primary' 
                          : ''
                      }`}
                      onClick={() => setTestingState(prev => ({ ...prev, selectedResult: result }))}
                    >
                      <CardContent className="p-4">
                        <div className="text-center space-y-2">
                          <div className="font-medium">Page {result.pageNumber}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="font-medium text-blue-600">
                                {result.detectedLines.horizontal.length + result.detectedLines.vertical.length}
                              </div>
                              <div className="text-gray-600">Lignes</div>
                            </div>
                            <div>
                              <div className="font-medium text-green-600">{result.tables.length}</div>
                              <div className="text-gray-600">Tables</div>
                            </div>
                          </div>
                          {getQualityBadge(result.qualityMetrics.overallQuality)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {testingState.selectedResult && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Détection d'Éléments - Page {testingState.selectedResult.pageNumber}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {testingState.selectedResult.detectedLines.horizontal.length}
                            </div>
                            <div className="text-sm text-gray-600">Lignes horizontales</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {testingState.selectedResult.detectedLines.vertical.length}
                            </div>
                            <div className="text-sm text-gray-600">Lignes verticales</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {testingState.selectedResult.tables.length}
                            </div>
                            <div className="text-sm text-gray-600">Tables détectées</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {testingState.selectedResult.textZones.length}
                            </div>
                            <div className="text-sm text-gray-600">Zones de texte</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Métriques de Qualité</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Détection lignes:</span>
                          <span>{Math.round(testingState.selectedResult.qualityMetrics.lineDetectionQuality * 100)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Détection tables:</span>
                          <span>{Math.round(testingState.selectedResult.qualityMetrics.tableDetectionQuality * 100)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Qualité globale:</span>
                          <span>{Math.round(testingState.selectedResult.qualityMetrics.overallQuality * 100)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Temps de Traitement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {testingState.selectedResult && (
                          <>
                            <div className="flex justify-between">
                              <span>Élimination bordures:</span>
                              <span>{formatDuration(testingState.selectedResult.processingStages.borderElimination)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Détection lignes:</span>
                              <span>{formatDuration(testingState.selectedResult.processingStages.lineDetection)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Détection tables:</span>
                              <span>{formatDuration(testingState.selectedResult.processingStages.tableDetection)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Extraction zones:</span>
                              <span>{formatDuration(testingState.selectedResult.processingStages.textZoneExtraction)}</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2">
                              <span>Total:</span>
                              <span>{formatDuration(testingState.selectedResult.totalProcessingTime)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques Globales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Pages traitées:</span>
                          <span>{testingState.results.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temps moyen/page:</span>
                          <span>
                            {formatDuration(
                              testingState.results.reduce(
                                (sum, r) => sum + r.totalProcessingTime, 0
                              ) / testingState.results.length
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Qualité moyenne:</span>
                          <span>
                            {Math.round(
                              testingState.results.reduce(
                                (sum, r) => sum + r.qualityMetrics.overallQuality, 0
                              ) / testingState.results.length * 100
                            )}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
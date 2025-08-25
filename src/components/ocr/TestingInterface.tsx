/**
 * Interface de Test Fonctionnelle pour les Algorithmes OCR
 * Permet de tester les algorithmes avec des documents réels
 */

import React, { useState, useRef, useCallback } from 'react';
import type { PDFProcessingConfig, PDFProcessingResult } from '@/types/ocr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Camera, 
  Eye, 
  Download, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Grid3X3,
  Type,
  Table,
  Settings,
  Play,
  Square,
  Circle,
  ArrowRight,
  Info,
  TestTube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { realAlgorithmIntegrationService, RealProcessingResult } from '@/services/enhanced/realAlgorithmIntegrationService';
import { contentExtractionService, ExtractedContent } from '@/services/enhanced/contentExtractionService';
import { opencvService } from '@/services/enhanced/opencvService';
import { pdfProcessingService } from '@/services/enhanced/pdfProcessingService';

interface TestResult {
  id: string;
  fileName: string;
  fileSize: number;
  processingTime: number;
  algorithmResults: RealProcessingResult | null;
  contentResults: ExtractedContent | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface AlgorithmMetrics {
  linesDetected: number;
  horizontalLines: number;
  verticalLines: number;
  tablesDetected: number;
  textSeparators: number;
  opencvStatus: boolean;
  processingTime: number;
}

export function TestingInterface() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null);
  const [metrics, setMetrics] = useState<AlgorithmMetrics>({
    linesDetected: 0,
    horizontalLines: 0,
    verticalLines: 0,
    tablesDetected: 0,
    textSeparators: 0,
    opencvStatus: false,
    processingTime: 0
  });
  const [activeTab, setActiveTab] = useState('upload');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  /**
   * Gestion de l'upload de fichier
   */
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    await processTestFile(file);
  }, []);

  /**
   * Gestion du drag & drop
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      await processTestFile(file);
    }
  }, []);

  /**
   * Traitement d'un fichier de test
   */
  const processTestFile = async (file: File) => {
    const testId = `test_${Date.now()}`;
    const testResult: TestResult = {
      id: testId,
      fileName: file.name,
      fileSize: file.size,
      processingTime: 0,
      algorithmResults: null,
      contentResults: null,
      status: 'pending'
    };

    setTestResults(prev => [...prev, testResult]);
    setCurrentTest(testResult);
    setIsProcessing(true);

    try {
      // Étape 1: Vérifier OpenCV.js
      testResult.status = 'processing';
      setCurrentTest({ ...testResult });
      
      console.log('🔍 Initialisation OpenCV.js...');
      await opencvService.initialize();
      
      let opencvReady = opencvService.isReady();
      let diagnosticInfo = opencvService.getDiagnosticInfo();
      
      console.log('📊 Diagnostic OpenCV.js:', diagnosticInfo);
      
      // Si OpenCV n'est pas prêt, essayer une réinitialisation
      if (!opencvReady) {
        console.log('🔄 Tentative de réinitialisation d\'OpenCV.js...');
        await opencvService.reinitialize();
        opencvReady = opencvService.isReady();
        diagnosticInfo = opencvService.getDiagnosticInfo();
        console.log('📊 Diagnostic après réinitialisation:', diagnosticInfo);
      }
      
      if (!opencvReady) {
        console.error('❌ OpenCV.js non disponible après réinitialisation:', diagnosticInfo);
        throw new Error(`OpenCV.js non disponible. Diagnostic: ${JSON.stringify(diagnosticInfo)}`);
      }

      // Étape 2: Convertir le fichier en ImageData
      console.log('🔄 Étape 2: Conversion du fichier en ImageData...');
      let imageData: ImageData;
      
      if (file.type === 'application/pdf') {
        // Traitement spécial pour les PDFs
        console.log('📄 Traitement d\'un fichier PDF...');
        imageData = await convertPDFToImageData(file);
        console.log('✅ PDF converti en ImageData:', imageData.width, 'x', imageData.height);
      } else {
        // Traitement des images
        try {
          // Essayer d'abord avec FileReader (évite les problèmes CSP)
          imageData = await convertFileToImageDataWithFileReader(file);
          console.log('✅ Fichier converti avec FileReader:', imageData.width, 'x', imageData.height);
        } catch (error) {
          console.warn('⚠️ FileReader échoué, tentative avec URL.createObjectURL:', error);
          // Fallback vers la méthode originale
          imageData = await convertFileToImageData(file);
          console.log('✅ Fichier converti avec URL.createObjectURL:', imageData.width, 'x', imageData.height);
        }
      }
      
      // Étape 3: Traiter avec les algorithmes réels
      const startTime = performance.now();
      const algorithmResults = await realAlgorithmIntegrationService.processPageWithRealAlgorithms(
        new File([new Blob()], 'temp.png', { type: 'image/png' })
      );
      const processingTime = performance.now() - startTime;

      // Étape 4: Extraire le contenu des zones détectées
      const textRegions = algorithmResults.textSeparators.map((separator, index) => ({
        id: `text_${index}`,
        x: separator.x1,
        y: separator.y1,
        width: Math.abs(separator.x2 - separator.x1),
        height: Math.abs(separator.y2 - separator.y1)
      }));

      const tableRegions = algorithmResults.tableRegions.map((table, index) => ({
        id: `table_${index}`,
        x: table.x,
        y: table.y,
        width: table.width,
        height: table.height,
        detectedCells: table.cells || []
      }));

      const contentResults = await contentExtractionService.extractContentFromRegions(
        imageData,
        textRegions,
        tableRegions
      );

      // Mettre à jour les métriques
      const newMetrics: AlgorithmMetrics = {
        linesDetected: algorithmResults.detectedLines?.length || 0,
        horizontalLines: algorithmResults.detectedLines?.filter((line: any) => line.type === 'horizontal')?.length || 0,
        verticalLines: algorithmResults.detectedLines?.filter((line: any) => line.type === 'vertical')?.length || 0,
        tablesDetected: algorithmResults.tableRegions?.length || 0,
        textSeparators: algorithmResults.textSeparators?.length || 0,
        opencvStatus: opencvReady,
        processingTime
      };
      setMetrics(newMetrics);

      // Finaliser le test
      const completedTest: TestResult = {
        ...testResult,
        status: 'completed',
        processingTime,
        algorithmResults,
        contentResults
      };

      setTestResults(prev => prev.map(t => t.id === testId ? completedTest : t));
      setCurrentTest(completedTest);

      toast({
        title: "Test terminé avec succès",
        description: `Détecté ${newMetrics.linesDetected} lignes et ${newMetrics.tablesDetected} tables`,
      });

    } catch (error) {
      console.error('Erreur lors du test:', error);
      
      const errorTest: TestResult = {
        ...testResult,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };

      setTestResults(prev => prev.map(t => t.id === testId ? errorTest : t));
      setCurrentTest(errorTest);

      toast({
        title: "Erreur lors du test",
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Convertir un PDF en ImageData
   */
  const convertPDFToImageData = async (file: File): Promise<ImageData> => {
    console.log('🔄 Conversion PDF en ImageData:', file.name);
    
    try {
      // Utiliser le service PDF existant pour convertir la première page
      const pdfResult = await pdfProcessingService.processPDF(file, {
        maxPages: 1, // Seulement la première page
        dpi: 300,
        scale: 1.0,
        format: 'PNG',
        quality: 0.9
      });
      
      if (pdfResult.error) {
        throw new Error(`Erreur conversion PDF: ${pdfResult.error}`);
      }
      
      if (pdfResult.pages.length === 0) {
        throw new Error('Aucune page convertie du PDF');
      }
      
      // Prendre la première page
      const firstPage = pdfResult.pages[0];
      console.log('✅ PDF converti en ImageData:', firstPage.width, 'x', firstPage.height);
      
      return firstPage.imageData;
      
    } catch (error) {
      throw new Error(`Erreur lors de la conversion PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  /**
   * Convertir un fichier en ImageData (méthode alternative avec FileReader)
   */
  const convertFileToImageDataWithFileReader = async (file: File): Promise<ImageData> => {
    console.log('🔄 Conversion avec FileReader:', file.name);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d')!;
              
              // Limiter la taille
              const maxSize = 2048;
              let { width, height } = img;
              
              if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize / width, maxSize / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
              }
              
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              
              const imageData = ctx.getImageData(0, 0, width, height);
              console.log('✅ ImageData créé avec FileReader:', imageData.width, 'x', imageData.height);
              resolve(imageData);
            } catch (error) {
              reject(new Error(`Erreur FileReader: ${error instanceof Error ? error.message : 'Erreur inconnue'}`));
            }
          };
          
          img.onerror = () => {
            reject(new Error('Erreur de chargement d\'image avec FileReader'));
          };
          
          img.src = e.target.result as string;
        } else {
          reject(new Error('Erreur de lecture du fichier'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur FileReader'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  /**
   * Convertir un fichier en ImageData
   */
  const convertFileToImageData = async (file: File): Promise<ImageData> => {
    console.log('🔄 Conversion du fichier:', file.name, 'Type:', file.type, 'Taille:', file.size);
    
    return new Promise((resolve, reject) => {
      // Vérifier le type de fichier
      const supportedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
        'application/pdf'
      ];
      
      if (!supportedTypes.includes(file.type)) {
        reject(new Error(`Type de fichier non supporté: ${file.type}. Types supportés: ${supportedTypes.join(', ')}`));
        return;
      }

      // Vérifier la taille du fichier
      if (file.size > 50 * 1024 * 1024) { // 50MB
        reject(new Error('Fichier trop volumineux. Taille maximale: 50MB'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      if (!ctx) {
        reject(new Error('Impossible d\'obtenir le contexte 2D du canvas'));
        return;
      }
      
      const fileUrl = URL.createObjectURL(file);
      const img = new Image();
      
      // Éviter les problèmes CORS avec les fichiers locaux
      if (file.type.startsWith('image/')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        try {
          console.log('✅ Image chargée:', img.width, 'x', img.height);
          
          // Vérifier les dimensions
          if (img.width === 0 || img.height === 0) {
            URL.revokeObjectURL(fileUrl);
            reject(new Error('Image invalide: dimensions nulles'));
            return;
          }
          
          // Limiter la taille pour éviter les problèmes de mémoire
          const maxSize = 2048;
          let { width, height } = img;
          
          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
            console.log('📏 Redimensionnement:', width, 'x', height);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Dessiner l'image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Obtenir les données d'image
          const imageData = ctx.getImageData(0, 0, width, height);
          
          console.log('✅ ImageData créé:', imageData.width, 'x', imageData.height);
          URL.revokeObjectURL(fileUrl);
          resolve(imageData);
          
        } catch (error) {
          URL.revokeObjectURL(fileUrl);
          reject(new Error(`Erreur lors du traitement de l'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`));
        }
      };
      
      img.onerror = (error) => {
        URL.revokeObjectURL(fileUrl);
        console.error('❌ Erreur de chargement d\'image:', error);
        reject(new Error(`Impossible de charger l'image: ${file.name}. Vérifiez que le fichier est valide.`));
      };
      
      // Définir la source de l'image
      img.src = fileUrl;
    });
  };

  /**
   * Visualiser les résultats sur un canvas
   */
  const visualizeResults = useCallback(() => {
    if (!currentTest?.algorithmResults || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Dessiner les lignes détectées
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    
    // Lignes horizontales
    const horizontalLines = currentTest.algorithmResults.detectedLines?.filter((line: any) => line.type === 'horizontal') || [];
    horizontalLines.forEach((line: any) => {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });
    
    // Lignes verticales
    ctx.strokeStyle = '#00ff00';
    const verticalLines = currentTest.algorithmResults.detectedLines?.filter((line: any) => line.type === 'vertical') || [];
    verticalLines.forEach((line: any) => {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });
    
    // Dessiner les tables
    ctx.strokeStyle = '#0000ff';
    ctx.lineWidth = 3;
    currentTest.algorithmResults.tableRegions.forEach(table => {
      ctx.strokeRect(table.x, table.y, table.width, table.height);
    });
  }, [currentTest]);

  /**
   * Exporter les résultats
   */
  const exportResults = () => {
    if (!currentTest) return;

    const exportData = {
      testId: currentTest.id,
      fileName: currentTest.fileName,
      processingTime: currentTest.processingTime,
      metrics,
      algorithmResults: currentTest.algorithmResults,
      contentResults: currentTest.contentResults,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_results_${currentTest.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Résultats exportés",
      description: "Fichier JSON téléchargé",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-6 h-6 text-purple-600" />
            Interface de Test - Algorithmes OCR Réels
          </CardTitle>
          <CardDescription>
            Testez les algorithmes OpenCV.js avec des documents réels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload">📤 Upload</TabsTrigger>
              <TabsTrigger value="results">📊 Résultats</TabsTrigger>
              <TabsTrigger value="visualization">👁️ Visualisation</TabsTrigger>
              <TabsTrigger value="metrics">📈 Métriques</TabsTrigger>
            </TabsList>

            {/* Onglet Upload */}
            <TabsContent value="upload" className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                                 <AlertDescription>
                   Uploadez une image ou un PDF pour tester les algorithmes de détection de lignes, tables et extraction de contenu.
                 </AlertDescription>
              </Alert>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                                 <input
                   type="file"
                   ref={fileInputRef}
                   onChange={handleFileUpload}
                   accept="image/*,.pdf,application/pdf"
                   className="hidden"
                 />
                
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {selectedFile ? selectedFile.name : 'Glissez-déposez un fichier ici'}
                  </p>
                  <p className="text-sm text-gray-500">
                    ou cliquez pour sélectionner
                  </p>
                </div>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="mt-4"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Sélectionner un fichier
                    </>
                  )}
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Traitement en cours...</span>
                    <span>{currentTest?.fileName}</span>
                  </div>
                  <Progress value={50} className="w-full" />
                </div>
              )}
            </TabsContent>

            {/* Onglet Résultats */}
            <TabsContent value="results" className="space-y-4">
              {currentTest ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Résultats du Test
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {metrics.linesDetected}
                          </div>
                          <div className="text-xs text-gray-500">Lignes Détectées</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {metrics.tablesDetected}
                          </div>
                          <div className="text-xs text-gray-500">Tables Détectées</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {metrics.textSeparators}
                          </div>
                          <div className="text-xs text-gray-500">Séparateurs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {metrics.processingTime.toFixed(0)}ms
                          </div>
                          <div className="text-xs text-gray-500">Temps</div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>OpenCV.js Status:</span>
                          <Badge variant={metrics.opencvStatus ? "default" : "destructive"}>
                            {metrics.opencvStatus ? "✅ Prêt" : "❌ Non disponible"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Lignes Horizontales:</span>
                          <span className="font-medium">{metrics.horizontalLines}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Lignes Verticales:</span>
                          <span className="font-medium">{metrics.verticalLines}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {currentTest.contentResults && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Contenu Extrait</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-64 overflow-auto">
                          <pre className="text-sm bg-gray-100 p-4 rounded">
                            {currentTest.contentResults.overallText}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={visualizeResults} disabled={!currentTest.algorithmResults}>
                      <Eye className="w-4 h-4 mr-2" />
                      Visualiser
                    </Button>
                    <Button onClick={exportResults} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Aucun test effectué. Uploadez un fichier pour commencer.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Onglet Visualisation */}
            <TabsContent value="visualization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visualisation des Résultats</CardTitle>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={canvasRef}
                    className="w-full max-w-2xl mx-auto border rounded"
                    style={{ maxHeight: '500px' }}
                  />
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-0.5 bg-red-500"></div>
                        <span>Lignes Horizontales</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-0.5 bg-green-500"></div>
                        <span>Lignes Verticales</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-0.5 bg-blue-500"></div>
                        <span>Tables</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Métriques */}
            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Métriques de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Algorithmes</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>OpenCV.js:</span>
                          <Badge variant={metrics.opencvStatus ? "default" : "destructive"}>
                            {metrics.opencvStatus ? "Disponible" : "Non disponible"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Temps de traitement:</span>
                          <span>{metrics.processingTime.toFixed(0)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lignes détectées:</span>
                          <span>{metrics.linesDetected}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tables détectées:</span>
                          <span>{metrics.tablesDetected}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Historique des Tests</h4>
                      <div className="space-y-2 max-h-48 overflow-auto">
                        {testResults.map((test) => (
                          <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {test.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {test.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                              {test.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin" />}
                              <span className="text-sm">{test.fileName}</span>
                            </div>
                            <Badge variant={test.status === 'completed' ? 'default' : 'secondary'}>
                              {test.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
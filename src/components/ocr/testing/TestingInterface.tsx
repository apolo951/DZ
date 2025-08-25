import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  TrendingUp,
  FileX,
  Activity
} from 'lucide-react';
import { useOCRProcessing } from '@/components/ocr/hooks/useOCRProcessing';
import { useOCRMetrics } from '@/hooks/useOCRMetrics';

interface TestingInterfaceProps {
  onTestComplete?: (results: any) => void;
}

export function TestingInterface({ onTestComplete }: TestingInterfaceProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [testFiles, setTestFiles] = useState<File[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { processFile, isProcessing, result, error, processingSteps } = useOCRProcessing();
  const { metrics, updateMetrics, alerts } = useOCRMetrics();

  // Étapes de l'algorithme pour la visualisation
  const algorithmSteps = [
    { id: 1, name: 'Préparation du fichier', description: 'Validation et préparation du document' },
    { id: 2, name: 'Détection des régions', description: 'Identification des zones de texte' },
    { id: 3, name: 'Traitement OCR', description: 'Reconnaissance optique des caractères' },
    { id: 4, name: 'Post-traitement', description: 'Correction et optimisation du texte' },
    { id: 5, name: 'Extraction d\'entités', description: 'Identification des entités nommées' },
    { id: 6, name: 'Mapping automatique', description: 'Association aux champs de formulaire' },
    { id: 7, name: 'Validation qualité', description: 'Vérification de la qualité des résultats' }
  ];

  // Gestion des fichiers de test
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setTestFiles(prev => [...prev, ...files]);
  };

  // Lancement d'un test
  const runTest = async (file: File) => {
    setIsRunning(true);
    setSelectedFile(file);
    
    const startTime = Date.now();
    
    try {
      await processFile(file);
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      const testResult = {
        fileName: file.name,
        fileSize: file.size,
        processingTime,
        confidence: result?.confidence || 0,
        textLength: result?.text.length || 0,
        entitiesCount: result?.entities ? Object.keys(result.entities).length : 0,
        success: !error,
        error: error,
        timestamp: new Date()
      };
      
      setTestResults(prev => [...prev, testResult]);
      updateMetrics(testResult);
      
      if (onTestComplete) {
        onTestComplete(testResult);
      }
    } catch (err) {
      console.error('Erreur lors du test:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Simulation de progression d'étapes
  useEffect(() => {
    if (isProcessing && isRunning) {
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < algorithmSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1000);

      return () => clearInterval(stepInterval);
    } else {
      setCurrentStep(0);
    }
  }, [isProcessing, isRunning]);

  // Métriques en temps réel
  const realTimeMetrics = {
    averageProcessingTime: testResults.length > 0 
      ? testResults.reduce((sum, result) => sum + result.processingTime, 0) / testResults.length 
      : 0,
    successRate: testResults.length > 0 
      ? (testResults.filter(r => r.success).length / testResults.length) * 100 
      : 0,
    averageConfidence: testResults.length > 0 
      ? testResults.reduce((sum, result) => sum + result.confidence, 0) / testResults.length * 100 
      : 0,
    totalDocuments: testResults.length
  };

  // Détection d'alertes qualité
  const qualityAlerts = testResults.filter(result => 
    result.confidence < 0.7 || result.processingTime > 10000 || !result.success
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Interface de Test et Monitoring OCR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="testing" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="testing">Tests</TabsTrigger>
              <TabsTrigger value="algorithm">Algorithme</TabsTrigger>
              <TabsTrigger value="metrics">Métriques</TabsTrigger>
              <TabsTrigger value="alerts">Alertes</TabsTrigger>
            </TabsList>

            <TabsContent value="testing" className="space-y-4">
              {/* Upload de fichiers de test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents de Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.pptx,.txt,.rtf"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  
                  {testFiles.length > 0 && (
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {testFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => runTest(file)}
                              disabled={isRunning}
                            >
                              {isRunning && selectedFile === file ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  En cours...
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Tester
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Résultats des tests */}
              {testResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Résultats des Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {testResults.map((result, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {result.success ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                                <span className="font-medium text-sm">{result.fileName}</span>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline">{result.processingTime}ms</Badge>
                                <Badge variant={result.confidence > 0.8 ? 'default' : 'secondary'}>
                                  {Math.round(result.confidence * 100)}%
                                </Badge>
                              </div>
                            </div>
                            {result.error && (
                              <div className="text-xs text-red-500 mt-1">{result.error}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="algorithm" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visualisation Pas-à-Pas de l'Algorithme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {algorithmSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index < currentStep ? 'bg-green-500 text-white' :
                        index === currentStep && isProcessing ? 'bg-primary text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index < currentStep ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : index === currentStep && isProcessing ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{step.name}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                      </div>
                      {index === currentStep && isProcessing && (
                        <div className="w-24">
                          <Progress value={(index + 1) / algorithmSteps.length * 100} />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{Math.round(realTimeMetrics.averageProcessingTime)}ms</div>
                    <div className="text-xs text-muted-foreground">Temps moyen</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{Math.round(realTimeMetrics.successRate)}%</div>
                    <div className="text-xs text-muted-foreground">Taux de succès</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">{Math.round(realTimeMetrics.averageConfidence)}%</div>
                    <div className="text-xs text-muted-foreground">Confiance moyenne</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileX className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{realTimeMetrics.totalDocuments}</div>
                    <div className="text-xs text-muted-foreground">Documents traités</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alertes Qualité</CardTitle>
                </CardHeader>
                <CardContent>
                  {qualityAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {qualityAlerts.map((alert, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>{alert.fileName}</strong>: 
                            {alert.confidence < 0.7 && ' Faible confiance OCR'}
                            {alert.processingTime > 10000 && ' Temps de traitement élevé'}
                            {!alert.success && ' Échec du traitement'}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Aucune alerte qualité détectée
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
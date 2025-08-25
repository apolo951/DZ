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
  TestTube,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Table,
  Settings,
  Download,
  Eye
} from 'lucide-react';
import { advancedAlgorithmIntegrationService } from '@/services/enhanced/advancedAlgorithmIntegrationService';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface TestResult {
  fileName: string;
  documentType: string;
  processingTime: number;
  quality: number;
  tablesDetected: number;
  accuracy: number;
  issues: string[];
}

export function AdvancedTestingInterface() {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [testFiles, setTestFiles] = useState<File[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [overallPerformance, setOverallPerformance] = useState<any>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [currentTestFile, setCurrentTestFile] = useState<string>('');
  const [calibrationResults, setCalibrationResults] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setTestFiles(files);
    toast.success(`${files.length} fichier(s) sélectionné(s) pour les tests`);
  };

  const runAdvancedTests = async () => {
    if (testFiles.length === 0) {
      toast.error('Veuillez sélectionner des fichiers de test');
      return;
    }

    setIsRunningTests(true);
    setTestProgress(0);
    setTestResults([]);
    setOverallPerformance(null);

    try {
      logger.info('AdvancedTesting', 'Début des tests avancés');

      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setTestProgress(prev => Math.min(prev + 5, 90));
      }, 500);

      const results = await advancedAlgorithmIntegrationService.runAlgerianDocumentTests(testFiles);
      
      clearInterval(progressInterval);
      setTestProgress(100);

      setTestResults(results.testResults);
      setOverallPerformance(results.overallPerformance);

      toast.success('Tests avancés terminés avec succès');
      logger.info('AdvancedTesting', 'Tests terminés', results.overallPerformance);

    } catch (error) {
      logger.error('AdvancedTesting', 'Erreur lors des tests:', error);
      toast.error('Erreur lors des tests avancés');
    } finally {
      setIsRunningTests(false);
    }
  };

  const runCalibration = async () => {
    if (testFiles.length < 3) {
      toast.error('Veuillez sélectionner au moins 3 fichiers pour le calibrage');
      return;
    }

    setIsCalibrating(true);

    try {
      logger.info('AdvancedTesting', 'Début du calibrage automatique');
      
      const calibration = await advancedAlgorithmIntegrationService.calibrateForAlgerianDocuments(testFiles);
      
      setCalibrationResults(calibration);
      toast.success('Calibrage automatique terminé');

    } catch (error) {
      logger.error('AdvancedTesting', 'Erreur calibrage:', error);
      toast.error('Erreur lors du calibrage');
    } finally {
      setIsCalibrating(false);
    }
  };

  const exportResults = () => {
    const exportData = {
      testResults,
      overallPerformance,
      calibrationResults,
      testDate: new Date().toISOString(),
      filesCount: testFiles.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced_ocr_test_results_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Résultats exportés');
  };

  const getQualityBadge = (quality: number) => {
    if (quality >= 0.9) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (quality >= 0.7) return <Badge className="bg-yellow-100 text-yellow-800">Bon</Badge>;
    if (quality >= 0.5) return <Badge className="bg-orange-100 text-orange-800">Moyen</Badge>;
    return <Badge className="bg-red-100 text-red-800">Faible</Badge>;
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 0.9) return <Badge className="bg-green-100 text-green-800">Optimal</Badge>;
    if (rate >= 0.7) return <Badge className="bg-yellow-100 text-yellow-800">Acceptable</Badge>;
    return <Badge className="bg-red-100 text-red-800">À améliorer</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-6 h-6 text-purple-600" />
            Interface de Test Avancée - Documents Algériens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Cette interface teste les algorithmes avancés OpenCV.js, HoughLinesP et l'extraction de tables
              sur des documents administratifs et juridiques algériens réels.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Upload et contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Sélection des Documents de Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.tiff"
              onChange={handleFileUpload}
              className="hidden"
              id="test-files-upload"
            />
            <label htmlFor="test-files-upload">
              <Button className="cursor-pointer">
                Sélectionner Documents Tests
              </Button>
            </label>
            <p className="text-sm text-gray-600 mt-2">
              Formats: PDF, Images (JPG, PNG, TIFF) - Documents juridiques algériens recommandés
            </p>
          </div>

          {testFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Fichiers sélectionnés ({testFiles.length}):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {testFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm truncate">{file.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(file.size / 1024).toFixed(0)}KB
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={runAdvancedTests}
              disabled={isRunningTests || testFiles.length === 0}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunningTests ? 'Tests en cours...' : 'Lancer Tests Complets'}
            </Button>
            <Button
              onClick={runCalibration}
              disabled={isCalibrating || testFiles.length < 3}
              variant="outline"
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isCalibrating ? 'Calibrage...' : 'Calibrage Auto'}
            </Button>
          </div>

          {(isRunningTests || isCalibrating) && (
            <div className="space-y-2">
              <Progress value={testProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                {isRunningTests && `Tests en cours... ${currentTestFile}`}
                {isCalibrating && 'Calibrage automatique des algorithmes...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {(testResults.length > 0 || calibrationResults) && (
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">Résultats Tests</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="calibration">Calibrage</TabsTrigger>
          </TabsList>

          {/* Résultats détaillés */}
          <TabsContent value="results" className="space-y-4">
            {overallPerformance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Résumé Global
                    </div>
                    <Button onClick={exportResults} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(overallPerformance.averageProcessingTime)}ms
                      </div>
                      <div className="text-sm text-gray-600">Temps moyen</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(overallPerformance.averageQuality * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Qualité moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(overallPerformance.successRate * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Taux de succès</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {testResults.length}
                      </div>
                      <div className="text-sm text-gray-600">Documents testés</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Résultats par Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{result.fileName}</span>
                          <Badge variant="outline">{result.documentType}</Badge>
                        </div>
                        {getQualityBadge(result.quality)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{result.processingTime}ms</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Table className="w-3 h-3" />
                          <span>{result.tablesDetected} tables</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{Math.round(result.accuracy * 100)}% précision</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{Math.round(result.quality * 100)}% qualité</span>
                        </div>
                      </div>

                      {result.issues.length > 0 && (
                        <div className="space-y-1">
                          <h5 className="text-sm font-medium text-orange-700">Problèmes détectés:</h5>
                          {result.issues.map((issue, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-orange-600">
                              <AlertTriangle className="w-3 h-3" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance globale */}
          <TabsContent value="performance" className="space-y-4">
            {overallPerformance && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse de Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-lg font-bold">Temps de Traitement</div>
                        <div className="text-2xl text-blue-600 my-2">
                          {Math.round(overallPerformance.averageProcessingTime)}ms
                        </div>
                        {getPerformanceBadge(overallPerformance.averageProcessingTime < 5000 ? 1 : 0.5)}
                      </div>
                      
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-lg font-bold">Qualité Globale</div>
                        <div className="text-2xl text-green-600 my-2">
                          {Math.round(overallPerformance.averageQuality * 100)}%
                        </div>
                        {getPerformanceBadge(overallPerformance.averageQuality)}
                      </div>
                      
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-lg font-bold">Fiabilité</div>
                        <div className="text-2xl text-purple-600 my-2">
                          {Math.round(overallPerformance.successRate * 100)}%
                        </div>
                        {getPerformanceBadge(overallPerformance.successRate)}
                      </div>
                    </div>

                    {overallPerformance.recommendedImprovements.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Recommandations d'Amélioration:</h4>
                        <div className="space-y-2">
                          {overallPerformance.recommendedImprovements.map((recommendation: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                              <span className="text-sm">{recommendation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Calibrage */}
          <TabsContent value="calibration" className="space-y-4">
            {calibrationResults ? (
              <Card>
                <CardHeader>
                  <CardTitle>Résultats du Calibrage Automatique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Configuration Optimisée:</h4>
                      <div className="space-y-2 text-sm">
                        <div>Type: {calibrationResults.documentType}</div>
                        <div>Profil: {calibrationResults.languageProfile}</div>
                        <div>Qualité attendue: {Math.round(calibrationResults.expectedQuality * 100)}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Paramètres Optimaux:</h4>
                      <div className="text-xs space-y-1">
                        <div>Bordures: {JSON.stringify(calibrationResults.optimizedConfig.borderElimination)}</div>
                        <div>Lignes: {JSON.stringify(calibrationResults.optimizedConfig.lineDetection)}</div>
                        <div>Tables: {JSON.stringify(calibrationResults.optimizedConfig.tableDetection)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Paramètres Recommandés:</h4>
                    <div className="space-y-1">
                      {calibrationResults.recommendedSettings.map((setting: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {setting}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Aucun calibrage effectué. Lancez le calibrage automatique.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
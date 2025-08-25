/**
 * Composant de Test d'Intégration
 * Vérifie que tous les composants sont correctement intégrés dans l'interface consolidée
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

interface IntegrationTestComponentProps {
  onTestComplete?: (results: TestResult[]) => void;
}

interface TestResult {
  component: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const IntegrationTestComponent: React.FC<IntegrationTestComponentProps> = ({
  onTestComplete
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runIntegrationTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Vérification des composants importés
      try {
        const { BatchProcessingComponent } = await import('./BatchProcessingComponent');
        results.push({
          component: 'BatchProcessingComponent',
          status: 'success',
          message: 'Composant de traitement par lot importé avec succès'
        });
      } catch (error) {
        results.push({
          component: 'BatchProcessingComponent',
          status: 'error',
          message: 'Erreur lors de l\'import',
          details: error instanceof Error ? error.message : 'Import failed'
        });
      }

      // Test 2: Vérification du composant d'approbation
      try {
        const { ApprovalWorkflowComponent } = await import('./ApprovalWorkflowComponent');
        results.push({
          component: 'ApprovalWorkflowComponent',
          status: 'success',
          message: 'Composant de workflow d\'approbation importé avec succès'
        });
      } catch (error) {
        results.push({
          component: 'ApprovalWorkflowComponent',
          status: 'error',
          message: 'Erreur lors de l\'import',
          details: error instanceof Error ? error.message : 'Import failed'
        });
      }

      // Test 3: Vérification du composant d'analytics
      try {
        const { OCRAnalyticsComponent } = await import('./OCRAnalyticsComponent');
        results.push({
          component: 'OCRAnalyticsComponent',
          status: 'success',
          message: 'Composant d\'analytics importé avec succès'
        });
      } catch (error) {
        results.push({
          component: 'OCRAnalyticsComponent',
          status: 'error',
          message: 'Erreur lors de l\'import',
          details: error instanceof Error ? error.message : 'Import failed'
        });
      }

      // Test 4: Vérification du composant de diagnostic
      try {
        const { OCRQualityDashboard } = await import('./OCRQualityDashboard');
        results.push({
          component: 'OCRQualityDashboard',
          status: 'success',
          message: 'Composant de diagnostic importé avec succès'
        });
      } catch (error) {
        results.push({
          component: 'OCRQualityDashboard',
          status: 'error',
          message: 'Erreur lors de l\'import',
          details: error instanceof Error ? error.message : 'Import failed'
        });
      }

      // Test 5: Vérification du composant de mapping intelligent
      try {
        const { IntelligentMappingInterface } = await import('./IntelligentMappingInterface');
        results.push({
          component: 'IntelligentMappingInterface',
          status: 'success',
          message: 'Composant de mapping intelligent importé avec succès'
        });
      } catch (error) {
        results.push({
          component: 'IntelligentMappingInterface',
          status: 'error',
          message: 'Erreur lors de l\'import',
          details: error instanceof Error ? error.message : 'Import failed'
        });
      }

      // Test 6: Vérification des algorithmes avancés
      try {
        const { AdvancedAlgorithmTestingInterface } = await import('./AdvancedAlgorithmTestingInterface');
        results.push({
          component: 'AdvancedAlgorithmTestingInterface',
          status: 'success',
          message: 'Composant d\'algorithmes avancés importé avec succès'
        });
      } catch (error) {
        results.push({
          component: 'AdvancedAlgorithmTestingInterface',
          status: 'error',
          message: 'Erreur lors de l\'import',
          details: error instanceof Error ? error.message : 'Import failed'
        });
      }

      // Test 7: Vérification du monitoring
      try {
        const { AlgorithmPerformanceMonitoring } = await import('./AlgorithmPerformanceMonitoring');
        results.push({
          component: 'AlgorithmPerformanceMonitoring',
          status: 'success',
          message: 'Composant de monitoring importé avec succès'
        });
      } catch (error) {
        results.push({
          component: 'AlgorithmPerformanceMonitoring',
          status: 'error',
          message: 'Erreur lors de l\'import',
          details: error instanceof Error ? error.message : 'Import failed'
        });
      }

    } catch (error) {
      results.push({
        component: 'Tests d\'intégration',
        status: 'error',
        message: 'Erreur générale lors des tests',
        details: error instanceof Error ? error.message : 'General test failure'
      });
    }

    setTestResults(results);
    setIsRunning(false);
    onTestComplete?.(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <Info className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-600">Succès</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      case 'warning':
        return <Badge variant="secondary">Avertissement</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const totalCount = testResults.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Test d'Intégration des Composants
          <Badge variant="outline">
            {totalCount > 0 ? `${successCount}/${totalCount} Succès` : 'Prêt'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bouton de test */}
        <div className="text-center">
          <Button 
            onClick={runIntegrationTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? 'Tests en cours...' : 'Lancer les Tests d\'Intégration'}
          </Button>
        </div>

        {/* Résumé des tests */}
        {totalCount > 0 && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-green-700">Succès</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-red-700">Erreurs</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
          </div>
        )}

        {/* Résultats détaillés */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Résultats Détaillés :</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.component}</span>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  {result.details && (
                    <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📋 Instructions de Test</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>1. Cliquez sur "Lancer les Tests d'Intégration"</div>
            <div>2. Vérifiez que tous les composants sont importés avec succès</div>
            <div>3. Si des erreurs apparaissent, vérifiez les imports dans DZOCRIAProcessor.tsx</div>
            <div>4. Tous les composants doivent être marqués "Succès" pour une intégration complète</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
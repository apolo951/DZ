/**
 * Composant de Test d'Intégration Simple
 * Pour isoler et résoudre les erreurs 404
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

export const TestIntegration: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testComponentImport = async (componentName: string, importPath: string) => {
    try {
      console.log(`🧪 Test d'import pour: ${componentName}`);
      
      // Test d'import dynamique
      const module = await import(importPath);
      const component = module[componentName];
      
      if (component) {
        console.log(`✅ ${componentName} importé avec succès`);
        return { name: componentName, status: 'success', message: 'Import réussi' };
      } else {
        console.error(`❌ ${componentName} non trouvé dans le module`);
        return { name: componentName, status: 'error', message: 'Composant non trouvé' };
      }
    } catch (error) {
      console.error(`❌ Erreur d'import pour ${componentName}:`, error);
      return { 
        name: componentName, 
        status: 'error', 
        message: 'Erreur d\'import',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setError(null);
    const results = [];

    const tests = [
      { name: 'BatchProcessingComponent', path: './BatchProcessingComponent' },
      { name: 'ApprovalWorkflowComponent', path: './ApprovalWorkflowComponent' },
      { name: 'OCRAnalyticsComponent', path: './OCRAnalyticsComponent' },
      { name: 'OCRQualityDashboard', path: './OCRQualityDashboard' },
      { name: 'IntelligentMappingInterface', path: './IntelligentMappingInterface' },
      { name: 'AdvancedAlgorithmTestingInterface', path: './AdvancedAlgorithmTestingInterface' },
      { name: 'AlgorithmPerformanceMonitoring', path: './AlgorithmPerformanceMonitoring' },
      { name: 'IntegrationTestComponent', path: './IntegrationTestComponent' }
    ];

    for (const test of tests) {
      const result = await testComponentImport(test.name, test.path);
      results.push(result);
      // Pause entre les tests pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Test d'Intégration des Composants
          <Badge variant="outline">
            {testResults.length > 0 ? `${successCount}/${testResults.length} Succès` : 'Prêt'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bouton de test */}
        <div className="text-center">
          <Button 
            onClick={runAllTests}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Tests en cours...
              </>
            ) : (
              'Lancer les Tests d\'Import'
            )}
          </Button>
        </div>

        {/* Résumé des tests */}
        {testResults.length > 0 && (
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
              <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
          </div>
        )}

        {/* Erreur générale */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Erreur Générale :</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Résultats détaillés */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Résultats Détaillés :</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {result.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.name}</span>
                    <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                      {result.status === 'success' ? 'Succès' : 'Erreur'}
                    </Badge>
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
            <div>1. Cliquez sur "Lancer les Tests d'Import"</div>
            <div>2. Vérifiez que tous les composants sont importés avec succès</div>
            <div>3. Si des erreurs apparaissent, vérifiez les chemins d'import</div>
            <div>4. Tous les composants doivent être marqués "Succès"</div>
          </div>
        </div>

        {/* Informations de débogage */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">🔍 Informations de Débogage</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>• Vérifiez la console du navigateur pour les détails des erreurs</div>
            <div>• Assurez-vous que tous les composants existent dans le dossier</div>
            <div>• Vérifiez les exports dans les fichiers index.ts</div>
            <div>• Testez les imports un par un pour isoler les problèmes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
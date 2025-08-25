/**
 * Composant de Test d'Intégration Ultra-Simple
 * Pour isoler complètement les erreurs 404
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";

export const SimpleIntegrationTest: React.FC = () => {
  const testBasicImports = () => {
    const results = [];
    
    // Test 1: Composants de base
    try {
      const { BatchProcessingComponent } = require('./BatchProcessingComponent');
      results.push({ name: 'BatchProcessingComponent', status: 'success' });
    } catch (error) {
      results.push({ name: 'BatchProcessingComponent', status: 'error', error: error.message });
    }

    // Test 2: Composant d'approbation
    try {
      const { ApprovalWorkflowComponent } = require('./ApprovalWorkflowComponent');
      results.push({ name: 'ApprovalWorkflowComponent', status: 'success' });
    } catch (error) {
      results.push({ name: 'ApprovalWorkflowComponent', status: 'error', error: error.message });
    }

    // Test 3: Composant d'analytics
    try {
      const { OCRAnalyticsComponent } = require('./OCRAnalyticsComponent');
      results.push({ name: 'OCRAnalyticsComponent', status: 'success' });
    } catch (error) {
      results.push({ name: 'OCRAnalyticsComponent', status: 'error', error: error.message });
    }

    // Test 4: Composant de diagnostic
    try {
      const { OCRQualityDashboard } = require('./OCRQualityDashboard');
      results.push({ name: 'OCRQualityDashboard', status: 'success' });
    } catch (error) {
      results.push({ name: 'OCRQualityDashboard', status: 'error', error: error.message });
    }

    // Test 5: Composant de mapping
    try {
      const { IntelligentMappingInterface } = require('./IntelligentMappingInterface');
      results.push({ name: 'IntelligentMappingInterface', status: 'success' });
    } catch (error) {
      results.push({ name: 'IntelligentMappingInterface', status: 'error', error: error.message });
    }

    console.log('🧪 Résultats des tests d\'import:', results);
    
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    console.log(`📊 Résumé: ${successCount} succès, ${errorCount} erreurs`);
    
    if (errorCount > 0) {
      console.error('❌ Composants avec erreurs:', results.filter(r => r.status === 'error'));
    } else {
      console.log('✅ Tous les composants importés avec succès !');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Test d'Intégration Ultra-Simple
          <Badge variant="outline">Version Simplifiée</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Button 
            onClick={testBasicImports}
            className="bg-green-600 hover:bg-green-700"
          >
            🧪 Tester les Imports de Base
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📋 Instructions</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>1. Cliquez sur "Tester les Imports de Base"</div>
            <div>2. Ouvrez la console du navigateur (F12)</div>
            <div>3. Vérifiez les résultats des tests</div>
            <div>4. Identifiez les composants avec des erreurs</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Résolution des Erreurs 404</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <div>• Vérifiez que tous les composants existent dans le dossier</div>
            <div>• Vérifiez les exports dans les fichiers index.ts</div>
            <div>• Vérifiez les chemins d'import dans DZOCRIAProcessor.tsx</div>
            <div>• Redémarrez le serveur de développement si nécessaire</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
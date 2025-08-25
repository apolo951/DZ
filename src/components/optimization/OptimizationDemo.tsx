import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGeoData } from '@/services/geoDataService';
import { FileText, Map, Zap, Download, CheckCircle, AlertCircle } from 'lucide-react';

export function OptimizationDemo() {
  const [fileSize, setFileSize] = useState<{
    original: number;
    optimized: number;
    reduction: number;
  }>({
    original: 0,
    optimized: 0,
    reduction: 0
  });

  const [performance, setPerformance] = useState<{
    loadTime: number;
    memoryUsage: number;
  }>({
    loadTime: 0,
    memoryUsage: 0
  });

  const geoData = useGeoData();

  useEffect(() => {
    // Calculer les tailles de fichiers
    const originalSize = 6.2 + 4.6 + 3.3 + 1.4 + 1.1; // MB
    const optimizedSize = 1.1 + 2.0; // MB (géographie simplifiée + OCR optimisé)
    const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

    setFileSize({
      original: originalSize,
      optimized: optimizedSize,
      reduction
    });
  }, []);

  const testGeoDataLoading = async () => {
    const startTime = Date.now();
    await geoData.preloadData(true); // Version simplifiée
    const endTime = Date.now();
    
    setPerformance(prev => ({
      ...prev,
      loadTime: endTime - startTime
    }));
  };

  const measureMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setPerformance(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">Démonstration des Optimisations</h1>
      </div>

      {/* Réduction de taille des fichiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Réduction de la taille des fichiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {fileSize.original.toFixed(1)} MB
              </div>
              <div className="text-sm text-gray-600">Taille originale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {fileSize.optimized.toFixed(1)} MB
              </div>
              <div className="text-sm text-gray-600">Taille optimisée</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {fileSize.reduction.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Réduction</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Taille des fichiers</span>
              <span>{fileSize.reduction.toFixed(1)}% de réduction</span>
            </div>
            <Progress value={fileSize.reduction} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Optimisation des données géographiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Optimisation des données géographiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Données simplifiées</div>
                <div className="text-sm text-gray-600">
                  Réduction de 6.2M à 1.1M (82% de réduction)
                </div>
              </div>
              <Badge variant="secondary">Optimisé</Badge>
            </div>

            <Button 
              onClick={testGeoDataLoading}
              disabled={geoData.loading}
              className="w-full"
            >
              {geoData.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Test du chargement...
                </>
              ) : (
                <>
                  <Map className="w-4 h-4 mr-2" />
                  Tester le chargement des données géographiques
                </>
              )}
            </Button>

            {geoData.isDataLoaded() && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Données géographiques chargées avec succès !
                </AlertDescription>
              </Alert>
            )}

            {geoData.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Erreur: {geoData.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métriques de performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Métriques de performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium">Temps de chargement</div>
              <div className="text-2xl font-bold text-blue-500">
                {performance.loadTime > 0 ? `${performance.loadTime.toFixed(0)}ms` : '--'}
              </div>
            </div>
            <div>
              <div className="font-medium">Utilisation mémoire</div>
              <div className="text-2xl font-bold text-green-500">
                {performance.memoryUsage > 0 ? `${performance.memoryUsage.toFixed(1)}MB` : '--'}
              </div>
            </div>
          </div>

          <Button 
            onClick={measureMemoryUsage}
            variant="outline"
            className="mt-4"
          >
            Mesurer l'utilisation mémoire
          </Button>
        </CardContent>
      </Card>

      {/* Résumé des optimisations */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des optimisations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Réduction de 82% de la taille des fichiers volumineux</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Chargement dynamique des données géographiques</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cache intelligent pour les données fréquemment utilisées</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { extractionStatus } from '@/services/extractionStatusService';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export const ExtractionStatusDebug: React.FC = () => {
  const [status, setStatus] = useState(extractionStatus.getStatus());
  const [isVisible, setIsVisible] = useState(true);

  const refreshStatus = () => {
    setStatus(extractionStatus.getStatus());
  };

  useEffect(() => {
    const interval = setInterval(refreshStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <Button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
        size="sm"
      >
        🔍 Debug OCR
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            {status.isReal ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            Statut Extraction OCR
          </span>
          <div className="flex gap-2">
            <Button onClick={refreshStatus} size="sm" variant="ghost">
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button onClick={() => setIsVisible(false)} size="sm" variant="ghost">
              ×
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Mode:</span>
          <Badge variant={status.isReal ? 'default' : 'destructive'}>
            {status.isReal ? '✅ EXTRACTION RÉELLE' : '⚠️ SIMULATION'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Total extractions:</span>
          <span className="font-mono text-sm">{status.totalExtractions}</span>
        </div>

        <div className="space-y-1">
          <span className="text-sm font-medium">Logs récents:</span>
          <div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
            {status.recentLogs.length === 0 ? (
              <div className="text-xs text-gray-500">Aucune extraction récente</div>
            ) : (
              status.recentLogs.slice(-5).map((log, index) => (
                <div key={index} className="text-xs font-mono mb-1 leading-tight">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button
            onClick={() => {
              console.log('📊 Status complet:', extractionStatus.getStatus());
              console.log('📋 Tous les logs:', extractionStatus.getExtractionLogs());
            }}
            size="sm"
            variant="outline"
            className="w-full"
          >
            📊 Afficher tous les logs dans la console
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};